/* Utilidades de interfaz: creación de nodos, modales, toasts, confirmaciones. */
(function () {
  "use strict";

  /* h("div.clase#id", {attrs}, ...hijos) */
  const h = (sel, attrs, ...hijos) => {
    if (attrs && (typeof attrs !== "object" || Array.isArray(attrs) || attrs instanceof Node)) { hijos.unshift(attrs); attrs = null; }
    const partes = sel.split(/(?=[.#])/);
    const el = document.createElement(partes[0] || "div");
    for (const p of partes.slice(1)) {
      if (p[0] === ".") el.classList.add(p.slice(1));
      else if (p[0] === "#") el.id = p.slice(1);
    }
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === "class") el.className += (el.className ? " " : "") + v;
        else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === "dataset") Object.assign(el.dataset, v);
        else if (k === "html") el.innerHTML = v;
        else if (k in el && k !== "list" && k !== "form" && typeof v !== "object") { try { el[k] = v; } catch (e) { el.setAttribute(k, v); } }
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    const add = (c) => {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return c.forEach(add);
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    };
    hijos.forEach(add);
    return el;
  };

  const vaciar = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

  /* append que ignora null/false/undefined y aplana arrays (Element.append(null) escribiría "null") */
  const append = (el, ...hijos) => {
    const add = (c) => {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return c.forEach(add);
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    };
    hijos.forEach(add);
    return el;
  };

  /* Toasts */
  let contToast = null;
  const toast = (msg, tipo = "ok", ms = 3200) => {
    if (!contToast) { contToast = h("div.toasts", { role: "status", "aria-live": "polite" }); document.body.appendChild(contToast); }
    const t = h("div.toast", { class: "toast-" + tipo }, h("span.toast-icono", tipo === "ok" ? "✅" : tipo === "error" ? "⚠️" : "ℹ️"), h("span", msg));
    contToast.appendChild(t);
    requestAnimationFrame(() => t.classList.add("visible"));
    setTimeout(() => { t.classList.remove("visible"); setTimeout(() => t.remove(), 300); }, ms);
    return t;
  };

  /* Modal genérico. Devuelve { cerrar, el, cuerpo } */
  const pilaModales = [];
  const modal = ({ titulo, contenido, pie, ancho = "md", alCerrar, claseExtra = "" }) => {
    const fondo = h("div.modal-fondo", { role: "presentation" });
    const cerrar = () => {
      if (!fondo.isConnected) return;
      fondo.classList.remove("visible");
      setTimeout(() => fondo.remove(), 180);
      pilaModales.splice(pilaModales.indexOf(api), 1);
      document.body.classList.toggle("modal-abierto", pilaModales.length > 0);
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
      alCerrar && alCerrar();
    };
    const ultimoFoco = document.activeElement;
    const cuerpo = h("div.modal-cuerpo");
    const caja = h("div.modal", { role: "dialog", "aria-modal": "true", "aria-label": typeof titulo === "string" ? titulo : "Diálogo", class: `modal-${ancho} ${claseExtra}`, tabindex: "-1" },
      h("div.modal-cabecera",
        h("h2.modal-titulo", titulo),
        h("button.btn.btn-icono.modal-cerrar", { type: "button", "aria-label": "Cerrar", title: "Cerrar (Esc)", onClick: cerrar }, "✕")),
      cuerpo,
      pie ? h("div.modal-pie", pie) : null
    );
    if (typeof contenido === "function") contenido(cuerpo); else if (contenido) cuerpo.append(...(Array.isArray(contenido) ? contenido : [contenido]));
    fondo.appendChild(caja);
    fondo.addEventListener("mousedown", (e) => { if (e.target === fondo) cerrar(); });
    const onKey = (e) => { if (e.key === "Escape" && pilaModales[pilaModales.length - 1] === api) { e.stopPropagation(); cerrar(); } };
    document.addEventListener("keydown", onKey);
    const api = { cerrar: () => { document.removeEventListener("keydown", onKey); cerrar(); }, el: caja, cuerpo, pie: caja.querySelector(".modal-pie") };
    pilaModales.push(api);
    document.body.appendChild(fondo);
    document.body.classList.add("modal-abierto");
    requestAnimationFrame(() => { fondo.classList.add("visible"); const f = caja.querySelector("input,select,textarea,button:not(.modal-cerrar)"); (f || caja).focus(); });
    return api;
  };

  /* Diálogos que devuelven una promesa. Se resuelve ANTES de cerrar: el cierre dispara alCerrar,
     que solo cuenta como "cancelar" si aún no se había respondido. */
  const cerrarModales = () => { for (const m of [...pilaModales].reverse()) m.cerrar(); };

  const confirmar = ({ titulo = "¿Seguro?", mensaje, textoOk = "Sí, continuar", textoCancelar = "Cancelar", peligro = false }) =>
    new Promise((resolve) => {
      let m, respondido = false;
      const responder = (v) => { if (respondido) return; respondido = true; resolve(v); if (m) m.cerrar(); };
      m = modal({
        titulo,
        ancho: "sm",
        contenido: h("p", mensaje),
        pie: [h("button.btn", { type: "button", onClick: () => responder(false) }, textoCancelar), h("button.btn", { type: "button", class: peligro ? "btn-peligro" : "btn-primario", onClick: () => responder(true) }, textoOk)],
        alCerrar: () => responder(false),
      });
    });

  const pedirTexto = ({ titulo, etiqueta, valor = "", placeholder = "", textoOk = "Guardar" }) =>
    new Promise((resolve) => {
      let m, respondido = false;
      const responder = (v) => { if (respondido) return; respondido = true; resolve(v); if (m) m.cerrar(); };
      const input = h("input.input", { type: "text", value: valor, placeholder, "aria-label": etiqueta });
      const form = h("form", { onSubmit: (e) => { e.preventDefault(); responder(input.value.trim()); } }, h("label.campo", h("span.campo-etiqueta", etiqueta), input));
      m = modal({ titulo, ancho: "sm", contenido: form, pie: [h("button.btn", { type: "button", onClick: () => responder(null) }, "Cancelar"), h("button.btn.btn-primario", { type: "button", onClick: () => responder(input.value.trim()) }, textoOk)], alCerrar: () => responder(null) });
    });

  /* Chip/etiqueta */
  const chip = (texto, opciones = {}) => h("span.chip", { class: opciones.clase || "", title: opciones.title }, opciones.icono ? h("span.chip-icono", opciones.icono) : null, texto);

  /* Campo de formulario */
  const campo = (etiqueta, control, ayuda) => h("label.campo", h("span.campo-etiqueta", etiqueta), control, ayuda ? h("span.campo-ayuda", ayuda) : null);

  /* Grupo de botones segmentados (radio) */
  const segmentado = ({ opciones, valor, alCambiar, nombre, ariaLabel }) => {
    const cont = h("div.segmentado", { role: "radiogroup", "aria-label": ariaLabel || nombre });
    const pintar = () => {
      vaciar(cont);
      for (const o of opciones) {
        const activo = o.id === valor;
        cont.appendChild(h("button.seg-opcion", { type: "button", role: "radio", "aria-checked": activo ? "true" : "false", class: activo ? "activo" : "", title: o.desc || "", onClick: () => { valor = o.id; pintar(); alCambiar && alCambiar(o.id); } }, o.icono ? h("span.seg-icono", o.icono) : null, o.nombre));
      }
    };
    pintar();
    return cont;
  };

  /* Formato fecha */
  const fmtFecha = (iso) => { try { return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return iso; } };
  const fmtFechaHora = (iso) => { try { return new Date(iso).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return iso; } };

  const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  const descargar = (nombre, contenido, tipo = "application/json") => {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = h("a", { href: url, download: nombre });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const plural = (n, uno, varios) => (n === 1 ? uno : varios);

  window.UI = { h, vaciar, append, toast, modal, cerrarModales, confirmar, pedirTexto, chip, campo, segmentado, fmtFecha, fmtFechaHora, debounce, descargar, plural };
})();
