// Prerender SSG: genera una index.html completa per ogni rotta in dist/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ssr = await import(path.join(root, 'dist-ssr', 'entry-server.js'));

const template = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');

let count = 0;
for (const route of ssr.ROUTES) {
  const appHtml = await ssr.render(route);
  const head = ssr.headFor(route);

  let html = template;

  // sostituisci title/meta/og/canonical del template con quelli della rotta
  html = html.replace(/<title>[^<]*<\/title>/, '');
  html = html.replace(/\s*<meta name="description"[^>]*>/, '');
  html = html.replace(/\s*<link rel="canonical"[^>]*>/, '');
  html = html.replace(/\s*<meta property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/\s*<meta name="twitter:(title|description|image)"[^>]*>/g, '');

  // inietta head della rotta e contenuto renderizzato
  html = html.replace('</head>', `    ${head}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  const outFile =
    route === '/'
      ? path.join(root, 'dist', 'index.html')
      : path.join(root, 'dist', route, 'index.html');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  count++;
}

console.log(`Prerender completato: ${count} pagine statiche in dist/`);

// Sitemap generata dalle stesse fonti dati delle rotte: sempre completa e in sync
const today = new Date().toISOString().slice(0, 10);
const urls = ssr
  .sitemapEntries(today)
  .map(
    (e) =>
      `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
  )
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'dist', 'sitemap.xml'), sitemap);
console.log(`Sitemap generata: ${ssr.sitemapEntries(today).length} URL in dist/sitemap.xml`);
