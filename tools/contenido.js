/* Contenido editorial propio de HolaFresco (página «Sobre» y guías). Lo usa tools/paginas.js para generar las páginas
   estáticas. Cada página: { ruta, titulo, descripcion, cuerpo (HTML) }. */
"use strict";

module.exports = ({ totalRecetas, categorias }) => [
  {
    ruta: "sobre.html",
    titulo: "Sobre HolaFresco",
    descripcion: "Qué es HolaFresco, quién lo hace, cómo se elaboran y revisan sus recetas y cómo funciona el asistente de menú semanal.",
    cuerpo: `
<h1>Sobre HolaFresco</h1>
<p>HolaFresco es un recetario y un asistente para planificar las comidas y cenas de la semana. Le dices quién come en
casa, qué días cocinas, qué os gusta, qué no podéis comer y cuánto tiempo tienes, y te propone un menú semanal con su
lista de la compra ya sumada y ordenada por pasillos. Es gratuito, no pide registro y lo que configuras se guarda solo en
tu navegador.</p>

<h2>El recetario</h2>
<p>Hay ${String(totalRecetas).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} recetas de cocina casera, de diario, en ${categorias} tipos de plato:
legumbres, pescado, carnes, huevos, verduras, tofu y otras proteínas vegetales, ensaladas, pasta y arroces, sopas y cremas
y olla exprés. Cada receta trae sus ingredientes con cantidades, los pasos en orden, un consejo de cocinero y la energía
y los macronutrientes por ración. Muchas incluyen además una «versión alternativa» con un sustituto fácil de encontrar o
un cambio de aparato (olla exprés o cazuela, horno o freidora de aire).</p>

<h2>Cómo se hacen y se revisan las recetas</h2>
<p>El recetario parte de un recetario de cocina casera y se ha ampliado por cocinas, dietas y necesidades (fácil
digestión, baja en FODMAP, sin gluten, vegetariana, para tupper…). Las recetas se han elaborado y revisado con ayuda de
herramientas digitales, incluida la inteligencia artificial, siguiendo criterios de cocina y de nutrición que
comprobamos con programas propios:</p>
<ul>
<li><strong>Orden de los pasos:</strong> que todo se corte o se prepare antes de usarlo y que las esperas (el agua que
hierve, el horno que se calienta) se aprovechen.</li>
<li><strong>Sencillez:</strong> una revisión de «cocinero práctico» ha quitado cacharros y elaboraciones que no
aportaban nada, sin cambiar los ingredientes ni subir las calorías.</li>
<li><strong>Raciones y calorías:</strong> se calculan a partir de los ingredientes, no se estiman a ojo
(<a href="/guias/calorias-y-raciones.html">cómo lo hacemos</a>).</li>
<li><strong>Alérgenos:</strong> se detectan por los ingredientes de cada receta (los 14 de declaración obligatoria, más
legumbres y FODMAP), y el asistente los evita para las personas que los tienen marcados.</li>
<li><strong>Higiene:</strong> por ejemplo, los huevos con cáscara se cuecen siempre aparte
(<a href="/guias/higiene-en-la-cocina.html">más buenas prácticas</a>).</li>
<li><strong>Sin repeticiones:</strong> cada plato nuevo se compara con todo el recetario para no publicar dos veces lo
mismo con otro nombre.</li>
</ul>
<p>Aun así, los valores nutricionales y la detección de alérgenos son orientativos. Si en casa hay una alergia grave o
una condición médica, revisa siempre las etiquetas de lo que compras y consulta a tu médico o dietista-nutricionista.</p>

<h2>Quién lo hace</h2>
<p>HolaFresco es un proyecto de <a href="https://gcarbonell.com" rel="noopener">G. Carbonell</a> y J. Ramírez. Se
financia con publicidad de Google AdSense, que solo aparece junto al contenido de las recetas y de los menús guardados.
Puedes consultar el <a href="/#/legal">aviso legal, la política de privacidad y la de cookies</a>.</p>

<h2>Guías</h2>
<ul>
<li><a href="/guias/calorias-y-raciones.html">Cómo calculamos las raciones y las calorías</a></li>
<li><a href="/guias/cocina-baja-en-fodmap.html">Cocinar bajo en FODMAP sin complicarse</a></li>
<li><a href="/guias/higiene-en-la-cocina.html">Higiene en la cocina de casa: huevos, carnes y sobras</a></li>
<li><a href="/guias/menu-semanal-y-compra.html">Cómo organizar el menú de la semana y la compra</a></li>
</ul>
`,
  },
  {
    ruta: "guias/calorias-y-raciones.html",
    titulo: "Cómo calculamos las raciones y las calorías",
    descripcion: "El método de HolaFresco para calcular la energía de cada receta a partir de sus ingredientes y adaptar las cantidades a lo que necesita cada persona.",
    cuerpo: `
<h1>Cómo calculamos las raciones y las calorías</h1>
<p>En muchos recetarios las calorías de cada plato se estiman a ojo. En HolaFresco se calculan a partir de lo que lleva
la receta y de cómo se cocina, y luego se adaptan a cada persona de la casa. Así funciona.</p>

<h2>1. Una tabla de composición de ingredientes</h2>
<p>Cada uno de los más de mil ingredientes del recetario tiene su ficha: energía, proteína, hidratos y grasa por 100 g
de parte comestible, tomando como referencia tablas públicas de composición de alimentos (como BEDCA, la base de datos
española, y la del Departamento de Agricultura de Estados Unidos). La ficha también dice cuánto pesa una unidad de cocina
(una cebolla, un diente de ajo, una cucharada de aceite, un manojo de perejil) y qué parte se come: el hueso de unos
contramuslos, la concha de los mejillones o la piel de un plátano no cuentan.</p>

<h2>2. La preparación cuenta</h2>
<ul>
<li><strong>Frituras y confitados:</strong> el aceite del baño no se come entero. Contamos solo el que absorbe el
alimento, alrededor de un 8 % de su peso y nunca más de unos 25 g por ración.</li>
<li><strong>Vino y licores cocinados:</strong> con la cocción se evapora la mayor parte del alcohol, así que solo
contamos una cuarta parte de su energía.</li>
<li><strong>Lo opcional y lo «al gusto»:</strong> la sal, la pimienta o las especias en pizca no suman; un chorrito de
aceite «al gusto» sí.</li>
</ul>

<h2>3. Una ración estándar</h2>
<p>Tomamos como referencia a un adulto que necesita unas 2.100 kcal al día y las reparte como es habitual en España: la
comida, alrededor de un 35 %, y la cena, un 25-30 %. Eso da unas <strong>650 kcal por plato principal</strong>, con un
margen razonable de 400 a 900 kcal. Si una receta pensada «para dos» daba en realidad para tres o cuatro, la hemos
corregido para que cada ración sea la de una persona normal.</p>

<h2>4. Cada persona come su parte</h2>
<p>En el asistente de menú indicas sexo, edad, peso, altura, actividad y objetivos de cada persona. Con la fórmula de
Mifflin-St Jeor estimamos lo que necesita y lo convertimos en un <strong>factor de ración</strong>. Un ejemplo:</p>
<ul>
<li>Ana necesita 0,85 raciones estándar y Luis 1,2.</li>
<li>El menú calcula cada plato para 2,05 raciones, así que la lista de la compra ya trae esa cantidad.</li>
<li>En un plato de 650 kcal por ración estándar, Ana come unas 550 kcal (el 41 % del plato) y Luis unas 780 (el 59 %).</li>
</ul>
<p>El menú muestra una sola vez qué parte de cada plato es para cada uno y la energía media que come cada persona por
comida.</p>

<h2>Lo que no hace</h2>
<p>Son estimaciones razonables para organizar la semana, no una pauta dietética. Los productos concretos que compras
pueden variar, y las necesidades de cada persona también. Si sigues una dieta por motivos de salud, hazlo con un
profesional.</p>
`,
  },
  {
    ruta: "guias/cocina-baja-en-fodmap.html",
    titulo: "Cocinar bajo en FODMAP sin complicarse",
    descripcion: "Qué son los FODMAP, qué ingredientes cambiar en la cocina de diario y cómo usar las recetas de fácil digestión de HolaFresco.",
    cuerpo: `
<h1>Cocinar bajo en FODMAP sin complicarse</h1>
<p>Los FODMAP son un grupo de hidratos de carbono que algunas personas toleran mal: se absorben poco en el intestino
delgado, fermentan en el grueso y pueden causar hinchazón, gases o dolor, sobre todo en el síndrome del intestino
irritable. La dieta baja en FODMAP se usa para identificar cuáles sientan mal a cada persona.</p>

<h2>Cómo se suele hacer</h2>
<ol>
<li><strong>Fase de reducción</strong> (unas semanas): se limitan los alimentos con más FODMAP.</li>
<li><strong>Reintroducción</strong>: se vuelven a probar por grupos para ver cuáles se toleran y en qué cantidad.</li>
<li><strong>Personalización</strong>: se come de todo lo que sienta bien, y solo se limita lo que no.</li>
</ol>
<p>No es una dieta para siempre ni para todo el mundo. Lo recomendable es hacerla con un dietista-nutricionista.</p>

<h2>Cambios que hacemos en las recetas</h2>
<ul>
<li><strong>Sin ajo ni cebolla</strong> (ni puerro ni chalota): el sabor lo dan la parte verde de la cebolleta, el
cebollino, las hierbas frescas, las especias y un buen aceite de oliva.</li>
<li><strong>Lácteos sin lactosa</strong>, salvo los quesos curados, que apenas tienen.</li>
<li><strong>Pan y pasta sin gluten</strong>, más por el trigo (que tiene fructanos) que por el gluten.</li>
<li><strong>Raciones vigiladas</strong> de algunas verduras y frutos secos: la calabaza japonesa se tolera mejor que la
cacahuete, y el calabacín, la berenjena o las almendras van en cantidades moderadas.</li>
<li><strong>Sin legumbres, setas, coliflor, manzana, pera ni miel</strong> en la fase de reducción.</li>
</ul>

<h2>Cómo usarlo en HolaFresco</h2>
<p>Marca «intestino irritable (FODMAP)» como intolerancia de la persona en el asistente de menú y el plan evitará los
ingredientes ricos en FODMAP. También puedes elegir la necesidad «fácil digestión» (además, sin picante, sin alcohol,
sin fritos y con grasa moderada) o filtrar el recetario por la etiqueta «bajo en fodmap».</p>
<p>Para que el menú no se haga monótono, el asistente evita repetir los mismos ingredientes en toda la semana. Esto es
importante en esta dieta, porque deja menos ingredientes entre los que elegir.</p>
`,
  },
  {
    ruta: "guias/higiene-en-la-cocina.html",
    titulo: "Higiene en la cocina de casa: huevos, carnes y sobras",
    descripcion: "Buenas prácticas de higiene que seguimos en las recetas de HolaFresco: huevos, contaminación cruzada, cocción de carnes y conservación de sobras.",
    cuerpo: `
<h1>Higiene en la cocina de casa: huevos, carnes y sobras</h1>
<p>Cocinar en casa es seguro si se siguen unas pocas costumbres. Estas son las que aplicamos al escribir las recetas.</p>

<h2>Huevos</h2>
<ul>
<li><strong>Los huevos con cáscara se cuecen siempre aparte</strong>, en un cazo con agua limpia que luego se tira.
Nunca en el agua de las patatas o de la pasta, ni dentro de un caldo o un guiso, ni se aprovecha su agua para otra
cosa: la cáscara puede llevar bacterias como la salmonela.</li>
<li>Los huevos escalfados o cuajados sin cáscara en una sopa o una salsa sí pueden cocinarse en ella: se cocinan como
parte del plato.</li>
<li>Rompe los huevos en un recipiente aparte, no en el borde del bol donde vas a mezclar.</li>
</ul>

<h2>Contaminación cruzada</h2>
<ul>
<li>Usa tablas y cuchillos distintos (o lávalos bien) para la carne o el pescado crudos y para lo que se come sin
cocinar, como la ensalada.</li>
<li>Lávate las manos después de tocar carne, pescado o huevos crudos.</li>
<li>Una marinada que ha estado en contacto con carne cruda solo se puede usar como salsa si se cuece antes.</li>
</ul>

<h2>Carnes y pescados</h2>
<ul>
<li>El pollo, el pavo y la carne picada se cocinan hasta que no quedan rosados por dentro y sueltan jugos claros.</li>
<li>Descongela en la nevera, no en la encimera.</li>
</ul>

<h2>Sobras y tupper</h2>
<ul>
<li>Enfría las sobras y guárdalas en la nevera cuanto antes, en recipientes tapados.</li>
<li>Consúmelas en dos o tres días y recaliéntalas hasta que estén bien calientes por dentro.</li>
<li>Las recetas marcadas «para tupper» aguantan bien en la nevera y se recalientan sin problema.</li>
</ul>
`,
  },
  {
    ruta: "guias/menu-semanal-y-compra.html",
    titulo: "Cómo organizar el menú de la semana y la compra",
    descripcion: "Consejos prácticos para planificar las comidas de la semana, hacer una sola compra y aprovechar lo que tienes, con el asistente de HolaFresco.",
    cuerpo: `
<h1>Cómo organizar el menú de la semana y la compra</h1>
<p>Planificar la semana ahorra tiempo, dinero y la pregunta diaria de «¿qué hacemos hoy?». Estos son los pasos que
sigue el asistente de HolaFresco, y que también puedes seguir a mano.</p>

<h2>1. Quién come y cuándo</h2>
<p>Apunta qué días y qué comidas se hacen en casa y quién come en cada una. No todos comen lo mismo: un adulto activo
necesita más que un niño o que alguien que quiere perder peso. Por eso el asistente calcula las raciones de cada persona
y la lista ya trae las cantidades justas.</p>

<h2>2. Variedad sin pensar demasiado</h2>
<ul>
<li>Reparte los tipos de plato: legumbres dos o tres veces por semana, pescado otras tantas, verdura a diario.</li>
<li>No repitas el mismo plato ni la misma proteína en días seguidos.</li>
<li>Deja las recetas largas para el fin de semana y las rápidas para los días de trabajo.</li>
<li>Cenas más ligeras que las comidas.</li>
</ul>

<h2>3. Aprovechar lo que hay</h2>
<p>Antes de planificar, mira la nevera. Si tienes medio pollo o unos calabacines que gastar, el asistente puede incluir
recetas que los usen. En la lista de la compra saldrán aparte, con la cantidad que pide el menú, para que compruebes si
tienes bastante.</p>

<h2>4. Una sola compra, ordenada</h2>
<ul>
<li>Suma los ingredientes de todas las recetas: dos cebollas de un plato y una de otro son tres cebollas.</li>
<li>Ordénalos por pasillos: frutas y verduras, carnicería, pescadería, lácteos, despensa…</li>
<li>Revisa los básicos (aceite, sal, pimienta) antes de salir.</li>
<li>Compra el pescado fresco para los primeros días y deja para el final de la semana lo que aguanta más o lo congelado.</li>
</ul>

<h2>5. Cocinar una vez, comer dos</h2>
<p>Los guisos de cuchara, las legumbres y muchas cremas mejoran de un día para otro y aguantan bien en tupper. Si comes
fuera de casa entre semana, el asistente puede reservar para esos días platos que se recalientan bien.</p>
`,
  },
];
