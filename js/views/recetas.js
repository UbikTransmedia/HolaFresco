/* Vista: base de datos de recetas (listado, detalle, editor). */
(function () {
  "use strict";
  const { UI, Recetas, Compra, Catalogo, DB } = window;
  const { h } = UI;

  const FILTROS_DEFECTO = { q: "", categoria: [], origen: [], momento: "", dieta: "toda", necesidades: [], cocina: [], contundencia: [], coste: [], coccion: [], sinAlergenos: [], aptaHogar: false, tupper: false, tiempoMax: 0, orden: "nombre", soloFavoritas: false, listaNegra: "" };
  const estado = { ...FILTROS_DEFECTO, ...DB.leer("filtrosRecetas", {}) };
  // Antes «dieta» era una lista que mezclaba dietas e intolerancias: las intolerancias pasan a su filtro
  if (Array.isArray(estado.dieta)) {
    const aIntol = { "sin-gluten": "gluten", "sin-lactosa": "lactosa", "sin-frutos-secos": "frutos-secos", "bajo-fodmap": "fodmap" };
    estado.sinAlergenos = [...new Set([...(Array.isArray(estado.sinAlergenos) ? estado.sinAlergenos : []), ...estado.dieta.map((d) => aIntol[d]).filter(Boolean)])];
    estado.dieta = estado.dieta.includes("vegana") ? "vegana" : estado.dieta.includes("vegetariana") ? "vegetariana" : "toda";
  }
  if (!Recetas.DIETAS.some((d) => d.id === estado.dieta)) estado.dieta = "toda";
  for (const k of ["categoria", "origen", "necesidades", "cocina", "contundencia", "coste", "coccion", "sinAlergenos"]) if (!Array.isArray(estado[k])) estado[k] = [];
  estado.categoria = estado.categoria.filter((c) => Recetas.CATEGORIAS.some((x) => x.id === c));
  // «Olla exprés» ya no está en la fila principal de categorías: se filtra desde Más filtros → Cocción
  if (estado.categoria.includes("olla-express")) { estado.categoria = estado.categoria.filter((c) => c !== "olla-express"); if (!estado.coccion.includes("olla-express")) estado.coccion.push("olla-express"); }

  /* Personas del hogar con intolerancias (para avisar en tarjetas y detalle) */
  const hogarConIntol = () => (window.Personas ? window.Personas.todas() : []).filter((p) => (p.intolerancias || []).length);
  const intolHogarIds = () => [...new Set(hogarConIntol().flatMap((p) => p.intolerancias))];
  const guardarEstado = () => DB.guardar("filtrosRecetas", estado);
  const LOTE = 60;

  const iconoDificultad = (d) => (d === "fácil" ? "●○○" : d === "media" ? "●●○" : "●●●");

  const badgeOrigen = (r) => {
    const o = Recetas.ORIGENES[r.origen] || Recetas.ORIGENES.recetario;
    return h("span.badge", { class: "badge-" + o.id, title: o.desc }, o.icono, " ", o.corto);
  };

  const botonEstrella = (r, clase = "") => h("button.btn-estrella", { type: "button", class: (r.favorita ? "activa " : "") + clase, "aria-pressed": r.favorita ? "true" : "false", "aria-label": r.favorita ? `Quitar ${r.nombre} de favoritas` : `Marcar ${r.nombre} como favorita`, title: r.favorita ? "Favorita (el menú la elegirá más a menudo)" : "Marcar como favorita", onClick: (e) => { e.stopPropagation(); const ahora = Recetas.toggleFavorita(r.id); UI.toast(ahora ? "★ Añadida a favoritas: saldrá más en tus menús." : "Quitada de favoritas.", "info", 1800); } }, r.favorita ? "★" : "☆");

  const chipsAtributos = (r) => {
    const coc = Recetas.cocina(r.cocina), con = Recetas.contundencia(r.contundencia), cos = Recetas.coste(r.coste);
    return h("div.tarjeta-atributos",
      coc ? h("span.chip.chip-mini", { title: "Tipo de cocina: " + coc.nombre }, coc.icono, " ", coc.nombre) : null,
      con ? h("span.chip.chip-mini", { title: "Contundencia: " + con.nombre + " · " + con.desc }, con.icono, " ", con.nombre) : null,
      cos ? h("span.chip.chip-mini.chip-coste", { title: "Coste: " + cos.nombre + " · " + cos.desc }, cos.icono) : null,
      r.tupper ? h("span.chip.chip-mini.chip-tupper", { title: "Aguanta bien en tupper y se recalienta sin problema" }, "🥡") : null,
      r.coccion.filter((c) => c !== "una-olla" && c !== r.categoria).map((c) => { const cc = Recetas.coccion(c); return h("span.chip.chip-mini", { title: cc.desc }, cc.icono); })
    );
  };

  const tarjeta = (r, opciones = {}) => {
    const cat = Recetas.categoria(r.categoria);
    return h("article.tarjeta-receta", { class: r.enListaNegra ? "en-lista-negra" : "", tabindex: "0", role: "button", "aria-label": `Ver receta: ${r.nombre}`, onClick: () => abrirDetalle(r.id, opciones), onKeydown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrirDetalle(r.id, opciones); } } },
      h("div.tarjeta-cab", h("span.tarjeta-cat", { title: cat.nombre }, cat.icono, " ", cat.nombre), h("span.tarjeta-cab-der", badgeOrigen(r), botonEstrella(r))),
      h("h3.tarjeta-titulo", r.nombre),
      r.subtitulo ? h("p.tarjeta-sub", r.subtitulo) : null,
      h("div.tarjeta-meta",
        h("span", { title: "Tiempo total" }, "⏱ ", r.tiempo, " min"),
        h("span", { title: "Dificultad: " + r.dificultad }, iconoDificultad(r.dificultad), " ", r.dificultad),
        r.nutricion.kcal ? h("span", { title: "Energía por ración" }, "🔥 ", r.nutricion.kcal, " kcal") : null
      ),
      chipsAtributos(r),
      h("div.tarjeta-pie",
        h("span.momentos", r.momentos.map((mo) => { const m = Recetas.MOMENTOS.find((x) => x.id === mo); return h("span.chip.chip-mini", { title: m.nombre }, m.icono, " ", m.nombre); })),
        h("span.dietas", r.dieta.map((d) => { const dd = Recetas.dietaInfo(d); return dd ? h("span.dieta-ico", { title: dd.nombre }, dd.icono) : null; }), r.necesidades.map((n) => { const nn = Recetas.NECESIDADES.find((x) => x.id === n); return h("span.dieta-ico", { title: nn.nombre }, nn.icono); }))
      ),
      r.enListaNegra ? h("span.badge.badge-negra", { title: "No se elegirá en los menús semanales (salvo que la fijes)" }, "🚫 fuera de menús") : null,
      (() => { const no = Recetas.noAptaPara(r, opciones.personas || hogarConIntol()); return no.length ? h("span.badge.badge-noapta", { title: no.map((x) => `No apta para ${x.persona.nombre}: ${x.intolerancias.map((t) => t.corto).join(", ")}`).join(" · ") }, "⚠️ No apta para ", no.map((x) => x.persona.nombre).join(", ")) : null; })(),
      r._modificada ? h("span.marca-modificada", { title: "Has modificado esta receta" }, "✏️") : null
    );
  };

  /* Alérgenos e intolerancias de una receta, y personas del hogar para las que no es apta */
  const bloqueAlergenos = (r) => {
    const chip = (id, opcional) => { const t = Catalogo.intolerancia(id); const ings = Recetas.ingredientesCon(r, id, { opcionales: opcional }); return h("span.chip.chip-mini.chip-alergeno", { class: opcional ? "chip-alergeno-opc" : "", title: (opcional ? "Solo en ingredientes opcionales: " : "Por: ") + ings.join(", ") }, t.icono, " ", t.corto, opcional ? " (opcional)" : ""); };
    const no = Recetas.noAptaPara(r, hogarConIntol());
    const opcHogar = hogarConIntol().map((p) => ({ p, ids: (p.intolerancias || []).filter((id) => r.alergenosOpcionales.includes(id)) })).filter((x) => x.ids.length);
    return h("div.detalle-alergenos",
      h("span.detalle-alergenos-tit", r.alergenos.length || r.alergenosOpcionales.length ? "Contiene:" : "Sin alérgenos ni intolerancias habituales"),
      r.alergenos.map((id) => chip(id, false)), r.alergenosOpcionales.map((id) => chip(id, true)),
      no.map((x) => h("div.aviso.aviso-alerta.aviso-mini", `⚠️ No apta para ${x.persona.nombre}: lleva ${x.intolerancias.map((t) => `${Recetas.ingredientesCon(r, t.id).join(", ")} (${t.corto})`).join("; ")}.`)),
      opcHogar.map((x) => h("div.aviso.aviso-info.aviso-mini", `Para ${x.p.nombre}: prepárala sin ${x.ids.map((id) => Recetas.ingredientesCon(r, id, { opcionales: true }).join(", ")).join(", ")}, que es opcional.`))
    );
  };

  /* Enlace directo a una receta: #/recetas/<id> abre el recetario con su ficha */
  const enlaceReceta = (r) => location.origin + location.pathname + "#/recetas/" + encodeURIComponent(r.id);
  const compartirReceta = async (r) => {
    const url = enlaceReceta(r);
    if (r.origen === "propia" || r._modificada) UI.toast("Es una receta tuya o modificada: el enlace abre la versión original o solo funciona en este navegador. Para enviarla completa, usa «Copiar receta».", "info", 5000);
    if (navigator.share) {
      try { await navigator.share({ title: r.nombre, text: `${r.nombre} · HolaFresco`, url }); return; } catch (e) { if (e && e.name === "AbortError") return; }
    }
    const ok = await Compra.copiarAlPortapapeles(url);
    UI.toast(ok ? "Enlace a la receta copiado. Pégalo donde quieras." : "No se pudo copiar el enlace: " + url, ok ? "ok" : "error", 4000);
  };

  /* ---------- Detalle ---------- */
  const abrirDetalle = (id, opciones = {}) => {
    const r = Recetas.porId(id);
    if (!r) return UI.toast("No encuentro esa receta.", "error");
    let raciones = opciones.raciones || r.raciones || 2;
    const cat = Recetas.categoria(r.categoria);
    let m;

    const listaIng = h("ul.lista-ingredientes");
    const pintarIng = () => {
      UI.vaciar(listaIng);
      for (const ing of Compra.escalar(r, raciones)) {
        const q = ing.q == null ? null : Compra.redondear(ing.q, ing.u);
        listaIng.appendChild(h("li", h("label.ing-check", h("input", { type: "checkbox", "aria-label": `Tengo ${ing.n}` }), h("span.ing-cant", ing.u === "al gusto" || q == null ? "al gusto" : Compra.fmtCantidad(q, ing.u)), h("span.ing-nombre", ing.n, ing.opcional ? h("span.muted", " (opcional)") : null, ing.nota ? h("span.muted", ` · ${ing.nota}`) : null))));
      }
    };
    pintarIng();
    const numRaciones = h("span.raciones-num", { "aria-live": "polite" }, String(raciones).replace(".", ","));
    const stepper = h("div.stepper", { role: "group", "aria-label": "Raciones" },
      h("button.btn.btn-icono", { type: "button", "aria-label": "Menos raciones", onClick: () => { raciones = Math.max(0.5, raciones - 0.5); numRaciones.textContent = String(raciones).replace(".", ","); pintarIng(); } }, "−"),
      h("span.stepper-valor", numRaciones, h("span.muted", " ", UI.plural(raciones, "ración", "raciones"))),
      h("button.btn.btn-icono", { type: "button", "aria-label": "Más raciones", onClick: () => { raciones = Math.min(20, raciones + 0.5); numRaciones.textContent = String(raciones).replace(".", ","); pintarIng(); } }, "+")
    );

    const nut = r.nutricion || {};
    const coc = Recetas.cocina(r.cocina), con = Recetas.contundencia(r.contundencia), cos = Recetas.coste(r.coste);
    const cuerpo = h("div.detalle",
      h("div.detalle-cab",
        r.subtitulo ? h("p.detalle-sub", r.subtitulo) : null,
        h("div.detalle-chips", h("span.chip", cat.icono, " ", cat.nombre), badgeOrigen(r), coc ? h("span.chip", { title: "Tipo de cocina" }, coc.icono, " ", coc.nombre) : null, con ? h("span.chip", { title: con.desc }, con.icono, " ", con.nombre) : null, cos ? h("span.chip.chip-coste", { title: cos.desc }, cos.icono, " ", cos.nombre) : null, ...r.coccion.filter((c) => c !== r.categoria).map((c) => { const cc = Recetas.coccion(c); return h("span.chip", { title: cc.desc }, cc.icono, " ", cc.nombre); }), r.tupper ? h("span.chip.chip-tupper", { title: "Aguanta bien en tupper y se recalienta sin problema" }, "🥡 Para tupper") : null),
        h("div.detalle-meta",
          h("span", "⏱ ", r.tiempo, " min"), h("span", iconoDificultad(r.dificultad), " ", r.dificultad),
          h("span", r.momentos.map((mo) => Recetas.MOMENTOS.find((x) => x.id === mo)).filter(Boolean).map((mo) => mo.icono + " " + mo.nombre).join(" · ")),
          r.equipo.length ? h("span", "🍳 ", r.equipo.join(", ")) : null
        ),
        r.dieta.length || r.necesidades.length ? h("div.detalle-dietas", r.dieta.map((d) => { const dd = Recetas.dietaInfo(d); return dd ? h("span.chip.chip-mini.chip-dieta", { title: dd.desc || "" }, dd.icono, " ", dd.nombre) : null; }), r.necesidades.map((n) => { const nn = Recetas.NECESIDADES.find((x) => x.id === n); return h("span.chip.chip-mini.chip-necesidad", { title: nn.desc }, nn.icono, " ", nn.nombre); })) : null,
        bloqueAlergenos(r),
        r.enListaNegra ? h("div.aviso.aviso-alerta.aviso-mini", "🚫 Esta receta está excluida de los menús semanales: sigue en el recetario pero el asistente no la elegirá (salvo que la fijes como obligatoria).") : null
      ),
      h("div.detalle-cols",
        h("section.detalle-ing",
          h("div.detalle-sec-cab", h("h3", "Ingredientes"), stepper),
          listaIng
        ),
        h("section.detalle-pasos",
          h("h3", "Preparación"),
          h("ol.lista-pasos", r.pasos.map((p) => h("li", p))),
          window.Publicidad.bloque("receta"),
          r.consejo ? h("div.consejo", h("strong", "💡 Consejo del cocinero: "), r.consejo) : null
        )
      ),
      nut.kcal ? h("section.detalle-nut",
        h("h3", "Por ración ", h("span.muted", "(aproximado)")),
        h("div.nut-grid",
          h("div.nut-item", h("strong", nut.kcal), h("span", "kcal")),
          h("div.nut-item", h("strong", nut.prot, " g"), h("span", "proteína")),
          h("div.nut-item", h("strong", nut.hc, " g"), h("span", "hidratos")),
          h("div.nut-item", h("strong", nut.grasa, " g"), h("span", "grasa"))
        )
      ) : null,
      r.etiquetas.length ? h("div.detalle-etiquetas", r.etiquetas.map((e) => h("span.chip.chip-mini", "#", e))) : null
    );

    const btnFav = h("button.btn", { type: "button", class: r.favorita ? "btn-fav-activa" : "", "aria-pressed": r.favorita ? "true" : "false", onClick: () => { const ahora = Recetas.toggleFavorita(r.id); btnFav.textContent = ahora ? "★ Favorita" : "☆ Marcar favorita"; btnFav.classList.toggle("btn-fav-activa", ahora); btnFav.setAttribute("aria-pressed", ahora ? "true" : "false"); UI.toast(ahora ? "★ Favorita: saldrá más a menudo en tus menús." : "Quitada de favoritas.", "info", 1800); } }, r.favorita ? "★ Favorita" : "☆ Marcar favorita");
    const btnNegra = h("button.btn", { type: "button", title: "Sigue en el recetario, pero el asistente no la elegirá para los menús", "aria-pressed": r.enListaNegra ? "true" : "false", onClick: () => { const ahora = Recetas.toggleListaNegra(r.id); btnNegra.textContent = ahora ? "✅ Volver a usar en menús" : "🚫 No usar en menús"; btnNegra.setAttribute("aria-pressed", ahora ? "true" : "false"); UI.toast(ahora ? "Excluida de los menús semanales. Sigue en tu recetario." : "Vuelve a estar disponible para los menús.", "info", 2200); } }, r.enListaNegra ? "✅ Volver a usar en menús" : "🚫 No usar en menús");

    const pie = [];
    if (opciones.accionExtra) pie.push(opciones.accionExtra(() => m.cerrar()));
    pie.push(btnFav, btnNegra, h("button.btn", { type: "button", title: "Copia la receta en formato Markdown (con las raciones que estás viendo) para pegarla en notas, documentos o mensajes", onClick: () => Recetas.copiarMarkdown(r.id, raciones) }, "📋 Copiar receta"));
    pie.push(h("div.espaciador"));
    const masAcciones = h("details.menu-mas", h("summary.btn", "⋯ Más"), h("div.menu-mas-lista",
      h("button.btn.btn-suave", { type: "button", onClick: () => { m.cerrar(); abrirEditor(r.id); } }, "✏️ Editar"),
      h("button.btn.btn-suave", { type: "button", onClick: () => { const nid = Recetas.duplicar(r.id); m.cerrar(); UI.toast("Copia creada. Ya puedes editarla."); abrirEditor(nid); } }, "⧉ Duplicar"),
      Recetas.esSemilla(r.id) && r._modificada ? h("button.btn.btn-suave", { type: "button", onClick: async () => { if (await UI.confirmar({ titulo: "Restaurar receta original", mensaje: "Se perderán tus cambios en esta receta y volverá a la versión original." })) { Recetas.restaurar(r.id); m.cerrar(); UI.toast("Receta restaurada"); } } }, "↺ Restaurar original") : null,
      h("button.btn.btn-suave.btn-peligro-suave", { type: "button", onClick: async () => { if (await UI.confirmar({ titulo: "Ocultar receta", mensaje: `¿Ocultar «${r.nombre}» de tu recetario? ${Recetas.esSemilla(r.id) ? "No se borra del programa: podrás recuperarla desde Ajustes → Recetas ocultas." : "Es una receta tuya: se eliminará de este navegador."}`, textoOk: "Ocultar", peligro: true })) { Recetas.borrar(r.id); m.cerrar(); UI.toast("Receta ocultada"); } } }, "🙈 Ocultar del recetario")
    ));
    pie.push(masAcciones);
    pie.push(h("button.btn.btn-primario", { type: "button", title: "Comparte un enlace que abre esta receta en HolaFresco", onClick: () => compartirReceta(r) }, "🔗 Compartir"));

    m = UI.modal({ titulo: r.nombre, ancho: "xl", contenido: cuerpo, pie, claseExtra: "modal-receta", alCerrar: opciones.alCerrar });
    return m;
  };

  /* ---------- Editor ---------- */
  const abrirEditor = (id, alGuardar) => {
    const base = id ? Recetas.porId(id) : null;
    const r = base ? JSON.parse(JSON.stringify(base)) : { nombre: "", subtitulo: "", categoria: "carnes", cocina: "", momentos: ["comida", "cena"], proteina: "pollo", tiempo: 30, dificultad: "fácil", equipo: [], raciones: 2, ingredientes: [{ n: "", q: "", u: "g" }], pasos: [""], nutricion: { kcal: "", prot: "", hc: "", grasa: "" }, etiquetas: [], consejo: "", contundencia: "", coste: "" };
    // si los atributos venían derivados automáticamente, dejamos el selector en "auto"
    if (base && !(base._contundenciaManual || (window.RECETAS_SEED || []).some((s) => s.id === base.id && s.contundencia))) { /* se mantiene el valor actual */ }
    let m;
    const ingCont = h("div.editor-ingredientes");
    const unidades = Object.keys(Catalogo.UNIDADES);
    const datalist = h("datalist#dl-ingredientes", Recetas.indiceIngredientes().slice(0, 500).map((i) => h("option", { value: i.n })));

    const filaIng = (ing, idx) => {
      const fila = h("div.fila-ing");
      const inN = h("input.input", { type: "text", value: ing.n || "", placeholder: "ingrediente", list: "dl-ingredientes", "aria-label": "Ingrediente", onInput: (e) => { ing.n = e.target.value; } });
      const inQ = h("input.input.input-corto", { type: "number", step: "any", min: 0, value: ing.q == null ? "" : ing.q, placeholder: "cant.", "aria-label": "Cantidad", disabled: ing.u === "al gusto", onInput: (e) => { ing.q = e.target.value === "" ? null : Number(e.target.value); } });
      const selU = h("select.input.input-corto", { "aria-label": "Unidad", onChange: (e) => { ing.u = e.target.value; inQ.disabled = ing.u === "al gusto"; if (inQ.disabled) { ing.q = null; inQ.value = ""; } } }, unidades.map((u) => h("option", { value: u, selected: u === (ing.u || "g") }, u)));
      const chkOpc = h("label.check-inline", { title: "Opcional" }, h("input", { type: "checkbox", checked: !!ing.opcional, onChange: (e) => { ing.opcional = e.target.checked; } }), "opc.");
      UI.append(fila, h("span.fila-ing-num", String(idx + 1)), inN, inQ, selU, chkOpc, h("button.btn.btn-icono", { type: "button", "aria-label": "Quitar ingrediente", onClick: () => { r.ingredientes.splice(r.ingredientes.indexOf(ing), 1); pintarIng(); } }, "✕"));
      return fila;
    };
    const pintarIng = () => { UI.vaciar(ingCont); r.ingredientes.forEach((ing, i) => ingCont.appendChild(filaIng(ing, i))); };
    pintarIng();

    const pasosTA = h("textarea.input.textarea", { rows: 8, placeholder: "Un paso por línea…", "aria-label": "Pasos" }, (r.pasos || []).join("\n"));
    const etiquetasIn = h("input.input", { type: "text", value: (r.etiquetas || []).join(", "), placeholder: "rápida, al horno, batch cooking…" });
    const campoNum = (clave, etiqueta) => UI.campo(etiqueta, h("input.input.input-corto", { type: "number", min: 0, value: r.nutricion[clave] == null ? "" : r.nutricion[clave], onInput: (e) => { r.nutricion[clave] = e.target.value === "" ? "" : Number(e.target.value); } }));

    const chkGrupo = (lista, claveArray, nombre) => h("div.chips-check", { role: "group", "aria-label": nombre }, lista.map((x) => {
      const id = typeof x === "string" ? x : x.id;
      const nom = typeof x === "string" ? x : (x.icono ? x.icono + " " : "") + x.nombre;
      return h("label.chip.chip-check", h("input", { type: "checkbox", "aria-label": typeof x === "string" ? x : x.nombre, checked: (r[claveArray] || []).includes(id), onChange: (e) => { r[claveArray] = r[claveArray] || []; if (e.target.checked) { if (!r[claveArray].includes(id)) r[claveArray].push(id); } else r[claveArray] = r[claveArray].filter((v) => v !== id); } }), nom);
    }));

    const form = h("form.form-receta", { onSubmit: (e) => { e.preventDefault(); enviar(); } },
      datalist,
      h("div.fila-campos",
        UI.campo("Nombre", h("input.input", { type: "text", value: r.nombre, required: true, placeholder: "Nombre del plato", onInput: (e) => { r.nombre = e.target.value; } })),
        UI.campo("Subtítulo (opcional)", h("input.input", { type: "text", value: r.subtitulo || "", placeholder: "con…", onInput: (e) => { r.subtitulo = e.target.value; } }))
      ),
      h("div.fila-campos.fila-3",
        UI.campo("Categoría", h("select.input", { onChange: (e) => { r.categoria = e.target.value; } }, Recetas.CATEGORIAS.map((c) => h("option", { value: c.id, selected: c.id === r.categoria }, c.icono + " " + c.nombre)))),
        UI.campo("Tipo de cocina", h("select.input", { onChange: (e) => { r.cocina = e.target.value || null; } }, h("option", { value: "", selected: !r.cocina }, "Sin especificar"), Recetas.COCINAS.map((c) => h("option", { value: c.id, selected: c.id === r.cocina }, c.icono + " " + c.nombre)))),
        UI.campo("Proteína principal", h("select.input", { onChange: (e) => { r.proteina = e.target.value; } }, Recetas.PROTEINAS.map((p) => h("option", { value: p, selected: p === r.proteina }, p))))
      ),
      h("div.fila-campos.fila-3",
        UI.campo("Contundencia", h("select.input", { onChange: (e) => { r.contundencia = e.target.value; } }, h("option", { value: "", selected: !r.contundencia }, "Automática (según kcal)"), Recetas.CONTUNDENCIAS.map((c) => h("option", { value: c.id, selected: c.id === r.contundencia }, c.icono + " " + c.nombre + " · " + c.desc)))),
        UI.campo("Coste", h("select.input", { onChange: (e) => { r.coste = e.target.value; } }, h("option", { value: "", selected: !r.coste }, "Automático (según ingredientes)"), Recetas.COSTES.map((c) => h("option", { value: c.id, selected: c.id === r.coste }, c.icono + " " + c.nombre)))),
        UI.campo("Dificultad", h("select.input", { onChange: (e) => { r.dificultad = e.target.value; } }, Recetas.DIFICULTADES.map((d) => h("option", { value: d, selected: d === r.dificultad }, d))))
      ),
      h("div.fila-campos.fila-3",
        UI.campo("Tiempo total (min)", h("input.input.input-corto", { type: "number", min: 1, value: r.tiempo, onInput: (e) => { r.tiempo = Number(e.target.value) || 0; } })),
        UI.campo("Raciones de la receta", h("input.input.input-corto", { type: "number", min: 1, step: "0.5", value: r.raciones || 2, onInput: (e) => { r.raciones = Number(e.target.value) || 2; } }), "Las cantidades de abajo son para este número de raciones."),
        h("div.campo", h("span.campo-etiqueta", "Encaja en"), chkGrupo(Recetas.MOMENTOS, "momentos", "Momentos"))
      ),
      h("div.campo", h("span.campo-etiqueta", "Equipo necesario"), chkGrupo(["horno", "olla-express", "sartén", "cazuela", "batidora", "wok", "plancha", "bol", "airfryer", "microondas", "slow-cooker"], "equipo", "Equipo")),
      h("div.fila-campos",
        h("div.campo", h("span.campo-etiqueta", "Forma de cocinar ", h("span.muted", "(se deduce del equipo; marca para fijarla)")), h("div.chips-check", { role: "group", "aria-label": "Forma de cocinar" }, Recetas.COCCIONES.map((c) => h("label.chip.chip-check", { title: c.desc }, h("input", { type: "checkbox", "aria-label": c.nombre, checked: (r.coccion || []).includes(c.id), onChange: (e) => { r._coccionManual = true; r.coccion = (r.coccion || []).filter((x) => x !== c.id); if (e.target.checked) r.coccion.push(c.id); } }), c.icono, " ", c.nombre)))),
        UI.campo("🥡 ¿Va bien en tupper?", h("select.input", { onChange: (e) => { r._tupper = e.target.value; } }, [["auto", "Automático"], ["si", "Sí, aguanta y se recalienta bien"], ["no", "No, mejor al momento"]].map(([v, t]) => h("option", { value: v, selected: v === "auto" }, t))))
      ),
      h("div.campo",
        h("span.campo-etiqueta", "Ingredientes ", h("span.muted", "(nombre · cantidad · unidad)")),
        ingCont,
        h("button.btn.btn-suave", { type: "button", onClick: () => { r.ingredientes.push({ n: "", q: "", u: "g" }); pintarIng(); const ult = ingCont.querySelector(".fila-ing:last-child input"); ult && ult.focus(); } }, "+ Añadir ingrediente"),
        h("span.campo-ayuda", "Usa nombres sencillos y en singular (cebolla, pollo (pechuga), garbanzos cocidos) para que la lista de la compra los agrupe bien. Sal, pimienta y aceite: marca la unidad «al gusto».")
      ),
      h("div.campo", h("span.campo-etiqueta", "Preparación ", h("span.muted", "(un paso por línea)")), pasosTA),
      h("div.campo", h("span.campo-etiqueta", "Valores por ración (aprox.)"), h("div.fila-campos.fila-4", campoNum("kcal", "kcal"), campoNum("prot", "Proteína (g)"), campoNum("hc", "Hidratos (g)"), campoNum("grasa", "Grasa (g)"))),
      UI.campo("Etiquetas (separadas por comas)", etiquetasIn),
      UI.campo("Consejo del cocinero (opcional)", h("textarea.input.textarea", { rows: 2, onInput: (e) => { r.consejo = e.target.value; } }, r.consejo || ""))
    );

    const enviar = () => {
      if (!r.nombre.trim()) { UI.toast("La receta necesita un nombre.", "error"); form.querySelector("input").focus(); return; }
      r.pasos = pasosTA.value.split("\n").map((s) => s.trim()).filter(Boolean);
      r.etiquetas = etiquetasIn.value.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      r.ingredientes = r.ingredientes.filter((i) => i.n && i.n.trim()).map((i) => ({ ...i, n: i.n.trim(), q: i.u === "al gusto" ? undefined : (i.q === "" || i.q == null ? undefined : Number(i.q)) }));
      if (!r.ingredientes.length) { UI.toast("Añade al menos un ingrediente.", "error"); return; }
      if (!r.pasos.length) { UI.toast("Describe al menos un paso.", "error"); pasosTA.focus(); return; }
      if (!r.momentos || !r.momentos.length) r.momentos = ["comida", "cena"];
      for (const k of ["kcal", "prot", "hc", "grasa"]) if (r.nutricion[k] === "") delete r.nutricion[k];
      if (!r.cocina) delete r.cocina;
      if (!r.contundencia) delete r.contundencia;
      if (!r.coste) delete r.coste;
      const nid = Recetas.guardar(r);
      m.cerrar();
      UI.toast(id ? "Receta guardada" : "Receta añadida a tu base de datos");
      alGuardar && alGuardar(nid);
    };

    m = UI.modal({ titulo: id ? "Editar receta" : "Nueva receta", ancho: "xl", contenido: form, pie: [h("button.btn", { type: "button", onClick: () => m.cerrar() }, "Cancelar"), h("button.btn.btn-primario", { type: "button", onClick: enviar }, "Guardar receta")] });
  };

  /* ---------- Listado ---------- */
  const render = (cont, params = {}) => {
    UI.vaciar(cont);
    const grid = h("div.grid-recetas");
    const contador = h("p.contador", { "aria-live": "polite" });
    let mostrados = LOTE;
    let listaActual = [];

    const toggleEn = (arr, v) => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); };
    const grupoChips = (lista, clave, extraClase) => {
      const cont = h("div.filtro-chips", { role: "group", "aria-label": clave });
      const pintar = () => { UI.vaciar(cont); for (const c of lista) cont.appendChild(h("button.chip.chip-btn", { type: "button", title: c.desc || "", "aria-pressed": estado[clave].includes(c.id) ? "true" : "false", class: (estado[clave].includes(c.id) ? "activo " : "") + (extraClase ? extraClase(c) : ""), onClick: () => { toggleEn(estado[clave], c.id); actualizar(); } }, c.icono ? c.icono + " " : "", c.nombre)); };
      return { cont, pintar };
    };
    const chipsCat = grupoChips(Recetas.CATEGORIAS.filter((c) => c.id !== "olla-express"), "categoria"); // la olla exprés se filtra en «Cocción»
    const chipsOrigen = grupoChips(Object.values(Recetas.ORIGENES), "origen", (o) => "badge-" + o.id);
    // Dieta: una sola (excluyente)
    const chipsDieta = { cont: h("div.filtro-chips", { role: "radiogroup", "aria-label": "Dieta" }), pintar() { UI.vaciar(this.cont); for (const d of Recetas.DIETAS) this.cont.appendChild(h("button.chip.chip-btn", { type: "button", role: "radio", title: d.desc || "", "aria-checked": estado.dieta === d.id ? "true" : "false", class: estado.dieta === d.id ? "activo" : "", onClick: () => { estado.dieta = d.id; actualizar(); } }, d.icono + " ", d.nombre)); } };
    const chipsNecesidades = grupoChips(Recetas.NECESIDADES, "necesidades");
    const chipsCocina = grupoChips(Recetas.COCINAS, "cocina");
    const chipsCont = grupoChips(Recetas.CONTUNDENCIAS, "contundencia");
    const chipsCoste = grupoChips(Recetas.COSTES, "coste");
    const chipsCoccion = grupoChips(Recetas.COCCIONES, "coccion");
    const chipsAlergenos = grupoChips(Catalogo.INTOLERANCIAS.map((t) => ({ id: t.id, icono: t.icono, nombre: "Sin " + t.corto, desc: "Oculta las recetas que lleven " + t.corto + " (salvo como ingrediente opcional)" })), "sinAlergenos");
    const nombresHogar = hogarConIntol().map((p) => p.nombre);
    const chkHogar = nombresHogar.length ? h("label.chip.chip-check", { title: "Solo recetas sin las intolerancias de " + Recetas.listaNombres(nombresHogar) }, h("input", { type: "checkbox", "aria-label": "Aptas para todo mi hogar", checked: estado.aptaHogar, onChange: (e) => { estado.aptaHogar = e.target.checked; actualizar(); } }), "🏠 Aptas para todo mi hogar") : null;
    const chkTupper = h("label.chip.chip-check", h("input", { type: "checkbox", "aria-label": "Solo para tupper", checked: estado.tupper, onChange: (e) => { estado.tupper = e.target.checked; actualizar(); } }), "🥡 Para tupper");

    const inputQ = h("input.input.input-buscar", { type: "search", value: estado.q, placeholder: "Buscar por nombre, ingrediente, cocina o etiqueta…", "aria-label": "Buscar recetas", onInput: UI.debounce((e) => { estado.q = e.target.value; actualizar(); }, 150) });
    const selMomento = h("select.input", { "aria-label": "Momento", onChange: (e) => { estado.momento = e.target.value; actualizar(); } }, h("option", { value: "" }, "Comida o cena"), Recetas.MOMENTOS.map((mo) => h("option", { value: mo.id, selected: estado.momento === mo.id }, mo.icono + " Para " + mo.nombre.toLowerCase())));
    const selTiempo = h("select.input", { "aria-label": "Tiempo máximo", onChange: (e) => { estado.tiempoMax = Number(e.target.value); actualizar(); } }, [[0, "Cualquier tiempo"], [20, "≤ 20 min"], [30, "≤ 30 min"], [45, "≤ 45 min"], [60, "≤ 60 min"], [90, "≤ 90 min"]].map(([v, t]) => h("option", { value: v, selected: estado.tiempoMax === v }, t)));
    const selOrden = h("select.input", { "aria-label": "Ordenar", onChange: (e) => { estado.orden = e.target.value; actualizar(); } }, [["nombre", "Ordenar: nombre"], ["favoritas", "Ordenar: favoritas primero"], ["tiempo", "Ordenar: más rápidas"], ["kcal", "Ordenar: más ligeras"], ["prot", "Ordenar: más proteína"], ["categoria", "Ordenar: categoría"], ["recientes", "Ordenar: más nuevas"]].map(([v, t]) => h("option", { value: v, selected: estado.orden === v }, t)));
    const chkFav = h("label.chip.chip-check", h("input", { type: "checkbox", "aria-label": "Solo favoritas", checked: estado.soloFavoritas, onChange: (e) => { estado.soloFavoritas = e.target.checked; actualizar(); } }), "★ Solo favoritas");
    const selNegra = h("select.input", { "aria-label": "Excluidas de menús", onChange: (e) => { estado.listaNegra = e.target.value; actualizar(); } }, [["", "Mostrar todas"], ["ocultar", "Ocultar excluidas de menús"], ["solo", "Solo excluidas de menús 🚫"]].map(([v, t]) => h("option", { value: v, selected: estado.listaNegra === v }, t)));
    const btnLimpiar = h("button.btn.btn-suave", { type: "button", onClick: () => { Object.assign(estado, JSON.parse(JSON.stringify({ ...FILTROS_DEFECTO, orden: estado.orden }))); inputQ.value = ""; selMomento.value = ""; selTiempo.value = "0"; selNegra.value = ""; chkFav.querySelector("input").checked = false; chkTupper.querySelector("input").checked = false; if (chkHogar) chkHogar.querySelector("input").checked = false; actualizar(); } }, "Limpiar filtros");

    const filtrosAvanzados = h("details.filtros-avanzados", { open: !!(estado.origen.length || estado.dieta !== "toda" || estado.necesidades.length || estado.cocina.length || estado.contundencia.length || estado.coste.length || estado.coccion.length || estado.sinAlergenos.length || estado.aptaHogar || estado.tupper || estado.soloFavoritas || estado.listaNegra) }, h("summary", "Más filtros"), h("div.filtros-avanzados-cuerpo",
      h("div.filtro-grupo", h("span.filtro-titulo", "Cocina"), chipsCocina.cont),
      h("div.filtro-grupo", h("span.filtro-titulo", "Contundencia"), chipsCont.cont),
      h("div.filtro-grupo", h("span.filtro-titulo", "Coste"), chipsCoste.cont),
      h("div.filtro-grupo", h("span.filtro-titulo", "Cocción"), chipsCoccion.cont, chkTupper),
      h("div.filtro-grupo", h("span.filtro-titulo", "Dieta"), chipsDieta.cont),
      h("div.filtro-grupo", h("span.filtro-titulo", "Necesidades"), chipsNecesidades.cont),
      h("div.filtro-grupo", h("span.filtro-titulo", "Intolerancias"), chipsAlergenos.cont, chkHogar),
      h("div.filtro-grupo", h("span.filtro-titulo", "Origen"), chipsOrigen.cont),
      h("div.filtro-grupo.filtro-selects", chkFav, selMomento, selTiempo, selNegra, selOrden)));

    const sentinela = h("div.sentinela");
    const btnMas = h("button.btn.cargar-mas", { type: "button", onClick: () => { mostrados += LOTE; pintarGrid(); } });

    const pintarGrid = () => {
      UI.vaciar(grid);
      if (!listaActual.length) { grid.appendChild(h("div.vacio", h("p", "No hay recetas con esos filtros."), h("button.btn", { type: "button", onClick: () => btnLimpiar.click() }, "Quitar filtros"))); btnMas.style.display = "none"; return; }
      const frag = document.createDocumentFragment();
      for (const r of listaActual.slice(0, mostrados)) frag.appendChild(tarjeta(r));
      grid.appendChild(frag);
      const restan = listaActual.length - mostrados;
      btnMas.style.display = restan > 0 ? "" : "none";
      btnMas.textContent = restan > 0 ? `Mostrar ${Math.min(LOTE, restan)} más (${restan} restantes)` : "";
    };

    const actualizar = () => {
      guardarEstado();
      [chipsCat, chipsOrigen, chipsDieta, chipsNecesidades, chipsCocina, chipsCont, chipsCoste, chipsCoccion, chipsAlergenos].forEach((g) => g.pintar());
      const sinAlergenos = [...new Set([...estado.sinAlergenos, ...(estado.aptaHogar ? intolHogarIds() : [])])];
      let lista = Recetas.filtrar({ q: estado.q, categoria: estado.categoria, origen: estado.origen, momento: estado.momento, dieta: estado.dieta, necesidades: estado.necesidades, cocina: estado.cocina, contundencia: estado.contundencia, coste: estado.coste, coccion: estado.coccion, sinAlergenos, tupper: estado.tupper, tiempoMax: estado.tiempoMax, soloFavoritas: estado.soloFavoritas, listaNegra: estado.listaNegra });
      const ord = estado.orden;
      const porNombre = (a, b) => a.nombre.localeCompare(b.nombre, "es");
      lista.sort((a, b) => ord === "tiempo" ? a.tiempo - b.tiempo || porNombre(a, b) : ord === "kcal" ? (a.nutricion.kcal || 0) - (b.nutricion.kcal || 0) : ord === "prot" ? (b.nutricion.prot || 0) - (a.nutricion.prot || 0) : ord === "categoria" ? a.categoria.localeCompare(b.categoria) || porNombre(a, b) : ord === "favoritas" ? (b.favorita - a.favorita) || porNombre(a, b) : ord === "recientes" ? b.id.localeCompare(a.id) : porNombre(a, b));
      listaActual = lista;
      const total = Recetas.todas().length;
      const hayFiltros = estado.q || estado.categoria.length || estado.origen.length || estado.momento || estado.dieta !== "toda" || estado.necesidades.length || estado.cocina.length || estado.contundencia.length || estado.coste.length || estado.coccion.length || sinAlergenos.length || estado.tupper || estado.tiempoMax || estado.soloFavoritas || estado.listaNegra;
      contador.textContent = hayFiltros ? `${lista.length} de ${total} recetas` : `${total} recetas`;
      btnLimpiar.style.display = hayFiltros ? "" : "none";
      pintarGrid();
    };

    const porOrigen = {};
    for (const r of Recetas.todas()) porOrigen[r.origen] = (porOrigen[r.origen] || 0) + 1;
    const nFav = Recetas.todas().filter((r) => r.favorita).length;

    UI.append(cont,
      h("header.vista-cab",
        h("div", h("h1", "🍳 Recetas"), h("p.vista-desc", `${(porOrigen.recetario || 0).toLocaleString("es-ES")} originales · ${(porOrigen.inventada || 0).toLocaleString("es-ES")} derivadas${porOrigen.propia ? ` · ${porOrigen.propia} tuyas` : ""}${nFav ? ` · ★ ${nFav} favoritas` : ""}`)),
        h("button.btn.btn-primario", { type: "button", onClick: () => abrirEditor(null) }, "+ Nueva receta")
      ),
      h("div.barra-filtros",
        h("div.fila-busqueda", inputQ, btnLimpiar),
        h("div.filtro-grupo", chipsCat.cont),
        filtrosAvanzados,
        contador
      ),
      window.Publicidad.bloque("recetas"),
      grid,
      h("div.cargar-mas-cont", btnMas, sentinela)
    );
    actualizar();
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting) && btnMas.style.display !== "none" && cont.isConnected) { mostrados += LOTE; pintarGrid(); } }, { rootMargin: "400px" });
      io.observe(sentinela);
    }
    const onCambio = () => { if (cont.isConnected) actualizar(); else { document.removeEventListener("recetas:cambio", onCambio); document.removeEventListener("recetas:marcas", onCambio); } };
    document.addEventListener("recetas:cambio", onCambio);
    document.addEventListener("recetas:marcas", onCambio);
    // Enlace compartido: abre la ficha y, al cerrarla, deja la dirección en #/recetas sin recargar la lista
    if (params.id) {
      if (Recetas.porId(params.id)) setTimeout(() => abrirDetalle(params.id, { alCerrar: () => { if (location.hash.startsWith("#/recetas/")) history.replaceState(null, "", "#/recetas"); } }), 0);
      else { UI.toast("Esa receta no está en este recetario.", "error"); history.replaceState(null, "", "#/recetas"); }
    }
    const onPersonas = () => { if (cont.isConnected) actualizar(); else document.removeEventListener("personas:cambio", onPersonas); };
    document.addEventListener("personas:cambio", onPersonas);
  };

  window.Vistas = window.Vistas || {};
  window.Vistas.recetas = { render, abrirDetalle, abrirEditor, tarjeta, badgeOrigen };
})();
