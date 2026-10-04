/* Personas del hogar: CRUD y diálogo diseñado con criterio de nutricionista
   (lenguaje amable, datos opcionales, sin juicios, foco en el objetivo de la persona). */
(function () {
  "use strict";
  const { DB, UI, Nutricion, Catalogo } = window;
  const { h, campo, segmentado } = UI;

  const todas = () => DB.leer("personas", []);
  const porId = (id) => todas().find((p) => p.id === id) || null;
  const guardar = (p) => {
    const lista = todas();
    if (!p.id) p.id = DB.uid("per");
    const i = lista.findIndex((x) => x.id === p.id);
    if (i >= 0) lista[i] = p; else lista.push(p);
    DB.guardar("personas", lista);
    document.dispatchEvent(new CustomEvent("personas:cambio"));
    return p.id;
  };
  const borrar = (id) => { DB.guardar("personas", todas().filter((p) => p.id !== id)); document.dispatchEvent(new CustomEvent("personas:cambio")); };

  const EMOJIS = ["🙂", "😊", "😎", "🤗", "🧑‍🍳", "🦊", "🐱", "🐼", "🐧", "🌻", "🍀", "⭐"];
  const avatar = (p) => p.avatar || EMOJIS[(p.nombre || "").length % EMOJIS.length];

  /* Diálogo de alta/edición */
  const editor = (persona, alGuardar) => {
    const p = JSON.parse(JSON.stringify(persona || { nombre: "", sexo: "mujer", edad: "", peso: "", altura: "", actividad: "ligera", objetivos: ["mantener"], intolerancias: [], avatar: "" }));
    if (!Array.isArray(p.intolerancias)) p.intolerancias = [];
    let m;

    const previa = h("div.persona-previa", { "aria-live": "polite" });
    const pintarPrevia = () => {
      UI.vaciar(previa);
      const { kcal, factor } = Nutricion.necesidades(p);
      UI.append(previa, 
        h("div.previa-kcal", h("strong", `≈ ${kcal.toLocaleString("es-ES")} kcal/día`), h("span.muted", " orientativas")),
        h("div.previa-racion", h("span.racion-barra", h("span.racion-relleno", { style: { width: Math.min(100, factor * 60) + "%" } })), h("span", `Ración ${factor.toLocaleString("es-ES", { maximumFractionDigits: 2 })}× `, h("span.muted", factor < 0.85 ? "(un poco más pequeña)" : factor > 1.15 ? "(generosa)" : "(estándar)"))),
        h("p.campo-ayuda", "Solo usamos estos datos para ajustar las cantidades de la lista de la compra. No es un diagnóstico ni una dieta: si tienes una condición médica o un embarazo, consulta con un profesional.")
      );
    };

    const inputNombre = h("input.input", { type: "text", value: p.nombre, placeholder: "Ej. Marta", required: true, maxlength: 30, autocomplete: "off", onInput: (e) => { p.nombre = e.target.value; } });
    const inputEdad = h("input.input.input-corto", { type: "number", min: 1, max: 110, inputmode: "numeric", value: p.edad, placeholder: "35", onInput: (e) => { p.edad = e.target.value; pintarPrevia(); } });
    const inputPeso = h("input.input.input-corto", { type: "number", min: 20, max: 250, step: "0.5", inputmode: "decimal", value: p.peso, placeholder: "—", onInput: (e) => { p.peso = e.target.value; pintarPrevia(); } });
    const inputAltura = h("input.input.input-corto", { type: "number", min: 100, max: 230, inputmode: "numeric", value: p.altura, placeholder: "—", onInput: (e) => { p.altura = e.target.value; pintarPrevia(); } });

    const avatares = h("div.avatares", { role: "radiogroup", "aria-label": "Icono" });
    const pintarAvatares = () => {
      UI.vaciar(avatares);
      for (const e of EMOJIS) avatares.appendChild(h("button.avatar-opcion", { type: "button", role: "radio", "aria-checked": (p.avatar || avatar(p)) === e ? "true" : "false", class: (p.avatar || avatar(p)) === e ? "activo" : "", onClick: () => { p.avatar = e; pintarAvatares(); } }, e));
    };
    pintarAvatares();

    const objetivos = h("div.objetivos", { role: "group", "aria-label": "Objetivos" });
    const pintarObjetivos = () => {
      UI.vaciar(objetivos);
      for (const o of Nutricion.OBJETIVOS) {
        const activo = (p.objetivos || []).includes(o.id);
        objetivos.appendChild(h("button.objetivo", { type: "button", "aria-label": o.nombre, "aria-pressed": activo ? "true" : "false", class: activo ? "activo" : "", onClick: () => {
          p.objetivos = p.objetivos || [];
          if (activo) p.objetivos = p.objetivos.filter((x) => x !== o.id);
          else if (o.id === "mantener") p.objetivos = ["mantener"]; // "mantener" es excluyente con el resto
          else { p.objetivos = p.objetivos.filter((x) => x !== "mantener"); p.objetivos.push(o.id); }
          if (p.objetivos.includes("perder-peso") && p.objetivos.includes("ganar-musculo")) UI.toast("Perder peso y ganar músculo a la vez es posible, pero iremos a raciones intermedias.", "info");
          pintarObjetivos(); pintarPrevia();
        } }, h("span.objetivo-icono", o.icono), h("span.objetivo-texto", h("strong", o.nombre), h("small", o.desc))));
      }
    };
    pintarObjetivos();
    pintarPrevia();

    /* Intolerancias y alergias: se aplican como vetos en todos los menús en los que esté esta persona */
    const resumenIntol = h("p.campo-ayuda", { "aria-live": "polite" });
    const pintarResumenIntol = () => {
      const total = window.Recetas ? window.Recetas.todas().length : 0;
      const aptas = window.Recetas && p.intolerancias.length ? window.Recetas.filtrar({ sinAlergenos: p.intolerancias }).length : total;
      resumenIntol.textContent = p.intolerancias.length
        ? `Los menús en los que esté esta persona evitarán estos ingredientes (${aptas.toLocaleString("es-ES")} de ${total.toLocaleString("es-ES")} recetas son aptas). Si fijas a mano una receta que los lleve, se mantendrá, pero te avisaremos.`
        : "Marca lo que esta persona no puede o no debe comer. Se tendrá en cuenta al crear menús y en el buscador de recetas.";
    };
    const intolerancias = h("div.chips-check", { role: "group", "aria-label": "Intolerancias y alergias" }, Catalogo.INTOLERANCIAS.map((t) =>
      h("label.chip.chip-check", { title: "Evita: " + t.grupos.flatMap((g) => (Catalogo.GRUPOS.find((x) => x.id === g) || {}).claves || []).slice(0, 8).join(", ").replace(/\*/g, "") + "…" },
        h("input", { type: "checkbox", "aria-label": t.nombre, checked: p.intolerancias.includes(t.id), onChange: (e) => { p.intolerancias = e.target.checked ? [...new Set([...p.intolerancias, t.id])] : p.intolerancias.filter((x) => x !== t.id); pintarResumenIntol(); } }), t.icono, " ", t.nombre)));
    pintarResumenIntol();

    const form = h("form.form-persona", { onSubmit: (e) => { e.preventDefault(); enviar(); } },
      h("div.fila-campos",
        campo("Nombre o apodo", inputNombre),
        h("div.campo", h("span.campo-etiqueta", "Icono"), avatares)
      ),
      h("div.campo", h("span.campo-etiqueta", "Sexo"), segmentado({ opciones: Nutricion.SEXOS, valor: p.sexo, ariaLabel: "Sexo", alCambiar: (v) => { p.sexo = v; pintarPrevia(); } }), h("span.campo-ayuda", "Lo usamos solo para la fórmula de gasto energético.")),
      h("div.fila-campos.fila-3",
        campo("Edad", h("div.input-con-unidad", inputEdad, h("span", "años"))),
        campo("Peso (opcional)", h("div.input-con-unidad", inputPeso, h("span", "kg"))),
        campo("Altura (opcional)", h("div.input-con-unidad", inputAltura, h("span", "cm")))
      ),
      h("div.campo", h("span.campo-etiqueta", "Nivel de actividad"), segmentado({ opciones: Nutricion.ACTIVIDADES, valor: p.actividad, ariaLabel: "Nivel de actividad", alCambiar: (v) => { p.actividad = v; pintarPrevia(); } })),
      h("div.campo", h("span.campo-etiqueta", "¿Qué te gustaría conseguir? ", h("span.muted", "(puedes marcar varios)")), objetivos),
      h("div.campo", h("span.campo-etiqueta", "Intolerancias y alergias ", h("span.muted", "(opcional)")), intolerancias, resumenIntol),
      previa
    );

    const enviar = () => {
      if (!p.nombre.trim()) { inputNombre.focus(); inputNombre.setCustomValidity("Ponle un nombre para reconocerla en el menú."); inputNombre.reportValidity(); return; }
      if (!p.objetivos || !p.objetivos.length) p.objetivos = ["mantener"];
      p.nombre = p.nombre.trim();
      p.edad = p.edad ? Number(p.edad) : "";
      p.peso = p.peso ? Number(p.peso) : "";
      p.altura = p.altura ? Number(p.altura) : "";
      const id = guardar(p);
      m.cerrar();
      UI.toast(persona && persona.id ? `Datos de ${p.nombre} actualizados` : `${p.nombre} ya forma parte del hogar`);
      alGuardar && alGuardar(id);
    };
    inputNombre.addEventListener("input", () => inputNombre.setCustomValidity(""));

    m = UI.modal({
      titulo: persona && persona.id ? `Editar a ${persona.nombre}` : "Añadir una persona",
      ancho: "lg",
      contenido: form,
      pie: [h("button.btn", { type: "button", onClick: () => m.cerrar() }, "Cancelar"), h("button.btn.btn-primario", { type: "button", onClick: enviar }, persona && persona.id ? "Guardar cambios" : "Añadir")],
    });
    return m;
  };

  const resumenCorto = (p) => {
    const partes = [];
    const sexo = Nutricion.SEXOS.find((s) => s.id === p.sexo);
    if (sexo && sexo.id !== "otro") partes.push(sexo.nombre);
    if (p.edad) partes.push(`${p.edad} años`);
    if (p.peso) partes.push(`${p.peso} kg`);
    return partes.join(" · ");
  };

  const objetivosTexto = (p) => (p.objetivos || []).map((o) => Nutricion.OBJETIVOS.find((x) => x.id === o)).filter(Boolean).map((o) => `${o.icono} ${o.nombre}`);
  const intoleranciasTexto = (p) => (p.intolerancias || []).map(Catalogo.intolerancia).filter(Boolean).map((t) => `${t.icono} Sin ${t.corto}`);

  window.Personas = { todas, porId, guardar, borrar, editor, avatar, resumenCorto, objetivosTexto, intoleranciasTexto };
})();
