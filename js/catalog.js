/* Catálogo de ingredientes: normalización, pasillos del supermercado y grupos (alérgenos / vetos).
   La coincidencia es por palabras completas (tolerando plurales): "sal" no atrapa "salsa" ni "salmón". */
(function () {
  "use strict";

  const normalizar = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\([^)]*\)/g, " ")
      .replace(/[^a-z0-9ñ ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const tokens = (s) => normalizar(s).split(" ").filter(Boolean);

  /* Variantes singular/plural de una palabra: "tomates" → {tomates, tomate, tomat}; "nuez" → {nuez, nuec} */
  const variantes = (w) => {
    const s = new Set([w]);
    if (w.length > 3 && w.endsWith("s")) s.add(w.slice(0, -1));
    if (w.length > 4 && w.endsWith("es")) s.add(w.slice(0, -2));
    if (w.endsWith("z")) s.add(w.slice(0, -1) + "c");
    return s;
  };
  const palabrasIguales = (a, b) => {
    if (a === b) return true;
    const vb = variantes(b);
    for (const x of variantes(a)) if (vb.has(x)) return true;
    return false;
  };

  /* ¿Aparece la secuencia de palabras de la clave dentro del nombre? Una clave acabada en "*" permite
     que su última palabra sea solo el principio de la del nombre ("congelad*" → "congeladas"). */
  const contieneFrase = (nombreTokens, clave) => {
    let prefijo = false;
    let k = normalizar(clave.replace(/\*$/, () => { prefijo = true; return ""; }));
    const ct = k.split(" ").filter(Boolean);
    if (!ct.length) return false;
    for (let i = 0; i + ct.length <= nombreTokens.length; i++) {
      let ok = true;
      for (let j = 0; j < ct.length; j++) {
        const nt = nombreTokens[i + j], kt = ct[j];
        const ultima = j === ct.length - 1;
        if (!(palabrasIguales(nt, kt) || (prefijo && ultima && nt.startsWith(kt)))) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  };
  const coincideAlguna = (nombre, claves) => { const t = tokens(nombre); return claves.some((c) => contieneFrase(t, c)); };

  /* ---------- Pasillos ---------- */
  const PASILLOS = [
    { id: "frutas-verduras", nombre: "Frutas y verduras", icono: "🥕", orden: 1 },
    { id: "carniceria", nombre: "Carnicería y charcutería", icono: "🥩", orden: 2 },
    { id: "pescaderia", nombre: "Pescadería", icono: "🐟", orden: 3 },
    { id: "lacteos-huevos", nombre: "Lácteos y huevos", icono: "🥚", orden: 4 },
    { id: "panaderia", nombre: "Panadería", icono: "🥖", orden: 5 },
    { id: "despensa", nombre: "Despensa y conservas", icono: "🥫", orden: 6 },
    { id: "frutos-secos", nombre: "Frutos secos y semillas", icono: "🥜", orden: 7 },
    { id: "especias", nombre: "Especias y condimentos", icono: "🧂", orden: 8 },
    { id: "congelados", nombre: "Congelados", icono: "🧊", orden: 9 },
    { id: "bebidas", nombre: "Bebidas", icono: "🍷", orden: 10 },
    { id: "otros", nombre: "Otros", icono: "🛒", orden: 11 },
    { id: "basicos", nombre: "Básicos de despensa (revisa que tengas)", icono: "🏠", orden: 12 },
    { id: "en-casa", nombre: "Ya lo tienes en casa (no comprar)", icono: "🧊", orden: 13 },
  ];

  // Orden importa: la primera regla que coincide gana.
  const REGLAS_PASILLO = [
    ["basicos", ["aceite de oliva", "aceite de oliva virgen", "aceite de oliva virgen extra", "sal", "sal gruesa", "sal en escamas", "pimienta negra", "pimienta", "agua"]],
    ["congelados", ["congelad*", "edamame", "helado"]],
    ["especias", [
      "pimenton*", "comino*", "asafetida", "mejorana*", "guascas*", "curcuma*", "canela*", "oregano*", "tomillo seco", "romero seco", "laurel", "cayena", "garam masala",
      "curry en polvo", "cilantro molido", "jengibre molido", "nuez moscada*", "clavo*", "anis*", "especias", "hierbas provenzales",
      "guindilla seca", "guindillas secas", "chile en polvo", "chile seco", "chile ancho", "pimienta de*", "cardamomo", "mostaza en grano", "semillas de mostaza",
      "semillas de cilantro", "semillas de hinojo", "sumac", "zaatar", "ras el hanout", "cinco especias", "achiote", "pasta de achiote", "sazonador*",
      "ajo en polvo", "cebolla en polvo", "azafran", "colorante*", "vainilla", "eneldo seco", "albahaca seca", "perejil seco",
      "copos de chile", "pimienta rosa", "pimienta blanca", "fenogreco", "mezcla de especias", "sal de*", "hierbas secas", "pimienta de jamaica",
    ]],
    ["despensa", [ // conservas y básicos que podrían confundirse con fresco
      "caldo*", "pastilla de caldo", "tomate triturado", "tomate frito", "tomate concentrado", "tomate seco*", "tomates secos*", "tomate en conserva",
      "tomate natural triturado", "tomate entero*", "tomate pelado*", "leche de coco", "crema de coco", "nata de coco", "bebida de coco", "atun en*", "atun al natural", "atun",
      "bonito en*", "bonito", "anchoa*", "sardinas en*", "sardina en*", "caballa en*", "caballa en conserva", "berberechos en*", "navajas en*", "mejillones en*", "berberecho*", "salmon ahumado", "trucha ahumada", "surimi",
      "vinagre*", "aceite de*", "aceite", "altramuz*", "azuki*", "gandul*", "aquafaba", "freekeh", "teff", "conchiglioni", "gluten de trigo", "palmito*", "jaca*", "membrillo", "crema de aji*", "carne de pimiento*", "pochas", "verdinas*", "garrofo", "galets", "fideos gordos", "gnocchi*", "ñoquis", "manteca*", "pimiento del piquillo", "pimientos del piquillo", "pimiento asado en*", "pimientos asados en*",
      "esparragos en*", "alcachofas en*", "maiz en*", "maiz dulce", "guisantes en*", "garbanzos cocidos", "lentejas cocidas", "judias blancas cocidas",
      "alubias*", "frijoles*", "legumbre cocida", "chipotle*", "adobo", "harissa", "hummus", "pasta de curry*", "curry en pasta", "mirin", "sake", "miso",
      "salsa*", "ketchup", "mayonesa", "veganesa", "alioli", "gochujang", "judiones*", "ñora*", "zumaque", "za'atar", "zaatar", "mostaza*", "tahini", "soja", "tamari", "sriracha", "worcestershire",
    ]],
    ["pescaderia", [
      "salmon*", "caballa*", "navaja*", "gallo", "pescadilla", "salmonete*", "chipirones", "cazon", "pez espada", "abadejo*", "jurel", "lenguado*", "gallo", "bacaladilla", "mero", "besugo", "emperador", "sardina*", "merluza", "bacalao*", "lubina*", "langostino*", "gamba*", "calamar*", "sepia", "pulpo", "mejillon*", "almeja*", "rape",
      "dorada", "bonito fresco", "atun fresco", "pescado*", "marisco*", "boqueron*", "sardinas frescas", "trucha", "rodaballo", "corvina", "vieira*", "chipiron*",
    ]],
    ["carniceria", [
      "pintada", "gallina*", "rosbif*", "cecina", "lomo embuchado", "fuet", "salami", "salchichon", "mortadela", "pastrami", "guanciale", "botillo", "jabali*", "callos*", "manitas*", "codorniz*", "perdiz*", "confit*", "oreja*", "pollo*", "pavo*", "ternera*", "cerdo*", "carrillada*", "solomillo*", "chorizo*", "bacon", "jamon*", "panceta", "cordero*",
      "salchicha*", "lomo*", "costilla*", "carne*", "butifarra*", "morcilla*", "conejo", "pechuga*", "muslo*", "contramuslo*", "magro*", "picada*", "rabo de toro", "rabo de*", "sobrasada", "ossobuco", "secreto*", "presa*", "lacon", "osobuco", "morcillo", "jarrete", "aguja", "falda", "redondo de*", "codillo", "manitas", "callos", "higado*", "higaditos", "mollejas", "pato", "codorniz*", "perdiz", "pavo*",
    ]],
    ["lacteos-huevos", [
      "huevo*", "queso*", "feta", "mozzarella", "burrata", "parmesano", "pecorino", "manchego", "cheddar", "halloumi", "paneer", "yogur*", "nata", "natas", "nata para*", "nata de*", "nata liquida", "nata montada",
      "leche*", "mantequilla", "requeson", "ricotta", "mascarpone", "crema agria", "kefir", "bebida vegetal", "bebida de avena", "bebida de soja",
      "bebida de almendra*", "labneh", "cuajada",
    ]],
    ["panaderia", ["tapas de empanada", "torta cenceña", "obleas*", "pan", "pan de*", "pan integral", "pan rallado", "panko", "pita*", "tortilla*", "baguette", "chapata", "picos", "regañas", "wrap*", "masa", "masa de*", "masa quebrada", "hojaldre", "obleas", "brioche", "molde"]],
    ["frutos-secos", [
      "almendra*", "anacardo*", "avellana*", "nuez", "nueces", "cacahuete*", "piñon*", "pistacho*", "sesamo", "semilla*", "pipas*",
      "pasas", "datil*", "orejon*", "ciruela pasa", "ciruelas pasas", "chia", "lino", "crema de cacahuete", "crema de almendra*", "frutos secos",
    ]],
    ["bebidas", ["te verde", "te negro", "te ", "vino*", "cerveza", "zumo*", "sidra", "vermut", "brandy", "coñac", "ron", "whisky", "licor*", "cava", "refresco*", "cola", "agua con gas"]],
    ["frutas-verduras", [
      "cebolla*", "cebolleta*", "ajo*", "puerro*", "zanahoria*", "apio", "pimiento*", "calabacin*", "berenjena*", "calabaza", "boniato*", "patata*",
      "tomate*", "brocoli", "coliflor", "espinaca*", "rucula", "lechuga*", "canonigo*", "pepino*", "rabano*", "rabanito*", "hinojo", "champiñon*", "seta*",
      "shiitake", "portobello", "judia*", "judias verdes", "maiz", "aguacate*", "limon*", "lima*", "naranja*", "manzana*", "piña", "higo*", "albaricoque*",
      "fresa*", "uva*", "granada*", "frutos rojos", "arandano*", "frambuesa*", "mora*", "melocoton*", "pera*", "platano*", "mango*", "kiwi*", "melon",
      "sandia", "cereza*", "mandarina*", "pomelo*", "jengibre*", "chile*", "jalapeño*", "guindilla*", "perejil*", "cilantro*", "albahaca*", "menta*",
      "hierbabuena*", "cebollino*", "tomillo*", "romero*", "eneldo*", "salvia", "estragon", "col", "col lombarda", "repollo", "kale", "acelga*", "endibia*",
      "escarola", "esparrago*", "alcachofa*", "remolacha*", "nabo*", "chirivia*", "guisante*", "haba", "habas", "habitas", "brote*", "germinado*", "chalota*", "hierbas frescas",
      "lemongrass", "hierba limon", "citronela", "lima kaffir", "pak choi", "bok choy", "berro*", "mezcla de lechugas", "ensalada", "hoja de roble", "verdura*", "fruta*",
      "mezclum", "brotes", "nectarina*", "apionabo", "niscalo*", "boletus", "rebozuelo*", "cogollo*", "cardo", "borraja*", "yuca", "castaña*", "caqui*", "coles de bruselas", "mazorca*", "platano macho", "cebollitas*", "endivia*", "grelos", "ajo tierno", "ajos tiernos", "espinacas baby", "edamame fresco", "setas variadas",
    ]],
    ["despensa", [
      "garbanzo*", "lenteja*", "judia blanca", "judias blancas", "alubia*", "arroz*", "bulgur", "cuscus", "quinoa", "pasta", "espagueti*", "macarron*", "fideo*", "linguine", "linguini", "tagliatelle", "tallarines", "penne", "fusilli", "rigatoni", "farfalle", "orzo", "gnocchi", "ñoquis", "canelon*", "ravioli*", "tortellini", "orecchiette", "pappardelle", "conchiglie", "lasaña", "chucrut", "kimchi", "encurtidos", "mijo", "farro", "trigo tierno", "cebada*", "centeno", "espelta", "trigo sarraceno", "amaranto", "harina de*", "levadura*", "pan de hamburguesa", "panecillo*",
      "noodle*", "tallarin*", "harina*", "maicena", "levadura*", "bicarbonato", "azucar*", "aceituna*", "oliva*", "alcaparra*", "pepinillo*", "encurtido*",
      "miel", "coco rallado", "chocolate*", "cacao", "sirope*", "melaza", "mermelada", "tofu*", "seitan", "heura", "tempeh", "proteina vegetal", "soja texturizada",
      "pure de*", "copos de avena", "avena", "muesli", "galleta*", "lasaña", "placas*", "polenta", "semola", "gelatina", "agar", "concentrado*", "alga*", "nori",
      "wasabi", "leche condensada", "leche evaporada", "nata vegetal", "dashi", "panela", "edulcorante", "caldo", "cuscus integral", "pan de molde",
    ]],
  ];

  const cachePasillo = new Map();
  const pasilloDe = (nombre) => {
    const key = normalizar(nombre);
    if (cachePasillo.has(key)) return cachePasillo.get(key);
    let res = "otros";
    const t = tokens(nombre);
    bucle: for (const [pasillo, claves] of REGLAS_PASILLO) {
      for (const k of claves) if (contieneFrase(t, k)) { res = pasillo; break bucle; }
    }
    cachePasillo.set(key, res);
    return res;
  };

  /* ---------- Grupos de ingredientes (alérgenos, dietas, vetos rápidos) ---------- */
  const GRUPOS = [
    { id: "carne", nombre: "Carne", icono: "🥩", excluir: ["carne de pimiento*", "carne de membrillo"], claves: ["pintada", "gallina*", "rosbif*", "roast beef", "cecina", "lomo embuchado", "fuet", "salami", "salchichon", "mortadela", "pastrami", "guanciale", "botillo", "jabali*", "callos*", "manitas*", "higado*", "codorniz*", "perdiz*", "confit*", "lacon", "oreja*", "sobrasada", "magret*", "salchicha ahumada", "rabo de toro", "ossobuco", "morcillo", "pato", "confit de pato", "codillo", "conejo", "cordero*", "secreto*", "presa iberica", "presa*", "lacon", "pluma iberica", "panceta", "pollo*", "pavo*", "ternera*", "cerdo*", "carrillada*", "solomillo*", "chorizo*", "bacon", "jamon*", "panceta", "cordero*", "salchicha*", "carne*", "lomo*", "costilla*", "butifarra*", "morcilla*", "caldo de pollo", "caldo de carne", "manteca de cerdo", "conejo", "pechuga*", "muslo*", "contramuslo*", "picada de*"] },
    { id: "cerdo", nombre: "Cerdo", icono: "🐷", claves: ["guanciale", "botillo", "manitas de cerdo", "oreja de cerdo", "lacon", "sobrasada", "secreto*", "presa iberica", "presa*", "lacon", "pluma iberica", "panceta", "cerdo*", "carrillada*", "solomillo de cerdo", "chorizo*", "bacon", "jamon*", "panceta", "lomo de cerdo", "costilla*", "butifarra*", "morcilla*", "salchicha*", "manteca de cerdo"] },
    { id: "pescado", nombre: "Pescado", icono: "🐟", claves: ["gallo", "gallo (filetes)", "pescadilla", "salmonete*", "rodaballo", "besugo", "merluza*", "chicharro", "jurel", "bonito*", "cazon", "pez espada", "abadejo*", "jurel", "caballa*", "lenguado*", "mero", "besugo", "bacaladilla", "emperador", "espinas", "salmon*", "merluza", "bacalao*", "lubina*", "atun*", "bonito*", "anchoa*", "sardina*", "boqueron*", "dorada", "rape", "pescado*", "salsa de pescado", "caldo de pescado", "surimi", "trucha*", "rodaballo", "corvina"] },
    { id: "marisco", nombre: "Marisco", icono: "🦐", claves: ["navaja*", "chipirones", "chipiron*", "tigres", "langostino*", "gamba*", "calamar*", "sepia", "pulpo", "mejillon*", "almeja*", "berberecho*", "marisco*", "cangrejo", "surimi", "vieira*", "chipiron*", "caldo de marisco"] },
    { id: "lacteos", nombre: "Lácteos", icono: "🧀", claves: ["queso*", "feta", "mozzarella", "burrata", "parmesano", "pecorino", "manchego", "cheddar", "halloumi", "paneer", "yogur*", "nata", "natas", "nata para*", "nata de*", "nata liquida", "nata montada", "leche*", "mantequilla", "requeson", "ricotta", "mascarpone", "crema agria", "kefir", "labneh", "cuajada", "bechamel"], excluir: ["leche de coco", "bebida vegetal", "nata vegetal", "nata de coco", "crema de coco", "yogur vegetal", "yogur de soja", "queso vegetal", "queso vegano", "mantequilla vegetal", "sin lactosa", "bebida de", "leche de almendra*", "leche de avena", "leche de arroz"] },
    { id: "huevo", nombre: "Huevo", icono: "🥚", claves: ["huevo*", "mayonesa", "alioli"], excluir: ["mayonesa vegetal", "mayonesa vegana", "veganesa", "alioli vegano", "sin huevo"] },
    { id: "gluten", nombre: "Gluten", icono: "🌾", claves: ["gluten de trigo", "freekeh", "conchiglioni", "trigo", "galets", "tapas de empanada", "obleas*", "torta cenceña", "fideos gordos", "pan", "pan de*", "pan rallado", "panko", "harina", "harina de trigo", "harina integral", "bulgur", "cuscus", "pasta", "espagueti*", "macarron*", "fideo*", "noodle*", "tallarin*", "seitan", "cerveza", "salsa de soja", "tortillas de trigo", "tortilla de trigo", "pita*", "hojaldre", "gnocchi*", "ñoquis", "lasaña", "placas de lasaña", "semola", "galleta*", "avena", "copos de avena", "cebada", "centeno", "worcestershire", "obleas", "wrap*", "baguette", "chapata", "picos", "regañas", "brioche", "pan de molde", "masa", "masa de pizza", "masa quebrada"], excluir: ["pasta de*", "trigo sarraceno", "harina de trigo sarraceno", "garam masala", "harina de garbanzo", "harina de maiz", "harina de arroz", "harina de almendra", "fideos de arroz", "tortillas de maiz", "tortilla de maiz", "pan sin gluten", "sin gluten", "tamari", "pasta sin gluten", "avena sin gluten", "noodles de arroz"] },
    { id: "soja", nombre: "Soja", icono: "🫘", claves: ["soja*", "tofu*", "edamame*", "miso", "tempeh", "heura", "bebida de soja", "salsa de soja", "tamari", "yogur de soja"] },
    { id: "frutos-secos", nombre: "Frutos secos", icono: "🥜", claves: ["almendra*", "anacardo*", "avellana*", "nuez", "nueces", "cacahuete*", "piñon*", "pistacho*", "crema de cacahuete", "crema de almendra*", "frutos secos", "bebida de almendra*", "harina de almendra"], excluir: ["nuez moscada"] },
    { id: "sesamo", nombre: "Sésamo", icono: "⚪", claves: ["sesamo", "tahini", "aceite de sesamo", "semillas de sesamo"] },
    { id: "picante", nombre: "Picante", icono: "🌶️", claves: ["aji amarillo", "crema de aji*", "chile*", "guindilla*", "sriracha", "cayena", "jalapeño*", "pimenton picante", "harissa", "chipotle*", "copos de chile", "pasta de curry*", "tabasco", "picante", "salsa picante", "curry rojo", "curry verde"] },
    { id: "cilantro", nombre: "Cilantro fresco", icono: "🌿", claves: ["cilantro fresco", "cilantro"], excluir: ["cilantro molido", "semillas de cilantro"] },
    { id: "setas", nombre: "Setas y champiñones", icono: "🍄", claves: ["niscalo*", "rebozuelo*", "champiñon*", "seta*", "shiitake", "boletus", "portobello", "trufa*", "aceite de trufa"] },
    { id: "legumbre", nombre: "Legumbres", icono: "🫘", claves: ["altramuz*", "azuki*", "gandul*", "aquafaba", "pochas", "verdinas*", "garrofo", "judiones*", "habas secas", "frijol*", "garbanzo*", "lenteja*", "judia blanca", "judias blancas", "alubia*", "frijol*", "haba", "habas", "habitas", "edamame*", "hummus", "falafel", "harina de garbanzo", "judia pinta", "judias pintas", "judia roja", "judias rojas"] },
    { id: "alcohol", nombre: "Alcohol", icono: "🍷", claves: ["vino*", "cerveza", "brandy", "coñac", "ron", "whisky", "licor*", "sidra", "vermut", "cava", "sake", "mirin"] },
    { id: "cebolla-ajo", nombre: "Cebolla y ajo", icono: "🧅", claves: ["cebolla*", "cebolleta*", "ajo", "ajos", "puerro*", "chalota*", "ajo en polvo", "cebolla en polvo"], excluir: ["cebollino"] },
    { id: "berenjena", nombre: "Berenjena", icono: "🍆", claves: ["berenjena*"] },
    /* Alto en FODMAP (orientativo, según las tablas habituales de la dieta baja en FODMAP). Las versiones
       aptas (aceite de ajo, sin lactosa, sin gluten, parte verde) quedan fuera. */
    { id: "fodmap", nombre: "Alto en FODMAP", icono: "🎈", claves: [
      "ajo", "ajos", "ajo en polvo", "cebolla*", "cebolleta*", "puerro*", "chalota*", "cebolla en polvo",
      "harina de trigo", "gluten de trigo", "freekeh", "conchiglioni", "harina", "pan", "pan de*", "pan rallado", "panko", "pasta", "espagueti*", "macarron*", "tallarin*", "tagliatelle", "lasaña", "placas de lasaña", "cuscus", "bulgur", "tortillas de trigo", "fideo*", "noodle*", "gnocchi*", "ñoquis", "centeno", "cebada", "hojaldre", "masa", "masa de*", "masa quebrada", "galleta*", "pasta filo",
      "garbanzo*", "lenteja*", "judia blanca", "judias blancas", "alubia*", "frijol*", "haba", "habas", "habitas", "guisante*", "hummus", "soja texturizada", "judiones*", "azuki*", "gandul*", "altramuz*",
      "leche", "nata", "natas", "nata para*", "nata de*", "nata liquida", "nata montada", "yogur*", "queso fresco", "queso crema", "ricotta", "requeson", "mascarpone", "kefir", "leche condensada", "leche evaporada",
      "manzana*", "pera*", "mango*", "sandia", "melocoton*", "ciruela*", "cereza*", "higo*", "datil*", "pasas", "orejon*", "albaricoque*", "moras",
      "champiñon*", "seta*", "shiitake", "portobello", "boletus", "niscalo*", "coliflor", "esparrago*", "alcachofa*", "remolacha*", "apio", "aguacate*", "col lombarda",
      "miel", "sirope de agave", "agave", "anacardo*", "pistacho*", "inulina"
    ], excluir: ["aceite de ajo", "aceite con ajo", "sin lactosa", "sin gluten", "leche de coco", "bebida de almendra*", "bebida de arroz", "fideos de arroz", "noodles de arroz", "harina de arroz", "harina de maiz", "harina de garbanzo", "pan sin gluten", "pasta sin gluten", "cebollino*", "parte verde", "yogur vegetal", "yogur de coco", "nata vegetal", "nata de coco", "pasta de*", "trigo sarraceno", "harina de trigo sarraceno"] },

    /* Alérgenos de declaración obligatoria que faltaban (Reglamento UE 1169/2011) */
    { id: "cacahuete", nombre: "Cacahuete", icono: "🥜", claves: ["cacahuete*", "crema de cacahuete", "mantequilla de cacahuete", "aceite de cacahuete"] },
    { id: "apio", nombre: "Apio", icono: "🥬", claves: ["apio", "apionabo", "sal de apio", "semillas de apio"] },
    { id: "mostaza", nombre: "Mostaza", icono: "🟡", claves: ["mostaza*", "semillas de mostaza", "mostaza en grano"], excluir: ["hojas de mostaza"] },
    { id: "altramuz", nombre: "Altramuces", icono: "🟤", claves: ["altramuz*", "harina de altramuz"] },
    { id: "sulfitos", nombre: "Sulfitos", icono: "🍷", claves: ["vino*", "vinagre*", "sidra", "cava", "vermut", "jerez", "vino fino", "mirin", "sake", "pasas", "orejon*", "ciruela pasa", "ciruelas pasas", "fruta deshidratada", "frutas desecadas", "encurtido*", "pepinillo*", "alcaparra*", "guindillas en vinagre", "mostaza*"], excluir: ["hojas de mostaza"] },
    { id: "miel", nombre: "Miel", icono: "🍯", claves: ["miel"] },
    { id: "cafeina", nombre: "Cafeína", icono: "☕", claves: ["cafe", "te verde", "te negro", "chocolate*", "cacao"] },
  ];

  /* ---------- Ampliación: cocinas italiana, griega y eslava ----------
     Formatos de pasta y masas de trigo (gluten y FODMAP), quesos, embutidos, pescados y especias
     que no estaban en las listas generales. Se añaden aquí para no alargar más las reglas de arriba. */
  const PASTAS_TRIGO = ["bucatini", "paccheri", "trofie", "fregola", "ziti", "casarecce", "strozzapreti", "ditalini", "tubetti", "maltagliati", "pici", "bigoli",
    "garganelli", "cavatelli", "malloreddus", "lumache", "mezze maniche", "calamarata", "rigatoni", "penne", "fusilli", "farfalle", "conchiglie", "orecchiette",
    "pappardelle", "tagliatelle", "tagliolini", "fettuccine", "linguine", "linguini", "orzo", "kritharaki", "hilopites", "trahana", "tortellini", "tortelloni",
    "ravioli", "raviolis", "cappelletti", "agnolotti", "canelon*", "anelletti", "busiate", "scialatielli", "stelline", "pastina", "lagane", "vermicelli", "farro", "espelta",
    "pierogi", "pelmeni", "vareniki", "halusky", "spatzle", "lazanki", "picatostes", "croutons", "pan de centeno", "pan negro", "tarama*", "kvas"];
  const anadirClaves = (id, claves, excluir) => { const g = GRUPOS.find((x) => x.id === id); g.claves.push(...claves); if (excluir) g.excluir = [...(g.excluir || []), ...excluir]; };
  const anadirPasillo = (id, claves, primera = true) => { const r = primera ? REGLAS_PASILLO.find((x) => x[0] === id) : [...REGLAS_PASILLO].reverse().find((x) => x[0] === id); r[1].push(...claves); };
  // «pasta de…» sin trigo (pastas de especias o de legumbre) no lleva gluten; la pasta de trigo sí
  const PASTAS_SIN_TRIGO = ["pasta de aji*", "pasta de achiote", "pasta de curry*", "pasta de tamarindo", "pasta de judia*", "pasta de lentejas*", "pasta de garbanzo*", "pasta de guisante*", "pasta de arroz", "pasta de maiz", "pasta de sesamo", "pasta de miso", "pasta de chile*", "pasta de gambas", "pasta de pimiento*", "pasta de ajo", "pasta de jengibre", "pasta de tomate", "pasta de aceitunas", "pasta de datiles", "pasta de alforfon", "pasta de trigo sarraceno"];
  for (const id of ["gluten", "fodmap"]) { const g = GRUPOS.find((x) => x.id === id); g.excluir = g.excluir.filter((e) => e !== "pasta de*").concat(PASTAS_SIN_TRIGO); }
  anadirClaves("gluten", PASTAS_TRIGO, ["alforfon*", "kasha"]);
  anadirClaves("fodmap", PASTAS_TRIGO.filter((x) => x !== "tarama*" && x !== "kvas").concat(["fava*", "guisantes partidos", "guisante partido*"]));
  anadirClaves("legumbre", ["fava*", "guisantes partidos", "guisante partido*"]);
  const EMBUTIDO_CERDO = ["pancetta", "salsiccia", "speck", "nduja", "prosciutto", "kielbasa", "tocino", "lardo", "coppa", "capocollo", "cotechino", "loukaniko", "kabanos", "carrillera*", "salo"];
  anadirClaves("carne", [...EMBUTIDO_CERDO, "bresaola"]);
  anadirClaves("cerdo", EMBUTIDO_CERDO.filter((x) => x !== "carrillera*"));
  const QUESOS = ["grana padano", "gorgonzola", "taleggio", "fontina", "scamorza", "provolone", "stracciatella", "kefalotyri", "graviera", "kasseri", "manouri", "mizithra", "anthotyros", "smetana", "tvorog", "twarog", "kajmak", "sirene", "bryndza", "quark", "asiago", "caciocavallo", "robiola", "crescenza", "tzatziki", "pesto*"];
  anadirClaves("lacteos", QUESOS, ["pesto vegano", "pesto sin queso"]);
  anadirClaves("frutos-secos", ["pesto", "pesto genoves", "pesto de albahaca", "pesto rojo", "pesto alla genovese"]);
  anadirClaves("cebolla-ajo", ["tzatziki"]);
  anadirClaves("pescado", ["arenque*", "lucioperca", "carpa", "eperlano*", "lucio", "esturion", "bottarga", "huevas*", "tarama*", "anguila*", "pez de san pedro", "san pedro"]);
  anadirClaves("marisco", ["langosta*", "bogavante*", "cigala*", "erizo*", "carabinero*"]);
  const LICORES = ["vodka", "ouzo", "tsipouro", "marsala", "vino de marsala", "grappa", "limoncello", "prosecco", "metaxa", "kvas"];
  anadirClaves("alcohol", LICORES);
  anadirClaves("sulfitos", LICORES.filter((x) => x !== "kvas"));
  anadirPasillo("carniceria", [...EMBUTIDO_CERDO, "bresaola"]);
  anadirPasillo("lacteos-huevos", QUESOS.filter((x) => x !== "pesto*" && x !== "tzatziki"));
  anadirPasillo("pescaderia", ["arenque*", "lucioperca", "carpa", "eperlano*", "lucio", "esturion", "bottarga", "huevas*", "anguila*", "pez de san pedro", "san pedro", "langosta*", "bogavante*", "cigala*", "erizo*", "carabinero*"]);
  anadirPasillo("bebidas", LICORES);
  anadirPasillo("especias", ["bayas de enebro", "enebro", "alcaravea", "comino de prados", "mahlab", "mastiha", "masticha", "almaciga", "hierbas italianas", "ajedrea", "levistico", "vegeta"]);
  anadirPasillo("despensa", ["pesto*", "tapenade", "tzatziki", "tarama*", "ajvar", "lutenitsa", "hojas de parra", "alforfon*", "kasha", "trigo sarraceno", "fava*", "guisantes partidos", "guisante partido*", "hojas de pasta filo"]);
  anadirPasillo("frutas-verduras", ["radicchio", "achicoria*", "cavolo nero", "col negra", "puntarelle", "colinabo", "verdolaga*", "diente de leon", "ortiga*", "acedera", "horta", "grosella*", "eneldo fresco"]);
  anadirPasillo("despensa", PASTAS_TRIGO.filter((x) => !["picatostes", "croutons", "pan de centeno", "pan negro", "tarama*", "kvas"].includes(x)), false);
  anadirPasillo("panaderia", ["picatostes", "croutons", "pan de centeno", "pan negro"]);

  const cacheGrupos = new Map();
  const gruposDe = (nombre) => {
    const key = String(nombre || "").toLowerCase();
    if (cacheGrupos.has(key)) return cacheGrupos.get(key);
    const t = tokens(nombre);
    const tCompleto = tokens(String(nombre || "").replace(/[()]/g, " ")); // las exclusiones también miran dentro de los paréntesis: «cebolleta (parte verde)»
    const res = [];
    for (const g of GRUPOS) {
      if (g.excluir && g.excluir.some((e) => contieneFrase(tCompleto, e))) continue;
      if (g.claves.some((c) => contieneFrase(t, c))) res.push(g.id);
    }
    cacheGrupos.set(key, res);
    return res;
  };

  /* ¿Un término vetado (texto libre o id de grupo) afecta a este ingrediente? */
  const cacheVeto = new Map();
  const ingredienteVetado = (nombreIngrediente, veto) => {
    const k = nombreIngrediente + "\u0000" + veto;
    let res = cacheVeto.get(k);
    if (res === undefined) { res = calcularVetado(nombreIngrediente, veto); cacheVeto.set(k, res); }
    return res;
  };
  const calcularVetado = (nombreIngrediente, veto) => {
    const v = normalizar(veto);
    if (!v) return false;
    const grupo = GRUPOS.find((g) => g.id === veto || normalizar(g.nombre) === v);
    if (grupo) return gruposDe(nombreIngrediente).includes(grupo.id);
    const t = tokens(nombreIngrediente);
    if (contieneFrase(t, v)) return true;
    // también acepta que el veto sea el principio de una palabra larga ("champiñ" → champiñones)
    const vt = v.split(" ");
    if (vt.length === 1 && v.length >= 5) return t.some((w) => w.startsWith(v));
    return false;
  };

  /* Intolerancias y alergias que se pueden indicar en el perfil de cada persona.
     Cada una se apoya en uno o varios grupos de ingredientes. */
  const INTOLERANCIAS = [
    { id: "gluten", nombre: "Gluten (celiaquía)", corto: "gluten", icono: "🌾", grupos: ["gluten"] },
    { id: "lactosa", nombre: "Lactosa y lácteos", corto: "lácteos", icono: "🥛", grupos: ["lacteos"] },
    { id: "huevo", nombre: "Huevo", corto: "huevo", icono: "🥚", grupos: ["huevo"] },
    { id: "frutos-secos", nombre: "Frutos secos", corto: "frutos secos", icono: "🌰", grupos: ["frutos-secos"] },
    { id: "cacahuete", nombre: "Cacahuete", corto: "cacahuete", icono: "🥜", grupos: ["cacahuete"] },
    { id: "pescado", nombre: "Pescado", corto: "pescado", icono: "🐟", grupos: ["pescado"] },
    { id: "marisco", nombre: "Marisco (crustáceos y moluscos)", corto: "marisco", icono: "🦐", grupos: ["marisco"] },
    { id: "soja", nombre: "Soja", corto: "soja", icono: "🫘", grupos: ["soja"] },
    { id: "sesamo", nombre: "Sésamo", corto: "sésamo", icono: "⚪", grupos: ["sesamo"] },
    { id: "apio", nombre: "Apio", corto: "apio", icono: "🥬", grupos: ["apio"] },
    { id: "mostaza", nombre: "Mostaza", corto: "mostaza", icono: "🟡", grupos: ["mostaza"] },
    { id: "altramuz", nombre: "Altramuces", corto: "altramuces", icono: "🟤", grupos: ["altramuz"] },
    { id: "sulfitos", nombre: "Sulfitos", corto: "sulfitos", icono: "🍷", grupos: ["sulfitos"] },
    { id: "legumbres", nombre: "Legumbres", corto: "legumbres", icono: "🫛", grupos: ["legumbre"] },
    { id: "fodmap", nombre: "Intestino irritable (FODMAP)", corto: "FODMAP", icono: "🎈", grupos: ["fodmap"] },
  ];
  const intolerancia = (id) => INTOLERANCIAS.find((x) => x.id === id) || null;
  /* Intolerancias (de una lista de ids) que choca con una lista de grupos de una receta */
  const intoleranciasEn = (gruposReceta, ids) => (ids || []).map(intolerancia).filter((t) => t && t.grupos.some((g) => gruposReceta.includes(g)));

  const esBasico = (nombre) => pasilloDe(nombre) === "basicos";

  /* ¿Este ingrediente de receta "es" el que el usuario quiere usar? Como el veto, pero sin contar
     caldos, salsas o aceites derivados ("pollo" no casa con "caldo de pollo"), salvo que se pida así. */
  const DERIVADOS = ["caldo", "salsa", "pastilla", "aceite", "vinagre", "zumo", "pasta de", "crema de", "concentrado"];
  const cacheUsa = new Map();
  const ingredienteUsa = (nombreIngrediente, termino) => {
    const k = nombreIngrediente + "\u0000" + termino;
    let v = cacheUsa.get(k);
    if (v === undefined) {
      v = ingredienteVetado(nombreIngrediente, termino);
      if (v) { const n = normalizar(nombreIngrediente), t = normalizar(termino); v = !DERIVADOS.some((d) => n.startsWith(d + " ") && !t.startsWith(d)); }
      cacheUsa.set(k, v);
    }
    return v;
  };

  /* ---------- Estimación de coste (orientativa) a partir de los ingredientes ----------
     Solo cuentan proteínas e ingredientes "base": las verduras corrientes son neutras. */
  const COSTE_PREMIUM_2 = ["salmon fresco", "caballa*", "salmon*", "lubina*", "rape", "dorada", "rodaballo", "corvina", "atun fresco", "atun rojo", "ventresca", "langostino*", "gamba*", "vieira*", "pulpo", "bogavante", "carabinero*", "cigala*", "almeja*", "carrillada*", "solomillo*", "cordero*", "secreto*", "presa*", "entrecot*", "chuleton*", "burrata", "jamon iberico", "bacalao*", "foie", "ostra*", "pato", "trufa*", "aceite de trufa", "azafran", "rabo de toro", "cochinillo", "pichon", "bogavante"];
  const COSTE_PREMIUM_1 = ["merluza*", "ternera*", "calamar*", "sepia", "chipiron*", "anchoa*", "salmon ahumado", "parmesano", "pecorino", "manchego", "queso de cabra", "mascarpone", "piñon*", "pistacho*", "anacardo*", "nueces", "nuez", "almendra*", "avellana*", "aguacate*", "quinoa", "edamame*", "miso", "frutos rojos", "frambuesa*", "arandano*", "granada*", "higo*", "mango*", "leche de coco", "setas variadas", "boletus", "shiitake", "esparrago*", "sirope de arce", "jamon serrano", "queso azul", "gorgonzola", "feta", "halloumi", "camembert", "brie", "cerdo iberico", "conejo", "atun en conserva"];
  const COSTE_ECONOMICO = ["lenteja*", "garbanzo*", "judia*", "alubia*", "frijol*", "arroz*", "pasta", "espagueti*", "macarron*", "fideo*", "patata*", "huevo*", "pollo*", "pavo*", "cerdo picado", "cerdo (paleta)", "paleta de cerdo", "costilla*", "lomo de cerdo", "tofu*", "harina*", "pan", "pan rallado", "avena", "sardina*", "caballa*", "boqueron*", "cuscus", "bulgur", "polenta", "guisantes congelados", "soja texturizada", "seitan", "mejillon*", "pan de pita", "tortillas de maiz", "tortillas de trigo", "salchicha*", "chorizo*", "bacon", "caldo*"];
  const costeDe = (ingredientes) => {
    let premium = 0, economico = 0;
    for (const ing of ingredientes || []) {
      if (ing.opcional) continue;
      const t = tokens(ing.n);
      if (COSTE_PREMIUM_2.some((c) => contieneFrase(t, c))) premium += 2;
      else if (COSTE_PREMIUM_1.some((c) => contieneFrase(t, c))) premium += 1;
      else if (COSTE_ECONOMICO.some((c) => contieneFrase(t, c))) economico += 1;
    }
    if (premium >= 2) return "premium";
    if (premium === 0 && economico >= 1) return "económica";
    return "media";
  };

  const UNIDADES = {
    g: { nombre: "g", plural: "g", decimales: 0 },
    ml: { nombre: "ml", plural: "ml", decimales: 0 },
    ud: { nombre: "ud", plural: "ud", decimales: 0 },
    cda: { nombre: "cda", plural: "cdas", decimales: 1 },
    cdta: { nombre: "cdta", plural: "cdtas", decimales: 1 },
    diente: { nombre: "diente", plural: "dientes", decimales: 0 },
    rama: { nombre: "rama", plural: "ramas", decimales: 0 },
    hoja: { nombre: "hoja", plural: "hojas", decimales: 0 },
    manojo: { nombre: "manojo", plural: "manojos", decimales: 1 },
    pizca: { nombre: "pizca", plural: "pizcas", decimales: 0 },
    lata: { nombre: "lata", plural: "latas", decimales: 0 },
    bote: { nombre: "bote", plural: "botes", decimales: 0 },
    rebanada: { nombre: "rebanada", plural: "rebanadas", decimales: 0 },
    loncha: { nombre: "loncha", plural: "lonchas", decimales: 0 },
    puñado: { nombre: "puñado", plural: "puñados", decimales: 1 },
    "al gusto": { nombre: "al gusto", plural: "al gusto", decimales: 0 },
  };

  window.Catalogo = { normalizar, tokens, palabrasIguales, contieneFrase, coincideAlguna, PASILLOS, pasilloDe, GRUPOS, gruposDe, ingredienteVetado, ingredienteUsa, esBasico, costeDe, UNIDADES, INTOLERANCIAS, intolerancia, intoleranciasEn };
})();
