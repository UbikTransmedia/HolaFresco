/* Vista: asistente para generar el menú semanal. */
(function () {
  "use strict";
  const { UI, Recetas, Planificador, Personas, Nutricion, Catalogo, DB } = window;
  const { h } = UI;

  const PASOS = [
    { id: "personas", nombre: "Personas", icono: "👥", titulo: "¿Para quién cocinas?", desc: "Elige quién come esta semana. Con sus datos ajustamos las cantidades de la lista de la compra." },
    { id: "dias", nombre: "Días", icono: "📅", titulo: "¿Qué días y qué comidas?", desc: "Marca los huecos que quieres que planifiquemos. Puedes dejar fuera los días que comes fuera." },
    { id: "gustos", nombre: "Gustos", icono: "🍽️", titulo: "¿Qué tipo de cocina te apetece?", desc: "Con qué frecuencia quieres cada tipo de plato, qué cocinas del mundo prefieres y si seguís alguna dieta." },
    { id: "ajustes", nombre: "Ajustes", icono: "⏱️", titulo: "Tiempo, contundencia y presupuesto", desc: "Cuánto quieres cocinar cada día, cómo de contundentes quieres las comidas y las cenas, y cuánto quieres gastar." },
    { id: "vetos", nombre: "Vetos", icono: "🚫", titulo: "¿Algo que no deba aparecer?", desc: "Alergias, intolerancias o simplemente cosas que no os gustan. Las recetas que los lleven quedarán fuera." },
    { id: "obligatorias", nombre: "Fijas", icono: "📌", titulo: "¿Algo que no puede faltar?", desc: "Ingredientes que quieres aprovechar (por ejemplo, lo que ya tienes en la nevera) y recetas concretas que quieres sí o sí esta semana." },
    { id: "resultado", nombre: "Menú", icono: "✨", titulo: "Tu menú semanal", desc: "Se recalcula cada vez que cambias algo en los pasos anteriores. Cambia lo que no te convenza y guárdalo: tendrás el menú y su lista de la compra." },
  ];
  const PASO_RESULTADO = PASOS.length - 1;

  const cargarBorrador = () => {
    const b = DB.leer("borradorWizard", null);
    const cfg = Planificador.normalizarConfig(b && b.cfg ? b.cfg : {});
    return { paso: b && typeof b.paso === "number" ? Math.min(b.paso, PASO_RESULTADO) : 0, cfg, resultado: b && b.resultado ? b.resultado : null };
  };
  let st = cargarBorrador();
  const guardarBorrador = () => DB.guardar("borradorWizard", { paso: st.paso, cfg: st.cfg, resultado: st.resultado });
  const reiniciar = () => { st = { paso: 0, cfg: Planificador.configPorDefecto(), resultado: null }; guardarBorrador(); };

  const personasSeleccionadas = () => [...new Set(st.cfg.personasIds)].map((id) => Personas.porId(id)).filter(Boolean);
  const seleccionar = (id) => { if (!st.cfg.personasIds.includes(id)) st.cfg.personasIds.push(id); };
  /* Huella de la configuración + intolerancias de las personas: si cambia algo, el menú se recalcula */
  const huellaWizard = () => Planificador.huella(st.cfg) + "|" + JSON.stringify(personasSeleccionadas().map((p) => [p.id, p.intolerancias || []]));
  const intolHogar = () => Planificador.intoleranciasGrupo(personasSeleccionadas());

  /* Cargar una configuración previa (desde un menú guardado) */
  const cargarConfig = (cfg) => { st = { paso: PASO_RESULTADO, cfg: Planificador.normalizarConfig({ ...cfg, semilla: null }), resultado: null }; guardarBorrador(); };

  const chipsCheck = ({ opciones, seleccion, alCambiar, aria, deshabilitadas = [] }) => h("div.chips-check", { role: "group", "aria-label": aria }, opciones.map((o) => h("label.chip.chip-check", { class: deshabilitadas.includes(o.id) ? "deshabilitada" : "", title: o.desc || "" }, h("input", { type: "checkbox", "aria-label": o.nombre, checked: seleccion.includes(o.id), disabled: deshabilitadas.includes(o.id), onChange: (e) => alCambiar(o.id, e.target.checked) }), o.icono ? o.icono + " " : "", o.nombre)));

  /* ---------- Paso 1: personas ---------- */
  const pasoPersonas = (cont, refrescar) => {
    const lista = Personas.todas();
    if (!st.cfg.personasIds.length && lista.length) st.cfg.personasIds = lista.map((p) => p.id);
    st.cfg.personasIds = [...new Set(st.cfg.personasIds)].filter((id) => Personas.porId(id));
    const grid = h("div.grid-personas");
    if (!lista.length) grid.appendChild(h("div.vacio.vacio-suave", h("p", "Aún no hay nadie en tu hogar. Añade a las personas para las que vas a cocinar: te llevará medio minuto."), h("button.btn.btn-primario", { type: "button", onClick: () => Personas.editor(null, (id) => { seleccionar(id); guardarBorrador(); refrescar(); }) }, "+ Añadir la primera persona")));
    for (const p of lista) {
      const sel = st.cfg.personasIds.includes(p.id);
      const { kcal, factor } = Nutricion.necesidades(p);
      grid.appendChild(h("div.tarjeta-persona", { class: sel ? "seleccionada" : "" },
        h("label.persona-check",
          h("input", { type: "checkbox", checked: sel, "aria-label": `Incluir a ${p.nombre}`, onChange: (e) => { if (e.target.checked) seleccionar(p.id); else st.cfg.personasIds = st.cfg.personasIds.filter((x) => x !== p.id); guardarBorrador(); refrescar(); } }),
          h("span.persona-avatar", Personas.avatar(p)),
          h("span.persona-info", h("strong", p.nombre), h("small", Personas.resumenCorto(p) || "sin datos físicos"), h("small.muted", `≈ ${kcal.toLocaleString("es-ES")} kcal · ración ${factor.toLocaleString("es-ES")}×`), h("span.persona-objetivos", Personas.objetivosTexto(p).map((t) => h("span.chip.chip-mini", t)), Personas.intoleranciasTexto(p).map((t) => h("span.chip.chip-mini.chip-intol", { title: "Intolerancia o alergia: se evitará en el menú" }, t))))
        ),
        h("div.persona-acciones",
          h("button.btn.btn-icono", { type: "button", "aria-label": `Editar a ${p.nombre}`, title: "Editar", onClick: () => Personas.editor(p, () => refrescar()) }, "✏️"),
          h("button.btn.btn-icono", { type: "button", "aria-label": `Quitar a ${p.nombre}`, title: "Quitar del hogar", onClick: async () => { if (await UI.confirmar({ titulo: "Quitar persona", mensaje: `¿Quitar a ${p.nombre} de tu hogar? Sus menús guardados no se borran.`, textoOk: "Quitar", peligro: true })) { Personas.borrar(p.id); st.cfg.personasIds = st.cfg.personasIds.filter((x) => x !== p.id); guardarBorrador(); refrescar(); } } }, "🗑")
        )
      ));
    }
    if (lista.length) grid.appendChild(h("button.tarjeta-persona.tarjeta-anadir", { type: "button", onClick: () => Personas.editor(null, (id) => { seleccionar(id); guardarBorrador(); refrescar(); }) }, h("span.persona-avatar", "➕"), h("span", "Añadir otra persona")));
    const sel = personasSeleccionadas();
    const resumen = sel.length ? h("div.aviso.aviso-ok", h("strong", `${sel.length} ${UI.plural(sel.length, "persona", "personas")}`), ` · cada comida se calculará para ${Planificador.racionesTotales(sel).toLocaleString("es-ES")} raciones estándar. `, h("span.muted", "Una ración estándar equivale a lo que come un adulto de unas 2.100 kcal/día.")) : h("div.aviso.aviso-info", "Selecciona al menos una persona para continuar.");
    UI.append(cont, grid, resumen);
  };

  /* ---------- Paso 2: días ---------- */
  const pasoDias = (cont, refrescar) => {
    const tiene = (d, m) => st.cfg.slots.some((s) => s.dia === d && s.momento === m);
    const set = (d, m, on) => { st.cfg.slots = st.cfg.slots.filter((s) => !(s.dia === d && s.momento === m)); if (on) st.cfg.slots.push({ dia: d, momento: m }); };
    const presets = [
      ["Toda la semana", () => Planificador.DIAS.flatMap((d) => [{ dia: d.id, momento: "comida" }, { dia: d.id, momento: "cena" }])],
      ["Lunes a viernes", () => Planificador.DIAS.filter((d) => d.laborable).flatMap((d) => [{ dia: d.id, momento: "comida" }, { dia: d.id, momento: "cena" }])],
      ["Solo comidas", () => Planificador.DIAS.map((d) => ({ dia: d.id, momento: "comida" }))],
      ["Solo cenas", () => Planificador.DIAS.map((d) => ({ dia: d.id, momento: "cena" }))],
      ["Cenas entre semana", () => Planificador.DIAS.filter((d) => d.laborable).map((d) => ({ dia: d.id, momento: "cena" }))],
      ["Ninguno", () => []],
    ];
    const tabla = h("table.tabla-dias", { role: "grid", "aria-label": "Días y comidas" },
      h("thead", h("tr", h("th", { scope: "col" }, ""), Recetas.MOMENTOS.map((m) => h("th", { scope: "col" }, h("button.btn.btn-suave.btn-mini", { type: "button", title: `Marcar/desmarcar todas las ${m.nombre.toLowerCase()}s`, onClick: () => { const todos = Planificador.DIAS.every((d) => tiene(d.id, m.id)); for (const d of Planificador.DIAS) set(d.id, m.id, !todos); guardarBorrador(); refrescar(); } }, m.icono, " ", m.nombre))))),
      h("tbody", Planificador.DIAS.map((d) => h("tr", { class: d.laborable ? "" : "finde" },
        h("th", { scope: "row" }, h("button.btn.btn-suave.btn-mini", { type: "button", title: `Marcar/desmarcar todo el ${d.nombre.toLowerCase()}`, onClick: () => { const todos = Recetas.MOMENTOS.every((m) => tiene(d.id, m.id)); for (const m of Recetas.MOMENTOS) set(d.id, m.id, !todos); guardarBorrador(); refrescar(); } }, h("span.dia-largo", d.nombre), h("span.dia-corto", d.abr))),
        Recetas.MOMENTOS.map((m) => h("td", h("label.celda-slot", { class: tiene(d.id, m.id) ? "activa" : "" }, h("input", { type: "checkbox", checked: tiene(d.id, m.id), "aria-label": `${d.nombre} ${m.nombre.toLowerCase()}`, onChange: (e) => { set(d.id, m.id, e.target.checked); guardarBorrador(); refrescar(); } }), h("span.celda-marca", tiene(d.id, m.id) ? m.icono : "·"))))
      )))
    );
    const n = st.cfg.slots.length;
    UI.append(cont,
      h("div.presets", h("span.muted", "Atajos: "), presets.map(([nom, fn]) => h("button.btn.btn-suave.btn-mini", { type: "button", onClick: () => { st.cfg.slots = fn(); guardarBorrador(); refrescar(); } }, nom))),
      tabla,
      n ? h("div.aviso.aviso-ok", h("strong", `${n} ${UI.plural(n, "comida", "comidas")}`), " para planificar.") : h("div.aviso.aviso-info", "Marca al menos una comida o cena.")
    );
  };

  /* ---------- Paso 3: gustos ---------- */
  const pasoGustos = (cont, refrescar) => {
    const todas = Recetas.todas();
    const frec = h("div.lista-frecuencias");
    for (const c of Recetas.CATEGORIAS) {
      const nCat = todas.filter((r) => r.categoria === c.id).length;
      if (!nCat) continue;
      frec.appendChild(h("div.fila-frecuencia",
        h("div.frec-nombre", h("span.frec-icono", c.icono), h("div", h("strong", c.nombre), h("small.muted", `${c.desc} · ${nCat} recetas`))),
        UI.segmentado({ opciones: Planificador.FRECUENCIAS, valor: st.cfg.frecuencias[c.id] || "normal", ariaLabel: `Frecuencia de ${c.nombre}`, alCambiar: (v) => { st.cfg.frecuencias[c.id] = v; guardarBorrador(); } })
      ));
    }
    const cocinasConRecetas = Recetas.COCINAS.map((c) => ({ ...c, n: todas.filter((r) => r.cocina === c.id).length })).filter((c) => c.n);
    const opcionesCocina = cocinasConRecetas.map((c) => ({ ...c, nombre: `${c.nombre} (${c.n})` }));
    const preferidas = chipsCheck({ opciones: opcionesCocina, seleccion: st.cfg.cocinasPreferidas, aria: "Cocinas que te apetecen más", deshabilitadas: st.cfg.cocinasEvitar, alCambiar: (id, on) => { st.cfg.cocinasPreferidas = st.cfg.cocinasPreferidas.filter((x) => x !== id); if (on) st.cfg.cocinasPreferidas.push(id); guardarBorrador(); refrescar(); } });
    const evitar = chipsCheck({ opciones: opcionesCocina, seleccion: st.cfg.cocinasEvitar, aria: "Cocinas a evitar", deshabilitadas: st.cfg.cocinasPreferidas, alCambiar: (id, on) => { st.cfg.cocinasEvitar = st.cfg.cocinasEvitar.filter((x) => x !== id); if (on) st.cfg.cocinasEvitar.push(id); guardarBorrador(); refrescar(); } });
    const dietas = UI.segmentado({ opciones: Recetas.DIETAS, valor: st.cfg.dieta, ariaLabel: "Dieta", alCambiar: (v) => { st.cfg.dieta = v; guardarBorrador(); refrescar(); } });
    const necesidades = chipsCheck({ opciones: Recetas.NECESIDADES, seleccion: st.cfg.necesidades, aria: "Necesidades", alCambiar: (id, on) => { st.cfg.necesidades = st.cfg.necesidades.filter((x) => x !== id); if (on) st.cfg.necesidades.push(id); guardarBorrador(); refrescar(); } });
    const compatibles = todas.filter((r) => Planificador.cumpleDieta(r, st.cfg)).length;
    const hayFiltroDieta = st.cfg.dieta !== "omnivora" || st.cfg.necesidades.length;
    const dietaSel = Recetas.dietaInfo(st.cfg.dieta);

    UI.append(cont,
      h("section.bloque", h("h3", "Frecuencia de cada tipo de plato"), h("p.muted", "«Normal» reparte por igual. «Mucho» duplica su presencia y «Nunca» lo excluye del todo."), frec),
      h("section.bloque", h("h3", "Cocinas del mundo ", h("span.muted", "(opcional)")),
        h("p.muted", "Marca las que te apetecen más (saldrán con más frecuencia) y las que prefieres evitar (no saldrán)."),
        h("div.campo", h("span.campo-etiqueta", "Me apetecen más"), preferidas),
        h("div.campo", h("span.campo-etiqueta", "Prefiero evitar"), evitar)),
      h("section.bloque", h("h3", "Dieta del hogar"), h("p.muted", "Elige una. Las alergias e intolerancias (sin gluten, sin lácteos, FODMAP…) se indican en el perfil de cada persona."), dietas, dietaSel && dietaSel.desc ? h("p.campo-ayuda", dietaSel.desc) : null),
      h("section.bloque", h("h3", "Necesidades ", h("span.muted", "(opcional)")), h("p.muted", "Solo entrarán recetas que cumplan todas las que marques."), necesidades),
      hayFiltroDieta ? h("div.aviso", { class: compatibles < 60 ? "aviso-alerta" : "aviso-ok" }, h("strong", `${compatibles} recetas`), " cumplen la dieta y las necesidades elegidas.", compatibles < 60 ? " Con tan pocas el menú repetirá platos; quizá quieras relajar alguna." : "") : null
    );
  };

  /* ---------- Paso 4: ajustes (tiempo, contundencia, presupuesto, repeticiones, equipo) ---------- */
  const pasoAjustes = (cont, refrescar) => {
    const t = st.cfg.tiempo;
    const selTiempo = (clave, etiqueta, ayuda) => h("div.campo", h("span.campo-etiqueta", etiqueta), h("select.input", { "aria-label": etiqueta, onChange: (e) => { st.cfg.tiempo[clave] = Number(e.target.value); guardarBorrador(); refrescar(); } }, Planificador.TIEMPOS.map(([v, txt]) => h("option", { value: v, selected: t[clave] === v }, txt))), h("span.campo-ayuda", ayuda));
    const recientes = Recetas.usadasRecientemente(st.cfg.evitarRepetidasSemanas);
    const nSlots = st.cfg.slots.length;
    const hayLimite = t.laborables || t.finde;

    UI.append(cont,
      h("section.bloque", h("h3", "⏱️ Tiempo en la cocina"),
        h("p.muted", "Tiempo total de cada receta (preparación + cocción). Puedes permitirte más el fin de semana."),
        h("div.bloque-grid",
          selTiempo("laborables", "De lunes a viernes", "Límite para las comidas y cenas entre semana."),
          selTiempo("finde", "Sábado y domingo", "Límite para el fin de semana."),
          h("div.campo", h("span.campo-etiqueta", "¿Cómo de estricto?"), UI.segmentado({ opciones: [{ id: "si", nombre: "Estricto", desc: "Nunca se pasa del límite" }, { id: "no", nombre: "Orientativo", desc: "Puede pasarse hasta un 50 % si la receta encaja muy bien" }], valor: t.estricto ? "si" : "no", ariaLabel: "Rigor del límite de tiempo", alCambiar: (v) => { st.cfg.tiempo.estricto = v === "si"; guardarBorrador(); } }), h("span.campo-ayuda", hayLimite ? (t.estricto ? "Las recetas que superen el límite quedarán fuera." : "Las recetas que se pasen un poco se evitarán, pero podrán salir si encajan muy bien (se avisa).") : "Sin límite no hay nada que respetar: todo vale."))
        )),
      h("section.bloque", h("h3", "🍽️ Contundencia de las comidas"),
        h("p.muted", "Ligera: menos de 480 kcal por ración. Media: 480–650. Contundente: más de 650."),
        h("div.bloque-grid",
          h("div.campo", h("span.campo-etiqueta", "☀️ Comidas"), h("select.input", { "aria-label": "Contundencia de las comidas", onChange: (e) => { st.cfg.contundencia.comida = e.target.value; guardarBorrador(); } }, Planificador.CONTUNDENCIA_OPCIONES.map((o) => h("option", { value: o.id, selected: st.cfg.contundencia.comida === o.id }, (o.icono ? o.icono + " " : "") + o.nombre)))),
          h("div.campo", h("span.campo-etiqueta", "🌙 Cenas"), h("select.input", { "aria-label": "Contundencia de las cenas", onChange: (e) => { st.cfg.contundencia.cena = e.target.value; guardarBorrador(); } }, Planificador.CONTUNDENCIA_OPCIONES.map((o) => h("option", { value: o.id, selected: st.cfg.contundencia.cena === o.id }, (o.icono ? o.icono + " " : "") + o.nombre))), h("span.campo-ayuda", "«Según objetivos» pone cenas ligeras si alguien quiere perder peso, deshincharse o cuidar la digestión."))
        )),
      h("section.bloque", h("h3", "💶 Presupuesto"),
        UI.segmentado({ opciones: Planificador.PRESUPUESTOS, valor: st.cfg.presupuesto, ariaLabel: "Presupuesto", alCambiar: (v) => { st.cfg.presupuesto = v; guardarBorrador(); } }),
        h("p.campo-ayuda", "Económico deja fuera las recetas premium (salmón, marisco, solomillo…) y favorece las baratas. Medio limita las premium. Premium las prioriza.")),
      h("section.bloque", h("h3", "🔁 Repeticiones"),
        h("div.bloque-grid",
          h("div.campo", h("span.campo-etiqueta", "No repetir recetas de menús anteriores"), h("select.input", { "aria-label": "No repetir recetas recientes", onChange: (e) => { st.cfg.evitarRepetidasSemanas = Number(e.target.value); guardarBorrador(); refrescar(); } }, Planificador.SEMANAS_SIN_REPETIR.map(([v, txt]) => h("option", { value: v, selected: st.cfg.evitarRepetidasSemanas === v }, v ? `Que no hayan salido en ${txt}` : txt))), h("span.campo-ayuda", st.cfg.evitarRepetidasSemanas ? `${recientes.size} ${UI.plural(recientes.size, "receta usada", "recetas usadas")} en tus menús de ese periodo quedarán fuera.` : "Mira tus menús guardados para no repetir lo que ya comiste.")),
          h("div.campo", h("span.campo-etiqueta", "Repetir dentro de la semana (sobras)"), UI.segmentado({ opciones: [{ id: "no", nombre: "No repetir" }, { id: "si", nombre: "Permitir" }], valor: st.cfg.permitirRepetir ? "si" : "no", ariaLabel: "Repetir recetas en la semana", alCambiar: (v) => { st.cfg.permitirRepetir = v === "si"; guardarBorrador(); } }), h("span.campo-ayuda", "Útil si cocinas de más para otro día."))
        )),
      h("section.bloque", h("h3", "🍳 Equipo y forma de cocinar"),
        h("div.campo", h("span.campo-etiqueta", "Aparatos que tienes"),
          chipsCheck({ opciones: Planificador.APARATOS, seleccion: st.cfg.equipo, aria: "Aparatos que tienes", alCambiar: (id, on) => { st.cfg.equipo = st.cfg.equipo.filter((x) => x !== id); if (on) st.cfg.equipo.push(id); st.cfg.tieneOllaExpress = st.cfg.equipo.includes("olla-express"); guardarBorrador(); refrescar(); } }),
          h("span.campo-ayuda", "Fuegos y sartenes se dan por supuestos. Las recetas que necesiten un aparato que no tienes quedan fuera.")),
        h("div.campo", h("span.campo-etiqueta", "Formas de cocinar que prefieres ", h("span.muted", "(opcional)")),
          chipsCheck({ opciones: Recetas.COCCIONES.map((c) => ({ ...c, nombre: c.nombre })), seleccion: st.cfg.coccionesPreferidas, aria: "Formas de cocinar preferidas", deshabilitadas: Recetas.COCCIONES.filter((c) => ["airfryer", "microondas", "slow-cooker", "olla-express"].includes(c.id) && !st.cfg.equipo.includes(c.id)).map((c) => c.id), alCambiar: (id, on) => { st.cfg.coccionesPreferidas = st.cfg.coccionesPreferidas.filter((x) => x !== id); if (on) st.cfg.coccionesPreferidas.push(id); guardarBorrador(); refrescar(); } }),
          h("span.campo-ayuda", "Saldrán con más frecuencia, sin excluir las demás.")),
        h("div.campo", h("span.campo-etiqueta", "🥡 Platos para tupper"),
          h("select.input", { "aria-label": "Platos para tupper", onChange: (e) => { st.cfg.tupper = e.target.value; guardarBorrador(); } }, Planificador.TUPPER.map((t) => h("option", { value: t.id, selected: st.cfg.tupper === t.id }, t.nombre))),
          h("span.campo-ayuda", "En esos huecos solo saldrán platos que aguantan bien en la nevera y se recalientan sin perder: guisos, legumbres, arroces, pastas, bowls…"))),
      nSlots ? null : h("div.aviso.aviso-info", "No has marcado ningún día en el paso 2.")
    );
  };

  /* ---------- Paso 5: vetos ---------- */
  const pasoVetos = (cont, refrescar) => {
    const toggle = (v) => { if (st.cfg.vetos.includes(v)) st.cfg.vetos = st.cfg.vetos.filter((x) => x !== v); else st.cfg.vetos.push(v); guardarBorrador(); refrescar(); };
    const grupos = h("div.chips-check", { role: "group", "aria-label": "Grupos de ingredientes" }, Catalogo.GRUPOS.map((g) => h("label.chip.chip-check", { title: g.claves.slice(0, 6).join(", ").replace(/\*/g, "") + "…" }, h("input", { type: "checkbox", "aria-label": `Vetar ${g.nombre}`, checked: st.cfg.vetos.includes(g.id), onChange: () => toggle(g.id) }), g.icono, " ", g.nombre)));
    const dl = h("datalist#dl-vetos", Recetas.indiceIngredientes().slice(0, 400).map((i) => h("option", { value: i.n })));
    const input = h("input.input", { type: "text", list: "dl-vetos", placeholder: "Ej. cilantro, berenjena, atún…", "aria-label": "Ingrediente a vetar" });
    const anadir = () => { const v = input.value.trim().toLowerCase(); if (!v) return; if (!st.cfg.vetos.includes(v)) st.cfg.vetos.push(v); input.value = ""; guardarBorrador(); refrescar(); };
    const form = h("form.fila-anadir", { onSubmit: (e) => { e.preventDefault(); anadir(); } }, dl, input, h("button.btn", { type: "submit" }, "Añadir"));
    const libres = st.cfg.vetos.filter((v) => !Catalogo.GRUPOS.some((g) => g.id === v));
    const chips = h("div.chips-vetos", libres.map((v) => h("span.chip.chip-veto", v, h("button.chip-quitar", { type: "button", "aria-label": `Quitar veto ${v}`, onClick: () => toggle(v) }, "✕"))));

    const intol = intolHogar();
    const vetosTotales = [...new Set([...st.cfg.vetos, ...intol.flatMap((t) => t.grupos)])];
    const bloqueIntol = h("section.bloque", h("h3", "Intolerancias del hogar"),
      intol.length
        ? [h("p.muted", "Se aplican siempre, como un veto más, porque están en el perfil de las personas que comen esta semana. Se cambian editando a cada persona (paso 1)."),
          h("div.chips-vetos", intol.map((t) => h("span.chip.chip-intol", { title: t.nombre }, t.icono, " Sin ", t.corto, h("small.muted", " · ", Recetas.listaNombres(t.personas)))))]
        : h("p.muted", "Nadie de esta semana tiene intolerancias o alergias en su perfil. Puedes añadirlas editando a cada persona en el paso 1."));
    const total = Recetas.todas().length;
    const compat = Recetas.todas().filter((r) => !Recetas.conflictosVeto(r, vetosTotales).some((c) => !c.opcional)).length;
    const excluidas = total - compat;
    const porcentaje = total ? Math.round((compat / total) * 100) : 100;
    UI.append(cont,
      bloqueIntol,
      h("section.bloque", h("h3", "Vetos rápidos"), h("p.muted", "Marca grupos enteros (alergias, intolerancias, preferencias) solo para este menú."), grupos),
      h("section.bloque", h("h3", "Ingredientes concretos"), form, libres.length ? chips : h("p.muted", "Todavía no has vetado ningún ingrediente concreto.")),
      h("div.aviso", { class: porcentaje < 35 ? "aviso-alerta" : "aviso-ok" }, h("strong", `${compat} de ${total} recetas`), ` siguen disponibles con estos vetos${intol.length ? " e intolerancias" : ""}${excluidas ? ` (${excluidas} quedan fuera)` : ""}.`, porcentaje < 35 ? " Con tan pocas opciones el menú repetirá platos; quizá quieras afinar los vetos." : "")
    );
  };

  /* ---------- Paso 6: obligatorias ---------- */
  const pasoObligatorias = (cont, refrescar) => {
    const seleccion = h("div.lista-obligatorias");
    const tituloFijas = h("h3");
    const pintarSel = () => {
      tituloFijas.textContent = `Recetas fijas (${st.cfg.obligatorias.length}/${st.cfg.slots.length})`;
      UI.vaciar(seleccion);
      if (!st.cfg.obligatorias.length) { seleccion.appendChild(h("p.muted", "No has fijado ninguna receta. Es opcional: si no eliges nada, el menú se genera libremente.")); return; }
      for (const o of st.cfg.obligatorias) {
        const r = Recetas.porId(o.recetaId);
        if (!r) continue;
        const conflictos = Recetas.conflictosVeto(r, st.cfg.vetos);
        const noDieta = !Planificador.cumpleDieta(r, st.cfg);
        const noApta = Recetas.noAptaPara(r, personasSeleccionadas());
        const selDia = h("select.input.input-corto", { "aria-label": "Día", onChange: (e) => { o.dia = e.target.value || null; guardarBorrador(); } }, h("option", { value: "" }, "Cualquier día"), Planificador.DIAS.map((d) => h("option", { value: d.id, selected: o.dia === d.id, disabled: !st.cfg.slots.some((s) => s.dia === d.id) }, d.nombre)));
        const selMom = h("select.input.input-corto", { "aria-label": "Comida o cena", onChange: (e) => { o.momento = e.target.value || null; guardarBorrador(); } }, h("option", { value: "" }, "Comida o cena"), Recetas.MOMENTOS.map((m) => h("option", { value: m.id, selected: o.momento === m.id }, m.icono + " " + m.nombre)));
        seleccion.appendChild(h("div.fila-obligatoria",
          h("div.oblig-info", h("strong", r.favorita ? "★ " : "", r.nombre), h("small.muted", `${Recetas.categoria(r.categoria).icono} ${Recetas.categoria(r.categoria).nombre} · ${r.tiempo} min · ${r.momentos.join("/")}`),
            conflictos.length ? h("div.aviso.aviso-alerta.aviso-mini", `⚠️ Lleva ${[...new Set(conflictos.map((c) => c.ingrediente))].join(", ")}, que has vetado. Se incluirá igualmente: las recetas fijas tienen prioridad.`) : null,
            noDieta ? h("div.aviso.aviso-alerta.aviso-mini", "⚠️ No cumple la dieta o las necesidades marcadas; se incluirá igualmente por ser fija.") : null,
            noApta.map((x) => h("div.aviso.aviso-alerta.aviso-mini", `⚠️ No es apta para ${x.persona.nombre} (${x.intolerancias.map((t) => t.corto).join(", ")}). Se incluirá igualmente por ser fija: revisa los ingredientes.`)),
            r.enListaNegra ? h("div.aviso.aviso-alerta.aviso-mini", "⚠️ Está en tu lista de excluidas de menús; se incluirá igualmente por ser fija.") : null),
          h("div.oblig-controles", selDia, selMom, h("button.btn.btn-icono", { type: "button", "aria-label": `Quitar ${r.nombre} de las fijas`, onClick: () => { st.cfg.obligatorias = st.cfg.obligatorias.filter((x) => x !== o); guardarBorrador(); pintarSel(); pintarRes(); } }, "✕"))
        ));
      }
    };

    const resultados = h("div.lista-busqueda-recetas");
    const inputQ = h("input.input", { type: "search", placeholder: "Busca una receta por nombre o ingrediente…", "aria-label": "Buscar receta", onInput: UI.debounce(() => pintarRes(), 120) });
    const soloFav = h("label.check-inline", h("input", { type: "checkbox", onChange: () => pintarRes() }), "★ Solo favoritas");
    const pintarRes = () => {
      UI.vaciar(resultados);
      const q = inputQ.value.trim();
      const lista = Recetas.filtrar({ q, soloFavoritas: soloFav.querySelector("input").checked }).sort((a, b) => (b.favorita - a.favorita) || a.nombre.localeCompare(b.nombre, "es")).slice(0, q ? 40 : 15);
      if (!lista.length) { resultados.appendChild(h("p.muted", "Sin resultados.")); return; }
      for (const r of lista) {
        const ya = st.cfg.obligatorias.some((o) => o.recetaId === r.id);
        const noApta = Recetas.noAptaPara(r, personasSeleccionadas());
        resultados.appendChild(h("div.fila-resultado",
          h("button.fila-resultado-info", { type: "button", title: "Ver receta", onClick: () => window.Vistas.recetas.abrirDetalle(r.id) }, h("span", Recetas.categoria(r.categoria).icono), h("span.fila-res-nombre", r.favorita ? "★ " : "", r.nombre), h("small.muted", ` · ${r.tiempo} min`), noApta.length ? h("small.texto-alerta", { title: noApta.map((x) => `No apta para ${x.persona.nombre}: ${x.intolerancias.map((t) => t.corto).join(", ")}`).join(" · ") }, ` · ⚠️ no apta para ${noApta.map((x) => x.persona.nombre).join(", ")}`) : null),
          h("button.btn.btn-mini", { type: "button", class: ya ? "btn-suave" : "btn-primario", disabled: ya, onClick: () => { st.cfg.obligatorias.push({ recetaId: r.id, dia: null, momento: null }); guardarBorrador(); pintarSel(); pintarRes(); UI.toast(`«${r.nombre}» fijada en el menú`); } }, ya ? "✓ Fijada" : "+ Fijar")
        ));
      }
    };
    pintarSel(); pintarRes();
    const maxSlots = st.cfg.slots.length;

    /* --- Ingredientes obligatorios --- */
    st.cfg.ingredientesObligatorios = st.cfg.ingredientesObligatorios || [];
    const listaIng = h("div.lista-ing-oblig");
    const contar = (t) => Recetas.todas().filter((r) => r.ingredientes.some((i) => !i.opcional && Catalogo.ingredienteUsa(i.n, t))).length;
    const pintarIng = () => {
      UI.vaciar(listaIng);
      if (!st.cfg.ingredientesObligatorios.length) { listaIng.appendChild(h("p.muted", "Ninguno todavía. Ejemplo: tienes medio pollo y unos calabacines que gastar: añádelos y el menú incluirá recetas que los usen.")); return; }
      for (const x of st.cfg.ingredientesObligatorios) {
        const n = contar(x.nombre);
        const vetado = st.cfg.vetos.some((v) => Catalogo.ingredienteVetado(x.nombre, v));
        listaIng.appendChild(h("div.fila-ing-oblig",
          h("div.oblig-info", h("strong", "🥕 ", x.nombre), h("small.muted", n ? `${n} ${UI.plural(n, "receta lo lleva", "recetas lo llevan")}` : "Ninguna receta lo lleva: prueba con otro nombre (en singular, p. ej. «calabacín»)."),
            vetado ? h("div.aviso.aviso-alerta.aviso-mini", "⚠️ También lo has vetado: manda el veto y no se forzará.") : null),
          h("label.check-inline", { title: "Si lo marcas, no saldrá en la lista de la compra" }, h("input", { type: "checkbox", checked: x.enCasa !== false, onChange: (e) => { x.enCasa = e.target.checked; guardarBorrador(); } }), "Ya lo tengo (no comprar)"),
          h("button.btn.btn-icono", { type: "button", "aria-label": `Quitar ${x.nombre}`, onClick: () => { st.cfg.ingredientesObligatorios = st.cfg.ingredientesObligatorios.filter((y) => y !== x); guardarBorrador(); pintarIng(); } }, "✕")
        ));
      }
    };
    const dlIng = h("datalist#dl-ing-oblig", Recetas.indiceIngredientes().slice(0, 500).map((i) => h("option", { value: i.n })));
    const inputIng = h("input.input", { type: "text", list: "dl-ing-oblig", placeholder: "Ej. pollo, calabacín, garbanzos cocidos…", "aria-label": "Ingrediente que quieres usar" });
    const anadirIng = () => {
      const v = inputIng.value.trim().toLowerCase();
      if (!v) return;
      if (!st.cfg.ingredientesObligatorios.some((x) => x.nombre === v)) st.cfg.ingredientesObligatorios.push({ nombre: v, enCasa: true });
      inputIng.value = ""; guardarBorrador(); pintarIng(); inputIng.focus();
    };
    pintarIng();

    UI.append(cont,
      h("section.bloque", h("h3", "🥕 Ingredientes que quieres usar"),
        h("p.muted", "Cada ingrediente aparecerá al menos en una receta del menú, y el asistente preferirá recetas que aprovechen varios a la vez."),
        h("form.fila-anadir", { onSubmit: (e) => { e.preventDefault(); anadirIng(); } }, dlIng, inputIng, h("button.btn", { type: "submit" }, "Añadir")),
        listaIng),
      h("section.bloque", tituloFijas, seleccion, st.cfg.obligatorias.length > maxSlots ? h("div.aviso.aviso-alerta", "Has fijado más recetas que huecos tiene el menú; algunas quedarán fuera.") : null),
      h("section.bloque", h("h3", "Buscar y fijar"), h("div.fila-busqueda", inputQ, soloFav), resultados)
    );
  };

  /* ---------- Paso 7: resultado ---------- */
  const generar = () => {
    const personas = personasSeleccionadas();
    const res = Planificador.generar({ ...st.cfg, semilla: Math.floor(Math.random() * 1e9) }, personas);
    res.huella = huellaWizard();
    res.generado = new Date().toISOString();
    st.resultado = res;
    guardarBorrador();
  };

  const iconosReceta = (r) => h("small.muted", `${r.tiempo} min · ${r.nutricion.kcal || "?"} kcal · ${(Recetas.contundencia(r.contundencia) || {}).icono || ""} ${(Recetas.coste(r.coste) || {}).icono || ""}${r.cocina ? " · " + (Recetas.cocina(r.cocina) || {}).icono : ""}`);

  const tarjetaSlot = (s, refrescar) => {
    const r = s.recetaId ? Recetas.porId(s.recetaId) : null;
    const personas = personasSeleccionadas();
    const raciones = st.resultado.raciones;
    const cambiar = () => {
      const { compatibles, otras } = Planificador.alternativas(st.cfg, s, st.resultado.slots.map((x) => x.recetaId).filter(Boolean), personas);
      let m;
      const elegir = (rr) => { s.recetaId = rr.id; s.avisos = []; s.obligatoria = false; s.usa = (st.cfg.ingredientesObligatorios || []).map((x) => x.nombre).filter((t) => rr.ingredientes.some((i) => !i.opcional && Catalogo.ingredienteUsa(i.n, t))); const c = Recetas.conflictosVeto(rr, st.cfg.vetos); if (c.some((x) => !x.opcional)) s.avisos.push(`Lleva ${[...new Set(c.filter((x) => !x.opcional).map((x) => x.ingrediente))].join(", ")} (vetado); la has elegido tú.`); for (const x of Recetas.noAptaPara(rr, personas)) s.avisos.push(`No es apta para ${x.persona.nombre} (${x.intolerancias.map((t) => t.corto).join(", ")}); la has elegido tú.`); guardarBorrador(); m.cerrar(); refrescar(); };
      const inputQ = h("input.input", { type: "search", placeholder: "Filtrar…", "aria-label": "Filtrar recetas", onInput: UI.debounce(() => pintar(), 100) });
      const lista = h("div.lista-busqueda-recetas");
      const pintar = () => {
        UI.vaciar(lista);
        const q = Catalogo.normalizar(inputQ.value);
        const filtra = (arr) => arr.filter((rr) => !q || rr.textoBusqueda.includes(q));
        const bloque = (titulo, arr, clase) => { if (!arr.length) return; lista.appendChild(h("h4.muted", titulo)); for (const rr of arr.slice(0, 80)) lista.appendChild(h("div.fila-resultado", { class: clase }, h("button.fila-resultado-info", { type: "button", onClick: () => window.Vistas.recetas.abrirDetalle(rr.id) }, h("span", Recetas.categoria(rr.categoria).icono), h("span.fila-res-nombre", rr.favorita ? "★ " : "", rr.nombre), iconosReceta(rr)), h("button.btn.btn-mini.btn-primario", { type: "button", onClick: () => elegir(rr) }, "Elegir"))); if (arr.length > 80) lista.appendChild(h("p.muted", `… y ${arr.length - 80} más. Escribe para filtrar.`)); };
        bloque(`Compatibles con tus filtros (${filtra(compatibles).length})`, filtra(compatibles));
        bloque("Otras (no cumplen algún filtro: veto, intolerancia, dieta, momento, tiempo, cocina, presupuesto o lista negra)", filtra(otras), "fila-otra");
      };
      pintar();
      m = UI.modal({ titulo: `Elegir receta para ${Planificador.dia(s.dia).nombre} · ${s.momento}`, ancho: "lg", contenido: [inputQ, lista] });
    };
    return h("div.slot", { class: (s.obligatoria ? "slot-obligatoria " : "") + (!r ? "slot-vacio" : "") },
      h("div.slot-cab", h("span.slot-momento", Recetas.MOMENTOS.find((m) => m.id === s.momento).icono, " ", s.momento === "comida" ? "Comida" : "Cena"), s.obligatoria ? h("span.chip.chip-mini.chip-fija", { title: "Receta fijada por ti" }, "📌 fija") : r && r.favorita ? h("span.chip.chip-mini.chip-fav", { title: "Favorita" }, "★") : null, (s.usa || []).length ? h("span.chip.chip-mini.chip-usa", { title: "Usa ingredientes que pediste" }, "🥕 ", s.usa.join(", ")) : null),
      r ? h("button.slot-receta", { type: "button", title: "Ver receta", onClick: () => window.Vistas.recetas.abrirDetalle(r.id, { raciones }) }, h("span.slot-cat", Recetas.categoria(r.categoria).icono), h("span.slot-nombre", r.nombre), iconosReceta(r)) : h("p.muted", "Sin receta"),
      (s.avisos || []).map((a) => h("div.aviso.aviso-alerta.aviso-mini", "⚠️ ", a)),
      h("div.slot-acciones",
        h("button.btn.btn-mini.btn-suave", { type: "button", title: "Proponer otra receta al azar para este hueco", onClick: () => { const res = Planificador.regenerarSlot(st.resultado, st.cfg, personas, s.dia + "|" + s.momento); const nuevo = res.slots.find((x) => x.dia === s.dia && x.momento === s.momento); if (nuevo) { Object.assign(s, { recetaId: nuevo.recetaId, avisos: nuevo.avisos, obligatoria: false, usa: nuevo.usa || [] }); } guardarBorrador(); refrescar(); } }, "🔀 Otra"),
        h("button.btn.btn-mini.btn-suave", { type: "button", title: "Elegir una receta concreta", onClick: cambiar }, "🔍 Elegir"),
        r ? h("button.btn.btn-mini.btn-suave", { type: "button", title: `Copiar «${r.nombre}» en Markdown`, "aria-label": `Copiar ${r.nombre} en Markdown`, onClick: () => Recetas.copiarMarkdown(r.id, raciones) }, "📋 Copiar") : null
      )
    );
  };

  const acciones = { guardar: null };

  const pasoResultado = (cont, refrescar) => {
    const huellaActual = huellaWizard();
    const habia = !!(st.resultado && st.resultado.slots && st.resultado.slots.length);
    if (!habia || st.resultado.huella !== huellaActual) {
      generar();
      if (habia) UI.toast("Menú recalculado con la nueva configuración.", "info");
    }
    const res = st.resultado;
    const personas = personasSeleccionadas();
    const resumen = Planificador.resumenNutricional(res.slots);
    const dias = Planificador.DIAS.filter((d) => res.slots.some((s) => s.dia === d.id));
    const grid = h("div.grid-semana", dias.map((d) => h("div.columna-dia", h("h3.dia-titulo", d.nombre), ["comida", "cena"].map((m) => { const s = res.slots.find((x) => x.dia === d.id && x.momento === m); return s ? tarjetaSlot(s, refrescar) : null; }))));

    const inputNombre = h("input.input", { type: "text", value: st.cfg.nombre || "", placeholder: nombreSugerido(), "aria-label": "Nombre del menú", onInput: (e) => { st.cfg.nombre = e.target.value; guardarBorrador(); } });
    const guardar = acciones.guardar = () => {
      if (!res.slots.some((s) => s.recetaId)) return UI.toast("El menú está vacío.", "error");
      const menu = {
        id: DB.uid("menu"),
        nombre: (st.cfg.nombre || "").trim() || nombreSugerido(),
        creado: new Date().toISOString(),
        personas: personas.map((p) => ({ id: p.id, nombre: p.nombre, avatar: Personas.avatar(p), intolerancias: p.intolerancias || [] })),
        raciones: res.raciones,
        slots: res.slots.map((s) => ({ dia: s.dia, momento: s.momento, recetaId: s.recetaId, obligatoria: !!s.obligatoria, usa: s.usa || [], raciones: res.raciones })),
        enCasa: (st.cfg.ingredientesObligatorios || []).filter((x) => x.enCasa !== false).map((x) => x.nombre),
        cfg: JSON.parse(JSON.stringify(st.cfg)),
        marcados: [],
      };
      window.Menus.guardar(menu);
      reiniciar();
      UI.toast("Menú guardado. La lista de la compra está en la segunda pestaña.");
      window.App.ir(`/menus/${menu.id}`);
    };

    const chipsResumen = resumen ? h("div.resumen-categorias",
      Object.entries(resumen.porCategoria).map(([c, n]) => h("span.chip", Recetas.categoria(c).icono, " ", Recetas.categoria(c).nombre, ": ", String(n))),
      Object.entries(resumen.porContundencia).map(([c, n]) => { const cc = Recetas.contundencia(c); return cc ? h("span.chip.chip-mini", cc.icono, " ", cc.nombre, ": ", String(n)) : null; }),
      Object.entries(resumen.porCoste).map(([c, n]) => { const cc = Recetas.coste(c); return cc ? h("span.chip.chip-mini", cc.icono, " ", cc.nombre, ": ", String(n)) : null; })
    ) : null;

    UI.append(cont,
      h("div.resultado-barra",
        h("div.resultado-info", h("strong", `${res.slots.length} comidas`), ` · ${personas.length} ${UI.plural(personas.length, "persona", "personas")} · ${res.raciones.toLocaleString("es-ES")} raciones por comida`, resumen ? h("span.muted", ` · media ${resumen.media.kcal} kcal y ${resumen.media.prot} g de proteína por ración`) : null),
        h("div.resultado-acciones", h("button.btn", { type: "button", onClick: () => { generar(); refrescar(); UI.toast("Nuevo menú propuesto"); } }, "🎲 Proponer otro menú"))
      ),
      res.avisos.length ? h("div.aviso.aviso-alerta", h("ul", res.avisos.map((a) => h("li", a)))) : null,
      grid,
      chipsResumen,
      h("div.guardar-menu", h("label.campo", h("span.campo-etiqueta", "Nombre del menú"), inputNombre), h("button.btn.btn-primario.btn-grande", { type: "button", onClick: guardar }, "💾 Guardar menú"))
    );
  };

  const nombreSugerido = () => {
    const hoy = new Date();
    const lunes = new Date(hoy); lunes.setDate(hoy.getDate() + ((8 - hoy.getDay()) % 7 || 7));
    const dom = new Date(lunes); dom.setDate(lunes.getDate() + 6);
    const f = (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    return `Menú ${f(lunes)} – ${f(dom)}`;
  };

  /* ---------- Render principal ---------- */
  const puedeAvanzar = () => {
    if (st.paso === 0) return personasSeleccionadas().length > 0;
    if (st.paso === 1) return st.cfg.slots.length > 0;
    return true;
  };
  const motivoBloqueo = () => (st.paso === 0 ? "Selecciona al menos una persona" : st.paso === 1 ? "Marca al menos una comida" : "");
  const PASO_FN = [pasoPersonas, pasoDias, pasoGustos, pasoAjustes, pasoVetos, pasoObligatorias, pasoResultado];

  const render = (cont) => {
    UI.vaciar(cont);
    st = cargarBorrador();
    const cuerpo = h("div.wizard-cuerpo");
    const stepper = h("ol.stepper-pasos", { "aria-label": "Pasos" });
    const nav = h("div.wizard-nav");

    const irA = (i) => { st.paso = i; guardarBorrador(); refrescar(); window.scrollTo({ top: 0, behavior: "smooth" }); };

    const refrescar = () => {
      UI.vaciar(stepper); UI.vaciar(cuerpo); UI.vaciar(nav);
      const okBase = personasSeleccionadas().length > 0 && st.cfg.slots.length > 0;
      PASOS.forEach((p, i) => stepper.appendChild(h("li.paso-item", { class: i === st.paso ? "actual" : i < st.paso ? "hecho" : "", "aria-current": i === st.paso ? "step" : null },
        h("button.paso-btn", { type: "button", "aria-label": `Paso ${i + 1}: ${p.nombre}`, disabled: i > st.paso && !okBase, title: i > st.paso && !okBase ? "Completa personas y días primero" : "", onClick: () => { if (i <= st.paso || okBase) irA(i); } }, h("span.paso-num", i < st.paso ? "✓" : p.icono), h("span.paso-nombre", p.nombre)))));
      const p = PASOS[st.paso];
      UI.append(cuerpo, h("header.paso-cab", h("h2", p.titulo), h("p.muted", p.desc)));
      const contenido = h("div.paso-contenido");
      PASO_FN[st.paso](contenido, refrescar);
      cuerpo.appendChild(contenido);
      UI.append(cuerpo, window.Publicidad.bloque("asistente"));
      const ok = puedeAvanzar();
      UI.append(nav,
        h("button.btn", { type: "button", disabled: st.paso === 0, onClick: () => irA(st.paso - 1) }, "← Atrás"),
        h("button.btn.btn-suave", { type: "button", onClick: async () => { if (await UI.confirmar({ titulo: "Empezar de nuevo", mensaje: "Se borrará lo que has configurado en este asistente (las personas del hogar se conservan)." })) { reiniciar(); refrescar(); } } }, "Empezar de nuevo"),
        h("div.espaciador"),
        st.paso === PASO_RESULTADO ? h("button.btn.btn-primario", { type: "button", onClick: () => acciones.guardar && acciones.guardar() }, "💾 Guardar menú") : null,
        st.paso < PASO_RESULTADO ? h("button.btn.btn-primario", { type: "button", disabled: !ok, title: ok ? "" : motivoBloqueo(), onClick: () => { if (!ok) return UI.toast(motivoBloqueo(), "info"); if (st.paso === PASO_RESULTADO - 1) st.resultado = null; irA(st.paso + 1); } }, st.paso === PASO_RESULTADO - 1 ? "✨ Generar menú" : "Siguiente →") : null
      );
    };
    UI.append(cont, h("header.vista-cab", h("div", h("h1", "🪄 Nuevo menú semanal"), h("p.vista-desc", "Siete pasos cortos. Todo se guarda automáticamente por si lo dejas a medias."))), stepper, cuerpo, nav);
    refrescar();
    const onPersonas = () => { if (cont.isConnected) refrescar(); else document.removeEventListener("personas:cambio", onPersonas); };
    document.addEventListener("personas:cambio", onPersonas);
  };

  window.Vistas = window.Vistas || {};
  window.Vistas.wizard = { render, cargarConfig, reiniciar };
})();
