import { Link } from 'react-router';
import { ARTICLES, SITE, byFormat } from '@/data/articles';
import { useSeo } from '@/lib/seo';
import type { ArticleFormat } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';

const META: Record<ArticleFormat, { title: string; intro: string; path: string }> = {
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

export function FormatPage({ format }: { format: ArticleFormat }) {
  const meta = META[format];
  const articles = byFormat(format);

  useSeo({
    title: `${meta.title} | ${SITE.name}`,
    description: meta.intro,
    canonical: `${SITE.domain}${meta.path}`,
  });

  const [first, ...rest] = articles;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-4">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-red-700">Rubrica</p>
        <h1 className="mt-1 font-serif text-4xl font-black text-neutral-950">{meta.title}</h1>
        <p className="mt-2 max-w-2xl font-serif text-lg text-neutral-600">{meta.intro}</p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {first && <ArticleCard article={first} variant="hero" />}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {rest.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="standard" />
            ))}
          </div>
        </div>
        <aside className="space-y-8">
          <div className="flex justify-center"><AdSlot format="rectangle" /></div>
          <div className="flex justify-center"><AdSlot format="halfpage" /></div>
        </aside>
      </div>
    </main>
  );
}

export function ArchivePage() {
  useSeo({
    title: `Archivio: tutti gli articoli | ${SITE.name}`,
    description: 'L\u2019archivio completo degli articoli de Il Fatto Edile: guide, classifiche e notizie sul mondo delle costruzioni.',
    canonical: `${SITE.domain}/archivio`,
  });

  return (
    <main className="mx-auto max-w-4xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-4">
        <h1 className="font-serif text-4xl font-black text-neutral-950">Archivio</h1>
        <p className="mt-2 font-serif text-lg text-neutral-600">{ARTICLES.length} articoli pubblicati</p>
      </header>
      <div className="mt-6">
        {ARTICLES.map((a, i) => (
          <ArticleCard key={a.slug} article={a} variant="compact" rank={i + 1} />
        ))}
      </div>
      <p className="mt-10 text-center">
        <Link to="/" className="font-sans text-sm font-bold text-red-700 hover:underline">← Torna alla home</Link>
      </p>
    </main>
  );
}
