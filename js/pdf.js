/* Generador de PDF mínimo y sin dependencias (funciona sin conexión).
   - Fuentes estándar PDF (Helvetica, Helvetica-Bold, Helvetica-Oblique, Courier) con codificación WinAnsi:
     cubre el español completo (á é í ó ú ñ ü ¿ ¡ « » € · – —). Los emojis se omiten.
   - Maquetación en flujo (párrafos con ajuste de línea, saltos de página automáticos).
   - Enlaces internos, marcadores (índice lateral del visor), pie con «página X de N»
     y ficheros adjuntos (p. ej. el Markdown del menú). */
(function () {
  "use strict";

  const A4 = { w: 595.28, h: 841.89 };
  const M = { izq: 50, der: 50, arriba: 56, abajo: 56 };
  const ANCHO = A4.w - M.izq - M.der;

  /* ---------- Codificación WinAnsi ---------- */
  const ESPECIALES = { "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87, "ˆ": 0x88, "‰": 0x89, "Š": 0x8a, "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "˜": 0x98, "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f };
  const SUSTITUTOS = [[/≈/g, "~"], [/≤/g, "<="], [/≥/g, ">="], [/→/g, "->"], [/←/g, "<-"], [/↑/g, "^"], [/★/g, "*"], [/☆/g, "*"], [/☐/g, "[ ]"], [/☑/g, "[x]"], [/✓|✔/g, "v"], [/✕|✖/g, "x"], [/ /g, " "], [/[​-‍︎️]/g, ""]];
  const codigo = (ch) => {
    const c = ch.codePointAt(0);
    if (c >= 32 && c < 127) return c;
    if (c >= 0xa0 && c <= 0xff) return c;
    return ESPECIALES[ch] || null;
  };
  /* Deja solo caracteres representables (los emojis y símbolos raros se eliminan) */
  const limpiar = (s) => {
    let t = String(s == null ? "" : s);
    for (const [re, r] of SUSTITUTOS) t = t.replace(re, r);
    let out = "";
    for (const ch of t) if (codigo(ch) != null) out += ch; else if (ch === "\n" || ch === "\t") out += ch === "\t" ? "  " : "\n";
    return out.replace(/(\S) {2,}/g, "$1 "); // une los huecos que dejan los emojis, sin tocar sangrías
  };

  /* ---------- Métricas (AFM estándar) ---------- */
  const HELV = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
  const HELV_B = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];
  const ALTOS = { 0x80: 556, 0x85: 1000, 0x91: 222, 0x92: 222, 0x93: 333, 0x94: 333, 0x95: 350, 0x96: 556, 0x97: 1000, 0xa0: 278, 0xa1: 333, 0xaa: 370, 0xab: 556, 0xb0: 400, 0xb7: 278, 0xba: 365, 0xbb: 556, 0xbc: 834, 0xbd: 834, 0xbe: 834, 0xbf: 611, 0xd7: 584 };
  const FUENTES = { F1: { base: "Helvetica", w: HELV }, F2: { base: "Helvetica-Bold", w: HELV_B }, F3: { base: "Helvetica-Oblique", w: HELV }, F4: { base: "Courier", mono: true } };
  const anchoChar = (ch, f) => {
    const fuente = FUENTES[f];
    if (fuente.mono) return 600;
    let c = ch.codePointAt(0);
    if (c >= 32 && c < 127) return fuente.w[c - 32];
    const base = ch.normalize("NFD")[0].codePointAt(0);
    if (base >= 32 && base < 127) return fuente.w[base - 32];
    return ALTOS[codigo(ch)] || 556;
  };
  const ancho = (s, f, size) => { let w = 0; for (const ch of s) w += anchoChar(ch, f); return (w / 1000) * size; };

  /* Ajuste de línea por palabras (corta palabras más largas que la línea) */
  const partir = (texto, f, size, max) => {
    const res = [];
    for (const parrafo of limpiar(texto).split("\n")) {
      const palabras = parrafo.split(/ +/);
      let linea = "";
      for (let p of palabras) {
        while (ancho(p, f, size) > max) { // palabra enorme
          let corte = p.length;
          while (corte > 1 && ancho(p.slice(0, corte), f, size) > max) corte--;
          if (linea) { res.push(linea); linea = ""; }
          res.push(p.slice(0, corte)); p = p.slice(corte);
        }
        const prueba = linea ? linea + " " + p : p;
        if (ancho(prueba, f, size) <= max) linea = prueba; else { res.push(linea); linea = p; }
      }
      res.push(linea);
    }
    return res;
  };

  /* ---------- Cadenas PDF ---------- */
  const literal = (s) => {
    let out = "(";
    for (const ch of limpiar(s)) {
      const c = codigo(ch);
      if (c == null) continue;
      if (ch === "(" || ch === ")" || ch === "\\") out += "\\" + ch;
      else if (c < 32 || c > 126) out += "\\" + c.toString(8).padStart(3, "0");
      else out += ch;
    }
    return out + ")";
  };
  const hexUnicode = (s) => { let h = "<FEFF"; for (let i = 0; i < s.length; i++) h += s.charCodeAt(i).toString(16).padStart(4, "0").toUpperCase(); return h + ">"; };
  const n2 = (v) => (Math.round(v * 100) / 100).toString();
  const color = (hex) => { const v = hex.replace("#", ""); return [0, 2, 4].map((i) => n2(parseInt(v.slice(i, i + 2), 16) / 255)).join(" "); };

  /* ---------- Documento ---------- */
  class Documento {
    constructor(opts = {}) {
      this.titulo = opts.titulo || "Documento";
      this.autor = opts.autor || "HolaFresco";
      this.pie = opts.pie || this.titulo;
      this.colores = { texto: "#1f1a16", suave: "#6b5f55", acento: opts.acento || "#b2461f", enlace: opts.enlace || "#1f4f8f", fondo: "#f3ece2", linea: "#cdbfae" };
      this.paginas = [];
      this.destinos = {};
      this.marcadores = [];
      this.adjuntos = [];
      this.nuevaPagina();
    }
    get pagina() { return this.paginas[this.paginas.length - 1]; }
    nuevaPagina() { this.paginas.push({ ops: [], annots: [] }); this.y = A4.h - M.arriba; }
    asegurar(alto) { if (this.y - alto < M.abajo) this.nuevaPagina(); }
    espacio(h) { this.y -= h; if (this.y < M.abajo) this.nuevaPagina(); }
    op(s) { this.pagina.ops.push(s); }

    textoEn(s, x, y, { f = "F1", size = 10, col = this.colores.texto } = {}) {
      this.op(`BT /${f} ${n2(size)} Tf ${color(col)} rg ${n2(x)} ${n2(y)} Td ${literal(s)} Tj ET`);
    }
    rect(x, y, w, h, { relleno, trazo, grosor = 0.6 } = {}) {
      if (relleno) this.op(`${color(relleno)} rg ${n2(x)} ${n2(y)} ${n2(w)} ${n2(h)} re f`);
      if (trazo) this.op(`${grosor} w ${color(trazo)} RG ${n2(x)} ${n2(y)} ${n2(w)} ${n2(h)} re S`);
    }
    linea(x1, y1, x2, y2, { col = this.colores.linea, grosor = 0.6 } = {}) { this.op(`${grosor} w ${color(col)} RG ${n2(x1)} ${n2(y1)} m ${n2(x2)} ${n2(y2)} l S`); }
    enlaceEn(s, x, y, destino, { f = "F1", size = 10 } = {}) {
      const w = ancho(limpiar(s), f, size);
      this.textoEn(s, x, y, { f, size, col: this.colores.enlace });
      this.linea(x, y - 1.6, x + w, y - 1.6, { col: this.colores.enlace, grosor: 0.4 });
      this.pagina.annots.push({ rect: [x, y - 3, x + w, y + size * 0.85], destino });
      return w;
    }
    destino(nombre) { this.destinos[nombre] = { pagina: this.paginas.length - 1, y: Math.min(A4.h, this.y + 24) }; }
    marcador(titulo, destino, padre) { const m = { titulo, destino, hijos: [] }; (padre ? padre.hijos : this.marcadores).push(m); return m; }
    adjuntar(nombre, contenido, desc) { this.adjuntos.push({ nombre, bytes: new TextEncoder().encode(contenido), desc: desc || nombre }); }
    paginaDe(destino) { const d = this.destinos[destino]; return d ? d.pagina + 1 : "?"; }

    /* Párrafo con ajuste de línea */
    parrafo(s, { f = "F1", size = 10, col, sangria = 0, interlineado = 1.38, despues = 4, x } = {}) {
      const lin = partir(s, f, size, ANCHO - sangria);
      const lh = size * interlineado;
      for (const l of lin) { this.asegurar(lh); this.y -= lh; this.textoEn(l, (x != null ? x : M.izq) + sangria, this.y + size * 0.25, { f, size, col }); }
      this.y -= despues;
    }
    titulo1(s, { destino } = {}) { this.asegurar(60); if (destino) this.destino(destino); this.parrafo(s, { f: "F2", size: 20, col: this.colores.acento, interlineado: 1.2, despues: 6 }); }
    titulo2(s, { destino } = {}) { this.asegurar(44); this.espacio(6); if (destino) this.destino(destino); this.parrafo(s, { f: "F2", size: 14, col: this.colores.acento, interlineado: 1.25, despues: 2 }); this.linea(M.izq, this.y + 1, A4.w - M.der, this.y + 1); this.y -= 6; }
    titulo3(s) { this.asegurar(34); this.espacio(4); this.parrafo(s, { f: "F2", size: 11.5, interlineado: 1.3, despues: 3 }); }

    /* Lista numerada o con viñeta con sangría francesa */
    elemento(marca, s, { size = 10, sangria = 18, f = "F1", fMarca = "F2", despues = 3 } = {}) {
      const lin = partir(s, f, size, ANCHO - sangria);
      const lh = size * 1.38;
      lin.forEach((l, i) => {
        this.asegurar(lh); this.y -= lh;
        if (i === 0) this.textoEn(marca, M.izq, this.y + size * 0.25, { f: fMarca, size, col: this.colores.acento });
        this.textoEn(l, M.izq + sangria, this.y + size * 0.25, { f, size });
      });
      this.y -= despues;
    }
    /* Casilla + texto + cantidad alineada a la derecha */
    casilla(s, derecha, { size = 10, suave = false } = {}) {
      const anchoDer = derecha ? ancho(limpiar(derecha), "F2", size) + 8 : 0;
      const lin = partir(s, "F1", size, ANCHO - 18 - anchoDer);
      const lh = size * 1.45;
      this.asegurar(lh * lin.length);
      lin.forEach((l, i) => {
        this.y -= lh;
        const base = this.y + size * 0.25;
        if (i === 0) {
          this.rect(M.izq, base - 1, 8.5, 8.5, { trazo: this.colores.suave, grosor: 0.8 });
          if (derecha) this.textoEn(derecha, A4.w - M.der - ancho(limpiar(derecha), "F2", size), base, { f: "F2", size, col: suave ? this.colores.suave : this.colores.texto });
        }
        this.textoEn(l, M.izq + 16, base, { size, col: suave ? this.colores.suave : this.colores.texto });
      });
      this.linea(M.izq + 16, this.y - 3, A4.w - M.der, this.y - 3, { grosor: 0.3 });
      this.y -= 1;
    }
    /* Caja sombreada (consejos, avisos) */
    caja(s, { titulo, size = 9.5 } = {}) {
      const lin = partir((titulo ? titulo + " " : "") + s, "F1", size, ANCHO - 20);
      const lh = size * 1.38;
      const alto = lin.length * lh + 14;
      this.asegurar(alto + 4);
      this.y -= 4;
      this.rect(M.izq, this.y - alto, ANCHO, alto, { relleno: this.colores.fondo });
      this.rect(M.izq, this.y - alto, 3, alto, { relleno: this.colores.acento });
      let y = this.y - 7;
      lin.forEach((l, i) => {
        y -= lh;
        if (i === 0 && titulo && l.startsWith(limpiar(titulo))) {
          const t = limpiar(titulo);
          this.textoEn(t, M.izq + 12, y + size * 0.25, { f: "F2", size });
          this.textoEn(l.slice(t.length), M.izq + 12 + ancho(t, "F2", size), y + size * 0.25, { size });
        } else this.textoEn(l, M.izq + 12, y + size * 0.25, { size });
      });
      this.y -= alto + 6;
    }
    /* Fila de índice: etiqueta + enlace (con ajuste) + «p. N» a la derecha */
    filaIndice(etiqueta, texto, destino, { size = 10.5, anchoEtiqueta = 70 } = {}) {
      const max = ANCHO - anchoEtiqueta - 40;
      const lin = partir(texto, "F1", size, max);
      const lh = size * 1.45;
      this.asegurar(lh * lin.length);
      lin.forEach((l, i) => {
        this.y -= lh;
        const base = this.y + size * 0.25;
        if (i === 0) {
          if (etiqueta) this.textoEn(etiqueta, M.izq, base, { f: "F2", size: size - 1, col: this.colores.suave });
          const yb = base, pag = this.pagina;
          pag.ops.push(() => { const t = "p. " + this.paginaDe(destino); return `BT /F1 ${n2(size - 1)} Tf ${color(this.colores.suave)} rg ${n2(A4.w - M.der - ancho(t, "F1", size - 1))} ${n2(yb)} Td ${literal(t)} Tj ET`; });
        }
        this.enlaceEn(l, M.izq + anchoEtiqueta, base, destino, { size });
      });
      this.y -= 2;
    }
    /* Fila de enlaces pequeños («Volver al plan · Markdown de esta receta») */
    enlaces(items, { size = 8.5 } = {}) {
      this.asegurar(size * 2);
      this.y -= size * 1.5;
      let x = M.izq;
      items.forEach(([texto, destino], i) => {
        if (i) { this.textoEn("·", x + 4, this.y, { size, col: this.colores.suave }); x += 12; }
        x += this.enlaceEn(texto, x, this.y, destino, { size });
      });
      this.y -= size * 0.8;
    }
    /* Texto monoespaciado (Markdown para copiar) */
    mono(s, { size = 7.6 } = {}) {
      const porLinea = Math.floor(ANCHO / (0.6 * size));
      const lh = size * 1.32;
      for (let linea of limpiar(s).split("\n")) {
        const sangria = (linea.match(/^\s*(?:[-*]|\d+\.)?\s*(?:\[[ x]\]\s)?/) || [""])[0].length;
        const trozos = [];
        if (linea.length <= porLinea) trozos.push(linea);
        else {
          let resto = linea, primera = true;
          while (resto.length) {
            const max = primera ? porLinea : porLinea - Math.min(sangria, 20);
            let corte = resto.length <= max ? resto.length : resto.lastIndexOf(" ", max);
            if (corte <= 0) corte = Math.min(max, resto.length);
            trozos.push((primera ? "" : " ".repeat(Math.min(sangria, 20))) + resto.slice(0, corte).trimEnd());
            resto = resto.slice(corte).trimStart();
            primera = false;
          }
        }
        for (const t of trozos) { this.asegurar(lh); this.y -= lh; if (t) this.textoEn(t, M.izq, this.y + size * 0.2, { f: "F4", size }); }
      }
    }

    /* ---------- Serialización ---------- */
    bytes() {
      const total = this.paginas.length;
      this.paginas.forEach((p, i) => {
        const t = `${limpiar(this.pie)}  ·  página ${i + 1} de ${total}`;
        p.ops.push(`BT /F1 8 Tf ${color(this.colores.suave)} rg ${n2(A4.w / 2 - ancho(t, "F1", 8) / 2)} 30 Td ${literal(t)} Tj ET`);
        p.ops.unshift(`${color(this.colores.linea)} RG`);
      });
      const objs = [];
      const reservar = () => { objs.push(null); return objs.length; };
      const fijar = (n, contenido) => { objs[n - 1] = contenido; };
      const ref = (n) => `${n} 0 R`;
      const enc = (s) => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xff; return b; };

      const nCatalogo = reservar(), nPaginas = reservar();
      const nFuentes = {}; for (const k of Object.keys(FUENTES)) nFuentes[k] = reservar();
      const nPag = this.paginas.map(() => reservar());
      const nCont = this.paginas.map(() => reservar());
      for (const k of Object.keys(FUENTES)) fijar(nFuentes[k], `<< /Type /Font /Subtype /Type1 /BaseFont /${FUENTES[k].base} /Encoding /WinAnsiEncoding >>`);
      const destArr = (nombre) => { const d = this.destinos[nombre]; return d ? `[${ref(nPag[d.pagina])} /XYZ 0 ${n2(d.y)} null]` : null; };
      const recursos = `<< /Font << ${Object.keys(FUENTES).map((k) => `/${k} ${ref(nFuentes[k])}`).join(" ")} >> >>`;
      this.paginas.forEach((p, i) => {
        const cuerpo = p.ops.map((o) => (typeof o === "function" ? o() : o)).join("\n");
        fijar(nCont[i], { stream: enc(cuerpo), dict: "" });
        const annots = p.annots.map((a) => { const d = destArr(a.destino); return d ? `<< /Type /Annot /Subtype /Link /Rect [${a.rect.map(n2).join(" ")}] /Border [0 0 0] /Dest ${d} >>` : null; }).filter(Boolean);
        fijar(nPag[i], `<< /Type /Page /Parent ${ref(nPaginas)} /MediaBox [0 0 ${A4.w} ${A4.h}] /Resources ${recursos} /Contents ${ref(nCont[i])}${annots.length ? ` /Annots [${annots.join(" ")}]` : ""} >>`);
      });
      fijar(nPaginas, `<< /Type /Pages /Kids [${nPag.map(ref).join(" ")}] /Count ${nPag.length} >>`);

      // Marcadores
      let nOutlines = null;
      if (this.marcadores.length) {
        nOutlines = reservar();
        const contar = (ms) => ms.reduce((a, m) => a + 1 + contar(m.hijos), 0);
        const escribir = (ms, padre) => {
          const nums = ms.map(() => reservar());
          ms.forEach((m, i) => {
            const hijos = m.hijos.length ? escribir(m.hijos, nums[i]) : null;
            const d = destArr(m.destino);
            fijar(nums[i], `<< /Title ${hexUnicode(m.titulo)} /Parent ${ref(padre)}${i ? ` /Prev ${ref(nums[i - 1])}` : ""}${i < ms.length - 1 ? ` /Next ${ref(nums[i + 1])}` : ""}${d ? ` /Dest ${d}` : ""}${hijos ? ` /First ${ref(hijos[0])} /Last ${ref(hijos[hijos.length - 1])} /Count ${contar(m.hijos)}` : ""} >>`);
          });
          return nums;
        };
        const raiz = escribir(this.marcadores, nOutlines);
        fijar(nOutlines, `<< /Type /Outlines /First ${ref(raiz[0])} /Last ${ref(raiz[raiz.length - 1])} /Count ${contar(this.marcadores)} >>`);
      }
      // Adjuntos
      let nombres = "";
      if (this.adjuntos.length) {
        const pares = this.adjuntos.map((a) => {
          const nEf = reservar(), nSpec = reservar();
          fijar(nEf, { stream: a.bytes, dict: "/Type /EmbeddedFile /Subtype /text#2Fmarkdown" });
          fijar(nSpec, `<< /Type /Filespec /F ${literal(a.nombre)} /UF ${hexUnicode(a.nombre)} /Desc ${hexUnicode(a.desc)} /EF << /F ${ref(nEf)} >> >>`);
          return [a.nombre, nSpec];
        }).sort((x, y) => (x[0] < y[0] ? -1 : 1));
        nombres = ` /Names << /EmbeddedFiles << /Names [${pares.map(([n, s]) => `${literal(n)} ${ref(s)}`).join(" ")}] >> >>`;
      }
      fijar(nCatalogo, `<< /Type /Catalog /Pages ${ref(nPaginas)}${nOutlines ? ` /Outlines ${ref(nOutlines)} /PageMode /UseOutlines` : ""}${nombres} /Lang (es-ES) >>`);
      const nInfo = reservar();
      const d = new Date(), p2 = (v) => String(v).padStart(2, "0");
      fijar(nInfo, `<< /Title ${hexUnicode(this.titulo)} /Author ${hexUnicode(this.autor)} /Creator (HolaFresco) /CreationDate (D:${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}${p2(d.getHours())}${p2(d.getMinutes())}) >>`);

      // Ensamblado con tabla xref
      const partes = [];
      let pos = 0;
      const push = (b) => { partes.push(b); pos += b.length; };
      push(enc("%PDF-1.7\n%âãÏÓ\n"));
      const offsets = [];
      objs.forEach((o, i) => {
        offsets.push(pos);
        if (typeof o === "string") push(enc(`${i + 1} 0 obj\n${o}\nendobj\n`));
        else {
          push(enc(`${i + 1} 0 obj\n<< ${o.dict} /Length ${o.stream.length} >>\nstream\n`));
          push(o.stream);
          push(enc("\nendstream\nendobj\n"));
        }
      });
      const xref = pos;
      let tabla = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
      for (const off of offsets) tabla += `${String(off).padStart(10, "0")} 00000 n \n`;
      push(enc(tabla + `trailer\n<< /Size ${objs.length + 1} /Root ${ref(nCatalogo)} /Info ${ref(nInfo)} >>\nstartxref\n${xref}\n%%EOF\n`));
      const out = new Uint8Array(pos);
      let k = 0; for (const b of partes) { out.set(b, k); k += b.length; }
      return out;
    }
  }

  window.PDF = { Documento, limpiar, ancho, partir, A4, M, ANCHO };
})();
