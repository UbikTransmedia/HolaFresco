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
| 🍳 **Recetas** | Cientos de recetas en 9 categorías (legumbres, pescado, carnes, vegetariano, vegano, ensaladas, pasta y arroces, sopas y cremas, olla exprés): **64 desarrolladas** a partir de los títulos de un recetario de referencia (no incluido en el repositorio) (etiqueta 📄 *Recetario*) y **2.110 inventadas** inspirándose en él (300 prácticas y saludables para tupper, airfryer y microondas, 300 sin gluten, entre ellas 300 mediterráneas fáciles y aromáticas, con la etiqueta «mediterránea», y 500 tradicionales fáciles y saciantes, con la etiqueta «tradicional») (etiqueta ✨ *Inventada*). Cada receta tiene **tipo de cocina** (española, mediterránea, asiática, india, Oriente Medio, latinoamericana, europea, americana, fusión), **contundencia** (ligera / media / contundente) y **coste** (económica / media / premium). Búsqueda por nombre, ingrediente, cocina o etiqueta; filtros por todo lo anterior más dieta, momento y tiempo. **Forma de cocción** (sin fuego, todo en una olla, todo al horno, airfryer, microondas, slow cooker, olla exprés), **apta para tupper** (🥡, aguanta y se recalienta bien) y **dietas** detectadas por ingredientes (vegetariana, vegana, sin gluten, sin lácteos, sin frutos secos y bajo en FODMAP). **Favoritas** (★, el asistente las elige más) y **excluidas de menús** (🚫, siguen en el recetario pero el asistente no las usa). Alta, edición, duplicado; ocultar recetas (recuperables desde Ajustes). Cada receta se escala a las raciones que quieras. |
| 🪄 **Nuevo menú** | Asistente en 7 pasos: personas (sexo, edad, peso, altura, actividad y objetivos), días y comidas, gustos (frecuencia por tipo de plato, cocinas del mundo preferidas o a evitar, dietas), ajustes (aparatos que tienes y formas de cocinar preferidas; platos para tupper en las comidas entre semana, en todas las comidas o en todo; tiempo máximo entre semana y fin de semana, estricto u orientativo; contundencia de comidas y cenas; presupuesto económico/medio/premium; no repetir recetas de las últimas semanas; sobras; olla exprés), vetos (grupos de alérgenos o ingredientes concretos), recetas fijas y resultado editable hueco a hueco. El menú **se recalcula automáticamente** al volver al último paso si has cambiado algo. |
| 📅 **Mis menús** | Base de datos de menús generados. Al abrir uno se muestra **primero la lista de la compra** (agrupada por pasillos, con casillas que se recuerdan y botón de copiar) y después el menú semanal y un resumen de la configuración usada. |
| 📄 **Exportar** | Desde cada menú guardado: **PDF** (plan de comidas como índice enlazado a cada receta, lista de la compra con casillas, una receta por página, marcadores y un anexo con el Markdown para copiar; además lleva adjuntos `menu-completo.md`, `plan-de-comidas.md`, `lista-de-la-compra.md` y `recetas.md`) y copia en **Markdown** del plan, de todas las recetas, del menú completo con la lista o de cada receta suelta. |
| ⚙️ **Ajustes** | Estilo visual (claro por defecto, oscuro, huerta, océano, alto contraste o según el sistema; también con el botón de la esquina superior derecha), exportar/importar copia de seguridad (JSON), recuperar recetas ocultas, borrar datos. |

### Reglas del generador

- Las **recetas fijas prevalecen** sobre cualquier veto, dieta, presupuesto o lista de excluidas: se incluyen igualmente y se avisa.
- Los vetos y dietas se detectan por los **ingredientes** de cada receta (por grupos: lácteos, gluten, marisco…).
- Reparte categorías según la frecuencia elegida, evita repetir recetas, proteínas y cocinas en días seguidos, respeta la
  contundencia deseada para comidas y cenas, el presupuesto, los límites de tiempo (estrictos u orientativos), las cocinas a evitar
  y las recetas usadas en menús recientes. Favorece las favoritas y las cocinas marcadas como preferidas.
- Las **raciones** se calculan con la fórmula de Mifflin-St Jeor (orientativa) ajustada por actividad y objetivos:
  una ración estándar ≈ adulto de 2.100 kcal/día. La lista de la compra escala todas las cantidades.

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
  views/          personas.js · recetas.js · wizard.js · menus.js
  app.js          navegación y ajustes
  data/
    ESQUEMA.md               esquema de datos de las recetas
    recetas-*.js             64 recetas del recetario por categoría
    recetas-inventadas.js    10 primeras recetas inventadas
    inventadas-NNx.js        1.500 recetas inventadas más, en ficheros de 25 por bloque temático
bkg/
  inicio.jpg, inicio-movil.jpg   foto de fondo de la portada (Stefan Vladimirov, Unsplash), optimizada
```

Para añadir recetas a mano a la semilla, sigue `js/data/ESQUEMA.md` (o usa «+ Nueva receta» en la app).

## Créditos

Foto de la portada: Stefan Vladimirov en [Unsplash](https://unsplash.com/photos/Q_Moi2xjieU), bajo la licencia de Unsplash.
