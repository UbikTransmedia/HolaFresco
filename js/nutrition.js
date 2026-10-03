/* Nutrición: necesidades energéticas por persona y factor de ración.
   Diseñado con criterio de nutricionista: estimaciones orientativas, lenguaje amable, nada de juicios. */
(function () {
  "use strict";

  const RACION_REFERENCIA_KCAL = 2100; // una "ración estándar" de receta corresponde a un adulto de ~2100 kcal/día

  const SEXOS = [
    { id: "mujer", nombre: "Mujer", icono: "👩" },
    { id: "hombre", nombre: "Hombre", icono: "👨" },
    { id: "otro", nombre: "Prefiero no decirlo", icono: "🧑" },
  ];

  const ACTIVIDADES = [
    { id: "sedentaria", nombre: "Tranquila", desc: "Trabajo sentado, poco ejercicio", factor: 1.25 },
    { id: "ligera", nombre: "Ligera", desc: "Paseos, 1–2 días de ejercicio", factor: 1.4 },
    { id: "moderada", nombre: "Moderada", desc: "3–5 días de ejercicio", factor: 1.55 },
    { id: "alta", nombre: "Alta", desc: "Ejercicio intenso casi a diario o trabajo físico", factor: 1.75 },
  ];

  /* Objetivos (varios a la vez). "ajuste" modifica la energía; "nudges" orientan al generador de menús. */
  const OBJETIVOS = [
    { id: "mantener", nombre: "Mantenerme y disfrutar", icono: "😊", desc: "Comer rico y variado sin contar nada", ajuste: 0 },
    { id: "perder-peso", nombre: "Perder peso con calma", icono: "🍃", desc: "Raciones algo más ajustadas, cenas ligeras, mucha verdura", ajuste: -0.12 },
    { id: "ganar-musculo", nombre: "Ganar músculo", icono: "💪", desc: "Más proteína en cada comida y raciones generosas", ajuste: 0.1 },
    { id: "deshincharse", nombre: "Deshincharme", icono: "🌬️", desc: "Cenas ligeras, menos legumbre de noche, menos ultraprocesado", ajuste: 0 },
    { id: "mas-energia", nombre: "Tener más energía", icono: "⚡", desc: "Hidratos de calidad y comidas completas", ajuste: 0.03 },
    { id: "mas-verdura", nombre: "Comer más verdura", icono: "🥦", desc: "Más platos vegetarianos y ensaladas", ajuste: 0 },
    { id: "digestion", nombre: "Cuidar la digestión", icono: "🫶", desc: "Cocciones suaves, cremas, menos picante", ajuste: 0 },
    { id: "azucar", nombre: "Controlar el azúcar", icono: "🩸", desc: "Menos miel y azúcar añadido, más fibra", ajuste: 0 },
  ];

  const alturaPorDefecto = (sexo) => (sexo === "hombre" ? 175 : sexo === "mujer" ? 162 : 168);

  /* Mifflin-St Jeor. Si falta altura o peso usamos valores de referencia (orientativo). */
  const metabolismoBasal = (p) => {
    const peso = Number(p.peso) || (p.sexo === "hombre" ? 78 : p.sexo === "mujer" ? 65 : 70);
    const altura = Number(p.altura) || alturaPorDefecto(p.sexo);
    const edad = Number(p.edad) || 35;
    let mb = 10 * peso + 6.25 * altura - 5 * edad;
    if (p.sexo === "hombre") mb += 5;
    else if (p.sexo === "mujer") mb -= 161;
    else mb -= 78; // media
    return mb;
  };

  const necesidades = (p) => {
    const act = ACTIVIDADES.find((a) => a.id === p.actividad) || ACTIVIDADES[1];
    let kcal = metabolismoBasal(p) * act.factor;
    const objetivos = (p.objetivos || []).map((o) => OBJETIVOS.find((x) => x.id === o)).filter(Boolean);
    let ajuste = 0;
    for (const o of objetivos) ajuste += o.ajuste;
    ajuste = Math.max(-0.2, Math.min(0.15, ajuste));
    kcal = kcal * (1 + ajuste);
    // menores: raciones más pequeñas (sin pretensión clínica)
    const edad = Number(p.edad) || 35;
    if (edad && edad < 14) kcal = Math.min(kcal, 1500 + edad * 40);
    kcal = Math.round(kcal / 10) * 10;
    let factor = kcal / RACION_REFERENCIA_KCAL;
    factor = Math.max(0.5, Math.min(1.7, Math.round(factor * 20) / 20)); // pasos de 0,05
    return { kcal, factor, ajuste };
  };

  /* Raciones totales de un grupo de personas (redondeadas a 0,5, mínimo 1). */
  const racionesGrupo = (personas) => {
    const suma = personas.reduce((acc, p) => acc + necesidades(p).factor, 0);
    return Math.max(1, Math.round(suma * 2) / 2);
  };

  /* Objetivos agregados del grupo → preferencias para el generador */
  const preferenciasGrupo = (personas) => {
    const conteo = {};
    for (const p of personas) for (const o of p.objetivos || []) conteo[o] = (conteo[o] || 0) + 1;
    const n = Math.max(1, personas.length);
    const peso = (id) => (conteo[id] || 0) / n; // 0..1
    return {
      cenasLigeras: peso("perder-peso") * 1 + peso("deshincharse") * 1 + peso("digestion") * 0.5,
      masProteina: peso("ganar-musculo"),
      masVerdura: peso("mas-verdura") + peso("perder-peso") * 0.5,
      menosLegumbreNoche: peso("deshincharse"),
      menosPicante: peso("digestion"),
      menosAzucar: peso("azucar"),
      masHidratos: peso("mas-energia") + peso("ganar-musculo") * 0.5,
    };
  };

  const descripcionAmable = (p) => {
    const { kcal, factor } = necesidades(p);
    const partes = [];
    partes.push(`≈ ${kcal.toLocaleString("es-ES")} kcal/día orientativas`);
    if (factor < 0.85) partes.push("ración un poco más pequeña");
    else if (factor > 1.15) partes.push("ración generosa");
    else partes.push("ración estándar");
    return partes.join(" · ");
  };

  window.Nutricion = { RACION_REFERENCIA_KCAL, SEXOS, ACTIVIDADES, OBJETIVOS, necesidades, racionesGrupo, preferenciasGrupo, descripcionAmable };
})();
