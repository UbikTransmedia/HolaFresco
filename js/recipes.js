/* Capa de recetas: semilla (ficheros js/data) + recetas propias + modificaciones + ocultas,
   favoritas y lista negra (excluidas de los menús). */
(function () {
  "use strict";
  const { DB, Catalogo } = window;

  const CATEGORIAS = [
    { id: "legumbres", nombre: "Legumbres", icono: "🫘", desc: "Guisos, ensaladas y platos con lentejas, garbanzos y judías" },
    { id: "pescado", nombre: "Pescado", icono: "🐟", desc: "Pescado blanco, azul, marisco y conservas" },
    { id: "carnes", nombre: "Carnes", icono: "🍗", desc: "Pollo, pavo, cerdo, ternera y cordero" },
    { id: "huevos", nombre: "Huevos", icono: "🍳", desc: "Tortillas, revueltos, huevos al plato, frittatas y shakshukas" },
    { id: "verduras", nombre: "Verduras", icono: "🥦", desc: "Platos en los que la verdura es la protagonista: asados, guisos, rellenos, gratinados, currys" },
    { id: "proteina-vegetal", nombre: "Tofu, tempeh y seitán", icono: "🫛", desc: "Platos con proteína vegetal (tofu, tempeh, seitán, heura, soja texturizada) como protagonista" },
    { id: "ensaladas", nombre: "Ensaladas", icono: "🥗", desc: "Ensaladas y bowls completos, frescos y templados" },
    { id: "pasta-arroces", nombre: "Pasta y arroces", icono: "🍝", desc: "Pasta, arroces, cuscús, quinoa y otros cereales" },
    { id: "sopas-cremas", nombre: "Sopas y cremas", icono: "🍲", desc: "Cremas, sopas completas, caldos y frías de verano" },
    { id: "olla-express", nombre: "Olla exprés", icono: "💣", desc: "Peligroso y sabroso: guisos, legumbres y carnes a presión" },
  ];
  const categoria = (id) => CATEGORIAS.find((c) => c.id === id) || { id, nombre: id || "Sin categoría", icono: "🍽️" };

  /* Los ids se mantienen aunque cambie el nombre visible (latinoamericana → Hispanoamericana,
     americana → Angloamericana) para no romper menús ni recetas guardadas. */
  const COCINAS = [
    { id: "española", nombre: "Española", icono: "🥘" },
    { id: "mediterránea", nombre: "Mediterránea", icono: "🫒", desc: "Provenza, Córcega, Malta, Adriático y cocina saludable de inspiración mediterránea" },
    { id: "italiana", nombre: "Italiana", icono: "🍕", desc: "De norte a sur de Italia, con Sicilia y Cerdeña" },
    { id: "griega", nombre: "Griega", icono: "🏛️", desc: "Griega continental, de las islas y chipriota" },
    { id: "asiática", nombre: "Asiática", icono: "🥢", desc: "China, japonesa, coreana y taiwanesa" },
    { id: "sudeste-asiático", nombre: "Sudeste asiático", icono: "🍜", desc: "Tailandesa, vietnamita, indonesia, malaya, filipina, camboyana, birmana, laosiana y de Singapur" },
    { id: "india", nombre: "India", icono: "🍛" },
    { id: "oriente-medio", nombre: "Oriente Medio y Magreb", icono: "🧆" },
    { id: "latinoamericana", nombre: "Hispanoamericana", icono: "🌮", desc: "México, Perú, Caribe, Andes, Cono Sur y Brasil" },
    { id: "europea", nombre: "Europea", icono: "🥐", desc: "Centroeuropea, francesa, británica, nórdica" },
    { id: "eslava", nombre: "Eslava", icono: "🥟", desc: "Rusa, ucraniana, polaca, checa, eslovaca y balcánica" },
    { id: "africana", nombre: "Africana", icono: "🪘", desc: "África occidental, Etiopía y Eritrea, África oriental, central y austral" },
    { id: "americana", nombre: "Angloamericana", icono: "🍔", desc: "Estados Unidos y Canadá: sur, cajún, tex-mex, barbacoa, clásicos de diner" },
    { id: "fusión", nombre: "Fusión", icono: "🌍", desc: "Mezcla de tradiciones o cocina saludable contemporánea sin un origen claro" },
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
    recetario: { id: "recetario", nombre: "Originales", corto: "Original", icono: "📄", desc: "Receta original: desarrollada a partir del recetario de partida de HolaFresco" },
    inventada: { id: "inventada", nombre: "Derivadas", corto: "Derivada", icono: "✨", desc: "Receta derivada: creada a partir de las originales (cocinas del mundo, tradicionales, prácticas y saludables)" },
    propia: { id: "propia", nombre: "Mías", corto: "Mía", icono: "✍️", desc: "Añadida por ti" },
  };

  /* Dieta: se elige una sola (excluyentes). Vegetariana y vegana se deducen de los ingredientes;
     keto y detox las asignó una revisión de nutricionista (etiquetas «keto» y «detox»).
     Las restricciones por alergia o intolerancia (sin gluten, sin lácteos, FODMAP…) van en Intolerancias. */
  const DIETAS = [
    { id: "toda", nombre: "Toda", icono: "🍽️", desc: "Todas las recetas, sin filtrar por dieta" },
    { id: "vegetariana", nombre: "Vegetariana", icono: "🥬", desc: "Sin carne ni pescado ni marisco" },
    { id: "vegana", nombre: "Vegana", icono: "🌱", desc: "Sin ningún producto animal" },
    { id: "keto", nombre: "Keto", icono: "🥑", desc: "Cetogénica: muy pocos hidratos (≤ 20 g por ración) y la mayor parte de la energía de la grasa" },
    { id: "detox", nombre: "Detox", icono: "🍃", desc: "Platos ligeros y vegetales, sin alcohol, azúcar, embutidos, fritos ni grasas pesadas (término popular, no médico)" },
  ];
  const dietaInfo = (id) => DIETAS.find((d) => d.id === id) || null;

  /* Necesidades especiales (etiquetas asignadas en la revisión de nutricionista; se pueden poner a mano en «etiquetas») */
  const NECESIDADES = [
    { id: "verduras-escondidas", etiqueta: "verduras escondidas", nombre: "Verduras escondidas", icono: "🙈", desc: "La verdura va triturada o rallada y no se nota: ideal para niños o poco amigos de la verdura" },
    { id: "sin-verduras", etiqueta: "sin verduras", nombre: "Sin verduras", icono: "🚫🥦", desc: "Sin verduras ni hortalizas visibles (solo aromáticos en el sofrito, hierbas o tomate en salsa)" },
    { id: "superalimentos", etiqueta: "superalimentos", nombre: "Superalimentos", icono: "💪", desc: "Protagonizan al menos dos alimentos de alta densidad nutricional: pescado azul, legumbres, hoja verde, frutos rojos, semillas, cereales integrales…" },
    { id: "poco-especiada", etiqueta: "poco especiada", nombre: "Poco especiada", icono: "🧂", desc: "Sabor suave, sin picante ni mezclas de especias intensas" },
    { id: "facil-digestion", etiqueta: "fácil digestión", nombre: "Fácil digestión", icono: "🫶", desc: "Para intestino irritable o hinchazón: baja en FODMAP, sin picante, alcohol ni fritos, grasa moderada y cocción suave" },
    { id: "bajo-colesterol", etiqueta: "bajo en colesterol", nombre: "Bajo en colesterol", icono: "❤️", desc: "Sin yema en cantidad, mantequilla, nata, quesos grasos, embutidos, carne roja ni marisco rico en colesterol" },
  ];

  /* Formas de cocinar. Se derivan del equipo y las etiquetas; una receta puede fijarlas en `coccion`. */
  const COCCIONES = [
    { id: "sin-fuego", nombre: "Sin fuego", icono: "🥗", desc: "No necesita cocinar: ni fuego, ni horno, ni microondas" },
    { id: "una-olla", nombre: "Todo en una olla", icono: "🍲", desc: "Una sola olla, cazuela o sartén: menos que fregar" },
    { id: "todo-al-horno", nombre: "Todo al horno", icono: "🔥", desc: "Solo horno: metes la bandeja y te olvidas" },
    { id: "airfryer", nombre: "Airfryer", icono: "🌀", desc: "Freidora de aire" },
    { id: "microondas", nombre: "Microondas", icono: "📻", desc: "Hecha en el microondas" },
    { id: "slow-cooker", nombre: "Slow cooker", icono: "🐢", desc: "Olla de cocción lenta: horas sin vigilar" },
    { id: "olla-express", nombre: "Olla exprés", icono: "💣", desc: "Olla a presión" },
  ];
  const coccion = (id) => COCCIONES.find((c) => c.id === id) || null;
  const EQUIPO_FUEGO = ["horno", "sartén", "cazuela", "olla-express", "plancha", "wok", "airfryer", "microondas", "slow-cooker"];
  const RECIPIENTES = ["sartén", "cazuela", "wok", "olla-express", "slow-cooker", "plancha"];
  const derivarCoccion = (r) => {
    const set = new Set(Array.isArray(r.coccion) ? r.coccion : []);
    const eq = (r.equipo || []).filter((e) => EQUIPO_FUEGO.includes(e));
    const et = (r.etiquetas || []).map((e) => Catalogo.normalizar(e));
    const tiene = (...xs) => xs.some((x) => et.includes(Catalogo.normalizar(x)));
    const cocina = /\b(hierv|cuec|coce|cocin|horne|hornea|fri[ea]|frei|sarten|horno|asa[rd]?|dora|tuest|calient|saltea|microondas|plancha|escalfa|pocha|sofri|°c|grados)/;
    const pasosTxt = Catalogo.normalizar((r.pasos || []).join(" "));
    if (tiene("sin coccion", "sin fuego") || (!eq.length && !cocina.test(pasosTxt))) set.add("sin-fuego");
    if (tiene("todo al horno", "una sola bandeja") || (eq.length === 1 && eq[0] === "horno")) set.add("todo-al-horno");
    if (tiene("una sola sarten", "una sola cazuela", "una sola olla", "una olla", "todo en una olla", "one pot") || (eq.length === 1 && RECIPIENTES.includes(eq[0]))) set.add("una-olla");
    for (const e of ["airfryer", "microondas", "slow-cooker", "olla-express"]) if (eq.includes(e)) set.add(e);
    return COCCIONES.map((c) => c.id).filter((id) => set.has(id));
  };
  /* ¿Aguanta bien en tupper y al recalentar? Las recetas pueden fijarlo con `tupper: true/false`. */
  const derivarTupper = (r, grupos) => {
    if (typeof r.tupper === "boolean") return r.tupper;
    const et = (r.etiquetas || []).map((e) => Catalogo.normalizar(e));
    const tiene = (...xs) => xs.some((x) => et.includes(Catalogo.normalizar(x)));
    if (tiene("sin coccion") && (grupos.has("pescado") || grupos.has("marisco")) && !tiene("ideal para llevar")) return false; // crudos de pescado
    if (tiene("ideal para llevar", "batch cooking", "tupper", "para llevar", "recalentar", "aprovechamiento", "de cuchara", "guiso")) return true;
    return ["legumbres", "olla-express", "sopas-cremas"].includes(r.categoria);
  };

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
    const grupos = new Set(), gruposFijos = new Set(); // gruposFijos: solo ingredientes no opcionales
    for (const ing of r.ingredientes || []) {
      for (const g of Catalogo.gruposDe(ing.n)) { grupos.add(g); if (!ing.opcional) gruposFijos.add(g); }
    }
    const dieta = [];
    const etiq = (r.etiquetas || []).map((e) => Catalogo.normalizar(e));
    const vegetariana = !grupos.has("carne") && !grupos.has("pescado") && !grupos.has("marisco");
    if (vegetariana) dieta.push("vegetariana");
    if (vegetariana && !grupos.has("lacteos") && !grupos.has("huevo") && !grupos.has("miel")) dieta.push("vegana");
    if (etiq.includes("keto")) dieta.push("keto");
    if (etiq.includes("detox")) dieta.push("detox");
    r.dieta = dieta;
    r.necesidades = NECESIDADES.filter((n) => etiq.includes(Catalogo.normalizar(n.etiqueta))).map((n) => n.id);
    r.grupos = [...grupos];
    // Alérgenos e intolerancias: los de ingredientes obligatorios y, aparte, los que solo aparecen en opcionales
    r.alergenos = Catalogo.INTOLERANCIAS.filter((t) => t.grupos.some((g) => gruposFijos.has(g))).map((t) => t.id);
    r.alergenosOpcionales = Catalogo.INTOLERANCIAS.filter((t) => !r.alergenos.includes(t.id) && t.grupos.some((g) => grupos.has(g))).map((t) => t.id);
    r.nutricion = r.nutricion || {};
    r.raciones = r.raciones || 2;
    r.momentos = r.momentos && r.momentos.length ? r.momentos : ["comida", "cena"];
    r.equipo = r.equipo || [];
    r.etiquetas = r.etiquetas || [];
    r.coccion = derivarCoccion(r);
    r.tupper = derivarTupper(r, grupos);
    if (!CONTUNDENCIAS.some((c) => c.id === r.contundencia)) r.contundencia = contundenciaPorKcal(Number(r.nutricion.kcal));
    if (!COSTES.some((c) => c.id === r.coste)) r.coste = Catalogo.costeDe(r.ingredientes);
    if (r.cocina && !COCINAS.some((c) => c.id === r.cocina)) r.cocina = null;
    r.favorita = favs.has(r.id);
    r.enListaNegra = negra.has(r.id);
    const coc = cocina(r.cocina);
    r.textoBusqueda = Catalogo.normalizar(
      [r.nombre, r.subtitulo, r.categoria, categoria(r.categoria).nombre, r.proteina, coc ? coc.nombre : "", r.contundencia, r.coste, ...r.coccion.map((c) => coccion(c).nombre), r.tupper ? "tupper" : "", ...(r.etiquetas || []), ...(r.ingredientes || []).map((i) => i.n)].join(" ")
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
    if (!limpia._coccionManual) delete limpia.coccion; delete limpia._coccionManual;
    if (limpia._tupper === "si") limpia.tupper = true; else if (limpia._tupper === "no") limpia.tupper = false; else if (limpia._tupper === "auto") delete limpia.tupper; delete limpia._tupper;
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
      const dietas = Array.isArray(f.dieta) ? f.dieta : f.dieta ? [f.dieta] : [];
      if (dietas.some((d) => d !== "toda" && d !== "omnivora" && !r.dieta.includes(d))) return false;
      if (f.necesidades && f.necesidades.length && !f.necesidades.every((n) => r.necesidades.includes(n))) return false;
      if (f.cocina && f.cocina.length && !f.cocina.includes(r.cocina)) return false;
      if (f.contundencia && f.contundencia.length && !f.contundencia.includes(r.contundencia)) return false;
      if (f.coste && f.coste.length && !f.coste.includes(r.coste)) return false;
      if (f.tiempoMax && r.tiempo > f.tiempoMax) return false;
      if (f.dificultad && f.dificultad.length && !f.dificultad.includes(r.dificultad)) return false;
      if (f.etiqueta && !r.etiquetas.includes(f.etiqueta)) return false;
      if (f.sinOllaExpress && r.equipo.includes("olla-express")) return false;
      if (f.coccion && f.coccion.length && !f.coccion.some((c) => r.coccion.includes(c))) return false;
      if (f.tupper && !r.tupper) return false;
      if (f.sinAlergenos && f.sinAlergenos.length && f.sinAlergenos.some((a) => r.alergenos.includes(a))) return false;
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

  /* Intolerancias: ingredientes de la receta que afectan a cada intolerancia y personas para las que no es apta */
  const ingredientesCon = (r, idIntolerancia, { opcionales = false } = {}) => {
    const t = Catalogo.intolerancia(idIntolerancia);
    if (!t) return [];
    return [...new Set(r.ingredientes.filter((i) => !!i.opcional === opcionales && t.grupos.some((g) => Catalogo.gruposDe(i.n).includes(g))).map((i) => i.n))];
  };
  const noAptaPara = (r, personas) => (personas || [])
    .map((p) => ({ persona: p, intolerancias: (p.intolerancias || []).filter((id) => r.alergenos.includes(id)).map(Catalogo.intolerancia).filter(Boolean) }))
    .filter((x) => x.intolerancias.length);
  const listaNombres = (nombres) => nombres.length <= 1 ? nombres.join("") : nombres.slice(0, -1).join(", ") + " y " + nombres[nombres.length - 1];

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
    const dietas = r.dieta.map((d) => (dietaInfo(d) || {}).nombre).filter(Boolean);
    if (dietas.length) L.push(`**Dieta:** ${dietas.join(", ")}`);
    if (r.necesidades.length) L.push(`**Necesidades:** ${r.necesidades.map((n) => NECESIDADES.find((x) => x.id === n).nombre).join(", ")}`);
    if (r.alergenos.length) L.push(`**Contiene (alérgenos e intolerancias):** ${r.alergenos.map((a) => Catalogo.intolerancia(a).corto).join(", ")}`);
    if (r.alergenosOpcionales.length) L.push(`**Solo en ingredientes opcionales:** ${r.alergenosOpcionales.map((a) => Catalogo.intolerancia(a).corto).join(", ")}`);
    if (r.equipo.length) L.push(`**Equipo:** ${r.equipo.join(", ")}`);
    if (r.coccion.length) L.push(`**Cocción:** ${r.coccion.map((c) => coccion(c).nombre).join(", ")}`);
    if (r.tupper) L.push("**Apta para tupper:** sí, aguanta bien y se recalienta sin problema");
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
    CATEGORIAS, categoria, COCINAS, cocina, COCCIONES, coccion, CONTUNDENCIAS, contundencia, contundenciaPorKcal, COSTES, coste, ORIGENES, DIETAS, dietaInfo, NECESIDADES, MOMENTOS, DIFICULTADES, PROTEINAS,
    todas, porId, esSemilla, guardar, borrar, restaurar, restaurarTodas, ocultas, duplicar,
    esFavorita, enListaNegra, toggleFavorita, toggleListaNegra, usadasRecientemente, aMarkdown, copiarMarkdown,
    indiceIngredientes, todasEtiquetas, filtrar, conflictosVeto, invalidar, enriquecer, ingredientesCon, noAptaPara, listaNombres,
  };
})();
