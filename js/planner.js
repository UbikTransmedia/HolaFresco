/* Generador de menús semanales. */
(function () {
  "use strict";
  const { Recetas, Nutricion, Catalogo } = window;

  const DIAS = [
    { id: "lun", nombre: "Lunes", corto: "L", abr: "Lun", laborable: true },
    { id: "mar", nombre: "Martes", corto: "M", abr: "Mar", laborable: true },
    { id: "mie", nombre: "Miércoles", corto: "X", abr: "Mié", laborable: true },
    { id: "jue", nombre: "Jueves", corto: "J", abr: "Jue", laborable: true },
    { id: "vie", nombre: "Viernes", corto: "V", abr: "Vie", laborable: true },
    { id: "sab", nombre: "Sábado", corto: "S", abr: "Sáb", laborable: false },
    { id: "dom", nombre: "Domingo", corto: "D", abr: "Dom", laborable: false },
  ];
  const dia = (id) => DIAS.find((d) => d.id === id);

  const FRECUENCIAS = [
    { id: "nunca", nombre: "Nunca", peso: 0 },
    { id: "poco", nombre: "Poco", peso: 0.5 },
    { id: "normal", nombre: "Normal", peso: 1 },
    { id: "mucho", nombre: "Mucho", peso: 2 },
  ];

  const PRESUPUESTOS = [
    { id: "indiferente", nombre: "Da igual", icono: "🤷" },
    { id: "economico", nombre: "Económico", icono: "€", desc: "Sin recetas premium; prioriza las económicas" },
    { id: "medio", nombre: "Medio", icono: "€€", desc: "Pocas recetas premium" },
    { id: "premium", nombre: "Premium", icono: "€€€", desc: "Prioriza ingredientes de capricho" },
  ];

  const CONTUNDENCIA_OPCIONES = [
    { id: "auto", nombre: "Según objetivos", desc: "Ligera si alguien quiere perder peso o deshincharse" },
    { id: "ligera", nombre: "Ligera", icono: "🍃" },
    { id: "media", nombre: "Media", icono: "🍽️" },
    { id: "contundente", nombre: "Contundente", icono: "🍖" },
    { id: "indiferente", nombre: "Da igual" },
  ];

  const TIEMPOS = [[0, "Sin límite"], [20, "Hasta 20 min"], [30, "Hasta 30 min"], [45, "Hasta 45 min"], [60, "Hasta 1 h"], [90, "Hasta 1 h 30"], [120, "Hasta 2 h"]];
  const SEMANAS_SIN_REPETIR = [[0, "No importa"], [1, "1 semana"], [2, "2 semanas"], [4, "1 mes"], [8, "2 meses"], [13, "3 meses"]];

  /* Configuración por defecto del wizard */
  const configPorDefecto = () => ({
    nombre: "",
    personasIds: [],
    slots: DIAS.flatMap((d) => [{ dia: d.id, momento: "comida" }, { dia: d.id, momento: "cena" }]),
    frecuencias: Object.fromEntries(Recetas.CATEGORIAS.map((c) => [c.id, "normal"])),
    cocinasEvitar: [],
    cocinasPreferidas: [],
    dietas: [],            // ids de Recetas.DIETAS exigidas
    vetos: [],             // textos libres o ids de grupo
    obligatorias: [],      // { recetaId, dia?, momento? }
    tieneOllaExpress: true,
    tiempo: { laborables: 0, finde: 0, estricto: true },   // minutos; 0 = sin límite
    contundencia: { comida: "auto", cena: "auto" },
    presupuesto: "indiferente",
    evitarRepetidasSemanas: 0,
    permitirRepetir: false, // repetir una receta dentro del mismo menú (sobras)
    ingredientesObligatorios: [], // { nombre, enCasa } — ingredientes que deben salir en el menú
    semilla: null,
  });

  /* Acepta configuraciones antiguas (menús guardados con versiones previas) */
  const normalizarConfig = (cfg = {}) => {
    const base = configPorDefecto();
    const c = { ...base, ...JSON.parse(JSON.stringify(cfg)) };
    c.frecuencias = { ...base.frecuencias, ...(cfg.frecuencias || {}) };
    if (!c.tiempo || typeof c.tiempo !== "object") c.tiempo = { laborables: Number(cfg.tiempoMaxLaborables) || 0, finde: 0, estricto: true };
    c.tiempo = { ...base.tiempo, ...c.tiempo };
    if (!c.contundencia || typeof c.contundencia !== "object") c.contundencia = { comida: "auto", cena: cfg.cenasLigeras === "si" ? "ligera" : cfg.cenasLigeras === "no" ? "indiferente" : "auto" };
    c.contundencia = { ...base.contundencia, ...c.contundencia };
    c.cocinasEvitar = c.cocinasEvitar || [];
    c.cocinasPreferidas = (c.cocinasPreferidas || []).filter((x) => !c.cocinasEvitar.includes(x));
    c.presupuesto = PRESUPUESTOS.some((p) => p.id === c.presupuesto) ? c.presupuesto : "indiferente";
    c.evitarRepetidasSemanas = Number(c.evitarRepetidasSemanas) || 0;
    c.ingredientesObligatorios = (c.ingredientesObligatorios || []).filter((x) => x && x.nombre).map((x) => ({ nombre: String(x.nombre).trim().toLowerCase(), enCasa: x.enCasa !== false }));
    delete c.tiempoMaxLaborables; delete c.cenasLigeras;
    return c;
  };

  const rng = (seed) => {
    let s = (seed >>> 0) || 123456789;
    return () => {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  };

  const racionesTotales = (personas) => Nutricion.racionesGrupo(personas);

  const limiteTiempo = (cfg, diaId) => { const d = dia(diaId); return d && d.laborable ? cfg.tiempo.laborables : cfg.tiempo.finde; };

  /* Filtro duro de elegibilidad (las obligatorias se saltan este filtro) */
  const elegible = (r, cfg, momento, diaId, ctx = {}) => {
    if (!r.momentos.includes(momento)) return false;
    if (r.enListaNegra) return false;
    if (cfg.dietas.some((d) => !r.dieta.includes(d))) return false;
    if (Recetas.conflictosVeto(r, cfg.vetos).some((c) => !c.opcional)) return false;
    if (!cfg.tieneOllaExpress && r.equipo.includes("olla-express")) return false;
    const freq = FRECUENCIAS.find((f) => f.id === (cfg.frecuencias[r.categoria] || "normal"));
    if (freq && freq.peso === 0) return false;
    if (cfg.cocinasEvitar.length && r.cocina && cfg.cocinasEvitar.includes(r.cocina)) return false;
    if (cfg.presupuesto === "economico" && r.coste === "premium") return false;
    const lim = limiteTiempo(cfg, diaId);
    if (lim && r.tiempo > lim && (cfg.tiempo.estricto || r.tiempo > lim * 1.5)) return false;
    if (ctx.recientes && ctx.recientes.has(r.id)) return false;
    return true;
  };

  const contundenciaDeseada = (cfg, momento, prefs) => {
    const v = (cfg.contundencia || {})[momento] || "auto";
    if (v !== "auto") return v;
    if (momento === "cena" && prefs.cenasLigeras > 0.3) return "ligera";
    return "indiferente";
  };
  const ORDEN_CONT = { ligera: 0, media: 1, contundente: 2 };

  const generar = (cfg, personas, opciones = {}) => {
    cfg = normalizarConfig(cfg);
    const random = rng(cfg.semilla || Math.floor(Math.random() * 1e9));
    const prefs = Nutricion.preferenciasGrupo(personas);
    const todas = Recetas.todas();
    const recientes = opciones.recientes || Recetas.usadasRecientemente(cfg.evitarRepetidasSemanas);
    const slots = [...cfg.slots].sort((a, b) => DIAS.findIndex((d) => d.id === a.dia) - DIAS.findIndex((d) => d.id === b.dia) || (a.momento === "comida" ? -1 : 1));
    const asignacion = new Map(); // clave slot → { recetaId, obligatoria, avisos[] }
    const clave = (s) => s.dia + "|" + s.momento;
    const fijos = new Set(opciones.fijar || []);
    const previos = opciones.previos || {};
    const avisosGlobales = [];

    for (const k of fijos) if (previos[k]) asignacion.set(k, previos[k]);

    // 1) Obligatorias: primero las que tienen hueco concreto, luego las libres en el mejor hueco
    const obligatorias = (cfg.obligatorias || []).map((o) => ({ ...o, receta: Recetas.porId(o.recetaId) })).filter((o) => o.receta);
    const colocarObligatoria = (o, slot) => {
      const avisos = [];
      const conflictos = Recetas.conflictosVeto(o.receta, cfg.vetos);
      if (conflictos.length) avisos.push(`Contiene ${[...new Set(conflictos.map((c) => c.ingrediente))].join(", ")} (vetado); se mantiene porque la marcaste como obligatoria.`);
      if (!o.receta.momentos.includes(slot.momento)) avisos.push(`Suele ser plato de ${o.receta.momentos.join("/")}, pero la has fijado en la ${slot.momento}.`);
      if (cfg.dietas.some((d) => !o.receta.dieta.includes(d))) avisos.push("No cumple todas las dietas elegidas; prevalece por ser obligatoria.");
      if (o.receta.enListaNegra) avisos.push("Está en tu lista de excluidas de menús; prevalece por ser obligatoria.");
      asignacion.set(clave(slot), { recetaId: o.receta.id, obligatoria: true, avisos });
    };
    for (const o of obligatorias.filter((o) => o.dia && o.momento)) {
      const slot = slots.find((s) => s.dia === o.dia && s.momento === o.momento);
      if (!slot) { avisosGlobales.push(`"${o.receta.nombre}" estaba fijada en ${dia(o.dia)?.nombre} ${o.momento}, pero ese hueco no está en el menú; se coloca en otro.`); o.dia = null; o.momento = null; continue; }
      if (asignacion.has(clave(slot)) && !fijos.has(clave(slot))) avisosGlobales.push(`Dos recetas obligatorias querían ${dia(o.dia).nombre} ${o.momento}; se ha recolocado una.`);
      if (!asignacion.has(clave(slot))) colocarObligatoria(o, slot); else { o.dia = null; o.momento = null; }
    }
    for (const o of obligatorias.filter((o) => !(o.dia && o.momento))) {
      const libres = slots.filter((s) => !asignacion.has(clave(s)));
      if (!libres.length) { avisosGlobales.push(`No quedaba hueco para "${o.receta.nombre}".`); continue; }
      let preferidos = libres.filter((s) => o.receta.momentos.includes(o.momento || s.momento) && (!o.momento || s.momento === o.momento) && (!o.dia || s.dia === o.dia));
      // si la receta es contundente y se quieren cenas ligeras, mejor a mediodía (si hay hueco)
      if (!o.momento && o.receta.contundencia === "contundente" && contundenciaDeseada(cfg, "cena", prefs) === "ligera") {
        const mediodia = preferidos.filter((s) => s.momento === "comida");
        if (mediodia.length) preferidos = mediodia;
      }
      const candidatos = preferidos.length ? preferidos : libres;
      colocarObligatoria(o, candidatos[Math.floor(random() * candidatos.length)]);
    }

    // 1b) Ingredientes obligatorios: cada uno debe aparecer en al menos una receta del menú
    const requeridos = cfg.ingredientesObligatorios.map((x) => x.nombre);
    const contiene = (r, t) => r.ingredientes.some((i) => !i.opcional && Catalogo.ingredienteUsa(i.n, t));
    const memoUsa = new Map();
    const usaDe = (r) => { if (!requeridos.length) return []; let u = memoUsa.get(r.id); if (!u) { u = requeridos.filter((t) => contiene(r, t)); memoUsa.set(r.id, u); } return u; };
    const cubiertos = new Set();
    for (const a of asignacion.values()) { const r = Recetas.porId(a.recetaId); if (r) for (const t of usaDe(r)) { cubiertos.add(t); a.usa = [...new Set([...(a.usa || []), t])]; } }
    for (const t of requeridos) {
      if (cubiertos.has(t)) continue;
      const vetado = cfg.vetos.some((v) => Catalogo.ingredienteVetado(t, v) || Catalogo.normalizar(v) === Catalogo.normalizar(t));
      if (vetado) { avisosGlobales.push(`«${t}» está a la vez vetado y marcado como obligatorio; manda el veto y no se fuerza.`); continue; }
      const libres = slots.filter((sl) => !asignacion.has(clave(sl)));
      if (!libres.length) { avisosGlobales.push(`No quedaba hueco para usar «${t}».`); continue; }
      const ya = new Set([...asignacion.values()].map((a) => a.recetaId));
      const conT = todas.filter((r) => contiene(r, t) && !ya.has(r.id) && !(opciones.excluir || []).includes(r.id) && !r.enListaNegra);
      let mejor = null;
      const evaluar = (estricto) => {
        for (const r of conT) {
          if (!estricto && (!r.dieta || cfg.dietas.some((d) => !r.dieta.includes(d)) || Recetas.conflictosVeto(r, cfg.vetos).some((c) => !c.opcional))) continue;
          for (const sl of libres) {
            const ok = estricto ? elegible(r, cfg, sl.momento, sl.dia, { recientes }) : r.momentos.includes(sl.momento);
            if (!ok) continue;
            const punt = usaDe(r).filter((x) => !cubiertos.has(x)).length * 3 + (r.favorita ? 1.5 : 0) + random();
            if (!mejor || punt > mejor.punt) mejor = { r, sl, punt, estricto };
          }
        }
      };
      evaluar(true);
      if (!mejor) evaluar(false);
      if (!mejor) { avisosGlobales.push(`No hay ninguna receta compatible con tus vetos y dietas que lleve «${t}».`); continue; }
      const usa = usaDe(mejor.r);
      const avisos = mejor.estricto ? [] : ["Elegida para usar un ingrediente que pediste, aunque no cumple algún filtro (tiempo, presupuesto, cocina o repetición)."];
      asignacion.set(clave(mejor.sl), { recetaId: mejor.r.id, usa, avisos });
      for (const x of usa) cubiertos.add(x);
    }

    // 2) Objetivos de categoría proporcionales a la frecuencia
    const pesos = {};
    let sumaPesos = 0;
    for (const c of Recetas.CATEGORIAS) {
      const f = FRECUENCIAS.find((x) => x.id === (cfg.frecuencias[c.id] || "normal"));
      let p = f ? f.peso : 1;
      if (c.id === "vegetariano" || c.id === "vegano") p *= 1 + prefs.masVerdura * 0.8;
      if (c.id === "ensaladas") p *= 1 + prefs.masVerdura * 0.4;
      if (c.id === "olla-express" && !cfg.tieneOllaExpress) p = 0;
      if (!todas.some((r) => r.categoria === c.id)) p = 0;
      pesos[c.id] = p; sumaPesos += p;
    }
    const nSlots = slots.length;
    const objetivo = {};
    for (const c of Recetas.CATEGORIAS) objetivo[c.id] = sumaPesos ? (pesos[c.id] / sumaPesos) * nSlots : 0;
    const colocados = {};
    const contar = () => { for (const c of Recetas.CATEGORIAS) colocados[c.id] = 0; for (const a of asignacion.values()) { const r = Recetas.porId(a.recetaId); if (r) colocados[r.categoria] = (colocados[r.categoria] || 0) + 1; } };

    // 3) Rellenar huecos con puntuación
    const vecinos = (slot) => {
      const i = DIAS.findIndex((d) => d.id === slot.dia);
      const res = [];
      for (const [k, a] of asignacion) {
        const [d, m] = k.split("|");
        const j = DIAS.findIndex((x) => x.id === d);
        const r = Recetas.porId(a.recetaId);
        if (!r) continue;
        res.push({ receta: r, mismoDia: d === slot.dia, distancia: Math.abs(i - j), mismoMomento: m === slot.momento });
      }
      return res;
    };
    const usadas = () => new Set([...asignacion.values()].map((a) => a.recetaId));
    const excluir = new Set(opciones.excluir || []);
    let avisoRecientes = false;

    for (const slot of slots) {
      if (asignacion.has(clave(slot))) continue;
      contar();
      const vec = vecinos(slot);
      const ya = usadas();
      const avisos = [];
      let candidatos = todas.filter((r) => elegible(r, cfg, slot.momento, slot.dia, { recientes }) && !excluir.has(r.id) && (cfg.permitirRepetir || !ya.has(r.id)));
      if (!candidatos.length && recientes.size) { candidatos = todas.filter((r) => elegible(r, cfg, slot.momento, slot.dia) && !excluir.has(r.id) && (cfg.permitirRepetir || !ya.has(r.id))); if (candidatos.length) avisoRecientes = true; }
      if (!candidatos.length) { candidatos = todas.filter((r) => elegible(r, cfg, slot.momento, slot.dia) && !excluir.has(r.id)); if (candidatos.length && !cfg.permitirRepetir) avisos.push("Receta repetida: no había suficientes recetas compatibles."); }
      if (!candidatos.length) candidatos = todas.filter((r) => r.momentos.includes(slot.momento) && !r.enListaNegra && !Recetas.conflictosVeto(r, cfg.vetos).some((c) => !c.opcional));
      if (!candidatos.length) { asignacion.set(clave(slot), { recetaId: null, avisos: ["No hay ninguna receta compatible con tus filtros para este hueco."] }); continue; }

      const deseo = contundenciaDeseada(cfg, slot.momento, prefs);
      const lim = limiteTiempo(cfg, slot.dia);
      const d = dia(slot.dia);
      let mejor = null, mejorPunt = -Infinity;
      for (const r of candidatos) {
        let p = 0;
        // cuota de categoría
        p += (objetivo[r.categoria] - (colocados[r.categoria] || 0)) * 2.2;
        // variedad
        for (const v of vec) {
          if (v.receta.id === r.id) p -= v.mismoDia ? 6 : v.distancia <= 1 ? 4 : 1.5;
          if (v.receta.proteina === r.proteina) p -= v.mismoDia ? 3 : v.distancia === 1 ? 1.5 : 0.3;
          if (v.receta.categoria === r.categoria && v.mismoDia) p -= 1.5;
          if (v.receta.categoria === r.categoria && v.distancia === 1 && v.mismoMomento) p -= 0.6;
          if (v.receta.cocina && v.receta.cocina === r.cocina && v.mismoDia) p -= 0.8;
        }
        // contundencia deseada
        if (deseo !== "indiferente") {
          const dif = Math.abs(ORDEN_CONT[r.contundencia] - ORDEN_CONT[deseo]);
          p += dif === 0 ? 2 : dif === 1 ? -0.6 : -2.6;
        } else if (slot.momento === "comida" && r.categoria === "ensaladas" && r.contundencia === "ligera") p -= 0.6;
        if (prefs.menosLegumbreNoche && slot.momento === "cena" && r.proteina === "legumbre") p -= prefs.menosLegumbreNoche * 2;
        // presupuesto
        if (cfg.presupuesto === "economico") p += r.coste === "económica" ? 1.2 : 0;
        else if (cfg.presupuesto === "medio") p += r.coste === "premium" ? -1.2 : 0;
        else if (cfg.presupuesto === "premium") p += r.coste === "premium" ? 1.2 : r.coste === "media" ? 0.3 : -0.4;
        // favoritas y cocinas preferidas
        if (r.favorita) p += 1.6;
        if (r.cocina && cfg.cocinasPreferidas.includes(r.cocina)) p += 1.2;
        // objetivos nutricionales
        if (prefs.masProteina) p += prefs.masProteina * ((r.nutricion.prot || 20) >= 30 ? 1.5 : (r.nutricion.prot || 20) < 18 ? -1.5 : 0);
        if (prefs.menosPicante && r.grupos.includes("picante")) p -= prefs.menosPicante * 1.5;
        if (prefs.menosAzucar && r.grupos.includes("miel")) p -= prefs.menosAzucar * 1.2;
        // tiempo
        if (lim && r.tiempo > lim) p -= 1.5 + ((r.tiempo - lim) / 15) * 0.5; // solo en modo flexible llega aquí
        else if (d && d.laborable) p += r.tiempo <= 30 ? 0.6 : r.tiempo > 60 ? -0.8 : 0;
        else p += r.tiempo > 60 ? 0.4 : 0;
        // azar para que cada generación sea distinta
        p += random() * 1.6;
        if (p > mejorPunt) { mejorPunt = p; mejor = r; }
      }
      if (lim && mejor.tiempo > lim) avisos.push(`Se pasa del tiempo máximo (${mejor.tiempo} min > ${lim} min); el límite está en modo orientativo.`);
      asignacion.set(clave(slot), { recetaId: mejor.id, avisos });
    }
    if (avisoRecientes) avisosGlobales.push("No había suficientes recetas sin usar en el periodo elegido; algunas se han repetido de menús anteriores.");

    for (const a of asignacion.values()) { const r = Recetas.porId(a.recetaId); if (r && requeridos.length) { const u = usaDe(r); if (u.length) a.usa = u; } }
    const resultado = slots.map((s) => ({ ...s, ...(asignacion.get(clave(s)) || { recetaId: null, avisos: [] }) }));
    return { slots: resultado, avisos: avisosGlobales, raciones: racionesTotales(personas) };
  };

  /* Regenerar un único hueco manteniendo el resto */
  const regenerarSlot = (menu, cfg, personas, slotClave) => {
    const previos = {};
    for (const s of menu.slots) previos[s.dia + "|" + s.momento] = { recetaId: s.recetaId, obligatoria: s.obligatoria, avisos: s.avisos || [] };
    const actual = previos[slotClave];
    const fijar = Object.keys(previos).filter((k) => k !== slotClave);
    return generar({ ...cfg, semilla: Math.floor(Math.random() * 1e9), obligatorias: [] }, personas, { fijar, previos, excluir: actual && actual.recetaId ? [actual.recetaId] : [] });
  };

  /* Alternativas para un hueco (para elegir a mano), ordenadas por compatibilidad */
  const alternativas = (cfg, slot, excluirIds = []) => {
    cfg = normalizarConfig(cfg);
    const ex = new Set(excluirIds);
    const recientes = Recetas.usadasRecientemente(cfg.evitarRepetidasSemanas);
    const compat = Recetas.todas().filter((r) => elegible(r, cfg, slot.momento, slot.dia, { recientes }) && !ex.has(r.id));
    const resto = Recetas.todas().filter((r) => !compat.includes(r) && !ex.has(r.id));
    const orden = (a, b) => (b.favorita - a.favorita) || a.nombre.localeCompare(b.nombre, "es");
    return { compatibles: compat.sort(orden), otras: resto.sort(orden) };
  };

  /* Resumen nutricional medio por ración del menú */
  const resumenNutricional = (slots) => {
    const recetas = slots.map((s) => Recetas.porId(s.recetaId)).filter(Boolean);
    if (!recetas.length) return null;
    const suma = { kcal: 0, prot: 0, hc: 0, grasa: 0 };
    for (const r of recetas) for (const k of Object.keys(suma)) suma[k] += Number(r.nutricion[k]) || 0;
    const n = recetas.length;
    const porCategoria = {};
    const porCoste = {};
    const porContundencia = {};
    for (const r of recetas) { porCategoria[r.categoria] = (porCategoria[r.categoria] || 0) + 1; porCoste[r.coste] = (porCoste[r.coste] || 0) + 1; porContundencia[r.contundencia] = (porContundencia[r.contundencia] || 0) + 1; }
    return { media: { kcal: Math.round(suma.kcal / n), prot: Math.round(suma.prot / n), hc: Math.round(suma.hc / n), grasa: Math.round(suma.grasa / n) }, porCategoria, porCoste, porContundencia, n };
  };

  /* Huella de la configuración relevante para saber si hay que regenerar */
  const huella = (cfg) => {
    const c = normalizarConfig(cfg);
    const { nombre, semilla, ...resto } = c;
    return JSON.stringify(resto);
  };

  window.Planificador = { DIAS, dia, FRECUENCIAS, PRESUPUESTOS, CONTUNDENCIA_OPCIONES, TIEMPOS, SEMANAS_SIN_REPETIR, configPorDefecto, normalizarConfig, generar, regenerarSlot, alternativas, elegible, resumenNutricional, racionesTotales, huella, contundenciaDeseada };
})();
