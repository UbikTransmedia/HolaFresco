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

  /* Unifica unidades convertibles dentro de un mismo ingrediente (cucharaditas → cucharadas) */
  const unificar = (cant) => {
    if (cant.has("cdta") && (cant.has("cda") || cant.get("cdta") >= 3)) {
      cant.set("cda", (cant.get("cda") || 0) + cant.get("cdta") / 3);
      cant.delete("cdta");
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
        const clave = Catalogo.normalizar(n);
        if (!items.has(clave)) items.set(clave, { clave, n, cantidades: new Map(), alGusto: false, recetas: new Set(), opcional: true, pasillo: Catalogo.pasilloDe(n) });
        const it = items.get(clave);
        if (u === "al gusto" || ing.q == null) it.alGusto = true;
        else it.cantidades.set(u, (it.cantidades.get(u) || 0) + ing.q);
        it.recetas.add(r.nombre);
        if (!ing.opcional) it.opcional = false;
      }
    }
    const enCasa = (menu.enCasa || []).filter(Boolean);
    if (enCasa.length) for (const it of items.values()) if (enCasa.some((t) => Catalogo.ingredienteUsa(it.n, t))) it.pasillo = "en-casa";
    const lista = [...items.values()].map((it) => {
      unificar(it.cantidades);
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
      if ((p.id === "basicos" && !incluirBasicos) || p.id === "en-casa") continue;
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
      if ((p.id === "basicos" && !incluirBasicos) || p.id === "en-casa") continue;
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

  window.Compra = { construir, escalar, ordenarIngredientes, redondear, fmtCantidad, fmtNum, fmtUnidad, textoCantidad, textoItem, FORMATOS, exportarTexto, exportarHTML, copiarAlPortapapeles, compartir };
})();
