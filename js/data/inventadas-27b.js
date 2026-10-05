window.RECETAS_SEED = window.RECETAS_SEED || [];

/* Recetas INVENTADAS TRADICIONALES de HUEVOS, PATATAS Y VERDURAS (bloque 27b: inv-1336 a inv-1360).
   Platos caseros de siempre, vegetarianos (con huevo y/o lácteos). Cantidades para 2 raciones. */

window.RECETAS_SEED.push({
  id: "inv-1336",
  nombre: "Lentejas de vigilia con verduras y huevo duro",
  subtitulo: "estofadas con patata, pimentón y laurel",
  origen: "inventada",
  categoria: "legumbres",
  cocina: "española",
  momentos: ["comida"],
  proteina: "legumbre",
  tiempo: 60,
  dificultad: "fácil",
  equipo: ["cazuela"],
  raciones: 2,
  ingredientes: [
    { n: "lentejas pardinas secas", q: 160, u: "g" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "zanahoria", q: 1, u: "ud" },
    { n: "pimiento verde", q: 1, u: "ud" },
    { n: "ajo", q: 2, u: "diente" },
    { n: "tomate", q: 1, u: "ud", nota: "maduro" },
    { n: "patata", q: 150, u: "g" },
    { n: "pimentón dulce", q: 1, u: "cdta" },
    { n: "laurel", q: 1, u: "hoja" },
    { n: "huevo", q: 2, u: "ud" },
    { n: "aceite de oliva", q: 3, u: "cda" },
    { n: "vinagre de vino", q: 1, u: "cdta", opcional: true },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Lava las lentejas (las pardinas no necesitan remojo). Pica la cebolla, el pimiento y el ajo; corta la zanahoria en rodajas y ralla el tomate.",
    "En una cazuela, pocha la cebolla, el pimiento y el ajo con el aceite a fuego medio 8 minutos, hasta que estén blandos. Añade el tomate rallado y cocina 4 minutos.",
    "Aparta del fuego, añade el pimentón, remueve 10 segundos y agrega las lentejas, la zanahoria y el laurel. Cubre con 1 litro de agua fría.",
    "Lleva a ebullición, baja a fuego suave y cuece tapado 25 minutos.",
    "Añade la patata cascada en trozos pequeños y sal, y cuece 15-20 minutos más, hasta que lentejas y patata estén tiernas y el caldo haya espesado. Si se quedan secas, añade un chorrito de agua caliente.",
    "Mientras, cuece los huevos 10 minutos, enfríalos y pélalos.",
    "Sirve las lentejas con un huevo duro en cuartos por plato y, si te gusta, unas gotas de vinagre."
  ],
  nutricion: { kcal: 664, prot: 32, hc: 80, grasa: 24 },
  etiquetas: ["tradicional", "de cuchara", "saciante", "económica", "batch cooking", "invierno", "poco especiada"],
  consejo: "Las lentejas se echan siempre en agua fría y, si al hervir les añades un chorrito de agua fría ('asustarlas'), conservan mejor la piel. Al día siguiente están todavía más buenas.",
  contundencia: "contundente",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1337",
  nombre: "Garbanzos guisados con acelgas, patata y huevo duro",
  subtitulo: "potaje de vigilia con picada de pan frito y ajo",
  origen: "inventada",
  categoria: "legumbres",
  cocina: "española",
  momentos: ["comida"],
  proteina: "legumbre",
  tiempo: 150,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén", "batidora"],
  raciones: 2,
  ingredientes: [
    { n: "garbanzos secos", q: 160, u: "g", nota: "en remojo desde la víspera" },
    { n: "acelgas", q: 300, u: "g" },
    { n: "patata", q: 200, u: "g" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "ajo", q: 3, u: "diente" },
    { n: "tomate", q: 1, u: "ud" },
    { n: "pimentón dulce", q: 1, u: "cdta" },
    { n: "comino molido", q: 1, u: "pizca" },
    { n: "laurel", q: 1, u: "hoja" },
    { n: "pan", q: 1, u: "rebanada" },
    { n: "huevo", q: 2, u: "ud" },
    { n: "aceite de oliva", q: 4, u: "cda" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Escurre los garbanzos del remojo. Pon a hervir 1,5 litros de agua con el laurel y media cebolla; cuando hierva, echa los garbanzos (siempre en agua caliente) y cuece a fuego suave 1 h 45 min-2 h, tapado, hasta que estén tiernos. Si hace falta, añade agua caliente, nunca fría.",
    "Mientras, cuece los huevos 10 minutos, enfríalos, pélalos y pícalos. Lava las acelgas y trocea pencas y hojas.",
    "En una sartén, fríe la rebanada de pan y 2 ajos con 2 cucharadas de aceite hasta que estén dorados. Májalos en el mortero o tritúralos con un poco de caldo de los garbanzos.",
    "En la misma sartén, con el resto del aceite, pocha la otra media cebolla y el ajo restante picados 8 minutos; añade el tomate rallado y cocina 5 minutos. Aparta y añade el pimentón y el comino.",
    "Cuando los garbanzos estén casi tiernos, añade el sofrito, la patata cascada y las pencas de acelga. Cuece 15 minutos; añade las hojas y la picada de pan y cuece 10 minutos más, hasta que la patata esté tierna y el caldo trabado. Sala al final.",
    "Retira el laurel y la media cebolla y sirve en plato hondo con el huevo duro picado por encima."
  ],
  nutricion: { kcal: 730, prot: 32, hc: 92, grasa: 26 },
  etiquetas: ["tradicional", "de cuchara", "saciante", "económica", "batch cooking", "invierno", "superalimentos", "poco especiada"],
  consejo: "Si se te olvidó el remojo, usa 400 g de garbanzos cocidos de bote bien enjuagados: empieza en el paso del sofrito y en 35 minutos tienes el potaje.",
  contundencia: "contundente",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1338",
  nombre: "Alubias blancas estofadas con verduras y huevo escalfado",
  subtitulo: "a la manera de la huerta, con puerro, zanahoria y pimentón",
  origen: "inventada",
  categoria: "legumbres",
  cocina: "española",
  momentos: ["comida"],
  proteina: "legumbre",
  tiempo: 140,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén"],
  raciones: 2,
  ingredientes: [
    { n: "alubias blancas secas", q: 160, u: "g", nota: "en remojo desde la víspera" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "puerro", q: 1, u: "ud" },
    { n: "zanahoria", q: 2, u: "ud" },
    { n: "pimiento rojo", q: 0.5, u: "ud" },
    { n: "ajo", q: 2, u: "diente" },
    { n: "tomate", q: 1, u: "ud" },
    { n: "pimentón dulce", q: 1, u: "cdta" },
    { n: "laurel", q: 1, u: "hoja" },
    { n: "huevo", q: 2, u: "ud" },
    { n: "aceite de oliva", q: 3, u: "cda" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Escurre las alubias y ponlas en una cazuela con 1,2 litros de agua fría, el laurel, media cebolla, el puerro limpio en trozos grandes y 1 zanahoria entera. Lleva a ebullición y retira la espuma.",
    "Baja a fuego mínimo y cuece tapado 1 h 30 min-1 h 45 min, hasta que las alubias estén tiernas y mantecosas. Cada 30 minutos, 'asústalas' con medio vaso de agua fría.",
    "Mientras, pica la otra media cebolla, el pimiento, el ajo y la otra zanahoria en dados. Pocha todo con el aceite en una sartén a fuego medio 12 minutos. Añade el tomate rallado y cocina 5 minutos; aparta y mezcla el pimentón.",
    "Saca de la cazuela las verduras enteras, tritúralas con un cazo de caldo y unas alubias, y devuélvelas a la cazuela junto con el sofrito. Cuece 10 minutos más para que el caldo espese. Sala.",
    "Casca los huevos con cuidado sobre las alubias, tapa y cuece a fuego suave 4 minutos, hasta que las claras estén cuajadas.",
    "Sirve en plato hondo con un huevo por ración."
  ],
  nutricion: { kcal: 680, prot: 32, hc: 84, grasa: 24 },
  etiquetas: ["tradicional", "de cuchara", "saciante", "económica", "invierno", "batch cooking", "poco especiada"],
  consejo: "Triturar las verduras de la cocción con unas pocas alubias es el truco para un caldo espeso y sabroso sin añadir harina. Sala siempre al final: la sal al principio endurece la piel.",
  contundencia: "contundente",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1339",
  nombre: "Sopa castellana de ajo con huevo escalfado",
  subtitulo: "con pan asentado y pimentón de la Vera",
  origen: "inventada",
  categoria: "sopas-cremas",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 25,
  dificultad: "fácil",
  equipo: ["cazuela"],
  raciones: 2,
  ingredientes: [
    { n: "pan", q: 120, u: "g", nota: "de hogaza, del día anterior" },
    { n: "ajo", q: 6, u: "diente" },
    { n: "pimentón dulce", q: 1, u: "cdta" },
    { n: "caldo de verduras", q: 900, u: "ml" },
    { n: "huevo", q: 4, u: "ud" },
    { n: "aceite de oliva", q: 3, u: "cda" },
    { n: "perejil fresco", q: 0.25, u: "manojo", opcional: true },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Corta el pan en rebanadas muy finas. Pela los ajos y lamínalos.",
    "En una cazuela, preferiblemente de barro, calienta el aceite a fuego medio-bajo y dora los ajos 2 minutos, hasta que estén dorados claros.",
    "Añade el pan y rehógalo 2-3 minutos, removiendo, hasta que absorba el aceite y se tueste un poco.",
    "Aparta del fuego, espolvorea el pimentón, remueve rápido y vierte enseguida el caldo caliente. Sala y cuece a fuego suave 10 minutos, hasta que el pan se ablande y la sopa espese ligeramente.",
    "Casca los huevos sobre la sopa con cuidado, separados, tapa y deja 3-4 minutos a fuego mínimo, hasta que las claras cuajen. Sirve muy caliente, con perejil picado si quieres."
  ],
  nutricion: { kcal: 462, prot: 22, hc: 44, grasa: 22 },
  etiquetas: ["tradicional", "de cuchara", "rápida", "económica", "invierno", "ligera", "sin verduras", "poco especiada"],
  consejo: "Es la sopa de aprovechamiento por excelencia: cuanto más duro el pan, mejor. Si prefieres el huevo integrado, bátelo y échalo en hilo removiendo, como en la sopa de mi abuela.",
  contundencia: "ligera",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1340",
  nombre: "Hervido valenciano con huevo duro y aceite crudo",
  subtitulo: "patata, judía verde, cebolla y zanahoria, con sal y buen aceite",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 30,
  dificultad: "fácil",
  equipo: ["cazuela"],
  raciones: 2,
  ingredientes: [
    { n: "patata", q: 400, u: "g" },
    { n: "judías verdes", q: 250, u: "g" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "zanahoria", q: 1, u: "ud" },
    { n: "huevo", q: 2, u: "ud" },
    { n: "aceite de oliva", q: 3, u: "cda", nota: "virgen extra, en crudo" },
    { n: "vinagre de vino", q: 1, u: "cdta", opcional: true },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Pela las patatas y córtalas en trozos grandes; pela la cebolla y córtala en cuartos; pela la zanahoria y córtala en tres trozos. Quita las puntas a las judías y trocéalas.",
    "Pon todo en una cazuela, cubre con agua fría con sal y lleva a ebullición. Añade los huevos con cáscara (lávalos antes) con cuidado.",
    "Cuece a fuego medio. A los 10 minutos saca los huevos y pásalos a agua fría.",
    "Sigue cociendo las verduras 10-12 minutos más, hasta que la patata se deje atravesar fácilmente con un cuchillo.",
    "Escurre las verduras (guarda el caldo para una sopa) y sírvelas en plato hondo con los huevos pelados en mitades. Aliña en la mesa con el aceite crudo, sal y unas gotas de vinagre al gusto, aplastando un poco la patata."
  ],
  nutricion: { kcal: 470, prot: 16, hc: 52, grasa: 22 },
  etiquetas: ["tradicional", "fácil", "económica", "rápida", "ligera", "poco especiada"],
  consejo: "Es un plato de una sencillez total, así que la calidad del aceite lo es todo. En Valencia se cuecen los huevos en la misma olla que las verduras: ahorras fuego y cacharros.",
  contundencia: "ligera",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1341",
  nombre: "Piperrada vasca con huevos y pan tostado",
  subtitulo: "pimientos rojos y verdes pochados con tomate, ligados con huevo",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 30,
  dificultad: "fácil",
  equipo: ["sartén", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "pimiento rojo", q: 1, u: "ud" },
    { n: "pimiento verde", q: 2, u: "ud", nota: "tipo italiano" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "ajo", q: 2, u: "diente" },
    { n: "tomate", q: 3, u: "ud", nota: "maduros" },
    { n: "azúcar", q: 1, u: "pizca" },
    { n: "huevo", q: 4, u: "ud" },
    { n: "aceite de oliva", q: 4, u: "cda" },
    { n: "pan", q: 2, u: "rebanada" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Corta los pimientos y la cebolla en tiras finas y lamina el ajo. Ralla los tomates desechando la piel.",
    "Calienta el aceite en una sartén amplia a fuego medio y pocha la cebolla y el ajo 5 minutos. Añade los pimientos con sal y cocina 12 minutos, removiendo, hasta que estén muy blandos.",
    "Incorpora el tomate y la pizca de azúcar y cocina 8 minutos a fuego medio, hasta que la salsa espese y no quede agua.",
    "Bate ligeramente los huevos con sal, viértelos sobre las verduras y remueve suavemente a fuego bajo 1-2 minutos, hasta que cuajen cremosos.",
    "Tuesta el pan y sirve la piperrada caliente con las tostadas."
  ],
  nutricion: { kcal: 474, prot: 20, hc: 40, grasa: 26 },
  etiquetas: ["tradicional", "verano", "fácil", "una sola sartén", "ligera", "poco especiada"],
  consejo: "En Euskadi hay quien la sirve con el huevo cuajado entero encima en vez de revuelto: ambas son válidas. Si haces más cantidad de pimientos con tomate, te sirve de base para varios días.",
  contundencia: "ligera",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1342",
  nombre: "Crema de calabacín y queso con picatostes",
  subtitulo: "la crema suave de toda la vida, con puerro y patata",
  origen: "inventada",
  categoria: "sopas-cremas",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "queso",
  tiempo: 30,
  dificultad: "fácil",
  equipo: ["cazuela", "batidora", "sartén"],
  raciones: 2,
  ingredientes: [
    { n: "calabacín", q: 600, u: "g" },
    { n: "puerro", q: 1, u: "ud" },
    { n: "patata", q: 150, u: "g" },
    { n: "caldo de verduras", q: 500, u: "ml" },
    { n: "queso crema", q: 60, u: "g" },
    { n: "aceite de oliva", q: 2, u: "cda" },
    { n: "pan", q: 60, u: "g", nota: "del día anterior, para los picatostes" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Limpia el puerro y córtalo en rodajas; trocea el calabacín con piel y la patata pelada.",
    "En una cazuela, rehoga el puerro con 1 cucharada de aceite a fuego medio 5 minutos, hasta que esté blando.",
    "Añade el calabacín y la patata, rehoga 2 minutos y cubre con el caldo caliente. Cuece 15 minutos a fuego medio, hasta que la patata esté tierna.",
    "Mientras, corta el pan en dados y dóralo en una sartén con la otra cucharada de aceite a fuego medio 4 minutos, hasta que esté crujiente.",
    "Añade el queso crema a la cazuela y tritura con la batidora hasta obtener una crema fina. Salpimienta. Si está espesa, aclara con un poco de agua caliente.",
    "Sirve caliente con los picatostes por encima."
  ],
  nutricion: { kcal: 430, prot: 12, hc: 46, grasa: 22 },
  etiquetas: ["tradicional", "de cuchara", "fácil", "para niños", "batch cooking", "ligera", "poco especiada"],
  consejo: "No peles el calabacín: la piel le da el color verde y buena parte del sabor. Los quesitos en porciones de toda la vida funcionan igual de bien que el queso crema: usa 3.",
  contundencia: "ligera",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1343",
  nombre: "Espinacas a la crema con huevos duros gratinados",
  subtitulo: "con bechamel ligera, ajo y nuez moscada",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 30,
  dificultad: "fácil",
  equipo: ["sartén", "horno", "cazuela"],
  raciones: 2,
  ingredientes: [
    { n: "espinacas frescas", q: 500, u: "g" },
    { n: "ajo", q: 1, u: "diente" },
    { n: "mantequilla", q: 25, u: "g" },
    { n: "harina de trigo", q: 25, u: "g" },
    { n: "leche", q: 350, u: "ml" },
    { n: "nuez moscada molida", q: 1, u: "pizca" },
    { n: "huevo", q: 4, u: "ud" },
    { n: "queso rallado", q: 40, u: "g" },
    { n: "pan", q: 40, u: "g" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Cuece los huevos 10 minutos, enfríalos en agua fría, pélalos y córtalos por la mitad.",
    "Lava las espinacas y escáldalas en una cazuela grande con un dedo de agua 2 minutos, hasta que se ablanden. Escúrrelas apretando bien y pícalas.",
    "En la misma cazuela, funde la mantequilla con el ajo muy picado 1 minuto a fuego medio. Añade la harina y tuéstala 1 minuto.",
    "Vierte la leche poco a poco removiendo con varillas y cuece 5 minutos, hasta que espese. Sazona con sal, pimienta y nuez moscada e incorpora las espinacas. Cocina 2 minutos.",
    "Precalienta el grill del horno. Pon las espinacas a la crema en una fuente, coloca encima los huevos con la yema hacia arriba y espolvorea el queso.",
    "Gratina 5-6 minutos, hasta que el queso se dore. Sirve con el pan."
  ],
  nutricion: { kcal: 562, prot: 30, hc: 34, grasa: 34 },
  etiquetas: ["tradicional", "rápida", "fácil", "para niños", "al horno", "poco especiada"],
  consejo: "Si usas espinacas congeladas (400 g), descongélalas y escúrrelas muy bien: el agua que retienen aguaría la bechamel. Un puñado de piñones o pasas les da el toque catalán.",
  contundencia: "media",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1344",
  nombre: "Puerros gratinados con bechamel sobre patatas cocidas",
  subtitulo: "con queso fundido y nuez moscada",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "queso",
  tiempo: 50,
  dificultad: "fácil",
  equipo: ["cazuela", "horno"],
  raciones: 2,
  ingredientes: [
    { n: "puerro", q: 4, u: "ud", nota: "unos 600 g" },
    { n: "patata", q: 300, u: "g" },
    { n: "mantequilla", q: 25, u: "g" },
    { n: "harina de trigo", q: 25, u: "g" },
    { n: "leche", q: 400, u: "ml" },
    { n: "nuez moscada molida", q: 1, u: "pizca" },
    { n: "queso rallado", q: 60, u: "g" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Limpia los puerros quitando la parte verde dura y córtalos en trozos de 8 cm; lávalos bien por dentro. Pela la patata y córtala en rodajas de 1 cm.",
    "Cuece las patatas en agua con sal 8 minutos; añade los puerros y cuece 10 minutos más, hasta que ambos estén tiernos. Escurre muy bien sobre papel de cocina.",
    "Prepara la bechamel: funde la mantequilla, tuesta la harina 1 minuto, añade la leche poco a poco con varillas y cuece 6 minutos a fuego suave, hasta que espese. Sazona con sal, pimienta y nuez moscada y añade la mitad del queso.",
    "Precalienta el horno a 220 °C con grill. Coloca las rodajas de patata en el fondo de una fuente y los puerros encima.",
    "Cubre con la bechamel y espolvorea el resto del queso.",
    "Gratina 10-12 minutos, hasta que la superficie esté dorada y burbujeante. Deja reposar 5 minutos y sirve."
  ],
  nutricion: { kcal: 598, prot: 22, hc: 60, grasa: 30 },
  etiquetas: ["tradicional", "al horno", "invierno", "fácil", "poco especiada"],
  consejo: "Escurre los puerros a conciencia, incluso presionándolos suavemente con papel: retienen mucha agua y si no la sueltan antes, la bechamel se aguará en el horno.",
  contundencia: "media",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1345",
  nombre: "Coliflor rebozada con salsa de tomate casera",
  subtitulo: "ramilletes rebozados en harina y huevo, como en casa de la abuela",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 50,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "coliflor", q: 700, u: "g" },
    { n: "harina de trigo", q: 60, u: "g" },
    { n: "huevo", q: 3, u: "ud" },
    { n: "aceite de oliva", q: 250, u: "ml", nota: "para freír" },
    { n: "tomate triturado", q: 300, u: "g" },
    { n: "cebolla", q: 0.5, u: "ud" },
    { n: "ajo", q: 1, u: "diente" },
    { n: "azúcar", q: 1, u: "pizca" },
    { n: "pan", q: 60, u: "g" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Separa la coliflor en ramilletes medianos y cuécelos en agua con sal 8 minutos, hasta que estén tiernos pero firmes. Escúrrelos muy bien y deja que se sequen y enfríen 10 minutos.",
    "Mientras, prepara la salsa: pocha la cebolla y el ajo picados con 2 cucharadas de aceite en un cazo 6 minutos; añade el tomate, la pizca de azúcar y sal y cocina 15 minutos a fuego suave, hasta que espese.",
    "Pasa los ramilletes por harina, sacudiendo el exceso, y luego por los huevos batidos con una pizca de sal.",
    "Calienta el aceite en una sartén a fuego medio-alto y fríe los ramilletes por tandas 2-3 minutos, girándolos, hasta que el rebozado esté dorado. Escúrrelos sobre papel.",
    "Sirve la coliflor rebozada con la salsa de tomate caliente por encima o al lado, y el pan."
  ],
  nutricion: { kcal: 616, prot: 20, hc: 62, grasa: 32 },
  etiquetas: ["tradicional", "para niños", "económica", "invierno", "poco especiada"],
  consejo: "La coliflor debe estar bien seca antes de rebozar o el huevo resbalará. Es la mejor forma de que los niños coman coliflor: con tomate casero no queda ni un ramillete.",
  contundencia: "media",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1346",
  nombre: "Trinxat de la Cerdanya con huevos fritos",
  subtitulo: "torta de col y patata aplastadas y doradas con ajo",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida"],
  proteina: "huevo",
  tiempo: 50,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén"],
  raciones: 2,
  ingredientes: [
    { n: "repollo", q: 500, u: "g", nota: "mejor col de invierno rizada" },
    { n: "patata", q: 500, u: "g" },
    { n: "ajo", q: 4, u: "diente" },
    { n: "huevo", q: 4, u: "ud" },
    { n: "aceite de oliva", q: 5, u: "cda" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Corta la col en tiras quitando el tronco duro y pela y trocea las patatas.",
    "Cuece las patatas en abundante agua con sal 10 minutos; añade la col y cuece 15 minutos más, hasta que todo esté muy tierno. Escurre a conciencia en un colador, presionando para que suelte el agua.",
    "En una sartén de 22 cm, dora los ajos laminados con 3 cucharadas de aceite a fuego medio 2 minutos.",
    "Añade la col y la patata, salpimienta y aplasta con un tenedor o un pasapurés mientras rehogas 5 minutos, hasta formar una masa gruesa, no un puré fino.",
    "Extiéndela en la sartén formando una torta, aprieta con la espátula y dórala a fuego medio-alto 5-6 minutos sin tocar, hasta que tenga costra. Dale la vuelta con un plato y dora el otro lado 4-5 minutos con 1 cucharada más de aceite.",
    "En otra sartén con el aceite restante fríe los huevos y sírvelos sobre las porciones de trinxat."
  ],
  nutricion: { kcal: 744, prot: 24, hc: 72, grasa: 40 },
  etiquetas: ["tradicional", "saciante", "invierno", "económica", "fácil", "poco especiada"],
  consejo: "La costra dorada es lo mejor del trinxat, así que no le des la vuelta antes de tiempo: cuando al mover la sartén la torta se desplace entera, está lista. La col de después de las heladas es más dulce.",
  contundencia: "contundente",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1347",
  nombre: "Lombarda a la madrileña con manzana, pasas y piñones",
  subtitulo: "con patatas cocidas y huevos escalfados",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 75,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén"],
  raciones: 2,
  ingredientes: [
    { n: "col lombarda", q: 600, u: "g" },
    { n: "manzana", q: 1, u: "ud", nota: "reineta o golden" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "ajo", q: 2, u: "diente" },
    { n: "pasas", q: 30, u: "g" },
    { n: "piñones", q: 15, u: "g" },
    { n: "vinagre de manzana", q: 2, u: "cda" },
    { n: "laurel", q: 1, u: "hoja" },
    { n: "patata", q: 300, u: "g" },
    { n: "huevo", q: 4, u: "ud" },
    { n: "aceite de oliva", q: 3, u: "cda" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Corta la lombarda en juliana fina, quitando el tronco. Ponla en una cazuela con agua hirviendo, sal, el laurel y 1 cucharada del vinagre (mantiene el color morado) y cuece 40 minutos a fuego medio, hasta que esté tierna. Escurre.",
    "Mientras, cuece las patatas peladas y en trozos en otro cazo con agua y sal 18-20 minutos, hasta que estén tiernas. Escúrrelas.",
    "Pon las pasas a remojar en agua templada 10 minutos.",
    "En una sartén grande, dora los ajos laminados y los piñones con el aceite a fuego medio-bajo 1-2 minutos, hasta que los piñones estén dorados. Añade la cebolla en juliana y póchala 8 minutos.",
    "Incorpora la manzana pelada en dados y las pasas escurridas y rehoga 4 minutos. Añade la lombarda y el resto del vinagre y saltea 5 minutos a fuego medio para que todo se mezcle. Rectifica de sal.",
    "Escalfa los huevos 3 minutos en un cazo con agua hirviendo suave y un chorrito de vinagre, sacándolos con espumadera.",
    "Sirve la lombarda con las patatas al lado y dos huevos escalfados por ración."
  ],
  nutricion: { kcal: 586, prot: 22, hc: 66, grasa: 26 },
  etiquetas: ["tradicional", "invierno", "para invitados", "batch cooking", "poco especiada"],
  consejo: "Es el acompañamiento de la Nochebuena madrileña, pero con huevo y patata se convierte en un plato completo. Se conserva muy bien cuatro días y gana sabor al recalentarla.",
  contundencia: "media",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1348",
  nombre: "Gratín dauphinois de patatas con nata y gruyère",
  subtitulo: "con ensalada verde a la vinagreta",
  origen: "inventada",
  categoria: "verduras",
  cocina: "europea",
  momentos: ["comida"],
  proteina: "queso",
  tiempo: 95,
  dificultad: "fácil",
  equipo: ["horno", "cazuela", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "patata", q: 800, u: "g", nota: "harinosa" },
    { n: "nata para cocinar", q: 250, u: "ml" },
    { n: "leche", q: 150, u: "ml" },
    { n: "ajo", q: 1, u: "diente" },
    { n: "nuez moscada molida", q: 1, u: "pizca" },
    { n: "queso gruyère", q: 60, u: "g", nota: "rallado" },
    { n: "mantequilla", q: 10, u: "g" },
    { n: "canónigos", q: 2, u: "puñado" },
    { n: "vinagre de vino", q: 1, u: "cdta" },
    { n: "aceite de oliva", q: 1, u: "cda" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Precalienta el horno a 170 °C. Frota una fuente de horno con el ajo partido por la mitad y úntala con la mantequilla.",
    "Pela las patatas y córtalas en láminas muy finas, de 2-3 mm (con mandolina si tienes). No las laves: su almidón espesará la salsa.",
    "En una cazuela, calienta la nata con la leche, el ajo picado, sal, pimienta y nuez moscada. Añade las patatas y cuece a fuego suave 10 minutos, removiendo con cuidado, hasta que la crema empiece a espesar.",
    "Pasa las patatas con la crema a la fuente, colocándolas en capas, y alisa la superficie. Espolvorea el queso.",
    "Hornea 60 minutos, hasta que la superficie esté dorada y un cuchillo atraviese las patatas sin resistencia. Si se dora demasiado pronto, cúbrela con papel de aluminio.",
    "Deja reposar 10 minutos para que se asiente. Mientras, aliña los canónigos con el aceite, el vinagre y sal, y sirve junto al gratín."
  ],
  nutricion: { kcal: 798, prot: 22, hc: 74, grasa: 46 },
  etiquetas: ["tradicional", "al horno", "saciante", "para invitados", "invierno", "de domingo", "poco especiada"],
  consejo: "Cocer primero las patatas en la nata es el truco de las abuelas del Delfinado: así el gratín queda cremoso y no se corta. Las patatas, siempre finas e iguales para que se hagan a la vez.",
  contundencia: "contundente",
  coste: "premium"
});

window.RECETAS_SEED.push({
  id: "inv-1349",
  nombre: "Crepes de espinacas y requesón gratinados con bechamel",
  subtitulo: "crepes caseras rellenas y horneadas con queso gruyère",
  origen: "inventada",
  categoria: "verduras",
  cocina: "europea",
  momentos: ["comida"],
  proteina: "queso",
  tiempo: 70,
  dificultad: "media",
  equipo: ["sartén", "cazuela", "horno", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "harina de trigo", q: 120, u: "g", nota: "100 g para las crepes y 20 g para la bechamel" },
    { n: "leche", q: 550, u: "ml", nota: "250 ml para las crepes y 300 ml para la bechamel" },
    { n: "huevo", q: 2, u: "ud" },
    { n: "mantequilla", q: 40, u: "g" },
    { n: "espinacas frescas", q: 400, u: "g" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "requesón", q: 150, u: "g" },
    { n: "nuez moscada molida", q: 1, u: "pizca" },
    { n: "queso gruyère", q: 50, u: "g", nota: "rallado" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Bate 100 g de harina con los huevos, 250 ml de leche, una pizca de sal y 10 g de mantequilla fundida hasta tener una masa lisa y fluida. Deja reposar 15 minutos.",
    "Calienta una sartén antiadherente de 20 cm a fuego medio, úntala con un poco de mantequilla y vierte un cazo pequeño de masa, girando la sartén para cubrir el fondo. Cocina 1 minuto, dale la vuelta y 30 segundos más. Haz 6 crepes.",
    "Pica la cebolla y pochala con 10 g de mantequilla en una sartén 6 minutos. Añade las espinacas lavadas y cocina 4 minutos, hasta que se reduzcan y se evapore el agua. Escurre, pica y mezcla con el requesón, sal, pimienta y nuez moscada.",
    "Prepara la bechamel con el resto de la mantequilla, 20 g de harina y 300 ml de leche: tuesta la harina 1 minuto, añade la leche poco a poco con varillas y cuece 5 minutos. Sazona.",
    "Precalienta el horno a 200 °C. Rellena cada crepe con el relleno de espinacas, enróllala y colócala en una fuente engrasada.",
    "Cubre con la bechamel, espolvorea el gruyère y hornea 15 minutos, hasta que estén doradas y burbujeantes."
  ],
  nutricion: { kcal: 796, prot: 36, hc: 64, grasa: 44 },
  etiquetas: ["tradicional", "al horno", "saciante", "para invitados", "de domingo", "poco especiada"],
  consejo: "La primera crepe casi siempre sale mal: es la que calibra la sartén. Las crepes se pueden hacer el día antes y guardarlas apiladas y tapadas en la nevera.",
  contundencia: "contundente",
  coste: "premium"
});

window.RECETAS_SEED.push({
  id: "inv-1350",
  nombre: "Tortilla de espárragos trigueros y ajetes",
  subtitulo: "jugosa, a la española, con pan tostado",
  origen: "inventada",
  categoria: "huevos",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 25,
  dificultad: "fácil",
  equipo: ["sartén", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "espárragos trigueros", q: 250, u: "g" },
    { n: "ajos tiernos", q: 1, u: "manojo" },
    { n: "huevo", q: 5, u: "ud" },
    { n: "aceite de oliva", q: 3, u: "cda" },
    { n: "pan", q: 80, u: "g" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Quita a los espárragos la parte dura del tallo (dóblalos: se parten solos por donde empieza lo tierno) y córtalos en trozos de 2 cm, dejando las yemas aparte. Limpia los ajetes y córtalos igual.",
    "Calienta 2 cucharadas de aceite en una sartén de 20 cm a fuego medio y saltea los tallos de espárrago con los ajetes 5 minutos. Añade las yemas y saltea 2 minutos más, hasta que estén tiernos pero aún verdes. Sala.",
    "Bate los huevos con sal en un bol y añade las verduras calientes. Mezcla y deja reposar 2 minutos.",
    "Calienta la sartén con la cucharada de aceite restante a fuego medio-alto, vierte la mezcla y cuaja 2-3 minutos despegando los bordes.",
    "Dale la vuelta con un plato y cuaja 1-2 minutos más, hasta que esté dorada por fuera y jugosa por dentro. Sirve con el pan tostado."
  ],
  nutricion: { kcal: 536, prot: 26, hc: 36, grasa: 32 },
  etiquetas: ["tradicional", "rápida", "fácil", "ideal para llevar", "poco especiada"],
  consejo: "En primavera, cuando hay trigueros silvestres, esta tortilla es un lujo de pueblo. Los tallos tardan más que las yemas: por eso se echan antes y las puntas al final.",
  contundencia: "media",
  coste: "premium"
});

window.RECETAS_SEED.push({
  id: "inv-1351",
  nombre: "Pastel de patata gratinado con verduras y queso",
  subtitulo: "capas de puré casero y sofrito de verduras con tomate",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida"],
  proteina: "queso",
  tiempo: 75,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén", "horno"],
  raciones: 2,
  ingredientes: [
    { n: "patata", q: 700, u: "g" },
    { n: "leche", q: 100, u: "ml" },
    { n: "mantequilla", q: 20, u: "g" },
    { n: "huevo", q: 1, u: "ud" },
    { n: "nuez moscada molida", q: 1, u: "pizca" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "zanahoria", q: 1, u: "ud" },
    { n: "pimiento rojo", q: 0.5, u: "ud" },
    { n: "calabacín", q: 200, u: "g" },
    { n: "tomate frito", q: 150, u: "g" },
    { n: "queso rallado", q: 60, u: "g" },
    { n: "aceite de oliva", q: 2, u: "cda" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Pela las patatas, trocéalas y cuécelas en agua con sal 20 minutos, hasta que se deshagan al pincharlas. Escúrrelas.",
    "Mientras, pica la cebolla, la zanahoria, el pimiento y el calabacín en dados pequeños. Pocha la cebolla, la zanahoria y el pimiento con el aceite en una sartén a fuego medio 10 minutos; añade el calabacín y cocina 6 minutos más. Agrega el tomate frito, salpimienta y cocina 3 minutos.",
    "Aplasta las patatas con un pasapurés o tenedor (no con batidora, se volvería chiclosa) y mezcla con la mantequilla, la leche caliente, el huevo batido, sal y nuez moscada hasta tener un puré cremoso.",
    "Precalienta el horno a 200 °C. Extiende la mitad del puré en una fuente, cubre con las verduras y tapa con el resto del puré, alisándolo con una espátula.",
    "Espolvorea el queso y hornea 20 minutos; pon el grill los últimos 5 minutos para que quede dorado.",
    "Deja reposar 5 minutos antes de cortar en porciones."
  ],
  nutricion: { kcal: 712, prot: 24, hc: 82, grasa: 32 },
  etiquetas: ["tradicional", "al horno", "saciante", "para niños", "económica", "batch cooking", "poco especiada"],
  consejo: "Pasa el tenedor por la superficie del puré antes de echar el queso: esas rayas se doran y quedan crujientes. Puedes montarlo la víspera y hornearlo justo antes de comer.",
  contundencia: "contundente",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1352",
  nombre: "Patatas revolconas con pimentón y huevos fritos",
  subtitulo: "el machacado abulense de patata, ajo y pimentón, sin torreznos",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida"],
  proteina: "huevo",
  tiempo: 45,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén"],
  raciones: 2,
  ingredientes: [
    { n: "patata", q: 800, u: "g" },
    { n: "laurel", q: 1, u: "hoja" },
    { n: "ajo", q: 4, u: "diente" },
    { n: "pimentón dulce", q: 1, u: "cdta" },
    { n: "pimentón picante", q: 0.5, u: "cdta" },
    { n: "aceite de oliva", q: 5, u: "cda" },
    { n: "huevo", q: 4, u: "ud" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Pela las patatas, cáscalas en trozos y cuécelas en agua con sal y el laurel 20-25 minutos, hasta que estén muy tiernas. Escúrrelas reservando un vaso del agua de cocción.",
    "En una sartén amplia, calienta 4 cucharadas de aceite a fuego medio y dora los ajos laminados 2 minutos, hasta que estén dorados.",
    "Aparta la sartén del fuego, añade los dos pimentones y remueve 10 segundos para que tiñan el aceite sin quemarse.",
    "Echa las patatas en la sartén y machácalas con un tenedor o una espátula a fuego bajo, añadiendo poco a poco el agua de cocción reservada, hasta tener un puré rústico, rojizo y cremoso. Rectifica de sal.",
    "Fríe los huevos en otra sartén con el resto del aceite bien caliente.",
    "Sirve las revolconas en plato con dos huevos fritos encima por ración."
  ],
  nutricion: { kcal: 736, prot: 22, hc: 72, grasa: 40 },
  etiquetas: ["tradicional", "saciante", "económica", "fácil", "invierno"],
  consejo: "El agua de cocer las patatas, con su almidón, es lo que hace que el machacado quede cremoso sin necesidad de leche ni mantequilla. Ve añadiéndola poco a poco hasta la textura que te guste.",
  contundencia: "contundente",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1353",
  nombre: "Rösti suizo de patata con huevos fritos y ensalada",
  subtitulo: "torta crujiente de patata rallada dorada en mantequilla",
  origen: "inventada",
  categoria: "verduras",
  cocina: "europea",
  momentos: ["comida"],
  proteina: "huevo",
  tiempo: 45,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "patata", q: 700, u: "g", nota: "firme, tipo agria" },
    { n: "cebolla", q: 0.5, u: "ud" },
    { n: "mantequilla", q: 30, u: "g" },
    { n: "aceite de oliva", q: 2, u: "cda" },
    { n: "huevo", q: 4, u: "ud" },
    { n: "lechuga romana", q: 0.5, u: "ud" },
    { n: "tomate", q: 1, u: "ud" },
    { n: "vinagre de vino", q: 1, u: "cdta" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Cuece las patatas enteras con piel en agua con sal 12 minutos (deben quedar a medio hacer, aún firmes). Escúrrelas y déjalas enfriar por completo, mejor en la nevera.",
    "Pélalas y rállalas con el lado grueso del rallador. Mezcla con la cebolla rallada, sal y pimienta.",
    "Calienta la mitad de la mantequilla con 1 cucharada de aceite en una sartén antiadherente de 24 cm a fuego medio. Echa la patata, aplánala ligeramente formando una torta y cocina 10-12 minutos sin remover, hasta que la base esté dorada y crujiente.",
    "Dale la vuelta con ayuda de un plato, añade el resto de la mantequilla por los bordes y dora el otro lado 8-10 minutos.",
    "Mientras, fríe los huevos en otra sartén con el aceite restante y prepara la ensalada de lechuga y tomate aliñada con sal, vinagre y un hilo de aceite.",
    "Corta el rösti en porciones y sírvelo con dos huevos encima y la ensalada al lado."
  ],
  nutricion: { kcal: 694, prot: 22, hc: 66, grasa: 38 },
  etiquetas: ["tradicional", "saciante", "económica", "fácil", "poco especiada"],
  consejo: "La patata cocida el día anterior y bien fría es el truco suizo: se ralla mejor y el rösti queda crujiente y no pegajoso. Si te sobran patatas cocidas de otra comida, este es su destino.",
  contundencia: "contundente",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1354",
  nombre: "Ensaladilla rusa de la abuela con huevo duro y piquillos",
  subtitulo: "patata, zanahoria y guisantes con mayonesa y aceitunas",
  origen: "inventada",
  categoria: "ensaladas",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 50,
  dificultad: "fácil",
  equipo: ["cazuela", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "patata", q: 500, u: "g" },
    { n: "zanahoria", q: 2, u: "ud" },
    { n: "guisantes congelados", q: 100, u: "g" },
    { n: "huevo", q: 3, u: "ud" },
    { n: "mayonesa", q: 100, u: "g", nota: "mejor casera" },
    { n: "pimientos del piquillo", q: 3, u: "ud" },
    { n: "aceitunas verdes", q: 12, u: "ud", nota: "sin hueso" },
    { n: "vinagre de vino", q: 1, u: "cdta" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Lava las patatas y cuécelas enteras con piel en agua con sal, junto con las zanahorias peladas, 25 minutos, hasta que un cuchillo las atraviese sin esfuerzo. Añade los huevos los últimos 10 minutos y los guisantes los últimos 3.",
    "Escurre todo y pasa los huevos a agua fría. Deja templar las verduras 10 minutos.",
    "Pela las patatas y córtalas en dados pequeños; corta la zanahoria en dados más pequeños aún. Pela los huevos y pica dos de ellos.",
    "En un bol, mezcla las patatas, la zanahoria, los guisantes y el huevo picado con la sal y el vinagre. Añade la mayonesa y mezcla con cuidado, chafando un poco la patata para que quede cremosa.",
    "Pasa a una fuente, alisa y decora con tiras de piquillo, las aceitunas y el último huevo en rodajas. Refrigera al menos 15 minutos antes de servir."
  ],
  nutricion: { kcal: 630, prot: 18, hc: 54, grasa: 38 },
  etiquetas: ["tradicional", "verano", "fácil", "ideal para llevar", "para invitados", "poco especiada"],
  consejo: "Mezcla la patata con la mayonesa cuando aún está templada, no fría: absorbe mejor el aliño y la ensaladilla queda más sabrosa. Para una mayonesa casera: 1 huevo, 200 ml de aceite suave, sal y unas gotas de limón con la batidora, sin levantarla hasta que emulsione.",
  contundencia: "media",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1355",
  nombre: "Berenjenas fritas con miel de caña y salmorejo",
  subtitulo: "con huevo duro picado sobre el salmorejo",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida"],
  proteina: "verdura",
  tiempo: 65,
  dificultad: "media",
  equipo: ["batidora", "sartén", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "berenjena", q: 2, u: "ud", nota: "unos 500 g" },
    { n: "leche", q: 200, u: "ml", nota: "para el remojo" },
    { n: "harina de trigo", q: 60, u: "g" },
    { n: "aceite de oliva", q: 250, u: "ml", nota: "para freír" },
    { n: "miel de caña", q: 2, u: "cda" },
    { n: "tomate pera", q: 500, u: "g", nota: "muy maduros" },
    { n: "pan", q: 80, u: "g", nota: "de miga compacta, del día anterior" },
    { n: "ajo", q: 1, u: "diente" },
    { n: "vinagre de Jerez", q: 1, u: "cdta" },
    { n: "huevo", q: 2, u: "ud" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Corta las berenjenas en rodajas o bastones de medio centímetro, ponlas en un bol cubiertas con la leche y una pizca de sal y deja reposar 30 minutos (les quita el amargor y hace que absorban menos aceite).",
    "Mientras, prepara el salmorejo: tritura los tomates troceados con el ajo hasta que estén líquidos; añade el pan troceado y deja que se empape 10 minutos. Tritura de nuevo añadiendo en hilo 4 cucharadas del aceite, el vinagre y sal, hasta que esté espeso y fino. Enfría en la nevera.",
    "Cuece los huevos 10 minutos, enfríalos, pélalos y pícalos.",
    "Escurre las berenjenas, sécalas ligeramente y pásalas por la harina, sacudiendo el exceso.",
    "Calienta el resto del aceite en una sartén a fuego medio-alto y fríe las berenjenas por tandas 2-3 minutos, hasta que estén doradas y crujientes. Escúrrelas sobre papel y sálalas.",
    "Sirve las berenjenas recién fritas con un hilo de miel de caña por encima y el salmorejo frío en un cuenco aparte, coronado con el huevo picado."
  ],
  nutricion: { kcal: 832, prot: 18, hc: 82, grasa: 48 },
  etiquetas: ["tradicional", "verano", "saciante", "para invitados", "poco especiada"],
  consejo: "La miel de caña (melaza) es la de toda la vida en Andalucía; si no la encuentras, usa miel de flores rebajada con unas gotas de agua. Las berenjenas, al plato nada más freírlas, que reblandecen enseguida.",
  contundencia: "contundente",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1356",
  nombre: "Tortilla de berenjena y cebolla con pimientos del piquillo",
  subtitulo: "berenjena pochada lentamente, con pan",
  origen: "inventada",
  categoria: "huevos",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 50,
  dificultad: "fácil",
  equipo: ["sartén", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "berenjena", q: 1, u: "ud", nota: "unos 350 g" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "huevo", q: 5, u: "ud" },
    { n: "aceite de oliva", q: 4, u: "cda" },
    { n: "pimientos del piquillo", q: 4, u: "ud" },
    { n: "ajo", q: 1, u: "diente" },
    { n: "pan", q: 60, u: "g" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Pela la berenjena a tiras (deja algo de piel) y córtala en dados de 1,5 cm. Corta la cebolla en juliana.",
    "Calienta 3 cucharadas de aceite en una sartén de 20-22 cm a fuego medio, añade la cebolla y la berenjena con sal, tapa y cocina 15-18 minutos, removiendo de vez en cuando, hasta que la berenjena esté melosa y la cebolla dorada.",
    "Bate los huevos con sal en un bol, añade las verduras escurridas del exceso de aceite y deja reposar 3 minutos.",
    "Limpia la sartén, caliéntala con unas gotas de aceite a fuego medio-alto, vierte la mezcla y cuaja 3 minutos despegando los bordes. Dale la vuelta con un plato y cuaja 2 minutos más.",
    "Mientras, saltea los piquillos en tiras con el ajo laminado y el resto del aceite 3 minutos a fuego medio.",
    "Sirve la tortilla en porciones con los piquillos por encima y el pan."
  ],
  nutricion: { kcal: 562, prot: 24, hc: 40, grasa: 34 },
  etiquetas: ["tradicional", "fácil", "verano", "ideal para llevar", "poco especiada"],
  consejo: "Tapar la sartén al pochar la berenjena hace que se cueza en su propio vapor y absorba mucho menos aceite. Si te gusta con queso, unos dados de queso fresco en la mezcla le quedan de maravilla.",
  contundencia: "media",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1357",
  nombre: "Huevos en salsa de la abuela con patatas fritas",
  subtitulo: "huevos duros en salsa de tomate, cebolla y pimiento al vino blanco",
  origen: "inventada",
  categoria: "huevos",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 45,
  dificultad: "fácil",
  equipo: ["cazuela", "sartén"],
  raciones: 2,
  ingredientes: [
    { n: "huevo", q: 4, u: "ud" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "pimiento verde", q: 1, u: "ud" },
    { n: "ajo", q: 2, u: "diente" },
    { n: "tomate triturado", q: 300, u: "g" },
    { n: "vino blanco", q: 50, u: "ml" },
    { n: "pimentón dulce", q: 0.5, u: "cdta" },
    { n: "laurel", q: 1, u: "hoja" },
    { n: "patata", q: 400, u: "g" },
    { n: "aceite de oliva", q: 250, u: "ml", nota: "para freír; se recupera" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Cuece los huevos 10 minutos, enfríalos en agua fría y pélalos.",
    "En una cazuela baja, pocha la cebolla, el pimiento y el ajo picados con 3 cucharadas de aceite a fuego medio 10 minutos, hasta que estén blandos.",
    "Añade el pimentón, remueve unos segundos y vierte el vino; deja evaporar 2 minutos. Incorpora el tomate, el laurel y sal y cocina 12 minutos a fuego suave, hasta que la salsa espese.",
    "Mientras, pela las patatas, córtalas en bastones, sécalas y fríelas en el resto del aceite a fuego medio 10 minutos y luego a fuego fuerte 3 minutos, hasta que estén doradas. Escúrrelas y sálalas.",
    "Parte los huevos por la mitad, colócalos en la salsa con la yema hacia arriba y calienta 3 minutos a fuego suave, echándoles salsa por encima con una cuchara.",
    "Sirve los huevos con su salsa y las patatas fritas al lado para mojar."
  ],
  nutricion: { kcal: 610, prot: 22, hc: 54, grasa: 34 },
  etiquetas: ["tradicional", "fácil", "económica", "para niños", "poco especiada"],
  consejo: "Era la cena de aprovechamiento cuando sobraba salsa de otro guiso. Si la quieres más fina, tritura la salsa antes de añadir los huevos y añade unos guisantes en los últimos minutos.",
  contundencia: "media",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1358",
  nombre: "Patatas viudas con pimiento choricero y huevo escalfado",
  subtitulo: "guisadas sin carne, con todo el sabor del sofrito",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "huevo",
  tiempo: 50,
  dificultad: "fácil",
  equipo: ["cazuela"],
  raciones: 2,
  ingredientes: [
    { n: "patata", q: 700, u: "g" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "pimiento verde", q: 1, u: "ud" },
    { n: "ajo", q: 2, u: "diente" },
    { n: "carne de pimiento choricero", q: 1, u: "cda" },
    { n: "pimentón dulce", q: 1, u: "cdta" },
    { n: "laurel", q: 1, u: "hoja" },
    { n: "caldo de verduras", q: 700, u: "ml" },
    { n: "huevo", q: 2, u: "ud" },
    { n: "aceite de oliva", q: 3, u: "cda" },
    { n: "sal", u: "al gusto" }
  ],
  pasos: [
    "Pica la cebolla, el pimiento y el ajo. Pela las patatas y cáscalas en trozos medianos.",
    "En una cazuela, pocha la cebolla, el pimiento y el ajo con el aceite a fuego medio 10 minutos, hasta que estén blandos y dorados.",
    "Añade la carne de pimiento choricero y rehoga 1 minuto. Aparta del fuego, añade el pimentón y remueve unos segundos.",
    "Incorpora las patatas y el laurel, rehoga 2 minutos para que se impregnen y cubre con el caldo caliente. Sala.",
    "Cuece a fuego medio-suave 25 minutos, hasta que las patatas estén tiernas y el caldo haya espesado. Aplasta un par de trozos contra la pared para engordar el caldo.",
    "Casca los huevos sobre el guiso, tapa y cuece 4 minutos a fuego suave. Reposa 5 minutos y sirve un huevo por plato."
  ],
  nutricion: { kcal: 566, prot: 18, hc: 74, grasa: 22 },
  etiquetas: ["tradicional", "de cuchara", "económica", "invierno", "batch cooking", "poco especiada"],
  consejo: "Se llaman 'viudas' porque no llevan carne: todo el sabor sale del sofrito y del pimiento choricero. Cascar las patatas en vez de cortarlas suelta el almidón que espesa el caldo.",
  contundencia: "media",
  coste: "económica"
});

window.RECETAS_SEED.push({
  id: "inv-1359",
  nombre: "Champiñones rellenos de ajo, perejil y queso con patatas al romero",
  subtitulo: "gratinados al horno en la misma bandeja",
  origen: "inventada",
  categoria: "verduras",
  cocina: "española",
  momentos: ["comida", "cena"],
  proteina: "queso",
  tiempo: 55,
  dificultad: "fácil",
  equipo: ["horno", "bol"],
  raciones: 2,
  ingredientes: [
    { n: "champiñones", q: 400, u: "g", nota: "grandes, unos 12" },
    { n: "ajo", q: 2, u: "diente" },
    { n: "perejil fresco", q: 0.5, u: "manojo" },
    { n: "queso rallado", q: 60, u: "g" },
    { n: "pan rallado", q: 2, u: "cda" },
    { n: "patata", q: 500, u: "g" },
    { n: "romero fresco", q: 1, u: "rama" },
    { n: "aceite de oliva", q: 4, u: "cda" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Precalienta el horno a 200 °C. Lava las patatas y córtalas en gajos con piel. Mézclalas en una bandeja con 2 cucharadas de aceite, el romero deshojado, sal y pimienta, y hornea 20 minutos.",
    "Mientras, limpia los champiñones con un paño, quítales el pie y pica los pies muy finos.",
    "En un bol, mezcla los pies picados con el ajo y el perejil muy picados, el queso, el pan rallado, 1 cucharada de aceite, sal y pimienta.",
    "Rellena los sombreros de champiñón con la mezcla, apretando un poco.",
    "Saca la bandeja, da la vuelta a las patatas, haz hueco y coloca los champiñones. Riégalos con el aceite restante y hornea 18-20 minutos más, hasta que los champiñones estén tiernos, el relleno gratinado y las patatas doradas.",
    "Sirve todo junto, bien caliente."
  ],
  nutricion: { kcal: 588, prot: 22, hc: 62, grasa: 28 },
  etiquetas: ["tradicional", "al horno", "fácil", "para invitados", "poco especiada"],
  consejo: "No laves los champiñones bajo el grifo: absorben agua como una esponja y luego la sueltan en el horno. Un paño húmedo o un cepillo suave es suficiente.",
  contundencia: "media",
  coste: "media"
});

window.RECETAS_SEED.push({
  id: "inv-1360",
  nombre: "Canelones de espinacas a la catalana con piñones y pasas",
  subtitulo: "con requesón, bechamel y parmesano gratinado",
  origen: "inventada",
  categoria: "pasta-arroces",
  cocina: "española",
  momentos: ["comida"],
  proteina: "queso",
  tiempo: 80,
  dificultad: "media",
  equipo: ["cazuela", "sartén", "horno"],
  raciones: 2,
  ingredientes: [
    { n: "canelones (placas)", q: 12, u: "ud" },
    { n: "espinacas frescas", q: 500, u: "g" },
    { n: "cebolla", q: 1, u: "ud" },
    { n: "piñones", q: 25, u: "g" },
    { n: "pasas", q: 30, u: "g" },
    { n: "requesón", q: 125, u: "g" },
    { n: "leche", q: 500, u: "ml" },
    { n: "mantequilla", q: 35, u: "g" },
    { n: "harina de trigo", q: 35, u: "g" },
    { n: "nuez moscada molida", q: 1, u: "pizca" },
    { n: "parmesano", q: 40, u: "g", nota: "rallado" },
    { n: "aceite de oliva", q: 2, u: "cda" },
    { n: "sal", u: "al gusto" },
    { n: "pimienta negra", u: "al gusto" }
  ],
  pasos: [
    "Pon las pasas en remojo en agua templada. Cuece las placas de canelón en abundante agua con sal el tiempo del paquete, escúrrelas y extiéndelas sobre un paño limpio.",
    "Pica la cebolla y pochala con el aceite en una sartén grande a fuego medio 8 minutos. Añade los piñones y dóralos 1 minuto.",
    "Agrega las espinacas lavadas y cocina 4-5 minutos, hasta que se reduzcan y no quede agua. Incorpora las pasas escurridas, salpimienta y deja templar. Mezcla con el requesón.",
    "Prepara la bechamel: funde la mantequilla, tuesta la harina 1 minuto, añade la leche poco a poco con varillas y cuece 8 minutos a fuego suave, hasta que napé. Sazona con sal y nuez moscada.",
    "Precalienta el horno a 200 °C. Mezcla 3 cucharadas de bechamel con el relleno. Pon una cucharada de relleno en cada placa y enróllala.",
    "Extiende una capa fina de bechamel en una fuente, coloca los canelones con la juntura hacia abajo y cúbrelos con el resto de la bechamel. Espolvorea el parmesano.",
    "Hornea 15 minutos y gratina 3-4 minutos más, hasta que estén dorados. Reposa 5 minutos antes de servir."
  ],
  nutricion: { kcal: 806, prot: 34, hc: 82, grasa: 38 },
  etiquetas: ["tradicional", "al horno", "saciante", "para invitados", "de domingo", "poco especiada"],
  consejo: "Las espinacas con piñones y pasas son un clásico catalán de Cuaresma. Prepara los canelones rellenos la víspera y gratínalos al día siguiente: la bechamel se asienta y quedan todavía mejor.",
  contundencia: "contundente",
  coste: "premium"
});
