/* Capa de recetas: semilla (ficheros js/data) + recetas propias + modificaciones + ocultas,
   favoritas y lista negra (excluidas de los menús). */
(function () {
  "use strict";
  const { DB, Catalogo } = window;

  const CATEGORIAS = [
    { id: "legumbres", nombre: "Legumbres", icono: "🫘", desc: "Guisos, ensaladas y platos con lentejas, garbanzos y judías" },
    { id: "pescado", nombre: "Pescado", icono: "🐟", desc: "Pescado blanco, azul, marisco y conservas" },
    { id: "carnes", nombre: "Carnes", icono: "🍗", desc: "Pollo, pavo, cerdo, ternera y cordero" },
    { id: "vegetariano", nombre: "Vegetariano", icono: "🥬", desc: "Sin carne ni pescado, con huevo o lácteos" },
    { id: "vegano", nombre: "Vegano", icono: "🌱", desc: "Sin ningún producto animal" },
    { id: "ensaladas", nombre: "Ensaladas", icono: "🥗", desc: "Ensaladas y bowls completos, frescos y templados" },
    { id: "pasta-arroces", nombre: "Pasta y arroces", icono: "🍝", desc: "Pasta, arroces, cuscús, quinoa y otros cereales" },
    { id: "sopas-cremas", nombre: "Sopas y cremas", icono: "🍲", desc: "Cremas, sopas completas, caldos y frías de verano" },
    { id: "olla-express", nombre: "Olla exprés", icono: "💣", desc: "Peligroso y sabroso: guisos, legumbres y carnes a presión" },
  ];
  const categoria = (id) => CATEGORIAS.find((c) => c.id === id) || { id, nombre: id || "Sin categoría", icono: "🍽️" };

  const COCINAS = [
    { id: "española", nombre: "Española", icono: "🥘" },
    { id: "mediterránea", nombre: "Mediterránea", icono: "🫒", desc: "Italiana, griega, sur de Francia" },
    { id: "asiática", nombre: "Asiática", icono: "🥢", desc: "China, japonesa, tailandesa, vietnamita, coreana" },
    { id: "india", nombre: "India", icono: "🍛" },
    { id: "oriente-medio", nombre: "Oriente Medio y Magreb", icono: "🧆" },
    { id: "latinoamericana", nombre: "Latinoamericana", icono: "🌮" },
    { id: "europea", nombre: "Europea", icono: "🥐", desc: "Centroeuropea, francesa, británica, nórdica" },
    { id: "americana", nombre: "Americana", icono: "🍔" },
    { id: "fusión", nombre: "Fusión", icono: "🌍" },
  ];
  const cocina = (id) => COCINAS.find((c) => c.id === id) || null;

  const CONTUNDENCIAS = [
    { id: "ligera", nombre: "Ligera", icono: "🍃", desc: "Menos de 480 kcal por ración" },
    { id: "media", nombre: "Media", icono: "🍽️", desc: "Entre 480 y 650 kcal por ración" },
    { id: "contundente", nombre: "Contundente", icono: "🍖", desc: "Más de 650 kcal por ración" },
  ];
  const contundencia = (id) => CONTUNDENCIAS.find((c) => c.id === id) || null;
  const contundenciaPorKcal = (kcal) => (!kcal ? "media" : kcal < 480 ? "ligera" : kcal > 650 ? "contundente" : "media");

  const COSTES = [
    { id: "económica", nombre: "Económica", icono: "€", desc: "Legumbres, huevos, pollo, conservas básicas…" },
    { id: "media", nombre: "Media", icono: "€€", desc: "Pescado blanco, ternera picada, quesos corrientes…" },
    { id: "premium", nombre: "Premium", icono: "€€€", desc: "Salmón, marisco, carrillada, solomillo, burrata…" },
  ];
  const coste = (id) => COSTES.find((c) => c.id === id) || null;

  const ORIGENES = {
    recetario: { id: "recetario", nombre: "Del recetario", corto: "Recetario", icono: "📄", desc: "Desarrollada a partir de un título de RECETAS.pdf" },
    inventada: { id: "inventada", nombre: "Inventada", corto: "Inventada", icono: "✨", desc: "Creada nueva inspirándose en RECETAS.pdf (cocina fusión y saludable)" },
    propia: { id: "propia", nombre: "Mía", corto: "Mía", icono: "✍️", desc: "Añadida por ti" },
  };

  const DIETAS = [
    { id: "vegetariana", nombre: "Vegetariana", icono: "🥬" },
    { id: "vegana", nombre: "Vegana", icono: "🌱" },
    { id: "sin-gluten", nombre: "Sin gluten", icono: "🌾" },
    { id: "sin-lactosa", nombre: "Sin lácteos", icono: "🥛" },
    { id: "sin-frutos-secos", nombre: "Sin frutos secos", icono: "🥜" },
  ];

  const MOMENTOS = [
    { id: "comida", nombre: "Comida", icono: "☀️" },
    { id: "cena", nombre: "Cena", icono: "🌙" },
  ];

  const DIFICULTADES = ["fácil", "media", "elaborada"];
  const PROTEINAS = ["legumbre", "pescado", "marisco", "pollo", "cerdo", "ternera", "cordero", "pavo", "huevo", "queso", "tofu", "seitan", "heura", "tempeh", "verdura", "mixto"];

  /* ---------- Favoritas y lista negra ---------- */
  const favoritos = () => new Set(DB.leer("favoritos", []));
  const listaNegra = () => new Set(DB.leer("listaNegra", []));
  const esFavorita = (id) => favoritos().has(id);
  const enListaNegra = (id) => listaNegra().has(id);
  const marcar = (clave, id) => {
    const s = new Set(DB.leer(clave, []));
    if (s.has(id)) s.delete(id); else s.add(id);
    DB.guardar(clave, [...s]);
    if (cache) { const r = cache.find((x) => x.id === id); if (r) r[clave === "favoritos" ? "favorita" : "enListaNegra"] = s.has(id); }
    document.dispatchEvent(new CustomEvent("recetas:marcas", { detail: { id, clave } }));
    return s.has(id);
  };
  const toggleFavorita = (id) => marcar("favoritos", id);
  const toggleListaNegra = (id) => marcar("listaNegra", id);

  /* Deriva etiquetas de dieta a partir de los ingredientes (coherente con los vetos) y completa atributos */
  const enriquecer = (r, favs, negra) => {
    const grupos = new Set();
    for (const ing of r.ingredientes || []) {
      for (const g of Catalogo.gruposDe(ing.n)) grupos.add(g);
    }
    const dieta = [];
    const vegetariana = !grupos.has("carne") && !grupos.has("pescado") && !grupos.has("marisco");
    if (vegetariana) dieta.push("vegetariana");
    if (vegetariana && !grupos.has("lacteos") && !grupos.has("huevo") && !grupos.has("miel")) dieta.push("vegana");
    if (!grupos.has("gluten")) dieta.push("sin-gluten");
    if (!grupos.has("lacteos")) dieta.push("sin-lactosa");
    if (!grupos.has("frutos-secos")) dieta.push("sin-frutos-secos");
    r.dieta = dieta;
    r.grupos = [...grupos];
    r.nutricion = r.nutricion || {};
    r.raciones = r.raciones || 2;
    r.momentos = r.momentos && r.momentos.length ? r.momentos : ["comida", "cena"];
    r.equipo = r.equipo || [];
    r.etiquetas = r.etiquetas || [];
    if (!CONTUNDENCIAS.some((c) => c.id === r.contundencia)) r.contundencia = contundenciaPorKcal(Number(r.nutricion.kcal));
    if (!COSTES.some((c) => c.id === r.coste)) r.coste = Catalogo.costeDe(r.ingredientes);
    if (r.cocina && !COCINAS.some((c) => c.id === r.cocina)) r.cocina = null;
    r.favorita = favs.has(r.id);
    r.enListaNegra = negra.has(r.id);
    const coc = cocina(r.cocina);
    r.textoBusqueda = Catalogo.normalizar(
      [r.nombre, r.subtitulo, r.categoria, categoria(r.categoria).nombre, r.proteina, coc ? coc.nombre : "", r.contundencia, r.coste, ...(r.etiquetas || []), ...(r.ingredientes || []).map((i) => i.n)].join(" ")
    );
    return r;
  };

  let cache = null;
  const invalidar = () => { cache = null; document.dispatchEvent(new CustomEvent("recetas:cambio")); };

  const semilla = () => (window.RECETAS_SEED || []).map((r) => ({ ...r, origen: r.origen || "recetario" }));

  const todas = () => {
    if (cache) return cache;
    const overrides = DB.leer("recetasOverrides", {});
    const borradas = new Set(DB.leer("recetasBorradas", []));
    const propias = DB.leer("recetasPropias", []);
    const favs = favoritos();
    const negra = listaNegra();
    const base = semilla()
      .filter((r) => !borradas.has(r.id))
      .map((r) => (overrides[r.id] ? { ...r, ...overrides[r.id], id: r.id, origen: r.origen, _modificada: true } : r));
    cache = [...base, ...propias.map((r) => ({ ...r, origen: "propia" }))].map((r) => enriquecer(JSON.parse(JSON.stringify(r)), favs, negra));
    return cache;
  };

  const porId = (id) => todas().find((r) => r.id === id) || null;
  const esSemilla = (id) => semilla().some((r) => r.id === id);

  const guardar = (receta) => {
    const limpia = { ...receta };
    for (const k of ["dieta", "grupos", "textoBusqueda", "_modificada", "favorita", "enListaNegra"]) delete limpia[k];
    limpia.ingredientes = (limpia.ingredientes || []).filter((i) => i.n && i.n.trim());
    limpia.pasos = (limpia.pasos || []).filter((p) => p && p.trim());
    if (limpia.id && esSemilla(limpia.id)) {
      const overrides = DB.leer("recetasOverrides", {});
      overrides[limpia.id] = limpia;
      DB.guardar("recetasOverrides", overrides);
    } else {
      const propias = DB.leer("recetasPropias", []);
      if (!limpia.id) limpia.id = DB.uid("mia");
      limpia.origen = "propia";
      const idx = propias.findIndex((r) => r.id === limpia.id);
      if (idx >= 0) propias[idx] = limpia; else propias.push(limpia);
      DB.guardar("recetasPropias", propias);
    }
    invalidar();
    return limpia.id;
  };

  /* "Quitar" = ocultar en este navegador (la receta sigue en los ficheros del proyecto) */
  const borrar = (id) => {
    if (esSemilla(id)) {
      const borradas = DB.leer("recetasBorradas", []);
      if (!borradas.includes(id)) borradas.push(id);
      DB.guardar("recetasBorradas", borradas);
    } else {
      DB.guardar("recetasPropias", DB.leer("recetasPropias", []).filter((r) => r.id !== id));
    }
    invalidar();
  };

  const restaurar = (id) => {
    const overrides = DB.leer("recetasOverrides", {});
    delete overrides[id];
    DB.guardar("recetasOverrides", overrides);
    DB.guardar("recetasBorradas", DB.leer("recetasBorradas", []).filter((x) => x !== id));
    invalidar();
  };

  const restaurarTodas = () => {
    DB.borrar("recetasOverrides");
    DB.borrar("recetasBorradas");
    invalidar();
  };

  const ocultas = () => {
    const borradas = new Set(DB.leer("recetasBorradas", []));
    return semilla().filter((r) => borradas.has(r.id));
  };

  const duplicar = (id) => {
    const r = porId(id);
    if (!r) return null;
    const copia = JSON.parse(JSON.stringify(r));
    delete copia.id;
    copia.nombre = r.nombre + " (copia)";
    return guardar(copia);
  };

  /* Índice de ingredientes para autocompletar (nombre → nº recetas) */
  const indiceIngredientes = () => {
    const m = new Map();
    for (const r of todas()) for (const i of r.ingredientes) {
      const k = i.n.trim().toLowerCase();
      m.set(k, (m.get(k) || 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([n, c]) => ({ n, c }));
  };

  const todasEtiquetas = () => {
    const m = new Map();
    for (const r of todas()) for (const e of r.etiquetas) m.set(e, (m.get(e) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([n, c]) => ({ n, c }));
  };

  /* Recetas usadas en menús guardados en las últimas N semanas */
  const usadasRecientemente = (semanas) => {
    const res = new Set();
    if (!semanas) return res;
    const limite = Date.now() - semanas * 7 * 24 * 3600 * 1000;
    for (const m of DB.leer("menus", [])) {
      const t = Date.parse(m.creado || "");
      if (!t || t < limite) continue;
      for (const s of m.slots || []) if (s.recetaId) res.add(s.recetaId);
    }
    return res;
  };

  /* Filtro genérico usado por la vista de recetas y el wizard */
  const filtrar = (f = {}) => {
    const q = Catalogo.normalizar(f.q || "");
    const palabras = q ? q.split(" ").filter(Boolean) : [];
    return todas().filter((r) => {
      if (palabras.length && !palabras.every((p) => r.textoBusqueda.includes(p))) return false;
      if (f.categoria && f.categoria.length && !f.categoria.includes(r.categoria)) return false;
      if (f.origen && f.origen.length && !f.origen.includes(r.origen)) return false;
      if (f.momento && !r.momentos.includes(f.momento)) return false;
      if (f.dieta && f.dieta.length && !f.dieta.every((d) => r.dieta.includes(d))) return false;
      if (f.cocina && f.cocina.length && !f.cocina.includes(r.cocina)) return false;
      if (f.contundencia && f.contundencia.length && !f.contundencia.includes(r.contundencia)) return false;
      if (f.coste && f.coste.length && !f.coste.includes(r.coste)) return false;
      if (f.tiempoMax && r.tiempo > f.tiempoMax) return false;
      if (f.dificultad && f.dificultad.length && !f.dificultad.includes(r.dificultad)) return false;
      if (f.etiqueta && !r.etiquetas.includes(f.etiqueta)) return false;
      if (f.sinOllaExpress && r.equipo.includes("olla-express")) return false;
      if (f.soloFavoritas && !r.favorita) return false;
      if (f.listaNegra === "ocultar" && r.enListaNegra) return false;
      if (f.listaNegra === "solo" && !r.enListaNegra) return false;
      return true;
    });
  };

  /* ¿Qué ingredientes de la receta chocan con una lista de vetos? */
  const conflictosVeto = (receta, vetos = []) => {
    const res = [];
    for (const ing of receta.ingredientes) {
      for (const v of vetos) {
        if (Catalogo.ingredienteVetado(ing.n, v)) res.push({ ingrediente: ing.n, veto: v, opcional: !!ing.opcional });
      }
    }
    return res;
  };

  /* Receta en Markdown (para copiar y pegar en cualquier app de notas) */
  const aMarkdown = (r, raciones) => {
    raciones = raciones || r.raciones || 2;
    const C = window.Compra;
    const cat = categoria(r.categoria), coc = cocina(r.cocina), con = contundencia(r.contundencia), cos = coste(r.coste);
    const L = [];
    L.push(`# ${r.nombre}`);
    if (r.subtitulo) L.push("", `*${r.subtitulo.charAt(0).toUpperCase() + r.subtitulo.slice(1)}*`);
    L.push("");
    const datos = [`${cat.icono} ${cat.nombre}`, coc ? `${coc.icono} ${coc.nombre}` : null, `⏱ ${r.tiempo} min`, `Dificultad: ${r.dificultad}`, con ? `${con.icono} ${con.nombre}` : null, cos ? `Coste: ${cos.nombre}` : null].filter(Boolean);
    L.push(datos.join(" · "));
    const momentos = r.momentos.map((m) => (MOMENTOS.find((x) => x.id === m) || {}).nombre).filter(Boolean).join(" o ");
    if (momentos) L.push("", `**Para:** ${momentos}`);
    const dietas = r.dieta.filter((d) => d !== "sin-frutos-secos").map((d) => (DIETAS.find((x) => x.id === d) || {}).nombre).filter(Boolean);
    if (dietas.length) L.push(`**Apta para:** ${dietas.join(", ")}`);
    if (r.equipo.length) L.push(`**Equipo:** ${r.equipo.join(", ")}`);
    const rac = String(raciones).replace(".", ",");
    L.push("", `## Ingredientes (${rac} ${raciones === 1 ? "ración" : "raciones"})`, "");
    for (const ing of C.escalar(r, raciones)) {
      const q = ing.q == null ? null : C.redondear(ing.q, ing.u);
      const cant = ing.u === "al gusto" || q == null ? "al gusto" : C.fmtCantidad(q, ing.u);
      L.push(`- [ ] ${ing.n} · ${cant}${ing.opcional ? " (opcional)" : ""}${ing.nota ? ` — ${ing.nota}` : ""}`);
    }
    L.push("", "## Preparación", "");
    r.pasos.forEach((p, i) => L.push(`${i + 1}. ${p}`));
    if (r.consejo) L.push("", `> 💡 **Consejo:** ${r.consejo}`);
    const n = r.nutricion || {};
    if (n.kcal) L.push("", "## Por ración (aprox.)", "", "| kcal | Proteína | Hidratos | Grasa |", "|---|---|---|---|", `| ${n.kcal} | ${n.prot} g | ${n.hc} g | ${n.grasa} g |`);
    if (r.etiquetas.length) L.push("", r.etiquetas.map((e) => "#" + e.replace(/\s+/g, "-")).join(" "));
    return L.join("\n") + "\n";
  };

  const copiarMarkdown = async (id, raciones) => {
    const r = porId(id);
    if (!r) return false;
    const ok = await window.Compra.copiarAlPortapapeles(aMarkdown(r, raciones));
    window.UI.toast(ok ? `«${r.nombre}» copiada en Markdown. Pégala donde quieras.` : "No se pudo copiar automáticamente.", ok ? "ok" : "error");
    return ok;
  };

  document.addEventListener("recetas:semilla-cargada", invalidar);

  window.Recetas = {
    CATEGORIAS, categoria, COCINAS, cocina, CONTUNDENCIAS, contundencia, contundenciaPorKcal, COSTES, coste, ORIGENES, DIETAS, MOMENTOS, DIFICULTADES, PROTEINAS,
    todas, porId, esSemilla, guardar, borrar, restaurar, restaurarTodas, ocultas, duplicar,
    esFavorita, enListaNegra, toggleFavorita, toggleListaNegra, usadasRecientemente, aMarkdown, copiarMarkdown,
    indiceIngredientes, todasEtiquetas, filtrar, conflictosVeto, invalidar, enriquecer,
  };
})();
