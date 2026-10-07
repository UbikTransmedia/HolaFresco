window.RECETAS_SEED = window.RECETAS_SEED || [];

/* Recetas INVENTADAS de cocina MEDITERRÁNEA para OLLA EXPRÉS (bloque de huecos: inv-3173 a inv-3174).
   Cubren el hueco de la categoría «olla-express» con dos platos tradicionales que el recetario aún
   no tenía: la daube de ternera de Provenza (guiso de fin de semana, con patatas cocidas en la
   misma olla en un segundo golpe de presión) y el kusksu de habas de Malta (sopa espesa de
   primavera, lista en poco más de media hora). En cada receta se indica el tiempo desde que sube la válvula y
   cómo despresurizar. Cantidades para 2 raciones. */

window.RECETAS_SEED.push({
  id: "inv-3173",
  nombre: "Daube provenzal de ternera al vino tinto con piel de naranja y aceitunas negras",
  subtitulo: "con patatas cocidas en la misma olla y perejil picado",
  origen: "inventada",
  categoria: "olla-express",
  cocina: "mediterránea",
  momentos: ["comida"],
  proteina: "ternera",
  tiempo: 110,
  dificultad: "media",
  equipo: ["olla-express"],
  raciones: 2,
  ingredientes: [
    { n: "ternera para guisar", q: 320, u: "g", nota: "morcillo o aguja, en tacos de 5 cm" },
    { n: "panceta", q: 50, u: "g", nota: "curada, en tiras gruesas" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "zanahoria", q: 2, u: "ud" },
    { n: "ajo", q: 3, u: "diente" },
    { n: "tomate concentrado", q: 1, u: "cda" },
    { n: "vino tinto", q: 250, u: "ml", nota: "un tinto joven con cuerpo" },
    { n: "agua", q: 150, u: "ml" },
    { n: "naranja", q: 0.5, u: "ud", nota: "solo la piel, en 3 tiras sin la parte blanca" },
    { n: "tomillo fresco", q: 3, u: "rama" },
    { n: "laurel", q: 2, u: "hoja" },
    { n: "clavo", q: 2, u: "ud" },
    { n: "aceitunas negras", q: 50, u: "g", nota: "mejor pequeñas y con hueso, tipo Niza o Aragón" },
    { n: "patata", q: 400, u: "g" },
    { n: "perejil fresco", q: 0.25, u: "manojo" },
    { n: "aceite de oliva", q: 1, u: "cda" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Seca la ternera con papel de cocina y salpimiéntala. Corta la panceta en tiras gruesas, la cebolla en plumas y las zanahorias en rodajas de 2 cm; aplasta los ajos con la hoja del cuchillo. Con un pelador, saca 3 tiras de piel de naranja sin nada de la parte blanca, que amarga.",
    "Calienta el aceite de oliva en la olla exprés abierta a fuego medio-alto y dora la panceta 3 minutos, hasta que suelte la grasa y se vea tostada; sácala. En esa misma grasa dora la carne en dos tandas, 3-4 minutos por tanda y sin moverla, hasta que tenga costra marrón por todas las caras. Resérvala con la panceta.",
    "Baja a fuego medio y rehoga la cebolla y la zanahoria 5 minutos, hasta que la cebolla esté transparente y empiece a dorarse. Añade los ajos y el tomate concentrado y remueve 1 minuto, hasta que el tomate se oscurezca.",
    "Vierte el vino tinto y raspa el fondo con una cuchara de madera para despegar todo lo tostado. Deja hervir 3 minutos a fuego fuerte, hasta que deje de oler a vino crudo. Devuelve la carne y la panceta con su jugo y añade el agua, la piel de naranja, el tomillo, el laurel y los clavos: el líquido debe cubrir la carne hasta la mitad.",
    "Cierra la olla y ponla a fuego fuerte. Cuando suba la válvula (segundo anillo en las ollas con indicador), baja a fuego medio-bajo y cuenta 35 minutos. Apaga y deja que la presión baje de forma natural, unos 10-15 minutos, hasta que la válvula descienda sola: así la carne no se encoge ni se reseca.",
    "Mientras baja la presión, pela las patatas y cáscalas en trozos de 4 cm (rompiéndolas con el cuchillo para que suelten almidón y espesen la salsa). Abre la olla: la carne debe deshacerse al apretarla con un tenedor; si aún se resiste, ciérrala y dale 5-8 minutos más. Añade las patatas y las aceitunas negras y mezcla para que queden medio cubiertas de salsa; si falta líquido, añade un chorrito de agua.",
    "Cierra de nuevo, lleva a presión y cuenta 5 minutos desde que suba la válvula; mientras, pica el perejil. Despresuriza de forma rápida: aparta la olla del fuego y abre la válvula poco a poco, o ponla bajo el grifo de agua fría hasta que baje el indicador.",
    "Retira la piel de naranja, el laurel, las ramas de tomillo y los clavos. Si la salsa está demasiado líquida, hierve sin tapa 5 minutos hasta que cubra el dorso de una cuchara. Prueba de sal y pimienta y sirve con el perejil por encima."
  ],
  nutricion: { kcal: 700, prot: 43, hc: 54, grasa: 32 },
  etiquetas: ["tradicional", "de cuchara", "invierno", "otoño", "batch cooking", "sin gluten", "sin lácteos", "alta en proteína", "poco especiada"],
  consejo: "En Provenza la daube se marina la víspera: si puedes, deja la carne toda la noche en la nevera con el vino, la cebolla, la zanahoria, el ajo, la piel de naranja y las hierbas, sécala bien antes de dorarla y usa el vino de la marinada en el paso 4. Aguanta 3 días en la nevera y está más buena al segundo día; para congelar, guarda la carne con su salsa sin las patatas. En Niza, con la salsa que sobra se aliñan unos macarrones y la carne deshilachada sirve para rellenar los raviolis a la daube.",
  tupper: true,
  contundencia: "contundente",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-3174",
  nombre: "Kusksu maltés de habas y guisantes con huevos escalfados y queso fresco",
  subtitulo: "sopa espesa de pasta en bolitas y tomate, típica de la primavera maltesa",
  origen: "inventada",
  categoria: "olla-express",
  cocina: "mediterránea",
  momentos: ["comida", "cena"],
  proteina: "legumbre",
  tiempo: 35,
  dificultad: "fácil",
  equipo: ["olla-express"],
  raciones: 2,
  ingredientes: [
    { n: "cebolla", q: 1, u: "ud" },
    { n: "ajo", q: 2, u: "diente" },
    { n: "aceite de oliva", q: 1.5, u: "cda" },
    { n: "tomate concentrado", q: 2, u: "cda" },
    { n: "mejorana seca", q: 0.5, u: "cdta", nota: "o orégano seco" },
    { n: "caldo de verduras", q: 750, u: "ml", nota: "caliente" },
    { n: "laurel", q: 1, u: "hoja" },
    { n: "habas congeladas", q: 250, u: "g", nota: "habitas baby; en primavera, frescas y desgranadas" },
    { n: "guisantes congelados", q: 100, u: "g" },
    { n: "cuscús perlado", q: 100, u: "g", nota: "sustituye al kusksu maltés; vale también fregola" },
    { n: "huevo", q: 2, u: "ud" },
    { n: "queso fresco", q: 100, u: "g", nota: "de oveja o de cabra si lo encuentras; sustituye a las ġbejniet maltesas" },
    { n: "perejil fresco", q: 0.25, u: "manojo" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" },
    { n: "agua", u: "al gusto" },
  ],
  pasos: [
    "Pica fina la cebolla y lamina los ajos. Corta el queso fresco en 4 trozos gruesos y pica el perejil fresco. Calienta el caldo.",
    "Calienta 1 cucharada de aceite de oliva en la olla exprés abierta a fuego medio y rehoga la cebolla 6 minutos, hasta que esté blanda y transparente. Añade el ajo y cocina 1 minuto más, sin que llegue a dorarse.",
    "Incorpora el tomate concentrado y la mejorana seca y remueve 2 minutos, hasta que el tomate se oscurezca y huela a tostado: el concentrado bien frito (la kunserva) es la base de muchos guisos malteses.",
    "Vierte el caldo de verduras caliente y añade el laurel, las habas congeladas, los guisantes congelados y el cuscús perlado. Remueve rascando bien el fondo para que no quede nada pegado y salpimienta (con cuidado si el caldo ya lleva sal).",
    "Comprueba que la olla no pasa de la mitad de su capacidad (con pasta hace espuma), ciérrala y ponla a fuego fuerte. Cuando suba la válvula, baja el fuego al mínimo y cuenta 3 minutos. Despresuriza de forma rápida poniendo la olla bajo el grifo de agua fría hasta que baje el indicador: no abras la válvula de golpe, porque el almidón de la pasta forma espuma y saldría proyectada.",
    "Abre y remueve: la pasta debe estar tierna y la sopa espesa, como unas gachas ligeras. Si te ha quedado muy densa, añade 100 ml de agua caliente. Retira el laurel.",
    "Vuelve a poner la olla a fuego suave, sin cerrarla. Haz 2 huecos en la sopa, casca un huevo en cada uno y reparte el queso fresco alrededor. Tapa con una tapadera normal y deja 4-5 minutos, hasta que la clara esté cuajada y blanca y la yema siga temblando.",
    "Sirve en platos hondos con un huevo y la mitad del queso por ración, pimienta negra recién molida, el perejil y la media cucharada de aceite de oliva restante en crudo."
  ],
  nutricion: { kcal: 630, prot: 33, hc: 68, grasa: 24 },
  etiquetas: ["tradicional", "de cuchara", "primavera", "vegetariana", "económica", "para entre semana", "poco especiada"],
  consejo: "El kusksu es una sopa de la Cuaresma y la primavera maltesas, cuando hay habas frescas; se hace con una pasta en bolitas que lleva su mismo nombre. El cuscús perlado es lo más parecido; también sirven un orzo pequeño (los mismos 3 minutos) o la fregola, que es más dura (súbela a 5 minutos de presión). Si quieres guardar una ración, hazlo antes de escalfar los huevos: la pasta sigue absorbiendo caldo, así que al recalentarla añade un buen chorro de agua y escalfa el huevo en ese momento.",
  tupper: false,
  contundencia: "media",
  coste: "económica"
});
