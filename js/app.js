/* Arranque, navegación por hash y ajustes. */
(function () {
  "use strict";
  const { UI, DB, Recetas } = window;
  const { h } = UI;

  const RUTAS = [
    { id: "inicio", patron: /^\/?$/, nombre: "Inicio", icono: "🏠" },
    { id: "recetas", patron: /^\/recetas\/?$/, nombre: "Recetas", icono: "🍳" },
    { id: "wizard", patron: /^\/wizard\/?$/, nombre: "Nuevo menú", icono: "🪄" },
    { id: "menus", patron: /^\/menus(?:\/([^/?]+))?\/?$/, nombre: "Mis menús", icono: "📅" },
  ];

  const rutaActual = () => {
    const hash = location.hash.replace(/^#/, "") || "/";
    const ruta = hash.split("?")[0];
    for (const r of RUTAS) { const m = ruta.match(r.patron); if (m) return { ...r, params: { id: m[1] ? decodeURIComponent(m[1]) : undefined } }; }
    return { ...RUTAS[0], params: {} };
  };

  const ir = (ruta) => { if (location.hash === "#" + ruta) render(); else location.hash = ruta; };

  /* ---------- Inicio ---------- */
  const renderInicio = (cont) => {
    const menus = window.Menus.todos();
    const ultimo = menus[0];
    const total = Recetas.todas().length;
    const porOrigen = {};
    for (const r of Recetas.todas()) porOrigen[r.origen] = (porOrigen[r.origen] || 0) + 1;
    const personas = window.Personas.todas();
    UI.append(cont, 
      h("section.hero",
        h("h1", "HolaFresco"),
        h("p.hero-sub", "Tu recetario, un asistente que arma el menú de la semana y la lista de la compra lista para pegar en el móvil."),
        h("div.hero-acciones",
          h("button.btn.btn-primario.btn-grande", { type: "button", onClick: () => ir("/wizard") }, "🪄 Crear menú semanal"),
          h("button.btn.btn-grande", { type: "button", onClick: () => ir("/recetas") }, "🍳 Ver recetas")
        )
      ),
      h("div.grid-inicio",
        h("article.tarjeta-inicio", { tabindex: "0", role: "button", onClick: () => ir("/recetas"), onKeydown: (e) => { if (e.key === "Enter") ir("/recetas"); } }, h("h2", "🍳 Recetas"), h("p", h("strong", String(total)), " recetas: ", h("span.badge.badge-recetario", "📄 ", String(porOrigen.recetario || 0), " del recetario"), " ", h("span.badge.badge-inventada", "✨ ", String(porOrigen.inventada || 0), " inventadas"), porOrigen.propia ? h("span", " ", h("span.badge.badge-propia", "✍️ ", String(porOrigen.propia), " tuyas")) : null), h("p.muted", "Busca por ingrediente, filtra por categoría o dieta, añade las tuyas.")),
        h("article.tarjeta-inicio", { tabindex: "0", role: "button", onClick: () => ir("/wizard"), onKeydown: (e) => { if (e.key === "Enter") ir("/wizard"); } }, h("h2", "🪄 Nuevo menú"), h("p", personas.length ? `Hogar: ${personas.map((p) => `${window.Personas.avatar(p)} ${p.nombre}`).join(", ")}` : "Empieza añadiendo a las personas de tu hogar."), h("p.muted", "Seis pasos: personas, días, gustos, vetos, recetas fijas y listo.")),
        h("article.tarjeta-inicio", { tabindex: "0", role: "button", onClick: () => ir(ultimo ? `/menus/${ultimo.id}` : "/menus"), onKeydown: (e) => { if (e.key === "Enter") ir(ultimo ? `/menus/${ultimo.id}` : "/menus"); } }, h("h2", "📅 Mis menús"), ultimo ? h("p", "Último: ", h("strong", ultimo.nombre), h("span.muted", ` · ${UI.fmtFecha(ultimo.creado)}`)) : h("p", "Aún no hay menús guardados."), h("p.muted", menus.length ? `${menus.length} ${UI.plural(menus.length, "menú", "menús")} con su lista de la compra.` : "Cada menú guarda su lista de la compra para copiarla al móvil."))
      ),
      h("section.bloque.bloque-ayuda",
        h("h3", "¿Cómo funciona?"),
        h("ol.lista-pasos-inicio",
          h("li", h("strong", "Personas. "), "Añade a quien come en casa: sexo, edad, peso y objetivos. Con eso ajustamos las raciones."),
          h("li", h("strong", "Días y gustos. "), "Marca qué comidas planificar, con qué frecuencia quieres legumbre, pescado, carne… y qué ingredientes vetar."),
          h("li", h("strong", "Menú y compra. "), "Revisa el menú, cambia lo que quieras y guárdalo. La lista de la compra sale agrupada por pasillos y se copia como lista de tareas.")
        ),
        h("p.muted", "Todo se guarda en este navegador (no hay servidor). Desde ⚙️ Ajustes puedes exportar una copia de seguridad.")
      )
    );
  };

  /* ---------- Tema (claro por defecto) ---------- */
  const TEMAS = [
    { id: "claro", nombre: "Claro", icono: "☀️", data: "light", color: "#b2461f" },
    { id: "oscuro", nombre: "Oscuro", icono: "🌙", data: "dark", color: "#0f0d0c" },
    { id: "huerta", nombre: "Huerta", icono: "🌿", data: "huerta", color: "#3f6b22" },
    { id: "oceano", nombre: "Océano", icono: "🌊", data: "oceano", color: "#0a1320" },
    { id: "contraste", nombre: "Alto contraste", icono: "◐", data: "contraste", color: "#000000" },
    { id: "sistema", nombre: "Según el sistema", icono: "🖥️" },
  ];
  const mediaOscuro = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const temaActual = () => { const t = DB.leer("ajustes", {}).tema || "claro"; return TEMAS.some((x) => x.id === t) ? t : "claro"; };
  const temaResuelto = () => { const t = temaActual(); return t === "sistema" ? (mediaOscuro && mediaOscuro.matches ? "oscuro" : "claro") : t; };
  const temaEfectivo = () => TEMAS.find((x) => x.id === temaResuelto()).data;
  const aplicarTema = () => {
    const t = TEMAS.find((x) => x.id === temaResuelto());
    document.documentElement.setAttribute("data-theme", t.data);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t.color);
    const btn = document.querySelector(".btn-tema");
    if (btn) { btn.textContent = t.icono; btn.title = `Estilo: ${t.nombre}. Pulsa para cambiar`; btn.setAttribute("aria-label", btn.title); }
  };
  const fijarTema = (id) => { DB.guardar("ajustes", { ...DB.leer("ajustes", {}), tema: id }); aplicarTema(); };
  if (mediaOscuro && mediaOscuro.addEventListener) mediaOscuro.addEventListener("change", () => { if (temaActual() === "sistema") aplicarTema(); });

  /* ---------- Ajustes ---------- */
  const abrirAjustes = () => {
    let m;
    const borradas = DB.leer("recetasBorradas", []).length;
    const modificadas = Object.keys(DB.leer("recetasOverrides", {})).length;
    const inputImportar = h("input", { type: "file", accept: "application/json,.json", style: { display: "none" }, onChange: async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { const datos = JSON.parse(await f.text()); if (!(await UI.confirmar({ titulo: "Importar copia", mensaje: `Se sustituirán tus datos actuales por los del fichero (${datos.fecha ? "del " + UI.fmtFechaHora(datos.fecha) : "sin fecha"}). ¿Continuar?` }))) return; DB.importarTodo(datos); Recetas.invalidar(); m.cerrar(); UI.toast("Copia importada"); render(); } catch (err) { UI.toast("No se pudo importar: " + err.message, "error"); }
    } });
    m = UI.modal({
      titulo: "⚙️ Ajustes",
      ancho: "md",
      contenido: [
        h("section.bloque", h("h3", "Apariencia"), h("p.muted", "El estilo claro es el predeterminado. «Según el sistema» alterna entre claro y oscuro según tu dispositivo. También puedes cambiar de estilo con el botón de la esquina superior derecha."), UI.segmentado({ opciones: TEMAS, valor: temaActual(), ariaLabel: "Tema", alCambiar: fijarTema })),
        h("section.bloque", h("h3", "Copia de seguridad"), h("p.muted", "Tus personas, menús y recetas viven en este navegador. Exporta un fichero para guardarlo o pasarlo a otro dispositivo."), h("div.fila-botones", h("button.btn", { type: "button", onClick: () => { UI.descargar(`holafresco-copia-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(DB.exportarTodo(), null, 2)); UI.toast("Copia descargada"); } }, "⬇️ Exportar copia"), h("button.btn", { type: "button", onClick: () => inputImportar.click() }, "⬆️ Importar copia"), inputImportar)),
        h("section.bloque", h("h3", "Recetas ocultas y modificadas"), h("p.muted", `Has modificado ${modificadas} y ocultado ${borradas} ${UI.plural(borradas, "receta", "recetas")}. Ocultar no borra nada del programa: solo deja de mostrarse en este navegador.`),
          borradas ? h("ul.lista-simple.lista-ocultas", Recetas.ocultas().map((r) => h("li", r.nombre, " ", h("button.btn.btn-mini.btn-suave", { type: "button", onClick: () => { Recetas.restaurar(r.id); UI.toast(`«${r.nombre}» vuelve a tu recetario`); m.cerrar(); abrirAjustes(); } }, "Recuperar")))) : null,
          h("button.btn", { type: "button", disabled: !borradas && !modificadas, onClick: async () => { if (await UI.confirmar({ titulo: "Restaurar recetas originales", mensaje: "Volverán todas las recetas ocultas y las modificadas recuperarán su versión original. Tus recetas propias, favoritas y lista de excluidas no se tocan." })) { Recetas.restaurarTodas(); m.cerrar(); UI.toast("Recetas restauradas"); render(); } } }, "↺ Restaurar todas las originales")),
        h("section.bloque", h("h3", "Borrar todo"), h("p.muted", "Elimina personas, menús, recetas propias y ajustes de este navegador."), h("button.btn.btn-peligro", { type: "button", onClick: async () => { if (await UI.confirmar({ titulo: "Borrar todos los datos", mensaje: "Esta acción no se puede deshacer. ¿Seguro que quieres borrar todo?", textoOk: "Sí, borrar todo", peligro: true })) { for (const k of ["personas", "menus", "recetasPropias", "recetasOverrides", "recetasBorradas", "ajustes", "borradorWizard", "filtrosRecetas", "favoritos", "listaNegra"]) DB.borrar(k); Recetas.invalidar(); m.cerrar(); UI.toast("Datos borrados"); ir("/"); render(); } } }, "🗑 Borrar todos los datos")),
        h("section.bloque", h("h3", "Acerca de"), h("p.muted", "HolaFresco funciona en local, sin conexión ni cuentas. Las recetas marcadas 📄 se desarrollaron a partir de los títulos de RECETAS.pdf; las marcadas ✨ son creaciones nuevas inspiradas en ese recetario. Los valores nutricionales y las raciones son orientativos.")),
      ],
    });
  };

  /* ---------- Render ---------- */
  const nav = h("nav.nav", { "aria-label": "Principal" });
  const main = h("main#contenido.contenido", { tabindex: "-1" });

  const render = () => {
    const ruta = rutaActual();
    UI.vaciar(nav);
    for (const r of RUTAS) nav.appendChild(h("a.nav-item", { href: "#" + (r.id === "inicio" ? "/" : "/" + r.id), class: r.id === ruta.id ? "activo" : "", "aria-current": r.id === ruta.id ? "page" : null }, h("span.nav-icono", r.icono), h("span.nav-texto", r.nombre)));
    nav.appendChild(h("button.nav-item.nav-btn", { type: "button", onClick: abrirAjustes, title: "Ajustes" }, h("span.nav-icono", "⚙️"), h("span.nav-texto", "Ajustes")));
    if (!document.querySelector(".btn-tema")) UI.append(document.querySelector(".cabecera"), h("button.btn.btn-icono.btn-tema", { type: "button", onClick: () => { const ciclo = TEMAS.filter((x) => x.data); const i = ciclo.findIndex((x) => x.id === temaResuelto()); const sig = ciclo[(i + 1) % ciclo.length]; fijarTema(sig.id); UI.toast(`Estilo: ${sig.icono} ${sig.nombre}`, "info", 1500); } }, "☀️"));
    aplicarTema();
    UI.vaciar(main);
    main.className = "contenido vista-" + ruta.id;
    if (ruta.id === "inicio") renderInicio(main);
    else if (ruta.id === "recetas") window.Vistas.recetas.render(main, ruta.params);
    else if (ruta.id === "wizard") window.Vistas.wizard.render(main, ruta.params);
    else if (ruta.id === "menus") window.Vistas.menus.render(main, ruta.params);
    document.title = (ruta.id === "inicio" ? "" : ruta.nombre + " · ") + "HolaFresco";
    window.scrollTo(0, 0);
  };

  const arrancar = () => {
    UI.append(document.body, 
      h("a.saltar", { href: "#contenido" }, "Saltar al contenido"),
      h("header.cabecera", h("a.logo", { href: "#/" }, h("span.logo-icono", "🥘"), h("span.logo-texto", "HolaFresco")), nav),
      main,
      h("footer.pie", h("span.muted", "HolaFresco · funciona sin conexión · datos guardados en este navegador"))
    );
    document.dispatchEvent(new CustomEvent("recetas:semilla-cargada"));
    if (!(window.RECETAS_SEED || []).length) UI.toast("No se han cargado las recetas de ejemplo. Comprueba que la carpeta js/data está junto a index.html.", "error", 8000);
    window.addEventListener("hashchange", render);
    render();
  };

  window.App = { ir, render, rutaActual, abrirAjustes, fijarTema, temaActual };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar); else arrancar();
})();
