/* Lista de la compra: agregación de ingredientes, redondeo, pasillos y exportación. */
(function () {
  "use strict";
  const { Recetas, Catalogo } = window;

  const redondear = (q, u) => {
    if (q == null) return null;
    switch (u) {
      case "g":
      case "ml":
        if (q < 20) return Math.ceil(q);
        if (q < 100) return Math.ceil(q / 5) * 5;
        if (q < 1000) return Math.ceil(q / 10) * 10;
        return Math.ceil(q / 50) * 50;
      case "ud":
      case "diente":
      case "lata":
      case "bote":
      case "rebanada":
      case "loncha":
      case "hoja":
      case "rama":
        return Math.ceil(q - 1e-9);
      case "cda":
      case "cdta":
      case "manojo":
      case "puñado":
        return Math.ceil(q * 2 - 1e-9) / 2;
      case "pizca":
        return Math.max(1, Math.ceil(q));
      default:
        return Math.round(q * 10) / 10;
    }
  };

  /* Redondeo para LEER una receta escalada (no para comprar): fracciones razonables en vez de redondear siempre hacia
     arriba. Con la lista de la compra se usa redondear() (se compran unidades enteras). */
  const aPaso = (q, paso) => Math.round(q / paso) * paso;
  const redondearReceta = (q, u) => {
    if (q == null) return null;
    switch (u) {
      case "g":
      case "ml":
        if (q < 10) return Math.max(1, Math.round(q));
        if (q < 100) return Math.max(5, aPaso(q, 5));
        if (q < 1000) return aPaso(q, 10);
        return aPaso(q, 50);
      case "ud":
      case "lata":
      case "bote":
      case "rebanada":
      case "loncha":
        if (q < 2) return Math.max(0.25, aPaso(q, 0.25));
        if (q < 5) return aPaso(q, 0.5);
        return Math.round(q);
      case "diente":
        return Math.max(0.5, aPaso(q, 0.5));
      case "hoja":
      case "rama":
        return Math.max(1, Math.round(q));
      case "cda":
      case "cdta":
      case "manojo":
      case "puñado":
        if (q < 1) return Math.max(0.25, aPaso(q, 0.25));
        return aPaso(q, 0.5);
      case "pizca":
        return Math.max(1, Math.round(q));
      default:
        return Math.round(q * 10) / 10;
    }
  };

  /* 0,5 → "½", 1,5 → "1½", 2 → "2", 0,25 → "¼" */
  const fmtNum = (n) => {
    if (n == null) return "";
    const entero = Math.floor(n);
    const resto = Math.round((n - entero) * 100) / 100;
    const frac = resto === 0.5 ? "½" : resto === 0.25 ? "¼" : resto === 0.75 ? "¾" : null;
    if (frac) return (entero ? String(entero) : "") + frac;
    return Number.isInteger(n) ? String(n) : n.toLocaleString("es-ES", { maximumFractionDigits: 1 });
  };

  const fmtUnidad = (q, u) => {
    const def = Catalogo.UNIDADES[u];
    if (!def) return u || "";
    if (u === "al gusto") return "al gusto";
    return q <= 1 ? def.nombre : def.plural;
  };

  const fmtCantidad = (q, u) => {
    if (u === "al gusto" || q == null) return "al gusto";
    if (u === "g" && q >= 1000) return fmtNum(Math.round(q / 50) / 20) + " kg";
    if (u === "ml" && q >= 1000) return fmtNum(Math.round(q / 50) / 20) + " l";
    return fmtNum(q) + " " + fmtUnidad(q, u);
  };

  /* Escala la lista de ingredientes de una receta a N raciones */
  const escalar = (receta, raciones) => {
    const f = raciones / (receta.raciones || 2);
    return receta.ingredientes.map((i) => ({ ...i, q: i.q == null ? null : i.q * f, qOriginal: i.q }));
  };

  /* Orden alfabético en español, sin distinguir mayúsculas ni tildes (listas para ir comprobando) */
  const compararNombre = (a, b) => a.localeCompare(b, "es", { sensitivity: "base", numeric: true });
  const ordenarIngredientes = (lista) => [...lista].sort((a, b) => compararNombre(a.n, b.n));

  /* Clave de la lista de la compra: el mismo producto aunque las recetas lo escriban distinto
     («rábano»/«rábanos», «cebolleta»/«cebolleta (parte verde)», «vinagre de Jerez»/«vinagre de jerez»). */
  const singular = (w) => {
    if (w.length <= 3 || !w.endsWith("s")) return w;
    const x = w.slice(0, -1);
    if (x.endsWith("ce")) return x.slice(0, -2) + "z"; // nueces → nuez
    if (/[nlr]e$/.test(x)) return x.slice(0, -1); // limones → limon, flores → flor (verdes → verde)
    return x; // tomates → tomate, rábanos → rábano
  };
  const claveCompra = (n) => Catalogo.normalizar(n.replace(/\((parte verde|bulbo|vainas)\)/gi, "")).split(" ").filter(Boolean).map(singular).join(" ");

  /* Peso orientativo por unidad para sumar «2 cebollas» con «150 g de cebolla». compra: unidad en que se compra. */
  const PESO_UD = {
    cebolla: [150, "ud"], "cebolla morada": [150, "ud"], cebolleta: [60, "ud"], chalota: [30, "ud"], puerro: [150, "ud"],
    patata: [200, "ud"], "patata nueva": [80, "ud"], boniato: [300, "ud"], zanahoria: [80, "ud"], chirivia: [150, "ud"],
    tomate: [120, "ud"], "tomate pera": [90, "ud"], "tomate cherry": [15, "g"], pepino: [300, "ud"],
    "pimiento rojo": [200, "ud"], "pimiento verde": [150, "ud"], "pimiento verde italiano": [120, "ud"], calabacin: [250, "ud"],
    berenjena: [300, "ud"], hinojo: [250, "ud"], rabano: [15, "ud"], "lechuga romana": [300, "ud"], "pak choi": [150, "ud"],
    brocoli: [400, "ud"], coliflor: [800, "ud"], "col blanca": [1000, "ud"], repollo: [1000, "ud"], calabaza: [1500, "g"],
    granada: [300, "ud"], "platano macho": [250, "ud"], limon: [120, "ud"], lima: [70, "ud"], naranja: [200, "ud"],
    manzana: [180, "ud"], pera: [180, "ud"], aguacate: [200, "ud"], huevo: [60, "ud"],
    "jengibre fresco": [30, "g"], "aceituna negra": [4, "g"], "aceituna verde": [4, "g"], almendra: [1.2, "g"],
    pepinillo: [20, "g"], "anchoa en aceite": [4, "g"], "pimiento del piquillo": [20, "g"], chorizo: [100, "g"],
    "pollo (contramuslos)": [120, "g"], "pollo (muslos deshuesados)": [100, "g"], "pollo (pechuga)": [250, "g"], "pavo (pechuga)": [300, "g"],
    "merluza (lomos)": [150, "g"], caballa: [300, "g"], "dorada entera": [400, "g"], mango: [300, "ud"], "orejon de albaricoque": [8, "g"],
  };

  /* Unifica unidades convertibles dentro de un mismo ingrediente */
  const unificar = (cant, clave) => {
    // una pizca se suma a las cucharaditas o cucharadas que ya haya (≈ ⅛ de cucharadita)
    if (cant.has("pizca") && (cant.has("cdta") || cant.has("cda"))) {
      cant.set("cdta", (cant.get("cdta") || 0) + cant.get("pizca") / 8);
      cant.delete("pizca");
    }
    // ramas de hierba fresca → manojos (≈ 10 ramas por manojo)
    if (cant.has("rama") && cant.has("manojo")) cant.set("manojo", cant.get("manojo") + cant.get("rama") / 10), cant.delete("rama");
    // cabezas de ajo (ud) → dientes (≈ 10 por cabeza)
    if (clave === "ajo" && cant.has("ud") && cant.has("diente")) cant.set("diente", cant.get("diente") + cant.get("ud") * 10), cant.delete("ud");
    // rebanadas de pan → gramos (≈ 40 g)
    if (cant.has("rebanada") && cant.has("g") && /^pan\b/.test(clave)) cant.set("g", cant.get("g") + cant.get("rebanada") * 40), cant.delete("rebanada");
    // cucharadas y cucharaditas → ml si alguna receta ya lo mide en ml (líquidos)
    if (cant.has("ml") && (cant.has("cda") || cant.has("cdta"))) {
      cant.set("ml", cant.get("ml") + (cant.get("cda") || 0) * 15 + (cant.get("cdta") || 0) * 5);
      cant.delete("cda"); cant.delete("cdta");
    }
    if (cant.has("cdta") && (cant.has("cda") || cant.get("cdta") >= 3)) {
      cant.set("cda", (cant.get("cda") || 0) + cant.get("cdta") / 3);
      cant.delete("cdta");
    }
    // gramos y unidades del mismo producto → la unidad en que se compra
    const peso = PESO_UD[clave];
    if (peso && cant.has("g") && cant.has("ud")) {
      const [g, compra] = peso;
      if (compra === "ud") cant.set("ud", cant.get("ud") + cant.get("g") / g), cant.delete("g");
      else cant.set("g", cant.get("g") + cant.get("ud") * g), cant.delete("ud");
    }
    // hojas sueltas de hierbas frescas → manojos (≈ 30 hojas); un manojo de cebolletas ≈ 6
    if (cant.has("hoja") && cant.has("manojo")) cant.set("manojo", cant.get("manojo") + cant.get("hoja") / 30), cant.delete("hoja");
    if (clave === "cebolleta" && cant.has("manojo") && cant.has("ud")) cant.set("ud", cant.get("ud") + cant.get("manojo") * 6), cant.delete("manojo");
    // hojas sueltas de lechuga o col → unidades
    if (cant.has("hoja") && cant.has("ud") && /^(lechuga|col|repollo)/.test(clave)) cant.set("ud", cant.get("ud") + cant.get("hoja") / (clave.startsWith("lechuga") ? 12 : 20)), cant.delete("hoja");
    // apio: ramas → gramos (≈ 40 g)
    if (clave === "apio" && cant.has("rama") && cant.has("g")) cant.set("g", cant.get("g") + cant.get("rama") * 40), cant.delete("rama");
    // si ya se compra al peso, las cucharadas y los puñados se pasan a gramos (aproximado)
    if (cant.has("g")) {
      const eq = { cda: 12, cdta: 4, "puñado": 30 };
      for (const [u, gr] of Object.entries(eq)) if (cant.has(u)) cant.set("g", cant.get("g") + cant.get(u) * gr), cant.delete(u);
    }
    return cant;
  };

  const ORDEN_UNIDADES = ["g", "ml", "ud", "diente", "lata", "bote", "manojo", "rama", "hoja", "rebanada", "loncha", "puñado", "cda", "cdta", "pizca"];

  /* Construye la lista a partir de un menú guardado. Un ingrediente = una fila, aunque venga en varias unidades. */
  const construir = (menu) => {
    const items = new Map(); // clave: nombre normalizado
    for (const s of menu.slots) {
      const r = Recetas.porId(s.recetaId);
      if (!r) continue;
      const raciones = s.raciones || menu.raciones || 2;
      for (const ing of escalar(r, raciones)) {
        const n = ing.n.trim();
        const u = ing.u || "ud";
        const clave = claveCompra(n);
        if (!items.has(clave)) items.set(clave, { clave, n: n.replace(/\s*\((parte verde|bulbo|vainas)\)/gi, ""), cantidades: new Map(), alGusto: false, recetas: new Set(), opcional: true, pasillo: Catalogo.pasilloDe(n) });
        const it = items.get(clave);
        if (u === "al gusto" || ing.q == null) it.alGusto = true;
        else it.cantidades.set(u, (it.cantidades.get(u) || 0) + ing.q);
        it.recetas.add(r.nombre);
        if (!ing.opcional) it.opcional = false;
      }
    }
    const enCasa = (menu.enCasa || []).filter(Boolean);
    // «Ya lo tengo»: solo el mismo producto («huevo» no esconde la mayonesa ni «limón» la hierba limón). No desaparece de la
    // lista: va a «Ya en casa» con la cantidad que pide el menú, para comprobar que hay bastante.
    const clavesCasa = new Set(enCasa.map(claveCompra));
    if (enCasa.length) for (const it of items.values()) if (clavesCasa.has(it.clave)) it.pasillo = "en-casa";
    const lista = [...items.values()].map((it) => {
      unificar(it.cantidades, it.clave);
      const partes = [...it.cantidades.entries()]
        .sort((a, b) => ORDEN_UNIDADES.indexOf(a[0]) - ORDEN_UNIDADES.indexOf(b[0]))
        .map(([u, q]) => ({ u, q, qRedondeada: redondear(q, u) }));
      return { ...it, recetas: [...it.recetas], partes, soloAlGusto: !partes.length };
    });
    const porPasillo = Catalogo.PASILLOS.map((p) => ({ ...p, items: lista.filter((i) => i.pasillo === p.id).sort((a, b) => compararNombre(a.n, b.n)) })).filter((p) => p.items.length);
    return { items: lista, porPasillo };
  };

  const textoCantidad = (it) => {
    if (it.soloAlGusto) return "al gusto";
    const t = it.partes.map((p) => fmtCantidad(p.qRedondeada, p.u)).join(" + ");
    return it.alGusto ? t + " (y un poco más al gusto)" : t;
  };

  const textoItem = (it) => {
    const nombre = it.n.charAt(0).toUpperCase() + it.n.slice(1);
    const opc = it.opcional ? " (opcional)" : "";
    return `${nombre} · ${textoCantidad(it)}${opc}`;
  };

  const FORMATOS = [
    { id: "markdown", nombre: "Markdown con casillas", desc: "Google Docs («Pegar desde Markdown»), Notion, Obsidian, Joplin…", ejemplo: "- [ ] Cebolla · 3 ud" },
    { id: "casillas", nombre: "Casillas ☐", desc: "Se ve como lista de comprobación en cualquier app (Samsung Notes, WhatsApp, Keep…), aunque la casilla no sea interactiva", ejemplo: "☐ Cebolla · 3 ud" },
    { id: "lineas", nombre: "Una línea por ingrediente", desc: "Sin símbolos. En Samsung Notes: pega, selecciona todo y pulsa «Lista de tareas» para convertirlo en casillas reales", ejemplo: "Cebolla · 3 ud" },
    { id: "vinetas", nombre: "Viñetas •", desc: "Para mensajes o notas sencillas", ejemplo: "• Cebolla · 3 ud" },
  ];

  const exportarTexto = (menu, lista, opciones = {}) => {
    const formato = opciones.formato || "markdown";
    const incluirBasicos = !!opciones.incluirBasicos;
    const conTitulos = opciones.conTitulos !== false;
    const marcados = new Set(opciones.marcados || []);
    const lineas = [];
    const titulo = `Lista de la compra · ${menu.nombre || "Menú semanal"}`;
    if (conTitulos) lineas.push(formato === "markdown" ? `## ${titulo}` : titulo, "");
    for (const p of lista.porPasillo) {
      if (p.id === "basicos" && !incluirBasicos) continue;
      if (conTitulos) lineas.push(formato === "markdown" ? `### ${p.icono} ${p.nombre}` : `${p.icono} ${p.nombre.toUpperCase()}`);
      for (const it of p.items) {
        const hecho = marcados.has(it.clave);
        const t = textoItem(it);
        if (formato === "markdown") lineas.push(`- [${hecho ? "x" : " "}] ${t}`);
        else if (formato === "casillas") lineas.push(`${hecho ? "☑" : "☐"} ${t}`);
        else if (formato === "vinetas") lineas.push(`• ${t}`);
        else lineas.push(t);
      }
      if (conTitulos) lineas.push("");
    }
    return lineas.join("\n").trim() + "\n";
  };

  const exportarHTML = (menu, lista, opciones = {}) => {
    const incluirBasicos = !!opciones.incluirBasicos;
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    let html = `<h2>Lista de la compra · ${esc(menu.nombre || "Menú semanal")}</h2>`;
    for (const p of lista.porPasillo) {
      if (p.id === "basicos" && !incluirBasicos) continue;
      html += `<h3>${p.icono} ${esc(p.nombre)}</h3><ul>`;
      for (const it of p.items) html += `<li>☐ ${esc(textoItem(it))}</li>`;
      html += `</ul>`;
    }
    return html;
  };

  const copiarAlPortapapeles = async (texto, html) => {
    try {
      if (navigator.clipboard && window.ClipboardItem && html) {
        const item = new ClipboardItem({ "text/plain": new Blob([texto], { type: "text/plain" }), "text/html": new Blob([html], { type: "text/html" }) });
        await navigator.clipboard.write([item]);
        return true;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(texto);
        return true;
      }
    } catch (e) {
      console.warn("Clipboard API falló, usando método clásico", e);
    }
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  };

  const compartir = async (titulo, texto) => {
    if (navigator.share) {
      try { await navigator.share({ title: titulo, text: texto }); return true; } catch (e) { return false; }
    }
    return false;
  };

  window.Compra = { construir, escalar, ordenarIngredientes, redondear, redondearReceta, claveCompra, fmtCantidad, fmtNum, fmtUnidad, textoCantidad, textoItem, FORMATOS, exportarTexto, exportarHTML, copiarAlPortapapeles, compartir };
})();
