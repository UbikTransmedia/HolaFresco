/* Publicidad (Google AdSense). En la aplicación solo hay un anuncio, debajo del contenido de un menú guardado (platos y
   lista de la compra generados para el usuario): nunca en la portada, el asistente, listados, ventanas emergentes ni
   pantallas vacías, que AdSense considera «pantallas sin contenido del editor». El resto de anuncios va en las páginas
   estáticas de cada receta (recetas/*.html, generadas por tools/paginas.js), que se leen sin JavaScript.
   El script de AdSense no está en index.html: se carga aquí, solo cuando se pinta un anuncio. Cada bloque necesita el id de un bloque de anuncios
   creado en AdSense (Anuncios → Por bloque de anuncios → Display, adaptable): ponlo en BLOQUE_DEFECTO
   para usar el mismo en todos los lugares, o uno distinto por lugar en BLOQUES. Sin id no se muestra nada. */
(function () {
  "use strict";
  const { h } = window.UI;
  const CLIENTE = "ca-pub-9953696711191519";
  const BLOQUE_DEFECTO = "5666459835";
  const BLOQUES = { menu: "" };
  const enLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  // El script de AdSense se carga la primera vez que hace falta un anuncio, nunca en pantallas sin contenido
  const cargarScript = () => {
    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) return;
    const sc = document.createElement("script");
    sc.async = true; sc.crossOrigin = "anonymous";
    sc.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENTE}`;
    document.head.appendChild(sc);
  };

  const bloque = (lugar) => {
    const slot = BLOQUES[lugar] || BLOQUE_DEFECTO;
    if (!slot || location.protocol === "file:") return null;
    cargarScript();
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
