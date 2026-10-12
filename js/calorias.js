/* Cálculo nutricional de las recetas a partir de sus ingredientes.
   Usa la tabla window.NUTRI_INGREDIENTES (js/data-nutri.js): por cada ingrediente, kcal y macronutrientes por 100 g
   de parte comestible, fracción comestible, densidad (g/ml) y gramos por unidad de cocina (ud, diente, cda…).
   Preparación: en las frituras solo cuenta el aceite que absorbe el alimento, no el del baño.
   Resultado por ración estándar; las raciones de cada persona (factor) escalan cantidades y kcal. */
(function () {
  "use strict";
  const { Catalogo } = window;
  const TABLA = window.NUTRI_INGREDIENTES || {};

  // Gramos por unidad cuando el ingrediente no trae su propio valor
  const UNIDAD_DEFECTO = { cda: 12, cdta: 4, pizca: 0.4, diente: 5, manojo: 40, rama: 3, hoja: 1, rebanada: 35, loncha: 20, lata: 120, bote: 250, "puñado": 30, ud: 100 };
  // «Al gusto»: solo cuenta el aceite (un chorrito para la receta); sal, pimienta, agua, especias: nada
  const AL_GUSTO_ACEITE = 8;

  const singular = (w) => (w.length > 3 && w.endsWith("s") ? (/(ces)$/.test(w) ? w.slice(0, -3) + "z" : /[nlr]es$/.test(w) ? w.slice(0, -2) : w.slice(0, -1)) : w);

  /* Busca el ingrediente en la tabla con varios intentos: tal cual, sin paréntesis, en singular, más corto */
  const memo = new Map();
  const buscar = (nombre) => {
    const k0 = Catalogo.normalizar(nombre);
    if (memo.has(k0)) return memo.get(k0);
    const intentos = [k0, Catalogo.normalizar(nombre.replace(/\([^)]*\)/g, " ")), k0.split(" ").map(singular).join(" ")];
    const palabras = Catalogo.normalizar(nombre.replace(/\([^)]*\)/g, " ")).split(" ").filter(Boolean);
    // Trozos cada vez más cortos del nombre, primero por el principio («pechuga de pollo fileteada» → «pechuga de pollo»)
    // y luego en cualquier posición («contramuslos de pollo deshuesados» → «pollo»)
    for (let n = palabras.length - 1; n >= 1; n--) intentos.push(palabras.slice(0, n).join(" "), palabras.slice(0, n).map(singular).join(" "));
    for (let n = palabras.length - 1; n >= 1; n--) for (let i = 1; i + n <= palabras.length; i++) { const t = palabras.slice(i, i + n); if (!["de", "con", "en", "y", "al", "a"].includes(t[0])) intentos.push(t.join(" "), t.map(singular).join(" ")); }
    let res = null;
    for (const k of intentos) if (TABLA[k]) { res = TABLA[k]; break; }
    memo.set(k0, res);
    return res;
  };

  // Grasas que pueden ser baño de fritura o confitado
  const esAceite = (nombre) => info(nombre).aceite;
  // Fritura o confitado (fríe, fríelas, frito, friendo, freír, confita…); «frío/fría» y «sofríe» no cuentan.
  // Se busca en el texto en minúsculas, con tildes, para no normalizar todos los pasos (es lo más lento)
  const RE_BANO = /(^|[^a-záéíóúüñ])(fr[ií]e|frit[oa]s?\b|fritura|friendo|fre[ií]r|confit)|escurr\w* (bien )?(el|del) aceite|papel absorbente/;

  // Pistas del nombre completo (con su nota entre paréntesis) sobre la parte comestible de carnes y pescados
  const RE_LIMPIO = /\b(filetes?|lomos?|sin (hueso|piel|espinas)|deshuesad\w*|pechugas?|solomillos?|limpi[oa]s?|pelad[oa]s?|en dados|picad[oa])\b/;
  const RE_HUESO = /\b(con hueso|paletilla|pierna|chuletas?|chuleton|costillas?|muslos?|contramuslos? con hueso|alitas?|alas|enter[oa]s?|codillo|rabo|carrilleras? con hueso|jarrete|osobuco)\b/;
  const comestibleDe = (ing, dato) => {
    const i = info(ing.n);
    if (i.limpio) return 1;
    if (dato.comestible) return dato.comestible;
    return i.hueso ? 0.7 : 1;
  };

  const RE_ALCOHOL = /^(vino|cerveza|brandy|conac|ron|whisky|jerez|fino|manzanilla|licor|sidra|vermut|oporto|ouzo|vodka|anis|mirin|sake|cava|orujo|pacharan|marsala|madeira|pedro ximenez|tequila|ginebra|calvados|grappa|raki|rakija|aguardiente)\b/;
  /* Lo que se deduce del nombre de un ingrediente, calculado una sola vez por nombre */
  const infos = new Map();
  const info = (nombre) => {
    let i = infos.get(nombre);
    if (!i) {
      const completo = Catalogo.normalizar(String(nombre).replace(/[()]/g, " ")); // con la nota entre paréntesis
      i = { completo, dato: buscar(nombre), aceite: /^(aceite|manteca de cerdo|manteca iberica|manteca colora)\b/.test(completo), limpio: RE_LIMPIO.test(completo), hueso: RE_HUESO.test(completo), alcohol: RE_ALCOHOL.test(completo) };
      infos.set(nombre, i);
    }
    return i;
  };
  const PIEZAS = [[/\bpaletilla\b/, 700], [/\bpierna\b/, 1200], [/\bcodillo\b/, 700], [/\bjarrete\b/, 500]];

  /* Gramos (peso tal como se compra) de un ingrediente; null si no se sabe */
  const gramos = (ing, dato) => {
    const u = ing.u || "ud";
    if (u === "al gusto" || ing.q == null) return esAceite(ing.n) ? AL_GUSTO_ACEITE : 0;
    const q = Number(ing.q) || 0;
    if (u === "g") return q;
    if (u === "ml") return q * ((dato && dato.ml) || 1);
    let porUnidad = (dato && dato[u]) || UNIDAD_DEFECTO[u];
    // Un filete o lomo pesa menos que la pieza entera de la tabla; una paletilla o un codillo, mucho más que una chuleta
    const n = info(ing.n).completo;
    if (u === "ud" && porUnidad > 160 && info(ing.n).limpio) porUnidad = 140;
    if (u === "ud") for (const [re, peso] of PIEZAS) if (re.test(n) && porUnidad < peso) porUnidad = peso;
    return porUnidad == null ? null : q * porUnidad;
  };

  /* Calcula la nutrición de una receta: totales y por ración, con la cobertura (fracción del peso con datos) */
  const calcular = (receta) => {
    const hayBano = RE_BANO.test((receta.pasos || []).join(" ").toLowerCase());
    let kcal = 0, p = 0, hc = 0, g = 0, pesoTotal = 0, pesoConDatos = 0, aceiteGr = 0, otrosGr = 0;
    const desconocidos = [];
    const aceiteAlGusto = (receta.ingredientes || []).some((i) => esAceite(i.n) && (i.u === "al gusto" || i.q == null));
    const filas = [];
    for (const ing of receta.ingredientes || []) {
      if (ing.opcional) continue; // los opcionales no se cuentan
      const dato = info(ing.n).dato;
      const gr = gramos(ing, dato);
      if (gr == null) { desconocidos.push(ing.n); continue; }
      if (!dato) { if (gr > 0) { desconocidos.push(ing.n); pesoTotal += gr; } continue; }
      const comestible = comestibleDe(ing, dato);
      const neto = gr * comestible;
      pesoTotal += gr; pesoConDatos += gr;
      if (esAceite(ing.n)) aceiteGr += neto; else if (ing.u !== "ml") otrosGr += neto; // los líquidos no absorben
      filas.push({ ing, dato, neto });
    }
    // En frituras y confitados la grasa del baño no se come entera: se estima lo absorbido (≈ 8 % del peso de los
    // sólidos + 10 g del resto de la receta, y nunca más de ~25 g por ración). Más de 120 g de grasa es siempre un baño.
    const raciones = receta.raciones || 2;
    const bano = aceiteGr > 120 || (hayBano && aceiteGr > 60);
    let aceiteContado = aceiteGr;
    const absorbido = Math.min(otrosGr * 0.08 + 10, 25 * raciones + 10);
    if (bano) aceiteContado = Math.min(aceiteGr, absorbido);
    // Fritura con el aceite «al gusto»: se cuenta igualmente lo que absorbe
    else if (hayBano && aceiteAlGusto) aceiteContado = Math.max(aceiteGr, absorbido);
    for (const { ing, dato, neto } of filas) {
      if (esAceite(ing.n)) continue;
      const f = neto / 100;
      // Bebidas alcohólicas: al cocinar se evapora la mayor parte del alcohol; queda ≈ 25 % de su energía
      const deMacros = 4 * dato.p + 4 * dato.hc + 9 * dato.g;
      const kcal100 = info(ing.n).alcohol && dato.kcal > deMacros ? deMacros + (dato.kcal - deMacros) * 0.25 : dato.kcal;
      kcal += kcal100 * f; p += dato.p * f; hc += dato.hc * f; g += dato.g * f;
    }
    kcal += aceiteContado * 9; g += aceiteContado; // grasas: ≈ 900 kcal y 100 g de grasa por 100 g
    const r1 = (x, d = 0) => Math.round((x / raciones) * 10 ** d) / 10 ** d;
    return {
      porRacion: { kcal: Math.round(kcal / raciones / 5) * 5, prot: r1(p), hc: r1(hc), grasa: r1(g) },
      cobertura: pesoTotal ? pesoConDatos / pesoTotal : 1,
      desconocidos,
      fritura: bano,
    };
  };

  /* kcal de un plato para una persona: ración estándar × su factor (el factor ya escala las cantidades del menú) */
  const kcalPersona = (kcalRacion, factor) => Math.round(((kcalRacion || 0) * (factor || 1)) / 10) * 10;

  window.Calorias = { calcular, buscar, kcalPersona, hayTabla: () => Object.keys(TABLA).length > 0 };
})();
