/* Vista: información legal (aviso legal, privacidad y cookies) y gestión del consentimiento.
   Normativa de referencia: RGPD (UE 2016/679), LOPDGDD (LO 3/2018), LSSI-CE (Ley 34/2002) y directiva ePrivacy.
   Los datos del titular se rellenan en TITULAR; los campos vacíos no se muestran. */
(function () {
  "use strict";
  const { UI } = window;
  const { h } = UI;

  const TITULAR = {
    nombre: "Guillem Carbonell",
    nif: "",
    domicilio: "",
    email: "",
    web: "holafresco.es",
  };
  const ACTUALIZADO = "5 de octubre de 2026";

  const enlace = (href, texto) => h("a", { href, target: "_blank", rel: "noopener" }, texto);
  const contacto = () => h("a", { href: "mailto:" + TITULAR.email }, TITULAR.email);

  /* Panel de consentimiento de Google (plataforma certificada TCF que se activa desde AdSense → Privacidad y mensajes) */
  const gestionarCookies = () => {
    const fc = window.googlefc;
    if (fc && typeof fc.showRevocationMessage === "function") { fc.showRevocationMessage(); return; }
    if (fc && fc.callbackQueue && fc.callbackQueue.push) { fc.callbackQueue.push({ CONSENT_DATA_READY: () => window.googlefc.showRevocationMessage() }); return; }
    UI.toast("El panel de consentimiento no está disponible ahora mismo (puede que un bloqueador lo impida). También puedes borrar las cookies de este sitio desde la configuración de tu navegador.", "info", 7000);
  };

  const PAGINAS = {
    "aviso-legal": {
      titulo: "Aviso legal",
      cuerpo: () => [
        h("h2", "1. Titular del sitio web"),
        h("p", "En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:"),
        h("ul",
          h("li", h("strong", "Titular: "), TITULAR.nombre),
          TITULAR.nif ? h("li", h("strong", "NIF: "), TITULAR.nif) : null,
          TITULAR.domicilio ? h("li", h("strong", "Domicilio: "), TITULAR.domicilio) : null,
          TITULAR.email ? h("li", h("strong", "Correo electrónico: "), contacto()) : null,
          h("li", h("strong", "Sitio web: "), TITULAR.web)),
        h("p", "HolaFresco es un proyecto de Guillem Carbonell y J. Ramírez. Es un servicio gratuito, sin registro y sin venta de productos, y no almacena nada de lo que sus usuarios introducen; solo recibe estadísticas de visitas agregadas si se aceptan en el aviso de consentimiento (ver la política de privacidad)."),
        h("h2", "2. Objeto y condiciones de uso"),
        h("p", "HolaFresco es un recetario y planificador de menús semanales de uso gratuito y sin registro. El acceso y el uso del sitio implican la aceptación de este aviso legal. Te comprometes a usarlo conforme a la ley y a no emplearlo para fines ilícitos o que perjudiquen a terceros o al funcionamiento del sitio."),
        h("h2", "3. Información nutricional, alergias y salud"),
        h("p", "Las recetas, los valores nutricionales, las raciones y la detección de alérgenos e intolerancias son ", h("strong", "orientativos"), ": se calculan automáticamente a partir de los nombres de los ingredientes y pueden contener errores. No sustituyen el consejo de un profesional sanitario ni la lectura de las etiquetas de los productos. Si tú o alguien de tu hogar tiene una alergia o una condición médica, comprueba siempre los ingredientes y consulta a tu médico o dietista-nutricionista."),
        h("h2", "4. Propiedad intelectual"),
        h("p", "El código fuente de HolaFresco se publica con licencia GNU GPL (ver el repositorio del proyecto). Los textos de las recetas, el diseño y el nombre pertenecen a sus autores. La fotografía de la portada es de Stefan Vladimirov, publicada en Unsplash bajo la licencia de Unsplash. Puedes compartir enlaces a las recetas; para otros usos de los contenidos se necesita la autorización de sus autores."),
        h("h2", "5. Responsabilidad"),
        h("p", "El titular no garantiza la ausencia de errores en los contenidos ni la disponibilidad continua del sitio, y no responde de los daños derivados del uso de la información publicada ni de los contenidos de sitios de terceros enlazados. Los anuncios los sirve Google y su contenido no está controlado por el titular."),
        h("h2", "6. Legislación aplicable"),
        h("p", "Este aviso legal se rige por la legislación española. Si eres consumidor, puedes acudir a los tribunales de tu domicilio. La Comisión Europea ofrece una plataforma de resolución de litigios en línea en ", enlace("https://ec.europa.eu/consumers/odr", "ec.europa.eu/consumers/odr"), "."),
      ],
    },
    "privacidad": {
      titulo: "Política de privacidad",
      cuerpo: () => [
        h("div.legal-resumen",
          h("p", h("strong", "HolaFresco no recoge, no almacena y no tiene acceso a nada de lo que escribes en la aplicación.")),
          h("ul",
            h("li", "No hay cuentas, registro ni formularios que se envíen a ningún sitio."),
            h("li", "No tenemos servidor ni base de datos: todo lo que introduces (personas del hogar, edades, pesos, intolerancias y alergias, menús, listas de la compra, recetas propias y ajustes) se guarda ", h("strong", "solo en tu navegador"), ", en tu dispositivo, y nunca nos llega."),
            h("li", "Si borras los datos del sitio en tu navegador o usas «Borrar datos» en ⚙️ Ajustes, desaparecen por completo. Nosotros no podemos verlos, recuperarlos ni borrarlos, porque no los tenemos."),
            h("li", "Lo único que sale de tu dispositivo al visitar la web son datos técnicos que tratan el servicio de alojamiento (GitHub), las estadísticas de visitas (Google Analytics, solo si lo aceptas) y la publicidad (Google, con tu consentimiento para fines personalizados). Te lo explicamos abajo.")),
        ),
        h("h2", "1. Responsable"),
        h("p", h("strong", "Guillem Carbonell"), ". HolaFresco no guarda nada de lo que introduces en la aplicación: todo lo controlas tú desde tu navegador. Las únicas estadísticas que recibe son las de Google Analytics, agregadas y solo si las aceptas."),
        h("h2", "2. Tus datos se quedan en tu navegador"),
        h("p", "La aplicación funciona entera en tu navegador. Los datos que escribes se guardan en su almacenamiento local (localStorage) para que la próxima vez sigan ahí, igual que un documento guardado en tu propio ordenador. ", h("strong", "No se transmiten al responsable ni a ningún tercero"), ", y el responsable no realiza ningún tratamiento de esos datos: no los recogen, no los consultan, no los analizan y no los ceden."),
        h("p", "Las intolerancias, alergias y datos físicos son información sensible. Como solo existen en tu dispositivo, quien tenga acceso a él podría verlos: si lo compartes, usa apodos en lugar de nombres reales. Puedes exportarlos (para pasarlos a otro dispositivo) o borrarlos en cualquier momento desde ⚙️ Ajustes."),
        h("h2", "3. Datos técnicos del alojamiento"),
        h("p", "El sitio se aloja en GitHub Pages (GitHub, Inc., EE. UU.). Al visitarlo, GitHub registra datos técnicos como tu dirección IP para servir la web y garantizar su seguridad. ", h("strong", "Base jurídica: "), "interés legítimo en ofrecer un sitio web seguro (art. 6.1.f RGPD). Más información en la ", enlace("https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement", "declaración de privacidad de GitHub"), "."),
        h("h2", "4. Estadísticas de uso (Google Analytics)"),
        h("p", "Si lo aceptas en el aviso de consentimiento, usamos Google Analytics 4 (Google Ireland Limited) para conocer de forma agregada cuántas personas visitan la web, qué pantallas se usan, desde qué tipo de dispositivo y país. Sirve para mejorar HolaFresco; no lo usamos para identificarte ni lo cruzamos con otros datos, y nunca incluye lo que escribes en la aplicación (personas, intolerancias, menús o recetas)."),
        h("ul",
          h("li", h("strong", "Base jurídica: "), "tu consentimiento (art. 6.1.a RGPD y art. 22.2 LSSI-CE). Mientras no lo des, Google Analytics funciona en modo de consentimiento denegado: no instala cookies de analítica."),
          h("li", h("strong", "Datos: "), "identificador de navegador seudónimo, páginas vistas, fecha y hora, idioma, tipo de dispositivo y navegador y ubicación aproximada (Google Analytics 4 no almacena tu dirección IP)."),
          h("li", h("strong", "Conservación: "), "los datos de uso se conservan un máximo de 14 meses en Google Analytics."),
          h("li", h("strong", "Transferencias internacionales: "), "Google LLC (EE. UU.) está adherida al Marco de Privacidad de Datos UE-EE. UU."),
          h("li", h("strong", "Retirar el consentimiento: "), "en cualquier momento desde «Gestionar cookies», en el pie de página, o con el ", enlace("https://tools.google.com/dlpage/gaoptout?hl=es", "complemento de inhabilitación de Google Analytics"), ".")),
        h("h2", "5. Publicidad (Google AdSense)"),
        h("p", "Para financiar el proyecto, el sitio muestra anuncios de Google AdSense (Google Ireland Limited). Google puede usar cookies e identificadores para mostrar anuncios, medir su rendimiento, prevenir el fraude y, si lo aceptas, personalizarlos según tus intereses. Al entrar se te pide el consentimiento mediante una plataforma de gestión del consentimiento certificada (IAB TCF); puedes aceptar, rechazar o elegir por finalidades, y cambiar tu decisión cuando quieras desde «Gestionar cookies» en el pie de página."),
        h("ul",
          h("li", h("strong", "Base jurídica: "), "tu consentimiento (art. 6.1.a RGPD y art. 22.2 LSSI-CE) para cookies y publicidad personalizada; si lo rechazas, Google puede mostrar anuncios no personalizados o limitados, que usan cookies solo para fines como la prevención del fraude."),
          h("li", h("strong", "Destinatarios: "), "Google y, según tus elecciones, sus socios publicitarios certificados."),
          h("li", h("strong", "Transferencias internacionales: "), "Google LLC (EE. UU.) está adherida al Marco de Privacidad de Datos UE-EE. UU. y aplica cláusulas contractuales tipo."),
          h("li", h("strong", "Más información: "), enlace("https://policies.google.com/technologies/partner-sites?hl=es", "cómo usa Google los datos de los sitios que usan sus servicios"), " y ", enlace("https://adssettings.google.com", "configuración de anuncios de Google"), ".")),
        h("h2", "6. Plazos de conservación"),
        h("p", "Los datos de tu navegador permanecen hasta que los borras. Los datos de Google Analytics, un máximo de 14 meses. Los datos técnicos y publicitarios se conservan durante los plazos que indican GitHub y Google en sus políticas y, para las cookies, los que detalla la política de cookies."),
        h("h2", "7. Tus derechos"),
        h("p", "Como HolaFresco no guarda datos tuyos, los que tienes en el navegador los controlas tú directamente: puedes verlos, corregirlos, exportarlos (portabilidad) o borrarlos desde la propia aplicación. Para los datos que tratan Google (estadísticas y publicidad) o GitHub (alojamiento), puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad ante ellos, y retirar en cualquier momento tu consentimiento publicitario desde «Gestionar cookies». Si consideras que no se han respetado tus derechos, puedes reclamar ante la ", enlace("https://www.aepd.es", "Agencia Española de Protección de Datos"), " (aepd.es)."),
        h("h2", "8. Menores de edad"),
        h("p", "El sitio no está dirigido a menores de 14 años. Si eres menor de esa edad, no aceptes la publicidad personalizada sin el consentimiento de tus padres o tutores (art. 7 LOPDGDD)."),
        h("h2", "9. Cambios en esta política"),
        h("p", "Podemos actualizar esta política para adaptarla a cambios legales o del servicio. La fecha de la última actualización figura al final."),
      ],
    },
    "cookies": {
      titulo: "Política de cookies",
      cuerpo: () => [
        h("p", "Una cookie es un pequeño archivo que un sitio web guarda en tu navegador. En esta política explicamos qué cookies y tecnologías similares (como el almacenamiento local) usa HolaFresco, con qué finalidad y cómo puedes gestionarlas, conforme al artículo 22.2 de la LSSI-CE y a la guía sobre el uso de cookies de la AEPD."),
        h("h2", "1. Almacenamiento local propio (técnico, no requiere consentimiento)"),
        h("p", "HolaFresco guarda tus datos en el almacenamiento local (localStorage) del navegador para que la aplicación funcione: es estrictamente necesario para prestar el servicio que pides y no se comparte con nadie."),
        h("div.tabla-legal", h("table",
          h("thead", h("tr", h("th", "Clave"), h("th", "Para qué sirve"), h("th", "Duración"))),
          h("tbody", [
            ["recetador.ajustes", "Estilo visual y preferencias de la lista de la compra"],
            ["recetador.personas", "Personas del hogar, sus datos y sus intolerancias"],
            ["recetador.menus", "Menús guardados y casillas marcadas de la lista de la compra"],
            ["recetador.borradorWizard", "Borrador del asistente de menú"],
            ["recetador.favoritos · listaNegra", "Recetas favoritas y excluidas de los menús"],
            ["recetador.recetasPropias · recetasOverrides · recetasBorradas", "Recetas creadas, modificadas u ocultadas por ti"],
            ["recetador.filtrosRecetas", "Últimos filtros usados en el buscador"],
          ].map(([k, d]) => h("tr", h("td", h("code", k)), h("td", d), h("td", "Hasta que la borres")))))),
        h("h2", "2. Cookies de terceros: Google Analytics y Google AdSense (requieren consentimiento)"),
        h("p", "Google instala cookies para gestionar tu consentimiento y, según lo que elijas, para medir las visitas (analítica) y para mostrar y medir anuncios (publicidad). No se instalan cookies de analítica ni publicitarias personalizadas sin tu consentimiento."),
        h("div.tabla-legal", h("table",
          h("thead", h("tr", h("th", "Cookie"), h("th", "Titular"), h("th", "Finalidad"), h("th", "Duración aprox."))),
          h("tbody", [
            ["FCCDCF, FCNEC", "Google", "Guardar tus elecciones de consentimiento (técnica)", "13 meses"],
            ["_ga", "Google Analytics", "Analítica: distinguir visitantes de forma seudónima", "2 años"],
            ["_ga_35Y5H4Y32X", "Google Analytics", "Analítica: mantener el estado de la sesión", "2 años"],
            ["__gads, __gpi", "Google", "Publicidad: frecuencia, medición y, con consentimiento, personalización", "13 meses"],
            ["__eoi", "Google", "Seguridad y prevención del fraude publicitario", "6 meses"],
            ["IDE, test_cookie (doubleclick.net)", "Google", "Publicidad personalizada y comprobación de cookies", "13 meses / 15 min"],
          ].map((f) => h("tr", f.map((c) => h("td", c))))))),
        h("p", "La lista exacta puede variar según tus elecciones y las actualizaciones de Google. Consulta la ", enlace("https://policies.google.com/technologies/cookies?hl=es", "información de Google sobre cookies"), "."),
        h("h2", "3. Cómo gestionar o retirar el consentimiento"),
        h("p", "Puedes cambiar tus preferencias en cualquier momento:"),
        h("p", h("button.btn.btn-primario", { type: "button", onClick: gestionarCookies }, "🍪 Gestionar cookies")),
        h("p", "También puedes bloquear o borrar las cookies desde tu navegador: ",
          enlace("https://support.google.com/chrome/answer/95647?hl=es", "Chrome"), " · ",
          enlace("https://support.mozilla.org/es/kb/Borrar%20cookies", "Firefox"), " · ",
          enlace("https://support.apple.com/es-es/guide/safari/sfri11471/mac", "Safari"), " · ",
          enlace("https://support.microsoft.com/es-es/microsoft-edge", "Edge"), ". Si borras el almacenamiento local, perderás tus personas, menús y recetas guardados: exporta antes una copia desde ⚙️ Ajustes."),
      ],
    },
  };

  const render = (cont, params = {}) => {
    const pag = PAGINAS[params.id] || PAGINAS["privacidad"];
    UI.append(cont,
      h("article.legal",
        h("nav.legal-nav", { "aria-label": "Información legal" }, Object.entries(PAGINAS).map(([id, p]) => h("a", { href: "#/legal/" + id, class: p === pag ? "activo" : "", "aria-current": p === pag ? "page" : null }, p.titulo))),
        h("h1", pag.titulo),
        pag.cuerpo(),
        h("p.muted.legal-fecha", "Última actualización: " + ACTUALIZADO)));
    document.title = pag.titulo + " · HolaFresco";
  };

  /* Enlaces del pie de página, visibles en todas las pantallas */
  const enlacesPie = () => h("nav.pie-legal", { "aria-label": "Información legal" },
    h("a", { href: "#/legal/aviso-legal" }, "Aviso legal"), " · ",
    h("a", { href: "#/legal/privacidad" }, "Privacidad"), " · ",
    h("a", { href: "#/legal/cookies" }, "Cookies"), " · ",
    h("button.enlace-boton", { type: "button", onClick: gestionarCookies }, "Gestionar cookies"));

  window.Vistas = window.Vistas || {};
  window.Vistas.legal = { render, enlacesPie, gestionarCookies, TITULAR };
})();
