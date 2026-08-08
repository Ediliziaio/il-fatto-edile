import { useParams, Link } from 'react-router';
import { ARTICLES, SITE } from '@/data/articles';
import { getAuthor } from '@/data/authors';
import { useSeo } from '@/lib/seo';
import { authorJsonLd } from '@/lib/seo';
import ArticleCard from '@/components/ArticleCard';
import { Mail } from 'lucide-react';

export default function AuthorPage() {
  const { slug } = useParams();
  const author = slug ? getAuthor(slug) : undefined;
  const articles = author ? ARTICLES.filter((a) => a.author === author.name) : [];

  useSeo({
    title: author ? `${author.name} — ${author.role} | ${SITE.name}` : `Autore | ${SITE.name}`,
    description: author
      ? `${author.name}, ${author.role} de Il Fatto Edile: ${author.beat.toLowerCase()}. Biografia, contatti e tutti gli articoli firmati.`
      : SITE.description,
    canonical: author ? `${SITE.domain}/autore/${author.slug}` : SITE.domain,
    noindex: !author,
    jsonLd: author ? authorJsonLd(author, articles) : undefined,
  });

  if (!author) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-black">Autore non trovato</h1>
        <Link to="/chi-siamo" className="mt-4 inline-block font-sans text-sm font-bold text-red-700 hover:underline">
          ← Scopri la redazione
        </Link>
      </main>
    );
  }

  const [first, ...rest] = articles;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-6">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-red-700">Autore</p>
        <div className="mt-2 flex items-start gap-5">
          <span
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center bg-neutral-950 font-serif text-xl font-black text-white"
          >
            {author.name.split(' ').map((w) => w[0]).join('')}
          </span>
          <div>
            <h1 className="font-serif text-4xl font-black leading-tight text-neutral-950">{author.name}</h1>
            <p className="mt-1 font-sans text-sm font-bold uppercase tracking-[0.15em] text-neutral-500">
              {author.role}
            </p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl font-body text-[17px] leading-relaxed text-neutral-700">{author.bio}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs text-neutral-500">
          <span>
            <strong className="text-neutral-800">Aree seguite:</strong> {author.beat}
          </span>
          <a href={`mailto:${author.email}`} className="flex items-center gap-1.5 font-semibold text-red-700 hover:underline">
            <Mail className="h-3.5 w-3.5" aria-hidden /> {author.email}
          </a>
          <span>{articles.length} articoli firmati</span>
        </p>
      </header>

      <h2 className="mt-10 border-b-2 border-neutral-950 pb-2 font-serif text-2xl font-black text-neutral-950">
        Articoli di {author.name}
      </h2>

      {articles.length === 0 ? (
        <p className="py-16 font-serif text-lg text-neutral-600">Nessun articolo firmato al momento.</p>
      ) : (
        <div className="mt-6">
          {first && <ArticleCard article={first} variant="hero" />}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="standard" />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
