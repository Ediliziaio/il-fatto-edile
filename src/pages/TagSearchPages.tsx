import { Link, useParams, useSearchParams } from 'react-router';
import { ARTICLES, SITE, getTag, TAGS } from '@/data/articles';
import { useSeo } from '@/lib/seo';
import type { Article } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function TagPage() {
  const { slug } = useParams();
  const tag = slug ? getTag(slug) : undefined;

  useSeo({
    title: tag ? `${tag.label}: articoli e guide | ${SITE.name}` : `Tag | ${SITE.name}`,
    description: tag
      ? `Tutti gli articoli de Il Fatto Edile sul tema ${tag.label}: guide, classifiche e notizie dal mondo dell\u2019edilizia.`
      : SITE.description,
    canonical: tag ? `${SITE.domain}/tag/${tag.slug}` : SITE.domain,
    // tag thin (<3 articoli) o inesistente: noindex, coerente con l'HTML prerenderizzato
    noindex: !tag || tag.articles.length < 3,
  });

  if (!tag) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-black">Tag non trovato</h1>
        <Link to="/" className="mt-4 inline-block font-sans text-sm font-bold text-red-700 hover:underline">← Torna alla home</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-4">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-red-700">Tag</p>
        <h1 className="mt-1 font-serif text-4xl font-black text-neutral-950">#{tag.label}</h1>
        <p className="mt-2 font-serif text-lg text-neutral-600">{tag.articles.length} articoli su questo tema</p>
      </header>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tag.articles.map((a) => (
          <ArticleCard key={a.slug} article={a} variant="standard" />
        ))}
      </div>

      <nav aria-label="Altri tag" className="mt-14 border-t border-neutral-200 pt-6">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">Esplora gli altri temi</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {TAGS.filter((t) => t.slug !== tag.slug).map((t) => (
            <Link
              key={t.slug}
              to={`/tag/${t.slug}`}
              className="border border-neutral-300 px-3 py-1 font-sans text-xs uppercase tracking-wider text-neutral-600 hover:border-red-700 hover:text-red-700"
            >
              #{t.label} <span className="text-neutral-400">({t.articles.length})</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}

function score(a: Article, terms: string[]): number {
  let s = 0;
  const title = a.title.toLowerCase();
  const excerpt = a.excerpt.toLowerCase();
  const kw = a.keywords.join(' ').toLowerCase();
  const tags = a.tags.join(' ').toLowerCase();
  const body = a.content
    .map((b) => ('text' in b ? b.text : 'items' in b ? b.items.join(' ') : ''))
    .join(' ')
    .toLowerCase();
  for (const t of terms) {
    if (title.includes(t)) s += 10;
    if (kw.includes(t)) s += 6;
    if (tags.includes(t)) s += 5;
    if (excerpt.includes(t)) s += 3;
    if (body.includes(t)) s += 1;
  }
  return s;
}

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const [input, setInput] = useState(q);

  useSeo({
    title: q ? `Ricerca: ${q} | ${SITE.name}` : `Cerca nel sito | ${SITE.name}`,
    description: 'Cerca tra guide, classifiche e notizie de Il Fatto Edile: bonus, normativa, mercato, materiali e innovazione per l\u2019edilizia.',
    canonical: `${SITE.domain}/ricerca`,
    noindex: true, // ricerca interna: mai in indice
  });

  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = q
    ? ARTICLES.map((a) => ({ a, s: score(a, terms) }))
        .filter((r) => r.s > 0)
        .sort((x, y) => y.s - x.s)
        .map((r) => r.a)
    : [];

  return (
    <main className="mx-auto max-w-4xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-4">
        <h1 className="font-serif text-4xl font-black text-neutral-950">Cerca nel sito</h1>
      </header>

      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(input.trim() ? { q: input.trim() } : {});
        }}
      >
        <label htmlFor="search-input" className="sr-only">Cerca articoli</label>
        <input
          id="search-input"
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Cerca: bonus, serramenti, BIM, sicurezza…"
          autoFocus
          className="w-full border border-neutral-300 px-4 py-3 font-sans text-sm focus:border-red-700 focus:outline-none"
        />
        <button type="submit" className="flex shrink-0 items-center gap-2 bg-red-700 px-5 py-3 font-sans text-sm font-bold uppercase tracking-wider text-white hover:bg-red-600">
          <Search className="h-4 w-4" /> Cerca
        </button>
      </form>

      {q && (
        <p className="mt-6 font-sans text-sm text-neutral-600" role="status">
          {results.length > 0
            ? `${results.length} risultati per «${q}»`
            : `Nessun risultato per «${q}». Prova con un termine più generale.`}
        </p>
      )}

      <div className="mt-6">
        {results.map((a, i) => (
          <ArticleCard key={a.slug} article={a} variant="compact" rank={i + 1} />
        ))}
      </div>

      <AdSlot format="leaderboard" className="mt-12" />
    </main>
  );
}
