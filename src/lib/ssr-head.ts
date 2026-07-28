import { ARTICLES, CATEGORIES, SITE, TAGS, getArticle, getTag } from '@/data/articles';
import { articleJsonLd, coverUrl } from '@/lib/seo';
import type { ArticleFormat } from '@/types/article';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** soglia minima di articoli perché una pagina tag sia indicizzabile (sotto = thin, noindex) */
export const TAG_INDEX_MIN = 3;

interface HeadInput {
  title: string;
  description: string;
  canonical: string;
  type?: 'website' | 'article';
  image?: string;
  jsonLd?: Record<string, object | null>;
  noindex?: boolean;
}

function renderHead({ title, description, canonical, type = 'website', image, jsonLd, noindex }: HeadInput) {
  const tags: string[] = [
    `<title>${esc(title)}</title>`,
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}" />`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  ];
  if (image) {
    tags.push(`<meta property="og:image" content="${esc(image)}" />`);
    tags.push(`<meta name="twitter:image" content="${esc(image)}" />`);
  }
  if (jsonLd) {
    for (const data of Object.values(jsonLd)) {
      if (!data) continue;
      const json = JSON.stringify(data).replace(/<\//g, '<\\/');
      tags.push(`<script type="application/ld+json">${json}</script>`);
    }
  }
  return tags.join('\n    ');
}

const FORMAT_META: Record<ArticleFormat, { title: string; intro: string; path: string }> = {
  top5: {
    title: 'Le guide Top 5',
    intro: 'Selezione ragionata e sempre aggiornata: le cinque cose da sapere su bonus, materiali, strumenti e tendenze del settore delle costruzioni.',
    path: '/top-5',
  },
  top10: {
    title: 'Le classifiche Top 10',
    intro: 'Le dieci risposte essenziali alle domande più cercate da imprese, tecnici e privati: classifiche complete, verificabili e scritte da chi conosce il cantiere.',
    path: '/top-10',
  },
  news: {
    title: 'News dall\u2019edilizia',
    intro: 'Le ultime notizie dal comparto costruzioni: normativa, mercato, cantieri e innovazione, con i fatti essenziali spiegati subito.',
    path: '/news',
  },
};

const LEGAL_META: Record<string, { title: string; description: string }> = {
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR) del sito Il Fatto Edile: titolare, finalità, basi giuridiche, diritti degli interessati.',
  },
  '/cookie-policy': {
    title: 'Cookie Policy',
    description: 'Cookie policy del sito Il Fatto Edile: cosa sono i cookie, quali utilizziamo (tecnici, analitici, marketing), come gestire o revocare il consenso.',
  },
  '/chi-siamo': {
    title: 'Chi siamo',
    description: 'Il Fatto Edile è il quotidiano digitale dedicato all\u2019edilizia italiana: la redazione, la missione editoriale e i valori della testata.',
  },
  '/contatti': {
    title: 'Contatti e pubblicità',
    description: 'Contatti de Il Fatto Edile: redazione, segnalazioni, ufficio commerciale e informazioni per le inserzioni pubblicitarie sul sito.',
  },
};

export function headFor(url: string): string {
  const path = url.split('?')[0];

  if (path === '/') {
    return renderHead({
      title: `${SITE.name} — News, bonus e guide per l'edilizia italiana`,
      description: SITE.metaDescription,
      canonical: SITE.domain + '/',
      image: `${SITE.domain}/images/logo.png`,
      jsonLd: {
        itemlist: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: ARTICLES.slice(0, 10).map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE.domain}/articolo/${a.slug}`,
            name: a.title,
          })),
        },
      },
    });
  }

  const articleMatch = path.match(/^\/articolo\/(.+)$/);
  if (articleMatch) {
    const a = getArticle(articleMatch[1]);
    if (a) {
      return renderHead({
        // titoli lunghi restano non-brandizzati per non superare troppo la soglia SERP (~60)
        title: a.title.length > 55 ? a.title : `${a.title} | ${SITE.name}`,
        description: a.excerpt,
        canonical: `${SITE.domain}/articolo/${a.slug}`,
        type: 'article',
        image: coverUrl(a.slug),
        jsonLd: articleJsonLd(a),
      });
    }
  }

  const catMatch = path.match(/^\/categoria\/(.+)$/);
  if (catMatch) {
    const c = CATEGORIES.find((x) => x.slug === catMatch[1]);
    if (c) {
      return renderHead({
        title: `${c.label}: news e guide | ${SITE.name}`,
        description: c.description,
        canonical: `${SITE.domain}/categoria/${c.slug}`,
      });
    }
  }

  const tagMatch = path.match(/^\/tag\/(.+)$/);
  if (tagMatch) {
    const t = getTag(tagMatch[1]);
    if (t) {
      return renderHead({
        title: `${t.label}: articoli e guide | ${SITE.name}`,
        description: `Tutti gli articoli de Il Fatto Edile sul tema ${t.label}: guide, classifiche e notizie dal mondo dell\u2019edilizia.`,
        canonical: `${SITE.domain}/tag/${t.slug}`,
        // tag con pochi articoli = pagina thin: fuori dall'indice, ma crawlabile (follow)
        noindex: t.articles.length < TAG_INDEX_MIN,
      });
    }
  }

  const format = (['top5', 'top10', 'news'] as ArticleFormat[]).find((f) => FORMAT_META[f].path === path);
  if (format) {
    const m = FORMAT_META[format];
    return renderHead({
      title: `${m.title} | ${SITE.name}`,
      description: m.intro,
      canonical: `${SITE.domain}${m.path}`,
    });
  }

  if (path === '/archivio') {
    return renderHead({
      title: `Archivio: tutti gli articoli | ${SITE.name}`,
      description: 'L\u2019archivio completo degli articoli de Il Fatto Edile: guide, classifiche e notizie sul mondo delle costruzioni.',
      canonical: `${SITE.domain}/archivio`,
    });
  }

  if (path === '/ricerca') {
    return renderHead({
      title: `Cerca nel sito | ${SITE.name}`,
      description: 'Cerca tra guide, classifiche e notizie de Il Fatto Edile: bonus, normativa, mercato, materiali e innovazione per l\u2019edilizia.',
      canonical: `${SITE.domain}/ricerca`,
      noindex: true, // pagina di ricerca interna: mai indicizzare (thin/duplicata)
    });
  }

  const legal = LEGAL_META[path];
  if (legal) {
    return renderHead({
      title: `${legal.title} | ${SITE.name}`,
      description: legal.description,
      canonical: `${SITE.domain}${path}`,
    });
  }

  return renderHead({
    title: `${SITE.name} — News, bonus e guide per l'edilizia italiana`,
    description: SITE.description,
    canonical: SITE.domain + path,
  });
}

export const ROUTES: string[] = [
  '/',
  ...(['top5', 'top10', 'news'] as ArticleFormat[]).map((f) => FORMAT_META[f].path),
  ...CATEGORIES.map((c) => `/categoria/${c.slug}`),
  ...ARTICLES.map((a) => `/articolo/${a.slug}`),
  ...TAGS.map((t) => `/tag/${t.slug}`),
  '/archivio',
  '/ricerca',
  ...Object.keys(LEGAL_META),
];

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

/**
 * Voci sitemap generate dalle stesse fonti dati delle rotte prerenderizzate:
 * resta sempre in sync con i contenuti reali (nessuna pagina indicizzabile fuori sitemap).
 * Esclude /ricerca e le pagine legali (nessun valore di ranking).
 */
export function sitemapEntries(today: string): SitemapEntry[] {
  const abs = (p: string) => `${SITE.domain}${p}`;
  const entries: SitemapEntry[] = [
    { loc: SITE.domain + '/', lastmod: today, changefreq: 'daily', priority: '1.0' },
  ];
  for (const f of ['top5', 'top10', 'news'] as ArticleFormat[]) {
    entries.push({ loc: abs(FORMAT_META[f].path), lastmod: today, changefreq: 'daily', priority: '0.9' });
  }
  entries.push({ loc: abs('/archivio'), lastmod: today, changefreq: 'weekly', priority: '0.6' });
  for (const c of CATEGORIES) {
    entries.push({ loc: abs(`/categoria/${c.slug}`), lastmod: today, changefreq: 'weekly', priority: '0.7' });
  }
  for (const a of ARTICLES) {
    entries.push({
      loc: abs(`/articolo/${a.slug}`),
      lastmod: a.updatedAt ?? a.publishedAt,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }
  // solo i tag "forti" (indicizzabili): gli altri sono noindex e NON vanno in sitemap
  for (const t of TAGS.filter((t) => t.articles.length >= TAG_INDEX_MIN)) {
    entries.push({ loc: abs(`/tag/${t.slug}`), lastmod: today, changefreq: 'monthly', priority: '0.5' });
  }
  // pagine istituzionali (E-E-A-T / trust): utili in indice
  entries.push({ loc: abs('/chi-siamo'), lastmod: today, changefreq: 'monthly', priority: '0.4' });
  entries.push({ loc: abs('/contatti'), lastmod: today, changefreq: 'monthly', priority: '0.4' });
  return entries;
}
