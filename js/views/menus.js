/* Vista: base de datos de menús semanales generados, con lista de la compra. */
(function () {
  "use strict";
  const { UI, Recetas, Planificador, Compra, Catalogo, DB } = window;
  const { h } = UI;

  /* ---------- Almacén ---------- */
  const todos = () => DB.leer("menus", []).sort((a, b) => (b.creado || "").localeCompare(a.creado || ""));
  const porId = (id) => todos().find((m) => m.id === id) || null;
  const guardar = (menu) => { const lista = DB.leer("menus", []); const i = lista.findIndex((m) => m.id === menu.id); if (i >= 0) lista[i] = menu; else lista.push(menu); DB.guardar("menus", lista); };
  const borrar = (id) => DB.guardar("menus", DB.leer("menus", []).filter((m) => m.id !== id));
  window.Menus = { todos, porId, guardar, borrar };

  const ajustes = () => DB.leer("ajustes", { formatoCopia: "markdown", incluirBasicos: false });
  const guardarAjustes = (a) => DB.guardar("ajustes", { ...ajustes(), ...a });

  /* ---------- Listado ---------- */
  const renderLista = (cont) => {
    const lista = todos();
    UI.append(cont, h("header.vista-cab", h("div", h("h1", "📅 Mis menús"), h("p.vista-desc", lista.length ? `${lista.length} ${UI.plural(lista.length, "menú guardado", "menús guardados")}. Abre uno para ver el menú y su lista de la compra.` : "Aquí se guardan los menús que generes con el asistente.")), h("button.btn.btn-primario", { type: "button", onClick: () => window.App.ir("/wizard") }, "🪄 Nuevo menú")));
    if (!lista.length) { cont.appendChild(h("div.vacio", h("p", "Todavía no has guardado ningún menú."), h("button.btn.btn-primario", { type: "button", onClick: () => window.App.ir("/wizard") }, "Crear mi primer menú"))); return; }
    const grid = h("div.grid-menus");
    for (const m of lista) {
      const nRecetas = m.slots.filter((s) => s.recetaId).length;
      const dias = [...new Set(m.slots.map((s) => s.dia))].length;
      const lc = Compra.construir(m);
      const nItems = lc.items.filter((i) => i.pasillo !== "basicos" && i.pasillo !== "en-casa").length;
      const hechos = (m.marcados || []).length;
      grid.appendChild(h("article.tarjeta-menu", { tabindex: "0", role: "button", "aria-label": `Abrir menú ${m.nombre}`, onClick: () => window.App.ir(`/menus/${m.id}`), onKeydown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.App.ir(`/menus/${m.id}`); } } },
        h("h3", m.nombre),
        h("p.muted", `Creado el ${UI.fmtFecha(m.creado)}`),
        h("div.tarjeta-menu-meta", h("span", `🍽️ ${nRecetas} comidas · ${dias} días`), h("span", `👥 ${(m.personas || []).map((p) => p.nombre).join(", ") || "—"}`), h("span", `🛒 ${nItems} ingredientes${hechos ? ` · ${Math.min(hechos, nItems)} marcados` : ""}`)),
        h("div.tarjeta-menu-acciones",
          h("button.btn.btn-mini", { type: "button", onClick: (e) => { e.stopPropagation(); window.App.ir(`/menus/${m.id}?tab=compra`); } }, "🛒 Lista de la compra"),
          h("button.btn.btn-mini.btn-suave", { type: "button", onClick: async (e) => { e.stopPropagation(); const n = await UI.pedirTexto({ titulo: "Renombrar menú", etiqueta: "Nombre", valor: m.nombre }); if (n) { m.nombre = n; guardar(m); window.App.render(); } } }, "✏️"),
          h("button.btn.btn-mini.btn-suave", { type: "button", title: "Borrar", onClick: async (e) => { e.stopPropagation(); if (await UI.confirmar({ titulo: "Borrar menú", mensaje: `¿Borrar «${m.nombre}» y su lista de la compra? No se puede deshacer.`, textoOk: "Borrar", peligro: true })) { borrar(m.id); UI.toast("Menú borrado"); window.App.render(); } } }, "🗑")
        )
      ));
    }
    cont.appendChild(grid);
  };

  /* ---------- Detalle ---------- */
  const renderDetalle = (cont, id) => {
    const menu = porId(id);
    if (!menu) { UI.append(cont, h("div.vacio", h("p", "Ese menú ya no existe."), h("button.btn", { type: "button", onClick: () => window.App.ir("/menus") }, "Volver a mis menús"))); return; }
    menu.marcados = menu.marcados || [];
    const lista = Compra.construir(menu);
    const tabUrl = (location.hash.split("?")[1] || "");
    let pestana = tabUrl.includes("tab=compra") ? "compra" : tabUrl.includes("tab=resumen") ? "resumen" : "menu";

    /* --- Exportar en Markdown --- */
    const bajarTitulos = (md, n) => md.replace(/^(#{1,6}) /gm, (m, h1) => "#".repeat(Math.min(6, h1.length + n)) + " ");
    const slotsOrdenados = () => Planificador.DIAS.flatMap((d) => ["comida", "cena"].map((m) => menu.slots.find((x) => x.dia === d.id && x.momento === m)).filter(Boolean));
    const mdPlan = (nivel = 1) => {
      const L = [`${"#".repeat(nivel)} Plan de comidas · ${menu.nombre}`, ""];
      const quien = (menu.personas || []).map((p) => p.nombre).join(", ");
      L.push(`${quien ? quien + " · " : ""}${Number(menu.raciones).toLocaleString("es-ES")} raciones por comida`, "");
      for (const d of Planificador.DIAS) {
        const del = menu.slots.filter((x) => x.dia === d.id);
        if (!del.length) continue;
        L.push(`${"#".repeat(nivel + 1)} ${d.nombre}`, "");
        for (const m of ["comida", "cena"]) {
          const s = del.find((x) => x.momento === m);
          if (!s) continue;
          const r = Recetas.porId(s.recetaId);
          const mo = Recetas.MOMENTOS.find((x) => x.id === m);
          L.push(`- ${mo.icono} **${mo.nombre}:** ${r ? `${r.nombre} (${r.tiempo} min${r.nutricion.kcal ? ` · ${r.nutricion.kcal} kcal` : ""})` : "—"}${s.obligatoria ? " 📌" : ""}`);
        }
        L.push("");
      }
      return L.join("\n").trim() + "\n";
    };
    const mdRecetas = (nivel = 1) => {
      const L = [`${"#".repeat(nivel)} Recetas · ${menu.nombre}`, ""];
      for (const s of slotsOrdenados()) {
        const r = Recetas.porId(s.recetaId);
        if (!r) continue;
        const d = Planificador.dia(s.dia), mo = Recetas.MOMENTOS.find((x) => x.id === s.momento);
        L.push(`*${d.nombre} · ${mo.nombre}*`, "", bajarTitulos(Recetas.aMarkdown(r, s.raciones || menu.raciones), nivel).trim(), "", "---", "");
      }
      return L.join("\n").trim() + "\n";
    };
    const mdCompra = (nivel = 1) => { const a = ajustes(); return bajarTitulos(Compra.exportarTexto(menu, Compra.construir(menu), { formato: "markdown", incluirBasicos: a.incluirBasicos, marcados: menu.marcados || [] }), nivel - 2); };
    /* --- Exportar a PDF: plan (índice enlazado) + lista de la compra + recetas + anexo Markdown --- */
    const exportarPDF = () => {
      const { Documento } = window.PDF;
      const doc = new Documento({ titulo: `${menu.nombre} · HolaFresco`, pie: `HolaFresco · ${menu.nombre}` });
      const slots = slotsOrdenados().filter((s) => Recetas.porId(s.recetaId));
      const kSlot = (s) => `r-${s.dia}-${s.momento}`;
      const lista = Compra.construir(menu);
      const a = ajustes();
      const quien = (menu.personas || []).map((p) => p.nombre).join(", ");
      const mdComp = mdCompra(2), mdPl = mdPlan(2), mdRec = mdRecetas(2);
      const completo = `# ${menu.nombre}\n\n${mdPl}\n${mdComp}\n${mdRec}`;

      // Marcadores (índice lateral)
      doc.marcador("Plan de comidas", "plan");
      doc.marcador("Lista de la compra", "lista");
      const mRec = doc.marcador("Recetas", slots.length ? kSlot(slots[0]) : "plan");
      for (const s of slots) doc.marcador(`${Planificador.dia(s.dia).nombre} · ${s.momento === "comida" ? "Comida" : "Cena"}: ${Recetas.porId(s.recetaId).nombre}`, kSlot(s), mRec);
      const mMd = doc.marcador("Markdown para copiar", "md");
      doc.marcador("Plan de comidas (Markdown)", "md-plan", mMd);
      doc.marcador("Lista de la compra (Markdown)", "md-lista", mMd);
      doc.marcador("Recetas (Markdown)", slots.length ? "md-" + kSlot(slots[0]) : "md", mMd);

      // 1. Portada + plan de comidas como índice
      doc.titulo1(menu.nombre, { destino: "plan" });
      doc.parrafo(`${quien ? quien + " · " : ""}${Number(menu.raciones).toLocaleString("es-ES")} raciones por comida · ${slots.length} comidas · creado el ${UI.fmtFecha(menu.creado)}`, { size: 9.5, col: doc.colores.suave, despues: 8 });
      doc.titulo2("Plan de comidas");
      doc.parrafo("Pulsa el nombre de un plato para ir a su receta. Cada receta tiene un enlace para volver aquí.", { size: 8.5, col: doc.colores.suave, despues: 2 });
      for (const d of Planificador.DIAS) {
        const del = slots.filter((x) => x.dia === d.id);
        if (!del.length) continue;
        doc.titulo3(d.nombre);
        for (const s of del) doc.filaIndice(s.momento === "comida" ? "Comida" : "Cena", Recetas.porId(s.recetaId).nombre, kSlot(s));
      }
      doc.titulo2("Contenido");
      doc.filaIndice("", "Lista de la compra", "lista", { anchoEtiqueta: 0 });
      doc.filaIndice("", "Recetas", slots.length ? kSlot(slots[0]) : "plan", { anchoEtiqueta: 0 });
      doc.filaIndice("", "Markdown para copiar (plan, lista y recetas)", "md", { anchoEtiqueta: 0 });

      // 2. Lista de la compra
      doc.nuevaPagina();
      doc.titulo1("Lista de la compra", { destino: "lista" });
      doc.enlaces([["Volver al plan", "plan"], ["Markdown de la lista", "md-lista"]]);
      doc.espacio(4);
      for (const pas of lista.porPasillo) {
        const esBasico = pas.id === "basicos", enCasa = pas.id === "en-casa";
        doc.titulo3(pas.nombre);
        for (const it of pas.items) doc.casilla(it.n.charAt(0).toUpperCase() + it.n.slice(1) + (it.opcional ? " (opcional)" : ""), Compra.textoCantidad(it), { suave: esBasico || enCasa });
      }

      // 3. Recetas (una por página)
      for (const s of slots) {
        const r = Recetas.porId(s.recetaId);
        const raciones = s.raciones || menu.raciones;
        const cat = Recetas.categoria(r.categoria), coc = Recetas.cocina(r.cocina), con = Recetas.contundencia(r.contundencia), cos = Recetas.coste(r.coste);
        doc.nuevaPagina();
        doc.destino(kSlot(s));
        doc.parrafo(`${Planificador.dia(s.dia).nombre.toUpperCase()} · ${s.momento === "comida" ? "COMIDA" : "CENA"}${s.obligatoria ? " · FIJA" : ""}`, { f: "F2", size: 8.5, col: doc.colores.suave, despues: 2 });
        doc.parrafo(r.nombre, { f: "F2", size: 18, col: doc.colores.acento, interlineado: 1.2, despues: 2 });
        if (r.subtitulo) doc.parrafo(r.subtitulo.charAt(0).toUpperCase() + r.subtitulo.slice(1), { f: "F3", size: 10.5, col: doc.colores.suave, despues: 4 });
        doc.parrafo([cat.nombre, coc ? coc.nombre : null, `${r.tiempo} min`, `dificultad ${r.dificultad}`, con ? con.nombre : null, cos ? `coste ${cos.nombre.toLowerCase()}` : null].filter(Boolean).join(" · "), { size: 9, col: doc.colores.suave, despues: 0 });
        doc.enlaces([["Volver al plan", "plan"], ["Markdown de esta receta", "md-" + kSlot(s)]]);
        doc.titulo3(`Ingredientes (${String(raciones).replace(".", ",")} ${raciones === 1 ? "ración" : "raciones"})`);
        for (const ing of Compra.escalar(r, raciones)) {
          const q = ing.q == null ? null : Compra.redondear(ing.q, ing.u);
          doc.casilla(ing.n + (ing.opcional ? " (opcional)" : "") + (ing.nota ? " — " + ing.nota : ""), ing.u === "al gusto" || q == null ? "al gusto" : Compra.fmtCantidad(q, ing.u), { size: 9.5 });
        }
        doc.titulo3("Preparación");
        r.pasos.forEach((p, i) => doc.elemento(`${i + 1}.`, p, { size: 10 }));
        if (r.consejo) doc.caja(r.consejo, { titulo: "Consejo del cocinero:" });
        const n = r.nutricion || {};
        if (n.kcal) doc.parrafo(`Por ración (aprox.): ${n.kcal} kcal · ${n.prot} g proteína · ${n.hc} g hidratos · ${n.grasa} g grasa`, { size: 9, col: doc.colores.suave, despues: 0 });
      }

      // 4. Anexo Markdown
      doc.nuevaPagina();
      doc.titulo1("Markdown para copiar", { destino: "md" });
      doc.parrafo("Selecciona el texto de cada bloque y cópialo para pegarlo en Notion, Obsidian, Google Docs («Pegar desde Markdown»), Samsung Notes o cualquier editor. Los emojis no caben en las fuentes del PDF y aquí se omiten.", { size: 9.5, despues: 4 });
      doc.caja("Este PDF lleva además el Markdown completo como ficheros adjuntos (menu-completo.md, plan-de-comidas.md, lista-de-la-compra.md y recetas.md), con emojis incluidos. Ábrelos desde el panel de adjuntos del visor (clip): Adobe Acrobat, Firefox, Okular, Evince… En Chrome o en el visor del móvil, copia el texto de esta sección.", { titulo: "Ficheros adjuntos:", size: 9 });
      doc.titulo2("Plan de comidas", { destino: "md-plan" });
      doc.enlaces([["Volver al plan", "plan"]]);
      doc.mono(mdPlan(1));
      doc.titulo2("Lista de la compra", { destino: "md-lista" });
      doc.enlaces([["Volver a la lista", "lista"]]);
      doc.mono(Compra.exportarTexto(menu, lista, { formato: "markdown", incluirBasicos: a.incluirBasicos }));
      for (const s of slots) {
        const r = Recetas.porId(s.recetaId);
        doc.titulo2(r.nombre, { destino: "md-" + kSlot(s) });
        doc.enlaces([["Volver a la receta", kSlot(s)], ["Volver al plan", "plan"]]);
        doc.mono(Recetas.aMarkdown(r, s.raciones || menu.raciones));
      }

      doc.adjuntar("menu-completo.md", completo, "Plan, lista de la compra y recetas en Markdown");
      doc.adjuntar("plan-de-comidas.md", mdPlan(1), "Plan de comidas en Markdown");
      doc.adjuntar("lista-de-la-compra.md", Compra.exportarTexto(menu, lista, { formato: "markdown", incluirBasicos: a.incluirBasicos }), "Lista de la compra en Markdown");
      doc.adjuntar("recetas.md", mdRecetas(1), "Todas las recetas en Markdown");

      const slug = Catalogo.normalizar(menu.nombre).replace(/[^a-z0-9ñ]+/g, "-").replace(/^-|-$/g, "") || "menu";
      UI.descargar(`${slug}.pdf`, doc.bytes(), "application/pdf");
      UI.toast(`PDF descargado: ${doc.paginas.length} páginas.`);
      return doc;
    };
    window.Menus.exportarPDF = (id) => (id === menu.id ? exportarPDF() : null);

    const copiarMd = async (texto, que) => { const ok = await Compra.copiarAlPortapapeles(texto); UI.toast(ok ? `${que} copiado en Markdown.` : "No se pudo copiar automáticamente.", ok ? "ok" : "error"); };
    const exportar = h("div.barra-exportar", { role: "group", "aria-label": "Exportar el menú" },
      h("button.btn.btn-mini.btn-primario", { type: "button", title: "PDF con el plan de comidas como índice enlazado, la lista de la compra, todas las recetas y el Markdown para copiar", onClick: () => exportarPDF() }, "📄 Exportar a PDF"),
      h("span.barra-exportar-titulo", "📋 Copiar en Markdown:"),
      h("button.btn.btn-mini", { type: "button", title: "Solo el plan: qué se come cada día", onClick: () => copiarMd(mdPlan(), "Plan de comidas") }, "🗓 Plan de comidas"),
      h("button.btn.btn-mini", { type: "button", title: "Todas las recetas del menú, una detrás de otra, con las raciones del menú", onClick: () => copiarMd(mdRecetas(), "Todas las recetas") }, "📖 Todas las recetas"),
      h("button.btn.btn-mini", { type: "button", title: "Plan de comidas, lista de la compra y todas las recetas en un solo documento", onClick: () => copiarMd(`# ${menu.nombre}\n\n${mdPlan(2)}\n${mdCompra(2)}\n${mdRecetas(2)}`, "Menú completo con la lista de la compra") }, "🛒📖 Lista de la compra + menú completo")
    );

    const cab = h("header.vista-cab.vista-cab-menu",
      h("div", h("a.enlace-volver", { href: "#/menus" }, "← Mis menús"), h("h1", menu.nombre), h("p.vista-desc", `${menu.slots.filter((s) => s.recetaId).length} comidas · ${(menu.personas || []).map((p) => `${p.avatar || ""} ${p.nombre}`.trim()).join(", ")} · ${Number(menu.raciones).toLocaleString("es-ES")} raciones por comida · creado el ${UI.fmtFecha(menu.creado)}`)),
      h("div.acciones-cab",
        h("button.btn.btn-suave", { type: "button", onClick: async () => { const n = await UI.pedirTexto({ titulo: "Renombrar menú", etiqueta: "Nombre", valor: menu.nombre }); if (n) { menu.nombre = n; guardar(menu); window.App.render(); } } }, "✏️ Renombrar"),
        h("button.btn.btn-suave", { type: "button", title: "Abrir el asistente con la misma configuración", onClick: () => { window.Vistas.wizard.cargarConfig(menu.cfg || {}); window.App.ir("/wizard"); } }, "🔁 Rehacer con esta configuración"),
        h("button.btn.btn-peligro-suave", { type: "button", onClick: async () => { if (await UI.confirmar({ titulo: "Borrar menú", mensaje: `¿Borrar «${menu.nombre}»? No se puede deshacer.`, textoOk: "Borrar", peligro: true })) { borrar(menu.id); UI.toast("Menú borrado"); window.App.ir("/menus"); } } }, "🗑 Borrar")
      )
    );

    const tabs = h("div.tabs", { role: "tablist" });
    const panel = h("div.tab-panel", { role: "tabpanel" });
    const pintarTabs = () => {
      UI.vaciar(tabs);
      for (const t of [{ id: "menu", nombre: "📅 Menú semanal" }, { id: "compra", nombre: "🛒 Lista de la compra" }, { id: "resumen", nombre: "ℹ️ Resumen" }]) tabs.appendChild(h("button.tab", { type: "button", role: "tab", "aria-selected": pestana === t.id ? "true" : "false", class: pestana === t.id ? "activa" : "", onClick: () => { pestana = t.id; pintarTabs(); pintarPanel(); } }, t.nombre));
    };
    const pintarPanel = () => { UI.vaciar(panel); (pestana === "compra" ? pintarCompra : pestana === "menu" ? pintarMenu : pintarResumen)(panel); };

    /* --- Lista de la compra --- */
    const pintarCompra = (p) => {
      const aj = ajustes();
      const marcados = new Set(menu.marcados);
      const claveItem = (it) => it.clave;
      const persistir = () => { menu.marcados = [...marcados]; guardar(menu); };
      const totalItems = lista.items.filter((i) => i.pasillo !== "basicos" && i.pasillo !== "en-casa").length;
      const progreso = h("div.progreso", { "aria-live": "polite" });
      const pintarProgreso = () => { const n = lista.items.filter((i) => i.pasillo !== "basicos" && i.pasillo !== "en-casa" && marcados.has(claveItem(i))).length; UI.vaciar(progreso); UI.append(progreso, h("span.progreso-barra", h("span.progreso-relleno", { style: { width: (totalItems ? (n / totalItems) * 100 : 0) + "%" } })), h("span.muted", `${n} de ${totalItems} en el carro`)); };

      const selFormato = h("select.input", { "aria-label": "Formato al copiar", onChange: (e) => { guardarAjustes({ formatoCopia: e.target.value }); pintarAyudaFormato(); } }, Compra.FORMATOS.map((f) => h("option", { value: f.id, selected: aj.formatoCopia === f.id }, f.nombre)));
      const chkBasicos = h("label.check-inline", h("input", { type: "checkbox", checked: !!aj.incluirBasicos, onChange: (e) => { guardarAjustes({ incluirBasicos: e.target.checked }); pintarPanel(); } }), "Incluir básicos (sal, aceite…)");
      const ayudaFormato = h("p.campo-ayuda.ayuda-formato");
      const pintarAyudaFormato = () => { const f = Compra.FORMATOS.find((x) => x.id === ajustes().formatoCopia); UI.vaciar(ayudaFormato); if (f) UI.append(ayudaFormato, h("code", f.ejemplo), " — ", f.desc); };
      pintarAyudaFormato();
      const copiar = async () => {
        const a = ajustes();
        const texto = Compra.exportarTexto(menu, lista, { formato: a.formatoCopia, incluirBasicos: a.incluirBasicos, marcados: [...marcados] });
        const html = a.formatoCopia === "casillas" ? Compra.exportarHTML(menu, lista, { incluirBasicos: a.incluirBasicos }) : null;
        const ok = await Compra.copiarAlPortapapeles(texto, html);
        UI.toast(ok ? "Lista copiada. Pégala en Samsung Notes, Google Docs o donde quieras." : "No se pudo copiar automáticamente; usa «Ver texto» y cópialo a mano.", ok ? "ok" : "error");
      };
      const verTexto = () => {
        const a = ajustes();
        const texto = Compra.exportarTexto(menu, lista, { formato: a.formatoCopia, incluirBasicos: a.incluirBasicos, marcados: [...marcados] });
        const ta = h("textarea.input.textarea.texto-exportado", { rows: 18, readonly: true, "aria-label": "Texto de la lista" }, texto);
        const m = UI.modal({ titulo: "Texto de la lista", ancho: "md", contenido: [h("p.muted", "Selecciona y copia este texto si el botón de copiar no funciona en tu navegador."), ta], pie: [h("button.btn.btn-primario", { type: "button", onClick: async () => { ta.select(); const ok = await Compra.copiarAlPortapapeles(texto); UI.toast(ok ? "Copiado" : "Selecciona el texto y copia con Ctrl+C", ok ? "ok" : "info"); } }, "Copiar")] });
        setTimeout(() => ta.select(), 50);
      };
      const btnCompartir = navigator.share ? h("button.btn", { type: "button", onClick: async () => { const a = ajustes(); const texto = Compra.exportarTexto(menu, lista, { formato: a.formatoCopia, incluirBasicos: a.incluirBasicos }); const ok = await Compra.compartir(`Lista de la compra · ${menu.nombre}`, texto); if (!ok) UI.toast("No se pudo compartir; prueba a copiar.", "info"); } }, "📤 Compartir") : null;

      const secciones = h("div.secciones-compra");
      for (const pas of lista.porPasillo) {
        const esBasico = pas.id === "basicos" || pas.id === "en-casa";
        const ul = h("ul.lista-compra");
        for (const it of pas.items) {
          const k = claveItem(it);
          const li = h("li.item-compra", { class: marcados.has(k) ? "hecho" : "" });
          const chk = h("input", { type: "checkbox", checked: marcados.has(k), "aria-label": `${it.n} en el carro`, onChange: (e) => { if (e.target.checked) marcados.add(k); else marcados.delete(k); li.classList.toggle("hecho", e.target.checked); persistir(); pintarProgreso(); } });
          UI.append(li, h("label.item-label", chk, h("span.item-nombre", it.n.charAt(0).toUpperCase() + it.n.slice(1), it.opcional ? h("span.muted", " (opcional)") : null), h("span.item-cant", Compra.textoCantidad(it))),
            h("details.item-detalle", h("summary", { title: "¿Para qué recetas?" }, `${it.recetas.length} ${UI.plural(it.recetas.length, "receta", "recetas")}`), h("ul", it.recetas.map((rn) => h("li", rn)))));
          ul.appendChild(li);
        }
        const sec = h("details.seccion-pasillo", { open: !esBasico }, h("summary", h("span.pasillo-icono", pas.icono), h("span.pasillo-nombre", pas.nombre), h("span.chip.chip-mini", String(pas.items.length))), ul);
        secciones.appendChild(sec);
      }

      pintarProgreso();
      UI.append(p, 
        h("div.barra-compra",
          h("div.barra-compra-copiar", h("label.campo.campo-inline", h("span.campo-etiqueta", "Formato"), selFormato), h("button.btn.btn-primario", { type: "button", onClick: copiar }, "📋 Copiar lista"), btnCompartir, h("button.btn.btn-suave", { type: "button", onClick: verTexto }, "Ver texto"), h("button.btn.btn-suave", { type: "button", onClick: () => window.print() }, "🖨 Imprimir")),
          ayudaFormato,
          h("div.barra-compra-opciones", chkBasicos, h("button.btn.btn-mini.btn-suave", { type: "button", onClick: () => { marcados.clear(); persistir(); pintarPanel(); } }, "Desmarcar todo"))
        ),
        progreso,
        secciones,
        h("details.ayuda-pegado", h("summary", "¿Cómo pegarla como lista de tareas?"), h("ul",
          h("li", h("strong", "Samsung Notes: "), "pega la lista; si no aparecen casillas, selecciona las líneas y pulsa el botón de ", h("em", "lista de tareas"), " (icono ☑) de la barra de formato. Con el formato «Casillas ☐» el símbolo ya se ve aunque no sea interactivo."),
          h("li", h("strong", "Google Docs: "), "con el formato Markdown, pega con clic derecho → ", h("em", "Pegar desde Markdown"), " (o activa Herramientas → Preferencias → Markdown) y cada línea se convertirá en casilla."),
          h("li", h("strong", "Google Keep, Notion, Obsidian, Joplin: "), "el formato Markdown se convierte en lista de comprobación al pegarlo en una nota de tipo lista."),
          h("li", h("strong", "En el móvil: "), "usa «Compartir» para enviarla directamente a Samsung Notes, WhatsApp o la app que quieras.")
        ))
      );
    };

    /* --- Menú semanal --- */
    const pintarMenu = (p) => {
      const dias = Planificador.DIAS.filter((d) => menu.slots.some((s) => s.dia === d.id));
      p.appendChild(h("div.grid-semana.grid-semana-lectura", dias.map((d) => h("div.columna-dia", h("h3.dia-titulo", d.nombre), ["comida", "cena"].map((m) => {
        const s = menu.slots.find((x) => x.dia === d.id && x.momento === m);
        if (!s) return null;
        const r = s.recetaId ? Recetas.porId(s.recetaId) : null;
        return h("div.slot", { class: s.obligatoria ? "slot-obligatoria" : "" },
          h("div.slot-cab", h("span.slot-momento", Recetas.MOMENTOS.find((x) => x.id === m).icono, " ", m === "comida" ? "Comida" : "Cena"), s.obligatoria ? h("span.chip.chip-mini.chip-fija", "📌 fija") : null, (s.usa || []).length ? h("span.chip.chip-mini.chip-usa", { title: "Usa ingredientes que pediste" }, "🥕 ", s.usa.join(", ")) : null),
          r ? h("button.slot-receta", { type: "button", onClick: () => window.Vistas.recetas.abrirDetalle(r.id, { raciones: s.raciones || menu.raciones }) }, h("span.slot-cat", Recetas.categoria(r.categoria).icono), h("span.slot-nombre", r.nombre), h("small.muted", `${r.tiempo} min · ${r.nutricion.kcal || "?"} kcal/ración`)) : h("p.muted", "Receta no disponible (se borró de la base de datos)"),
          r ? h("div.slot-acciones", h("button.btn.btn-mini.btn-suave", { type: "button", title: `Copiar «${r.nombre}» en Markdown, con las raciones del menú`, "aria-label": `Copiar ${r.nombre} en Markdown`, onClick: () => Recetas.copiarMarkdown(r.id, s.raciones || menu.raciones) }, "📋 Copiar")) : null
        );
      })))));
      p.appendChild(h("p.campo-ayuda", `Al abrir una receta verás las cantidades ya escaladas a ${Number(menu.raciones).toLocaleString("es-ES")} raciones.`));
    };

    /* --- Resumen --- */
    const pintarResumen = (p) => {
      const cfg = Planificador.normalizarConfig(menu.cfg || {});
      const res = Planificador.resumenNutricional(menu.slots);
      const vetos = (cfg.vetos || []).map((v) => { const g = Catalogo.GRUPOS.find((x) => x.id === v); return g ? `${g.icono} ${g.nombre}` : v; });
      const nombreCocina = (id) => { const c = Recetas.cocina(id); return c ? `${c.icono} ${c.nombre}` : id; };
      const tiempoTxt = (v) => (v ? (Planificador.TIEMPOS.find(([n]) => n === v) || [])[1] || `${v} min` : "Sin límite");
      const contTxt = (v) => (Planificador.CONTUNDENCIA_OPCIONES.find((o) => o.id === v) || {}).nombre || v;
      const chips = (obj, fn) => h("div.resumen-categorias", Object.entries(obj).map(([c, n]) => { const d = fn(c); return d ? h("span.chip.chip-mini", d.icono, " ", d.nombre, ": ", String(n)) : null; }));
      UI.append(p,
        h("section.bloque", h("h3", "Personas"), h("ul.lista-simple", (menu.personas || []).map((per) => h("li", `${per.avatar || "🙂"} ${per.nombre}`))), h("p.muted", `${Number(menu.raciones).toLocaleString("es-ES")} raciones estándar por comida.`)),
        res ? h("section.bloque", h("h3", "Media por ración"), h("div.nut-grid", h("div.nut-item", h("strong", res.media.kcal), h("span", "kcal")), h("div.nut-item", h("strong", res.media.prot, " g"), h("span", "proteína")), h("div.nut-item", h("strong", res.media.hc, " g"), h("span", "hidratos")), h("div.nut-item", h("strong", res.media.grasa, " g"), h("span", "grasa"))),
          h("div.resumen-categorias", Object.entries(res.porCategoria).map(([c, n]) => h("span.chip", Recetas.categoria(c).icono, " ", Recetas.categoria(c).nombre, ": ", String(n)))),
          chips(res.porContundencia, Recetas.contundencia), chips(res.porCoste, Recetas.coste)) : null,
        h("section.bloque", h("h3", "Configuración usada"),
          h("dl.dl",
            h("dt", "Frecuencias"), h("dd", Recetas.CATEGORIAS.filter((c) => (cfg.frecuencias || {})[c.id] && cfg.frecuencias[c.id] !== "normal").map((c) => `${c.icono} ${c.nombre}: ${cfg.frecuencias[c.id]}`).join(" · ") || "Todas en «normal»"),
            h("dt", "Cocinas"), h("dd", [cfg.cocinasPreferidas.length ? "Preferidas: " + cfg.cocinasPreferidas.map(nombreCocina).join(", ") : "", cfg.cocinasEvitar.length ? "Evitadas: " + cfg.cocinasEvitar.map(nombreCocina).join(", ") : ""].filter(Boolean).join(" · ") || "Sin preferencia"),
            h("dt", "Dieta"), h("dd", (cfg.dietas || []).length ? cfg.dietas.map((d) => (Recetas.DIETAS.find((x) => x.id === d) || {}).nombre || d).join(", ") : "Sin restricciones"),
            h("dt", "Vetos"), h("dd", vetos.length ? vetos.join(", ") : "Ninguno"),
            h("dt", "Recetas fijas"), h("dd", (cfg.obligatorias || []).length ? cfg.obligatorias.map((o) => (Recetas.porId(o.recetaId) || {}).nombre || "?").join(", ") : "Ninguna"),
            h("dt", "Tiempo máximo"), h("dd", `Entre semana: ${tiempoTxt(cfg.tiempo.laborables)} · Fin de semana: ${tiempoTxt(cfg.tiempo.finde)} · ${cfg.tiempo.estricto ? "estricto" : "orientativo"}`),
            h("dt", "Contundencia"), h("dd", `Comidas: ${contTxt(cfg.contundencia.comida)} · Cenas: ${contTxt(cfg.contundencia.cena)}`),
            h("dt", "Presupuesto"), h("dd", (Planificador.PRESUPUESTOS.find((x) => x.id === cfg.presupuesto) || {}).nombre || "Da igual"),
            h("dt", "Repeticiones"), h("dd", `${cfg.evitarRepetidasSemanas ? "Sin recetas de los últimos " + (Planificador.SEMANAS_SIN_REPETIR.find(([n]) => n === cfg.evitarRepetidasSemanas) || [])[1] : "Sin restricción de menús anteriores"} · ${cfg.permitirRepetir ? "permite sobras" : "sin repetir en la semana"}`),
            h("dt", "Aparatos"), h("dd", (cfg.equipo || []).map((a) => (Planificador.APARATOS.find((x) => x.id === a) || {}).nombre || a).join(", ") || "Solo fuegos"),
            h("dt", "Cocción preferida"), h("dd", (cfg.coccionesPreferidas || []).map((c) => (Recetas.coccion(c) || {}).nombre || c).join(", ") || "Sin preferencia"),
            h("dt", "Tupper"), h("dd", (Planificador.TUPPER.find((t) => t.id === cfg.tupper) || {}).nombre || "No hace falta")
          ))
      );
    };

    pintarTabs(); pintarPanel();
UI.append(cont, cab, exportar, tabs, panel);
  };

  const render = (cont, params) => { UI.vaciar(cont); if (params && params.id) renderDetalle(cont, params.id); else renderLista(cont); };

  window.Vistas = window.Vistas || {};
  window.Vistas.menus = { render };
})();
