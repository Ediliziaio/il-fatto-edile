import { useSearchParams } from 'react-router';
import { ARTICLES, SITE } from '@/data/articles';
import { useSeo } from '@/lib/seo';
import type { Article } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import { Search } from 'lucide-react';
import { useState } from 'react';

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
