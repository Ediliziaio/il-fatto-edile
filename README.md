# Il Fatto Edile

Quotidiano digitale dedicato all'edilizia italiana: news, guide Top 5, classifiche Top 10 e approfondimenti su normativa, bonus, mercato, materiali e innovazione in cantiere.

Sito editoriale **React 19 + TypeScript + Vite + Tailwind CSS**, con **prerendering statico (SSG)** di tutte le pagine e ottimizzazione spinta per **SEO, AEO e GEO**.

## Caratteristiche

- **182 pagine statiche** prerenderizzate (home, 30 articoli, categorie, rubriche, tag, pagine legali)
- **30 articoli** editoriali (5.000–9.000 caratteri) con box "In breve", FAQ e internal linking
- **Dati strutturati** Schema.org: NewsArticle, FAQPage, BreadcrumbList, NewsMediaOrganization, WebSite + SearchAction
- **Sitemap.xml** (61 URL) e **feed RSS** pronti per Google News/Discover
- **30 cover editoriali** generate (1200×675) usate come og:image per articolo
- **Ricerca interna** e **134 pagine tag** per l'architettura di internal linking
- **Cookie banner GDPR** con preferenze granulari e Consent hook per analytics/ad server
- **Slot pubblicitari** (leaderboard, half page, rectangle, in-article) pronti per l'ad server
- **Code splitting** per rotta (bundle iniziale ~181 KB gzip)
- Pagine legali complete: Privacy Policy, Cookie Policy, Chi siamo, Contatti

## Sviluppo

```bash
npm install
npm run dev        # dev server con HMR
```

## Build produzione (con prerendering SSG)

```bash
npm run build      # tsc + vite build + build SSR + prerender di tutte le rotte in dist/
npm run preview    # serve la build localmente
```

La cartella `dist/` è un sito statico pronto per Netlify, Vercel o qualsiasi hosting statico.

## Script utili

```bash
python scripts/generate-covers.py   # rigenera le 30 cover editoriali
node scripts/prerender.mjs          # riesegue solo il prerender (dopo vite build + build SSR)
```

## Struttura

```
src/
├── data/            # i 30 articoli (3 batch) + aggregazione, tag, categorie
├── lib/             # SEO hook, JSON-LD, head SSG
├── components/      # header, footer, card, ad slot, cover, cookie banner
├── pages/           # home, articolo, categoria, rubriche, tag, ricerca, legali
└── entry-server.tsx # rendering SSR per il prerendering
scripts/             # generate-covers.py, prerender.mjs
public/              # logo, cover, robots.txt, sitemap.xml, rss.xml
```
