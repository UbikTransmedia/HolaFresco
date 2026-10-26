# HolaFresco

Recetario, asistente de menú semanal y lista de la compra. Funciona **en local**, sin servidor ni cuentas:
todo se guarda en el navegador (localStorage).

## Cómo abrirlo

**Opción A (recomendada): servidor local**

```bash
cd RecetARIO
python3 -m http.server 8765
```

y abre <http://localhost:8765> en el navegador.

**Opción B: doble clic en `index.html`.** Funciona en Firefox y Chrome; si algún navegador bloquea los scripts
locales (`file://`), usa la opción A.

Para usarlo en el móvil, sirve la carpeta desde el ordenador (opción A) y abre `http://IP-DEL-ORDENADOR:8765`
desde la misma wifi, o copia la carpeta al móvil y ábrela con un navegador que admita ficheros locales.

## Qué hay dentro

| Sección | Qué hace |
|---|---|
| 🍳 **Recetas** | **5.378 recetas** en 10 tipos de comida (legumbres, pescado, carnes, huevos, verduras, tofu/tempeh/seitán, ensaladas, pasta y arroces, sopas y cremas, olla exprés): **64 originales** (📄, desarrolladas a partir de los títulos de un recetario de partida, no incluido en el repositorio) y **5.314 derivadas** (✨). Entre las derivadas: 700 de **fácil digestión** para intestino irritable o hinchazón (50 por cada cocina: bajas en FODMAP con las raciones de Monash, sin picante, alcohol ni fritos y con grasa moderada), 540 de las cocinas **italiana, griega y eslava** (20 por categoría y cocina, la mitad tradicionales, etiqueta «tradicional», y la otra mitad versiones libres, etiqueta «creativa»), 100 del **Sudeste asiático**, 90 de cocina **africana** (subsahariana), 60 sin ninguno de los 14 alérgenos, 40 bajas en FODMAP, 40 de primavera y otoño, 30 de slow cooker y sin fuego, 25 de aprovechamiento de sobras, 500 que cubren los huecos de una revisión del recetario (ver `docs/huecos-de-contenido.md`), 300 prácticas para tupper, airfryer y microondas, 300 sin gluten, 300 mediterráneas fáciles y 500 tradicionales saciantes. Además, **875 recetas sencillas** (8-12 ingredientes corrientes, técnica casera): 300 mediterráneas, 300 mediterráneas de fácil digestión, 125 mediterráneas bajas en FODMAP, 100 españolas y 50 españolas de fácil digestión y bajas en FODMAP, con 25 de pollo al horno en versiones distintas y 25 rápidas de 30 minutos o menos. Una revisión de **cocinero práctico** ha simplificado unas 1.090 recetas: menos sartenes, cazos y batidoras y menos elaboraciones separadas (dorar, reservar y seguir en el mismo recipiente; cocer los huevos en el agua de las patatas…), sin añadir ingredientes ni subir las calorías y respetando la técnica de los platos tradicionales. Cerca de una de cada cuatro recetas trae una **«Versión alternativa»** bajo el consejo del cocinero: un sustituto fácil de encontrar para un ingrediente poco común o caro, o el cambio de aparato (olla exprés ↔ cazuela, airfryer ↔ horno…) con sus tiempos, siempre respetando la dieta de la receta. **Tipo de cocina** (española, mediterránea, italiana, griega, asiática, sudeste asiático, india, Oriente Medio y Magreb, hispanoamericana, europea, eslava, africana, angloamericana y fusión; todas tienen al menos 10 recetas de cada categoría), **contundencia** (ligera / media / contundente) y **coste** (económica / media / premium). Búsqueda por nombre, ingrediente, cocina o etiqueta; filtros por todo lo anterior más dieta, momento y tiempo. **Forma de cocción** (sin fuego, todo en una olla, todo al horno, airfryer, microondas, slow cooker, olla exprés; la olla exprés se filtra en «Más filtros → Cocción»), **apta para tupper** (🥡) **dieta** (toda, vegetariana, vegana, keto o detox, a elegir una; «Toda» no filtra) y **necesidades** (verduras escondidas, sin verduras, superalimentos, poco especiada, bajo en colesterol, fácil digestión), asignadas en una revisión de nutricionista receta a receta. **Alérgenos e intolerancias** de cada receta (los 14 alérgenos de declaración obligatoria, más legumbres y FODMAP), con aviso «No apta para…» según las personas del hogar y filtros «Sin …» y «Aptas para todo mi hogar». **Favoritas** (★) y **excluidas de menús** (🚫). Alta, edición, duplicado; ocultar recetas (recuperables desde Ajustes). Cada receta se escala a las raciones que quieras. |
| 🪄 **Nuevo menú** | Asistente en 7 pasos: personas (sexo, edad, peso, altura, actividad, objetivos e **intolerancias o alergias**), días y comidas, gustos (frecuencia por tipo de plato, cocinas del mundo preferidas o a evitar, dietas), ajustes (aparatos que tienes y formas de cocinar preferidas; platos para tupper en las comidas entre semana, en todas las comidas o en todo; tiempo máximo entre semana y fin de semana, estricto u orientativo; contundencia de comidas y cenas; presupuesto económico/medio/premium; no repetir recetas de las últimas semanas; sobras; olla exprés), vetos (las intolerancias del hogar se aplican siempre; además, grupos de alérgenos o ingredientes concretos), recetas fijas y resultado editable hueco a hueco. El menú **se recalcula automáticamente** al volver al último paso si has cambiado algo. |
| 📅 **Mis menús** | Base de datos de menús generados. Al abrir uno se muestra **primero la lista de la compra** (agrupada por pasillos, con casillas que se recuerdan y botón de copiar) y después el menú semanal y un resumen de la configuración usada. |
| 📄 **Exportar** | Desde cada menú guardado: **PDF** (plan de comidas como índice enlazado a cada receta, lista de la compra con casillas, una receta por página, marcadores y un anexo con el Markdown para copiar; además lleva adjuntos `menu-completo.md`, `plan-de-comidas.md`, `lista-de-la-compra.md` y `recetas.md`) y copia en **Markdown** del plan de comidas, de la lista de la compra, de todas las recetas o de cada receta suelta. |
| ⚙️ **Ajustes** | Estilo visual (claro por defecto, oscuro, huerta, océano, alto contraste o según el sistema; también con el botón de la esquina superior derecha), exportar/importar copia de seguridad (JSON), recuperar recetas ocultas, borrar datos. |

### Páginas de recetas y publicidad

- `node tools/paginas.js` genera una **página HTML estática por receta** en `recetas/` (ingredientes, pasos, consejo,
  versión alternativa, nutrición calculada, datos estructurados schema.org/Recipe y recetas relacionadas), índices por
  tipo de plato, `sitemap.xml` y `robots.txt`. Se leen sin JavaScript, así que buscadores y AdSense ven el contenido
  real. Hay que volver a ejecutarlo cada vez que cambian las recetas.
- **Dónde hay anuncios:** en cada página de receta (uno tras los ingredientes y otro al final) y, dentro de la
  aplicación, solo debajo de un menú guardado. Nunca en la portada, el asistente, los listados, las ventanas emergentes
  ni las pantallas vacías, que AdSense trata como «pantallas sin contenido del editor». En la cuenta de AdSense
  conviene tener **desactivados los anuncios automáticos** para que Google no los coloque por su cuenta en esas pantallas.

### Reglas del generador

- Las **intolerancias** de las personas que comen esa semana son vetos estrictos. Si un ingrediente afectado es opcional, el menú avisa de que la receta se prepare sin él.
- Las **recetas fijas prevalecen** sobre cualquier veto, intolerancia, dieta, presupuesto o lista de excluidas: se incluyen igualmente y se avisa (en el caso de una intolerancia, con el nombre de la persona).
- Los vetos y dietas se detectan por los **ingredientes** de cada receta (por grupos: lácteos, gluten, marisco…).
- Reparte categorías según la frecuencia elegida, evita repetir recetas, proteínas y cocinas en días seguidos, respeta la
  contundencia deseada para comidas y cenas, el presupuesto, los límites de tiempo (estrictos u orientativos), las cocinas a evitar
  y las recetas usadas en menús recientes. Favorece las favoritas y las cocinas marcadas como preferidas.
- **Variedad de ingredientes:** además de no repetir recetas, proteínas ni cocinas en días seguidos, el generador
  penaliza los ingredientes que ya se repiten en la semana (patata, huevo, limón, perejil…). Es importante en los menús
  de fácil digestión, donde las restricciones dejan menos ingredientes posibles.
- **Ingredientes con un solo nombre:** cada producto se llama igual en todas las recetas («pechuga de pollo», nunca
  «pollo (pechuga)»), para que la lista de la compra lo sume en una sola línea. Las versiones sin gluten, sin lactosa o
  veganas se mantienen como productos distintos. Las recetas bajas en FODMAP usan aceite de oliva (no «aceite de ajo»).
- **Lista de la compra exacta:** cada ingrediente de cada receta entra con su cantidad (redondeada siempre hacia
  arriba). Solo se apartan, sin desaparecer, los básicos (sal, aceite de oliva, pimienta negra y agua, por nombre
  exacto) y lo que marcas como «Ya lo tengo», que sale en «Ya lo tienes en casa» con la cantidad que pide el menú.
- Las **raciones** se calculan con la fórmula de Mifflin-St Jeor (orientativa) ajustada por actividad y objetivos:
  una ración estándar ≈ adulto de 2.100 kcal/día. La lista de la compra escala todas las cantidades.

### Cálculo de calorías

- Las **kcal y los macronutrientes de cada receta se calculan** a partir de sus ingredientes (`js/calorias.js`) con
  una tabla de composición de 1.236 ingredientes (`js/data-nutri.js`, por 100 g de parte comestible, con densidades,
  fracción comestible —huesos, conchas, pieles— y gramos por unidad de cocina: ud, diente, cda, manojo, lata…).
- Se tiene en cuenta la **preparación**: en frituras y confitados solo cuenta el aceite que absorbe el alimento
  (≈ 8 % del peso de los sólidos, hasta ~25 g por ración), no el del baño; si se fríe con aceite «al gusto», también
  se cuenta lo absorbido. Los ingredientes opcionales y los «al gusto» (salvo un chorrito de aceite) no suman.
- El resultado se divide entre las raciones de la receta. Si no se reconocen ingredientes que sumen al menos el 85 %
  del peso, se usan los valores escritos en la receta (que se guardan como «declarados» y son los que se editan).
- **Ración estándar de referencia:** la de un adulto de 2.100 kcal/día que reparte la comida (≈ 35 %) y la cena
  (≈ 25-30 %), es decir, unas **650 kcal por plato**, con un rango razonable de 400 a 900 kcal. Las recetas cuya ración
  calculada se salía de ese rango (378 de 5.353, sobre todo platos con cantidades para más de dos personas) tienen
  ahora las raciones que de verdad dan; quedan por debajo algunas cenas ligeras de fácil digestión (≈ 320-380 kcal),
  que no pueden crecer sin pasar de 25 g de grasa.
- El **factor de ración** de cada persona escala las cantidades y, con ellas, la energía: con Ana (0,85×) y Luis
  (1,2×) se cocinan 2,05 raciones y cada uno come su parte. El menú, su Markdown y su PDF muestran una vez la
  **energía media por comida de cada persona** (kcal por ración estándar × su factor), y el detalle de cada receta,
  el total del plato a las raciones elegidas.

### Copiar la lista de la compra como lista de tareas

En la lista de la compra elige el **formato** y pulsa **Copiar lista**:

- **Markdown con casillas** (`- [ ] Cebolla · 3 ud`): en **Google Docs** pega con clic derecho → *Pegar desde Markdown*
  (o activa Herramientas → Preferencias → *Markdown*) y cada línea se convierte en casilla. También sirve para
  Notion, Obsidian, Joplin, GitHub…
- **Casillas ☐** (`☐ Cebolla · 3 ud`): el símbolo se ve en cualquier app (Samsung Notes, WhatsApp, Keep), aunque la
  casilla no sea interactiva.
- **Una línea por ingrediente**: para **Samsung Notes**, pega el texto, selecciona todas las líneas y pulsa el botón
  de *lista de tareas* (☑) de la barra de formato; cada línea pasa a ser una casilla real sin marcar.
- En el móvil, el botón **Compartir** envía el texto directamente a la app que elijas.

## Estructura

```
index.html
css/styles.css
js/
  catalog.js      ingredientes: pasillos del súper, grupos (alérgenos/vetos), normalización
  db.js           persistencia en localStorage + exportar/importar
  recipes.js      capa de recetas (semilla + propias + modificadas), dietas derivadas, filtros
  nutrition.js    necesidades energéticas, factor de ración, objetivos
  planner.js      generador de menús
  shopping.js     lista de la compra: agregación, redondeo, formatos de copia
  pdf.js          generador de PDF propio, sin dependencias (enlaces, marcadores, adjuntos)
  ui.js           utilidades de interfaz (h(), modales, toasts)
  ads.js          huecos de publicidad (Google AdSense)
  views/          personas.js · recetas.js · wizard.js · menus.js
  app.js          navegación y ajustes
  data/
    ESQUEMA.md               esquema de datos de las recetas
    recetas-*.js             64 recetas del recetario por categoría
    recetas-inventadas.js    10 primeras recetas derivadas
    inventadas-NNx.js        2.600 recetas derivadas más, en ficheros de 25 por bloque temático
    italiana-*.js, griega-*.js, eslava-*.js   20 recetas por categoría de cada cocina
    huecos-*.js              recetas que completan las cocinas con menos de 10 recetas en alguna categoría
    sudeste-*.js, africana-*.js           cocinas del Sudeste asiático y africana
    alergias-*.js, fodmap-*.js, primavera.js, otono.js, slow-sinfuego.js, aprovechamiento.js, mixto-asia-america.js
                             bloques de la segunda revisión de huecos (ver docs/huecos-de-contenido.md)
    dig-<cocina>-a.js, dig-<cocina>-b.js   50 recetas de fácil digestión por cocina
bkg/
  inicio.jpg, inicio-movil.jpg   foto de fondo de la portada (Stefan Vladimirov, Unsplash), optimizada
```

Para añadir recetas a mano a la semilla, sigue `js/data/ESQUEMA.md` (o usa «+ Nueva receta» en la app).

## Publicidad y analítica

Google Analytics 4 (`G-35Y5H4Y32X`) se carga en `index.html` con el modo de consentimiento de Google: todo empieza
denegado y solo mide con cookies si el visitante acepta en el aviso de consentimiento. Como la app cambia de pantalla sin
recargar, `js/app.js` envía un `page_view` en cada cambio de ruta.

La web publicada muestra anuncios de Google AdSense en seis huecos fijos (portada, recetas, ficha de receta,
asistente, Mis menús y detalle de menú). El script y la etiqueta de verificación están en `index.html`, el
`ads.txt` en la raíz y el id del bloque de anuncios en `js/ads.js`. Abierta en local (`file://`) no carga anuncios.

El pie de cada pantalla enlaza el **aviso legal**, la **política de privacidad** y la **política de cookies** (`js/views/legal.js`,
rutas `#/legal/…`) y el botón «Gestionar cookies», que abre el panel de consentimiento de Google (IAB TCF) configurado
en AdSense → Privacidad y mensajes. Los datos del titular se rellenan en `TITULAR`, al principio de `js/views/legal.js`.

## Créditos

Un proyecto de G. Carbonell ([gcarbonell.com](https://gcarbonell.com)) y **J. Ramírez**.

Foto de la portada: Stefan Vladimirov en [Unsplash](https://unsplash.com/photos/Q_Moi2xjieU), bajo la licencia de Unsplash.
