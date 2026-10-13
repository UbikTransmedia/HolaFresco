/* Genera una página HTML estática por receta (recetas/<slug>.html), índices por tipo de plato, sitemap.xml y robots.txt.
   Las páginas se leen sin JavaScript: así los buscadores y AdSense ven el contenido real de cada receta, y los anuncios
   solo aparecen junto a ese contenido. Uso (desde la raíz del proyecto): node tools/paginas.js */
"use strict";
const fs = require("fs"), path = require("path");
const RAIZ = path.resolve(__dirname, ".."), SALIDA = path.join(RAIZ, "recetas"), DOMINIO = "https://holafresco.es";
global.window = {}; global.document = { addEventListener() {}, dispatchEvent() {}, createElement() { return {}; } }; global.localStorage = undefined;
for (const f of fs.readdirSync(path.join(RAIZ, "js/data")).filter((f) => f.endsWith(".js")).sort()) require(path.join(RAIZ, "js/data", f));
require(path.join(RAIZ, "js/data-nutri.js"));
for (const f of ["catalog", "db", "calorias", "recipes", "nutrition", "shopping"]) require(path.join(RAIZ, "js", f + ".js"));
const { Recetas, Compra, Catalogo } = window;

const CLIENTE = "ca-pub-9953696711191519", BLOQUE = "5666459835", GA = "G-35Y5H4Y32X";
// Versión de la hoja de estilos según su contenido: si no cambia, las páginas generadas tampoco
const V = require("crypto").createHash("sha1").update(fs.readFileSync(path.join(RAIZ, "css/pagina.css"))).digest("hex").slice(0, 8);
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Mismo cálculo que Recetas.paginaEstatica (js/recipes.js), que enlaza cada receta con su página
const slug = (r) => `${Catalogo.normalizar(r.nombre.split(":")[0]).replace(/ñ/g, "n").split(" ").filter(Boolean).slice(0, 8).join("-")}-${r.id}`;
const fmtNum = (n) => String(n).replace(".", ",");
const minutos = (t) => (t >= 60 ? `${Math.floor(t / 60)} h${t % 60 ? ` ${t % 60} min` : ""}` : `${t} min`);

const cabeza = ({ titulo, descripcion, canonica, extra = "", anuncios = false }) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${canonica}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${canonica}">
<meta property="og:type" content="article">
<meta name="theme-color" content="#c4552d">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🥘%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="/css/pagina.css?v=${V}">
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
gtag('js', new Date());
gtag('config', '${GA}');
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
<meta name="google-adsense-account" content="${CLIENTE}">
${anuncios ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENTE}" crossorigin="anonymous"></script>\n` : ""}${extra}</head>
<body>
<header class="cab"><a class="marca" href="/">🥘 HolaFresco</a><nav><a href="/recetas/">Recetas</a><a href="/#/wizard">Crear menú semanal</a></nav></header>
<main class="pagina">
`;
const pie = (anuncios) => `</main>
<footer class="pie"><p>HolaFresco: recetario, menú semanal y lista de la compra. Los valores nutricionales son orientativos y se calculan a partir de los ingredientes.</p>
<p><a href="/#/legal">Aviso legal, privacidad y cookies</a> · <a href="/recetas/">Todas las recetas</a> · <a href="/">Crear tu menú</a></p></footer>
${anuncios ? `<script>document.querySelectorAll("ins.adsbygoogle").forEach(function(){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}});</script>\n` : ""}</body>
</html>
`;
// Bloque de anuncio dentro del contenido de una receta (nunca en índices ni en pantallas sin contenido)
const anuncio = () => `<aside class="anuncio" aria-label="Publicidad"><span class="anuncio-etiqueta">Publicidad</span><ins class="adsbygoogle" style="display:block" data-ad-client="${CLIENTE}" data-ad-slot="${BLOQUE}" data-ad-format="auto" data-full-width-responsive="true"></ins></aside>\n`;

const R = Recetas.todas().filter((r) => r.origen !== "propia");
const porId = new Map(R.map((r) => [r.id, r]));
const slugs = new Map(R.map((r) => [r.id, slug(r)]));

const paginaReceta = (r) => {
  const cat = Recetas.categoria(r.categoria), coc = Recetas.cocina(r.cocina), n = r.nutricion || {};
  const url = `${DOMINIO}/recetas/${slugs.get(r.id)}.html`;
  const desc = `${r.nombre}${r.subtitulo ? `: ${r.subtitulo}` : ""}. Receta para ${r.raciones} ${r.raciones === 1 ? "ración" : "raciones"}, ${minutos(r.tiempo)}, ${n.kcal ? `${n.kcal} kcal por ración` : ""}.`.slice(0, 300);
  const ings = Compra.escalar(r, r.raciones);
  const textoIng = (i) => { const q = i.q == null ? null : Compra.redondearReceta(i.q, i.u); return `${i.u === "al gusto" || q == null ? "" : Compra.fmtCantidad(q, i.u) + " "}${i.n}${i.u === "al gusto" ? " (al gusto)" : ""}${i.opcional ? " (opcional)" : ""}`; };
  const dietas = r.dieta.map((d) => (Recetas.dietaInfo(d) || {}).nombre).filter(Boolean);
  const necesidades = r.necesidades.map((x) => (Recetas.NECESIDADES.find((y) => y.id === x) || {}).nombre).filter(Boolean);
  const alerg = (r.alergenos || []).map((a) => (Catalogo.INTOLERANCIAS.find((t) => t.id === a) || {}).nombre).filter(Boolean);
  const ld = { "@context": "https://schema.org", "@type": "Recipe", name: r.nombre, description: r.subtitulo || r.nombre, recipeCategory: cat.nombre, recipeCuisine: coc ? coc.nombre : undefined, recipeYield: `${r.raciones} raciones`, totalTime: `PT${r.tiempo}M`, recipeIngredient: ings.map(textoIng), recipeInstructions: r.pasos.map((p) => ({ "@type": "HowToStep", text: p })), keywords: (r.etiquetas || []).join(", "), nutrition: n.kcal ? { "@type": "NutritionInformation", calories: `${n.kcal} kcal`, proteinContent: `${n.prot} g`, carbohydrateContent: `${n.hc} g`, fatContent: `${n.grasa} g` } : undefined, suitableForDiet: r.dieta.includes("vegana") ? "https://schema.org/VeganDiet" : r.dieta.includes("vegetariana") ? "https://schema.org/VegetarianDiet" : undefined };
  // Recetas relacionadas: mismo tipo de plato y misma cocina (enlaces internos con contenido real)
  const rel = R.filter((x) => x.id !== r.id && x.categoria === r.categoria && x.cocina === r.cocina).slice(0, 400);
  const sem = [...r.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const relacionadas = rel.length ? Array.from({ length: Math.min(6, rel.length) }, (_, i) => rel[(sem * 7 + i * 13) % rel.length]).filter((x, i, a) => a.indexOf(x) === i) : [];
  return cabeza({ titulo: `${r.nombre.split(":")[0]} · Receta · HolaFresco`, descripcion: desc, canonica: url, anuncios: true, extra: `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>\n` }) +
`<nav class="migas"><a href="/recetas/">Recetas</a> › <a href="/recetas/${r.categoria}.html">${esc(cat.nombre)}</a></nav>
<article class="receta">
<h1>${esc(r.nombre)}</h1>
${r.subtitulo ? `<p class="sub">${esc(r.subtitulo)}</p>\n` : ""}<ul class="datos">
<li>⏱ ${minutos(r.tiempo)}</li><li>🍽️ ${r.raciones} ${r.raciones === 1 ? "ración" : "raciones"}</li><li>${esc(cat.icono)} ${esc(cat.nombre)}</li>${coc ? `<li>${esc(coc.icono)} Cocina ${esc(coc.nombre.toLowerCase())}</li>` : ""}<li>Dificultad: ${esc(r.dificultad)}</li>${r.equipo.length ? `<li>🍳 ${esc(r.equipo.join(", "))}</li>` : ""}
</ul>
${dietas.length || necesidades.length ? `<p class="etiquetas">${[...dietas, ...necesidades].map((d) => `<span>${esc(d)}</span>`).join(" ")}</p>\n` : ""}${alerg.length ? `<p class="alergenos"><strong>No apta para:</strong> ${esc(alerg.join(", "))} (según sus ingredientes; revisa siempre las etiquetas).</p>\n` : `<p class="alergenos">Sin ninguno de los alérgenos que detectamos en los ingredientes.</p>\n`}<section>
<h2>Ingredientes <small>(${r.raciones} ${r.raciones === 1 ? "ración" : "raciones"})</small></h2>
<ul class="ingredientes">
${ings.map((i) => `<li>${esc(textoIng(i))}${i.nota ? ` <span class="nota">· ${esc(i.nota)}</span>` : ""}</li>`).join("\n")}
</ul>
</section>
${anuncio()}<section>
<h2>Preparación</h2>
<ol class="pasos">
${r.pasos.map((p) => `<li>${esc(p)}</li>`).join("\n")}
</ol>
</section>
${r.consejo ? `<aside class="consejo"><strong>💡 Consejo del cocinero:</strong> ${esc(r.consejo)}</aside>\n` : ""}${r.alternativa ? `<aside class="consejo alternativa"><strong>🔁 Versión alternativa:</strong> ${esc(r.alternativa)}</aside>\n` : ""}${n.kcal ? `<section>
<h2>Por ración</h2>
<p class="nut"><span><strong>${n.kcal}</strong> kcal</span><span><strong>${fmtNum(n.prot)} g</strong> proteína</span><span><strong>${fmtNum(n.hc)} g</strong> hidratos</span><span><strong>${fmtNum(n.grasa)} g</strong> grasa</span></p>
<p class="nota">Calculado a partir de los ingredientes y su preparación, para una ración estándar (un adulto de unas 2.100 kcal al día). En el menú semanal de HolaFresco las cantidades se ajustan a lo que necesita cada persona.</p>
</section>
` : ""}<p class="cta"><a class="boton" href="/#/recetas/${r.id}">Abrir en HolaFresco</a> <a class="boton secundario" href="/#/wizard">Crear un menú semanal</a></p>
</article>
${anuncio()}${relacionadas.length ? `<section class="relacionadas">
<h2>Más recetas de ${esc(cat.nombre.toLowerCase())}${coc ? ` de cocina ${esc(coc.nombre.toLowerCase())}` : ""}</h2>
<ul>
${relacionadas.map((x) => `<li><a href="/recetas/${slugs.get(x.id)}.html">${esc(x.nombre)}</a></li>`).join("\n")}
</ul>
</section>
` : ""}` + pie(true);
};

const paginaIndice = () => cabeza({ titulo: "Recetas · HolaFresco", descripcion: `${R.length.toLocaleString("es-ES")} recetas caseras con ingredientes, pasos, consejos y valores nutricionales por ración: legumbres, pescado, carnes, verduras, arroces y más.`, canonica: `${DOMINIO}/recetas/` }) +
`<h1>Recetas</h1>
<p>${R.length.toLocaleString("es-ES")} recetas caseras, cada una con sus ingredientes, los pasos en orden, un consejo de cocinero y la energía y los macronutrientes por ración calculados a partir de los ingredientes. Elige un tipo de plato:</p>
<ul class="categorias">
${Recetas.CATEGORIAS.map((c) => { const k = R.filter((r) => r.categoria === c.id).length; return k ? `<li><a href="/recetas/${c.id}.html">${esc(c.icono)} ${esc(c.nombre)}</a> <span class="nota">${k} recetas · ${esc(c.desc || "")}</span></li>` : ""; }).join("\n")}
</ul>
<p>¿Quieres organizar la semana? <a href="/#/wizard">Crea un menú semanal</a> con tus gustos y obtén la lista de la compra.</p>
` + pie(false);

const paginaCategoria = (c) => {
  const lista = R.filter((r) => r.categoria === c.id).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  const porCocina = {};
  for (const r of lista) { const k = r.cocina ? Recetas.cocina(r.cocina).nombre : "Otras"; (porCocina[k] = porCocina[k] || []).push(r); }
  return cabeza({ titulo: `Recetas de ${c.nombre.toLowerCase()} · HolaFresco`, descripcion: `${lista.length} recetas de ${c.nombre.toLowerCase()}: ${c.desc || ""}`.slice(0, 300), canonica: `${DOMINIO}/recetas/${c.id}.html` }) +
`<nav class="migas"><a href="/recetas/">Recetas</a></nav>
<h1>${esc(c.icono)} Recetas de ${esc(c.nombre.toLowerCase())}</h1>
<p>${lista.length} recetas${c.desc ? `: ${esc(c.desc.toLowerCase())}` : ""}.</p>
${Object.keys(porCocina).sort((a, b) => a.localeCompare(b, "es")).map((k) => `<h2>Cocina ${esc(k.toLowerCase())}</h2>
<ul class="lista-recetas">
${porCocina[k].map((r) => `<li><a href="/recetas/${slugs.get(r.id)}.html">${esc(r.nombre)}</a> <span class="nota">${minutos(r.tiempo)} · ${r.nutricion.kcal || "?"} kcal</span></li>`).join("\n")}
</ul>`).join("\n")}
` + pie(false);
};

// Escritura: se borra lo generado antes para no dejar páginas de recetas eliminadas
fs.rmSync(SALIDA, { recursive: true, force: true });
fs.mkdirSync(SALIDA, { recursive: true });
for (const r of R) fs.writeFileSync(path.join(SALIDA, slugs.get(r.id) + ".html"), paginaReceta(r));
fs.writeFileSync(path.join(SALIDA, "index.html"), paginaIndice());
const cats = Recetas.CATEGORIAS.filter((c) => R.some((r) => r.categoria === c.id));
for (const c of cats) fs.writeFileSync(path.join(SALIDA, c.id + ".html"), paginaCategoria(c));
const hoy = new Date().toISOString().slice(0, 10);
const urls = [`${DOMINIO}/`, `${DOMINIO}/recetas/`, ...cats.map((c) => `${DOMINIO}/recetas/${c.id}.html`), ...R.map((r) => `${DOMINIO}/recetas/${slugs.get(r.id)}.html`)];
fs.writeFileSync(path.join(RAIZ, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${u}</loc><lastmod>${hoy}</lastmod></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(RAIZ, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${DOMINIO}/sitemap.xml\n`);
console.log(`${R.length} páginas de recetas, ${cats.length} índices, sitemap con ${urls.length} URL`);
