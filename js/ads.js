/* Publicidad (Google AdSense). En la aplicación solo hay un anuncio, debajo del contenido de un menú guardado (platos y
   lista de la compra generados para el usuario): nunca en la portada, el asistente, listados, ventanas emergentes ni
   pantallas vacías, que AdSense considera «pantallas sin contenido del editor». El resto de anuncios va en las páginas
   estáticas de cada receta (recetas/*.html, generadas por tools/paginas.js), que se leen sin JavaScript.
   El script de AdSense no está en index.html: se carga aquí, solo cuando se pinta un anuncio.
   Bloques de AdSense: «Primero» es de tamaño fijo (728 × 90), así que se usa tal cual y solo donde cabe (pantallas
   anchas). Para que haya anuncio también en el móvil hay que crear en AdSense un bloque de display ADAPTABLE y poner su
   id en BLOQUE_ADAPTABLE; mientras esté vacío, en pantallas estrechas no se muestra ningún anuncio. */
(function () {
  "use strict";
  const { h } = window.UI;
  const CLIENTE = "ca-pub-9953696711191519";
  const BLOQUE_FIJO = { slot: "5666459835", ancho: 728, alto: 90 }; // «Primero»
  const BLOQUE_ADAPTABLE = ""; // id de un bloque de display adaptable (para móvil), si se crea
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
    if (location.protocol === "file:") return null;
    const caja = h("aside.anuncio", { class: "anuncio-" + lugar, "aria-label": "Publicidad" }, h("span.anuncio-etiqueta", "Publicidad"));
    // Cuando el hueco ya está en la página se mide: el bloque fijo solo si cabe; si no, el adaptable (si existe) o nada
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!caja.isConnected) return;
      const comun = { "data-ad-client": CLIENTE, "data-adtest": enLocal ? "on" : null };
      let ins = null;
      if (caja.clientWidth >= BLOQUE_FIJO.ancho) ins = h("ins.adsbygoogle", { ...comun, style: { display: "inline-block", width: BLOQUE_FIJO.ancho + "px", height: BLOQUE_FIJO.alto + "px" }, "data-ad-slot": BLOQUE_FIJO.slot });
      else if (BLOQUE_ADAPTABLE) ins = h("ins.adsbygoogle", { ...comun, style: { display: "block" }, "data-ad-slot": BLOQUE_ADAPTABLE, "data-ad-format": "auto", "data-full-width-responsive": "true" });
      if (!ins) { caja.remove(); return; }
      caja.appendChild(ins);
      // El hueco no ocupa espacio hasta que AdSense confirma que ha servido un anuncio (data-ad-status="filled")
      const ajustar = () => caja.classList.toggle("anuncio-lleno", ins.getAttribute("data-ad-status") === "filled");
      if ("MutationObserver" in window) new MutationObserver(ajustar).observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
      cargarScript();
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* bloqueador de anuncios o sin conexión */ }
    }));
    return caja;
  };

  window.Publicidad = { bloque, CLIENTE };
})();
