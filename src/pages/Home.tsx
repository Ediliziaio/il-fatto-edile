import { Link } from 'react-router';
import { ARTICLES, SITE, byCategory, byFormat } from '@/data/articles';
import { useSeo } from '@/lib/seo';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';

function SectionTitle({ title, to }: { title: string; to: string }) {
  return (
    <div className="mb-6 flex items-baseline justify-between border-b-2 border-neutral-950 pb-2">
      <h2 className="font-serif text-2xl font-black text-neutral-950">{title}</h2>
      <Link to={to} className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-red-700 hover:underline">
        Vedi tutti →
      </Link>
    </div>
  );
}

export default function Home() {
  useSeo({
    title: `${SITE.name} — News, bonus e guide per l'edilizia italiana`,
    description: SITE.metaDescription,
    canonical: SITE.domain,
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

  const [featured, ...rest] = ARTICLES;
  const secondary = rest.slice(0, 2);
  const latest = rest.slice(2, 8);
  const mostRead = [...ARTICLES].sort((a, b) => b.readingTime - a.readingTime).slice(0, 5);
  const top5 = byFormat('top5').slice(0, 4);
  const top10 = byFormat('top10').slice(0, 4);
  const normativa = byCategory('normativa-bonus').slice(0, 4);
  const innovazione = byCategory('innovazione').slice(0, 4);

  return (
    <main>
      {/* titolo editoriale della testata: unico h1 della home */}
      <h1 className="mx-auto max-w-7xl px-4 pt-8 font-serif text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">
        Il Fatto Edile: news, bonus e guide per l'edilizia italiana
      </h1>

      {/* apertura */}
      <section aria-label="In evidenza" className="mx-auto max-w-7xl px-4 pt-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ArticleCard article={featured} variant="hero" />
          </div>
          <div className="flex flex-col gap-6 lg:border-l lg:border-neutral-200 lg:pl-8">
            {secondary.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="standard" />
            ))}
          </div>
        </div>
      </section>

      <AdSlot format="leaderboard" className="mx-auto mt-10 max-w-7xl px-4" />

      {/* ultime notizie + sidebar */}
      <section aria-label="Ultime notizie" className="mx-auto mt-12 max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionTitle title="Ultime notizie" to="/news" />
            <div className="grid gap-6 sm:grid-cols-2">
              {latest.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="standard" />
              ))}
            </div>
          </div>
          <aside className="space-y-8">
            <div className="border border-neutral-200 bg-neutral-50 p-5">
              <h2 className="border-b-2 border-red-700 pb-2 font-sans text-sm font-bold uppercase tracking-[0.2em] text-neutral-900">
                Le più lette
              </h2>
              {mostRead.map((a, i) => (
                <ArticleCard key={a.slug} article={a} variant="compact" rank={i + 1} />
              ))}
            </div>
            <div className="flex justify-center">
              <AdSlot format="halfpage" />
            </div>
          </aside>
        </div>
      </section>

      {/* top 5 */}
      <section aria-label="Guide Top 5" className="mx-auto mt-14 max-w-7xl bg-neutral-950 px-4 py-12 lg:max-w-none">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-baseline justify-between border-b-2 border-white pb-2">
            <h2 className="font-serif text-2xl font-black text-white">Le guide Top 5</h2>
            <Link to="/top-5" className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-red-400 hover:underline">
              Tutte le Top 5 →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {top5.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="standard" />
            ))}
          </div>
        </div>
      </section>

      {/* top 10 */}
      <section aria-label="Classifiche Top 10" className="mx-auto mt-14 max-w-7xl px-4">
        <SectionTitle title="Le classifiche Top 10" to="/top-10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {top10.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="standard" />
          ))}
        </div>
      </section>

      <AdSlot format="leaderboard" className="mx-auto mt-12 max-w-7xl px-4" />

      {/* normativa */}
      <section aria-label="Normativa e bonus" className="mx-auto mt-14 max-w-7xl px-4">
        <SectionTitle title="Normativa & Bonus" to="/categoria/normativa-bonus" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {normativa.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="standard" />
          ))}
        </div>
      </section>

      {/* innovazione */}
      <section aria-label="Innovazione" className="mx-auto mt-14 max-w-7xl px-4">
        <SectionTitle title="Innovazione & Digitale" to="/categoria/innovazione" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {innovazione.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="standard" />
          ))}
        </div>
      </section>
    </main>
  );
}
