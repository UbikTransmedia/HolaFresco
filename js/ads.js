/* Publicidad (Google AdSense): bloques de anuncio en lugares fijos de la interfaz.
   El script de AdSense se carga en index.html. Cada bloque necesita el id de un bloque de anuncios
   creado en AdSense (Anuncios → Por bloque de anuncios → Display, adaptable): ponlo en BLOQUE_DEFECTO
   para usar el mismo en todos los lugares, o uno distinto por lugar en BLOQUES. Sin id no se muestra nada. */
(function () {
  "use strict";
  const { h } = window.UI;
  const CLIENTE = "ca-pub-9953696711191519";
  const BLOQUE_DEFECTO = "5666459835";
  const BLOQUES = { inicio: "", recetas: "", receta: "", asistente: "", menus: "", menu: "" };
  const enLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  const bloque = (lugar) => {
    const slot = BLOQUES[lugar] || BLOQUE_DEFECTO;
    if (!slot || location.protocol === "file:") return null;
    const ins = h("ins.adsbygoogle", { style: { display: "block" }, "data-ad-client": CLIENTE, "data-ad-slot": slot, "data-ad-format": "auto", "data-full-width-responsive": "true", "data-adtest": enLocal ? "on" : null });
    const caja = h("aside.anuncio", { class: "anuncio-" + lugar, "aria-label": "Publicidad" }, h("span.anuncio-etiqueta", "Publicidad"), ins);
    // El hueco no ocupa espacio hasta que AdSense confirma que ha servido un anuncio (data-ad-status="filled")
    const ajustar = () => caja.classList.toggle("anuncio-lleno", ins.getAttribute("data-ad-status") === "filled");
    if ("MutationObserver" in window) new MutationObserver(ajustar).observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    // AdSense necesita el bloque ya en la página (y con anchura) antes de pedir el anuncio
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!ins.isConnected || ins.getAttribute("data-adsbygoogle-status")) return;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* bloqueador de anuncios o sin conexión */ }
    }));
    return caja;
  };

  window.Publicidad = { bloque, CLIENTE };
})();
