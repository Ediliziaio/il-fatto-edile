import { useParams, Link } from 'react-router';
import { CATEGORIES, SITE, byCategory } from '@/data/articles';
import { useSeo } from '@/lib/seo';
import type { CategorySlug } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';

export default function CategoryPage() {
  const { slug } = useParams();
  const cat = CATEGORIES.find((c) => c.slug === slug);

  const articles = cat ? byCategory(cat.slug as CategorySlug) : [];

  useSeo({
    title: cat ? `${cat.label}: news e guide | ${SITE.name}` : `Sezione | ${SITE.name}`,
    description: cat ? cat.description : SITE.description,
    canonical: cat ? `${SITE.domain}/categoria/${cat.slug}` : SITE.domain,
  });

  if (!cat) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-black">Sezione non trovata</h1>
        <Link to="/" className="mt-4 inline-block font-sans text-sm font-bold text-red-700 hover:underline">← Torna alla home</Link>
      </main>
    );
  }

  const [first, ...rest] = articles;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-4">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-red-700">Sezione</p>
        <h1 className="mt-1 font-serif text-4xl font-black text-neutral-950">{cat.label}</h1>
        <p className="mt-2 max-w-2xl font-serif text-lg text-neutral-600">{cat.description}</p>
      </header>

      {articles.length === 0 ? (
        <p className="py-16 font-serif text-lg text-neutral-600">Nessun articolo in questa sezione al momento.</p>
      ) : (
        <>
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
        </>
      )}
    </main>
  );
}
