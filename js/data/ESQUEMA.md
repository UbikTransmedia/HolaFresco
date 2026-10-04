# Esquema de datos de recetas (HolaFresco)

Cada fichero `js/data/recetas-*.js` empieza con:

```js
window.RECETAS_SEED = window.RECETAS_SEED || [];
```

y a continuación hace `window.RECETAS_SEED.push({...})` por cada receta. Son ficheros de
JavaScript plano (sin `import`/`export`, sin `require`), cargados con `<script src>`.

## Objeto receta

```js
window.RECETAS_SEED.push({
  id: "pes-01",                 // prefijo de categoría + número de 2 cifras (ver prefijos)
  nombre: "Salmón noruego al horno con costra de panko",
  subtitulo: "con verduritas al horno y mayonesa al limón",   // opcional
  origen: "recetario",          // "recetario" = original (se muestra como «Originales»)
                                // "inventada" = derivada de las originales (se muestra como «Derivadas»)
  categoria: "pescado",         // legumbres | pescado | carnes | vegetariano | ensaladas | olla-express
  momentos: ["comida", "cena"], // en qué comidas encaja. Guisos pesados: ["comida"]; cremas y
                                // ensaladas: ["comida","cena"] o ["cena"]
  proteina: "pescado",          // proteína principal para asegurar variedad en el menú:
                                // legumbre | pescado | marisco | pollo | cerdo | ternera | pavo |
                                // huevo | queso | tofu | seitan | heura | verdura | mixto
  tiempo: 35,                   // minutos totales (preparación + cocción), entero
  dificultad: "fácil",          // fácil | media | elaborada
  equipo: ["horno"],            // horno | olla-express | sartén | cazuela | batidora | wok | plancha | bol |
                                // airfryer | microondas | slow-cooker
  raciones: 2,                  // SIEMPRE 2: las cantidades son para 2 raciones adultas estándar
  ingredientes: [
    { n: "salmón fresco (lomos)", q: 300, u: "g" },
    { n: "panko", q: 40, u: "g" },
    { n: "ajo", q: 1, u: "diente" },
    { n: "aceite de oliva", q: 2, u: "cda" },
    { n: "sal", u: "al gusto" },                 // básicos: sin q, u "al gusto"
    { n: "pimienta negra", u: "al gusto" },
    { n: "cilantro fresco", q: 0.5, u: "manojo", opcional: true, nota: "para servir" },
  ],
  pasos: [
    "Precalienta el horno a 200 °C con calor arriba y abajo.",
    "..."
  ],
  nutricion: { kcal: 560, prot: 36, hc: 32, grasa: 30 },   // POR RACIÓN, estimación realista
  etiquetas: ["al horno", "rápida", "batch cooking"],      // libres, en minúsculas
  consejo: "Si no tienes panko, usa pan rallado grueso mezclado con una cucharadita de aceite.",  // opcional
  cocina: "europea",            // OBLIGATORIO: tipo de cocina (ver lista)
  contundencia: "media",        // OBLIGATORIO: ligera | media | contundente
  coste: "premium"              // OBLIGATORIO: económica | media | premium
});
```

## Campos nuevos (obligatorios)

### `cocina` — tipo de cocina

| id | descripción |
|---|---|
| `española` | cocina tradicional española y de sus regiones |
| `mediterránea` | Provenza, Córcega, Malta, Adriático y cocina saludable de inspiración mediterránea sin un país claro |
| `italiana` | italiana de todas sus regiones (con Sicilia y Cerdeña) |
| `griega` | griega continental, de las islas y chipriota |
| `asiática` | china, japonesa, tailandesa, vietnamita, coreana |
| `india` | india y sur de Asia (curris, dal, biryani…) |
| `oriente-medio` | Oriente Medio y Magreb (libanesa, turca, marroquí, persa) |
| `latinoamericana` | se muestra como **Hispanoamericana**: mexicana, peruana, argentina, caribeña, brasileña… |
| `europea` | centroeuropea, francesa, británica, nórdica |
| `eslava` | rusa, ucraniana, polaca, checa, eslovaca y balcánica eslava (serbia, croata, búlgara…) |
| `americana` | se muestra como **Angloamericana**: Estados Unidos y Canadá (sur, cajún, criolla de Luisiana, tex-mex, barbacoa, diner, Nueva Inglaterra) |
| `fusión` | mezcla deliberada de dos tradiciones, o cocina saludable contemporánea sin un origen claro (bowls, tostas, wraps…) |

### `contundencia`

- `ligera`: plato ligero, normalmente < 480 kcal/ración, mucha verdura, cocciones suaves.
- `media`: plato completo equilibrado, 480–650 kcal/ración aprox.
- `contundente`: plato saciante, > 650 kcal/ración, guisos, fritos, pastas cremosas, carnes con guarnición generosa.

### `coste` (orientativo, por ración)

- `económica`: legumbres, huevos, arroz, pasta, pollo, cerdo picado, verduras de temporada, conservas básicas (≈ < 2,5 €/ración).
- `media`: pescado blanco congelado, ternera picada, quesos corrientes, frutos secos moderados (≈ 2,5–5 €/ración).
- `premium`: salmón, lubina, rape, marisco, carrillada, solomillo, cordero, burrata, piñones, azafrán, trufa, jamón ibérico (≈ > 5 €/ración).

## Categorías disponibles (campo `categoria`)

`legumbres` · `pescado` · `carnes` · `vegetariano` (con huevo o lácteos) · `vegano` (sin ningún producto animal, ni miel) ·
`ensaladas` · `olla-express` · `pasta-arroces` (pasta, arroz, cereales) · `sopas-cremas`

Prefijos de id adicionales: `vegano` usa `veg`, `pasta-arroces` usa `pas`, `sopas-cremas` usa `sop`. Las recetas inventadas usan siempre `inv-NNN`.

## Ingredientes ya usados en la base de datos

Reutiliza exactamente estos nombres cuando el ingrediente sea el mismo (lista en `INGREDIENTES-USADOS.txt`).
Los títulos existentes están en `TITULOS-EXISTENTES.txt`: no repitas ninguno ni hagas variantes casi idénticas.

## Prefijos de id por categoría

| categoria     | prefijo | ejemplo   |
|---------------|---------|-----------|
| legumbres     | leg     | leg-01    |
| pescado       | pes     | pes-01    |
| carnes        | car     | car-01    |
| vegetariano   | veg     | veg-01    |
| ensaladas     | ens     | ens-01    |
| olla-express  | oll     | oll-01    |
| inventadas    | inv     | inv-01    |  (la `categoria` sigue siendo una de las 6 anteriores)

## Unidades permitidas (`u`)

`g`, `ml`, `ud` (unidad/pieza), `cda` (cucharada sopera ≈ 15 ml), `cdta` (cucharadita ≈ 5 ml),
`diente`, `rama`, `hoja`, `manojo`, `pizca`, `lata`, `bote`, `rebanada`, `loncha`, `puñado`, `al gusto`.

Reglas:
- Pesos de carne/pescado/legumbre/verdura en `g`; líquidos en `ml`; piezas enteras en `ud`.
- Legumbre: indica si es cocida (bote) o seca: `"garbanzos cocidos"` (g) vs `"lentejas pardinas secas"` (g).
- Hierbas frescas en `manojo` (0.5 = medio manojo) o `rama`; especias secas en `cdta`/`cda`.
- Básicos de despensa (sal, pimienta negra, aceite de oliva para cocinar, agua) sin `q`, con `u: "al gusto"`,
  SALVO que la cantidad importe para la receta (p. ej. aceite para el pil pil: `q: 150, u: "ml"`).

## Nombres de ingredientes (canónicos, en minúsculas y singular)

Usa estos nombres exactos cuando apliquen para que la lista de la compra agrupe bien:

cebolla · cebolla morada · cebolleta · ajo · puerro · zanahoria · apio · pimiento rojo · pimiento verde ·
pimiento amarillo · calabacín · berenjena · calabaza · boniato · patata · tomate · tomate cherry ·
tomate pera · tomate seco en aceite · brócoli · coliflor · espinacas frescas · espinacas congeladas ·
rúcula · lechuga romana · canónigos · pepino · rábano · hinojo · champiñones · setas variadas ·
judías verdes · guisantes congelados · maíz dulce · aguacate · limón · lima · naranja · manzana ·
piña · higo fresco · albaricoque · fresa · uva · granada · frutos rojos · jengibre fresco · chile fresco ·
guindilla seca · perejil fresco · cilantro fresco · albahaca fresca · menta fresca · hierbabuena fresca ·
cebollino fresco · tomillo fresco · romero fresco · eneldo fresco

pollo (pechuga) · pollo (muslos deshuesados) · pollo (contramuslos) · pollo entero troceado ·
pavo (pechuga) · ternera picada · ternera para guisar · carrillada de cerdo · solomillo de cerdo ·
cerdo (paleta) · cerdo picado · chorizo · bacon · jamón serrano

salmón fresco (lomos) · merluza (lomos) · bacalao desalado (lomos) · bacalao fresco · lubina (lomos) ·
langostinos pelados · gambas peladas · calamar · atún en conserva · bonito en conserva · anchoas en aceite ·
salmón ahumado · surimi

huevo · queso griego · queso feta · mozzarella · burrata · parmesano · queso de cabra · queso crema ·
queso rallado · yogur griego natural · yogur natural · nata para cocinar · leche · mantequilla · bebida vegetal

garbanzos cocidos · lentejas pardinas secas · lentejas cocidas · lentejas rojas · judías blancas cocidas ·
alubias rojas cocidas · arroz redondo · arroz basmati · arroz jazmín · bulgur · cuscús · quinoa · pasta ·
fideos de arroz · harina de trigo · harina de garbanzo · pan rallado · panko · pan · pan de pita ·
tortillas de trigo · tortillas de maíz · tomate triturado · tomate frito · tomate concentrado ·
caldo de verduras · caldo de pollo · leche de coco · aceitunas negras · aceitunas verdes · alcaparras ·
pepinillos · mayonesa · mostaza de Dijon · mostaza antigua · miel · salsa de soja · sriracha ·
salsa de pescado · vinagre de vino · vinagre de manzana · vinagre de arroz · vinagre balsámico ·
tahini · pasta de curry rojo · curry en polvo · almendras · anacardos · avellanas · nueces · cacahuetes ·
piñones · pistachos · sésamo · semillas de calabaza · pasas · dátiles · tofu firme · seitán · heura ·
vino tinto · vino blanco · cerveza · zumo de naranja · chocolate negro

pimentón dulce · pimentón picante · pimentón ahumado · comino molido · cúrcuma molida · canela molida ·
orégano seco · tomillo seco · laurel · cayena · garam masala · curry en polvo · cilantro molido ·
pimienta negra · sal · aceite de oliva · aceite de sésamo · azúcar · azúcar moreno · maicena ·
levadura química · bicarbonato

Si necesitas otro ingrediente, nómbralo igual de claro (minúsculas, singular, sin marcas).

## Criterios de calidad (cocinero profesional + nutricionista)

- Cantidades realistas para 2 raciones adultas: ~120–150 g de proteína animal cruda por persona,
  ~70–80 g de legumbre seca o ~200 g cocida por persona, ~60–80 g de arroz/pasta/bulgur en seco por persona.
- Pasos concretos con tiempos, temperaturas y señales ("hasta que esté dorado", "cuando la cebolla
  esté transparente"). Entre 5 y 9 pasos. Tutea al lector.
- La estimación nutricional por ración debe ser coherente con los ingredientes.
- `tiempo` realista. `dificultad` honesta.
- `etiquetas` útiles para filtrar: "rápida" (≤25 min), "de cuchara", "al horno", "batch cooking",
  "sin cocción", "picante", "para niños", "económica", "ligera", "alta en proteína", "una sola sartén",
  "ideal para llevar", "verano", "invierno".

## Campos de cocción y tupper (opcionales; si faltan se deducen)

- `coccion`: lista de formas de cocinar, de entre `sin-fuego`, `una-olla` (todo en una olla, cazuela o sartén),
  `todo-al-horno`, `airfryer`, `microondas`, `slow-cooker`, `olla-express`. Si no se indica, la app la deduce del
  `equipo` y de las etiquetas. Las recetas de airfryer, microondas y slow cooker deben llevar ese aparato en `equipo`.
- `tupper`: `true` si el plato aguanta bien 2–3 días en la nevera y se recalienta (o se come frío) sin perder;
  `false` si debe comerse al momento (crujientes, crudos de pescado, huevos poco hechos…).

## Dietas detectadas por ingredientes

Vegetariana, vegana, sin gluten, sin lácteos, sin frutos secos y **bajo en FODMAP** (sin ajo, cebolla, puerro, trigo,
legumbres, lactosa, miel, setas, coliflor, manzana… ). Usa variantes aptas con su nombre explícito: «aceite de ajo»,
«leche sin lactosa», «yogur sin lactosa», «cebollino fresco» o «cebolleta (parte verde)», «pan sin gluten»,
«pasta sin gluten», «tamari», «harina de arroz», «fideos de arroz».
