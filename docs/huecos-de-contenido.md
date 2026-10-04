# Huecos de contenido del recetario (revisión de 2.174 recetas)

Revisión hecha cruzando categoría, cocina, contundencia, coste, momento, tiempo, forma de cocción, dietas,
estacionalidad e ingredientes protagonistas. Cada hueco indica el dato que lo justifica y el bloque de
recetas que lo cubre (50 recetas por bloque, ids inv-2111 a inv-2610).

| # | Hueco detectado | Dato | Bloque que lo cubre |
|---|---|---|---|
| 1 | Muy pocas recetas de verdad rápidas | Solo 102 recetas de 15 min o menos (5 %); 1 de olla exprés, 8 de carne, 10 de pescado | Exprés: platos completos en 15 minutos |
| 2 | Bajo en FODMAP casi sin opciones vegetales | 86 recetas bajas en FODMAP; solo 24 vegetarianas y 10 veganas | Vegetarianas y veganas bajas en FODMAP |
| 3 | Primavera y otoño olvidados | 35 recetas de primavera y 47 de otoño frente a 571 de invierno; espárrago 32, habas 19, coles de Bruselas 5, chirivía 6, nabo 8, higo 6, uva 6 | Temporada: primavera y otoño |
| 4 | Proteínas animales infrarrepresentadas | Conejo 8, pato 9, codorniz 2, sepia 10, boquerón 5, trucha 5, sardina 17, pulpo 16 | Carnes y pescados poco habituales |
| 5 | Proteína vegetal poco variada | Tempeh 14, seitán 13, heura 13; solo 11 veganas premium y 3 veganas de slow cooker | Veganas saciantes con proteína vegetal variada |
| 6 | Cereales y legumbres olvidados | Mijo 3, trigo sarraceno 5, cebada 7, polenta 15, habas 19 | Granos y legumbres poco usados |
| 7 | Cocinas del mundo desequilibradas por categoría | India: 3 sopas, 4 arroces/pastas, 6 ensaladas, 7 pescados. Americana: 7 vegetarianas, 8 legumbres, 8 pescados. Latinoamericana: 9 arroces/pastas. Asiática: 8 legumbres. Fusión: menos de 10 en casi todo | Cocinas del mundo en las categorías que les faltan |
| 8 | Formas de cocción poco cubiertas | Slow cooker 29 (18 de carne); sin fuego 84 (28 ensaladas, 2 de arroz/pasta); olla exprés ligera solo 39 | Slow cooker variado, sin fuego más allá de ensaladas y olla exprés ligera |
| 9 | Pocas recetas que enseñen técnica | Solo 32 recetas «elaboradas»; ninguna explica el porqué de las técnicas base | Aprende una técnica (cocina didáctica) |
| 10 | Aprovechamiento y cenas de invitados rápidas | 9 recetas de aprovechamiento; solo 71 premium en 25 minutos o menos | Aprovechamiento de sobras y cenas de invitados en 30 minutos |

Las recetas de estos bloques están escritas en clave didáctica: los pasos explican brevemente el porqué
de cada gesto y el consejo enseña algo reutilizable en otras recetas.

## Resultado tras añadir las 500 recetas (2.674 en total)

| Hueco | Antes | Después |
|---|---|---|
| Recetas de 15 min o menos | 102 | 162 |
| … de carne / de pescado | 8 / 10 | 22 / 23 |
| Bajo en FODMAP (vegetarianas / veganas) | 86 (24 / 10) | 144 (77 / 36) |
| Primavera / otoño | 35 / 47 | 80 / 107 |
| Conejo / pato / codorniz | 8 / 9 / 2 | 17 / 16 / 7 |
| Sepia / boquerón / trucha / sardina / pulpo | 10 / 5 / 5 / 17 / 16 | 16 / 11 / 11 / 24 / 21 |
| Tempeh / seitán / heura | 14 / 13 / 13 | 31 / 21 / 20 |
| Veganas premium / veganas de slow cooker | 11 / 3 | 26 / 14 |
| Mijo / trigo sarraceno / cebada / polenta | 3 / 5 / 7 / 15 | 10 / 12 / 16 / 23 |
| India: sopas / arroces y pastas / pescado | 3 / 4 / 7 | 6 / 8 / 13 |
| Americana vegetariana / asiática de legumbres | 7 / 8 | 14 / 12 |
| Slow cooker (sin carne) | 29 (11) | 56 (38) |
| Sin fuego (que no son ensaladas) | 84 (56) | 107 (77) |
| Olla exprés ligera | 39 | 56 |
| Recetas que enseñan una técnica | 0 | 61 |
| Aprovechamiento de sobras | 9 | 46 |
| Premium en 30 min o menos | 74 | 145 |

## Revisión por cocinas (octubre de 2026)

### 1. Cocina «Americana» → «Angloamericana» y nuevas cocinas

Dos revisores independientes (un cocinero de cocinas del mundo y un historiador de la gastronomía) clasificaron
las 131 recetas «americanas» y las 1.232 mediterráneas, europeas, de fusión y de Oriente Medio; un juez decidió
los 34 desacuerdos. Resultado: 358 recetas reclasificadas.

- 16 recetas «americanas» que no eran angloamericanas pasan a **Fusión** (14: boles, tostas y wraps saludables
  sin un origen claro, como el bol vegano de tofu ahumado, quinoa, kale y tahini) o a **Europea** (2: patatas
  asadas rellenas al estilo británico). Se quedan en Angloamericana el sur, el cajún, el tex-mex, la barbacoa,
  los clásicos de diner, Nueva Inglaterra y Canadá.
- 230 recetas pasan a **Italiana**, 77 a **Griega** y 19 a **Eslava**; unas pocas más cambian a su cocina correcta
  (p. ej. una sopa al pistou a Mediterránea o un bánh mì a Asiática).

### 2. Categorías con menos de 10 recetas por cocina

Matriz categoría × cocina tras la reclasificación (con * las celdas por debajo de 10):

```
                 ESP  MED  ITA  GRI  ASI  IND  OMM  HIS  EUR  ESL  ANG  FUS
legumbres         82   25   13   10   12   20   28   32   19   1*   11   12
pescado          148   52   13   7*   48   13   17   23   56   1*   8*   13
carnes           129   31   21   15   46   23   38   44   79   3*   33   13
vegetariano       77   46   37   12   20   18   32   23   40   2*   11   11
vegano            41   20   14   7*   57   23   26   35   20   2*   18   25
ensaladas         30   48   7*   6*   22   9*   19   14   27   0*   9*   12
pasta-arroces     58   27   94   7*   34   8*   21   14   10   0*   8*   10
sopas-cremas      54   26   14   4*   22   6*   14   23   43   8*   12   12
olla-express      66   8*   17   9*   14   13   13   15   19   2*   6*   4*
```

Carencias en las cocinas que ya existían: **India** (ensaladas 9, pasta y arroces 8, sopas 6), **Angloamericana**
(pescado 8, ensaladas 9, pasta y arroces 8, olla exprés 6), **Fusión** (olla exprés 4) y **Mediterránea** (olla
exprés 8): 24 recetas (ficheros `huecos-*.js`). Las carencias de Italiana, Griega y Eslava se cubren con el punto 3.

### 3. Cocinas italiana, griega y eslava

540 recetas nuevas: 20 por categoría y cocina, la mitad tradicionales (etiqueta «tradicional») y la otra mitad
derivadas no necesariamente tradicionales (etiqueta «creativa»). Cada bloque lo escribió un cocinero especialista,
lo revisó un chef de esa cocina con criterio de nutricionista (autenticidad, técnica, tiempos, cantidades,
etiquetas) y un editor por cocina eliminó los platos repetidos entre bloques y con el recetario existente.

Resultado final (3.238 recetas; ninguna celda por debajo de 10):

```
                 ESP  MED  ITA  GRI  ASI  IND  OMM  HIS  EUR  ESL  ANG  FUS  total
legumbres         82   25   33   30   12   20   28   32   19   21   11   12    325
pescado          148   52   33   27   48   13   17   23   56   21   10   13    461
carnes           129   31   41   35   46   23   38   44   79   23   33   13    535
vegetariano       77   46   57   32   20   18   32   23   40   22   11   11    389
vegano            41   20   34   27   57   23   26   35   20   22   18   25    348
ensaladas         30   48   27   26   22   10   19   14   27   20   10   12    265
pasta-arroces     58   27  114   27   34   10   21   14   10   20   10   10    355
sopas-cremas      54   26   34   24   22   10   14   23   43   28   12   12    302
olla-express      66   10   37   29   14   13   13   15   19   22   10   10    258
total            685  285  410  257  275  140  208  223  313  199  125  118   3238
```
