import { Link, useParams } from 'react-router';
import { Fragment } from 'react';
import { ARTICLES, SITE, categoryLabel, getArticle, relatedArticles, slugifyTag } from '@/data/articles';
import { articleJsonLd, coverUrl, formatDate, useSeo } from '@/lib/seo';
import type { Block } from '@/types/article';
import AdSlot from '@/components/AdSlot';
import ArticleCard from '@/components/ArticleCard';
import { Clock, Share2, ChevronRight, User, ListChecks, ArrowRight } from 'lucide-react';

function ReadAlso({ slug }: { slug: string }) {
  const a = getArticle(slug);
  if (!a) return null;
  return (
    <Link
      to={`/articolo/${a.slug}`}
      className="group my-8 flex items-center gap-4 border border-neutral-200 bg-neutral-50 p-4 hover:border-red-700"
    >
      <span className="shrink-0 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-red-700">
        Leggi<br />anche
      </span>
      <span className="font-serif text-[17px] font-bold leading-snug text-neutral-900 group-hover:underline">
        {a.title}
      </span>
      <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-red-700" />
    </Link>
  );
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case 'h2':
      return <h2 key={i} className="mt-10 font-serif text-2xl font-black leading-tight text-neutral-950">{b.text}</h2>;
    case 'h3':
      return <h3 key={i} className="mt-8 font-serif text-xl font-bold text-neutral-900">{b.text}</h3>;
    case 'p':
      return <p key={i} className="mt-5 font-body text-[18px] leading-[1.75] text-neutral-800">{b.text}</p>;
    case 'list':
      return (
        <ul key={i} className="mt-5 space-y-2.5 border-l-2 border-red-700 pl-5">
          {b.items.map((it, j) => (
            <li key={j} className="font-body text-[17px] leading-relaxed text-neutral-800">{it}</li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote key={i} className="mt-8 border-l-4 border-red-700 bg-neutral-50 p-6">
          <p className="font-body text-xl italic leading-relaxed text-neutral-900">«{b.text}»</p>
          {b.author && <cite className="mt-3 block font-sans text-xs font-semibold uppercase tracking-wider text-neutral-500 not-italic">— {b.author}</cite>}
        </blockquote>
      );
    case 'readalso':
      return <ReadAlso key={i} slug={b.slug} />;
    case 'table':
      return (
        <div key={i} className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse font-sans text-sm">
            <thead>
              <tr>{b.headers.map((h, j) => <th key={j} className="border border-neutral-300 bg-neutral-950 px-3 py-2 text-left text-white">{h}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map((r, j) => (
                <tr key={j}>{r.map((c, k) => <td key={k} className="border border-neutral-300 px-3 py-2 text-neutral-800">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = slug ? getArticle(slug) : undefined;

  const jsonLd = article ? articleJsonLd(article) : {};
  useSeo({
    title: article
      ? article.title.length > 55
        ? article.title
        : `${article.title} | ${SITE.name}`
      : `Articolo non trovato | ${SITE.name}`,
    description: article ? article.excerpt : 'L\u2019articolo richiesto non è disponibile.',
    canonical: article ? `${SITE.domain}/articolo/${article.slug}` : SITE.domain,
    type: 'article',
    image: article ? coverUrl(article.slug) : undefined,
    jsonLd,
  });

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-black">Articolo non trovato</h1>
        <Link to="/" className="mt-4 inline-block font-sans text-sm font-bold text-red-700 hover:underline">← Torna alla home</Link>
      </main>
    );
  }

  const related = relatedArticles(article);
  const more = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 4);

  // inserisce slot pubblicitari in-article dopo il 3° e il 9° blocco
  const blocks: (Block | 'ad')[] = [];
  article.content.forEach((b, i) => {
    blocks.push(b);
    if (i === 2 || i === 8) blocks.push('ad');
  });

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 font-sans text-xs text-neutral-500">
        <Link to="/" className="hover:text-red-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/categoria/${article.category}`} className="hover:text-red-700">{categoryLabel(article.category)}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-neutral-800" aria-current="page">{article.title}</span>
      </nav>

      <div className="mt-6 grid gap-12 lg:grid-cols-3">
        <article className="lg:col-span-2" itemScope itemType="https://schema.org/NewsArticle">
          <header>
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-red-700">
              {categoryLabel(article.category)}
            </span>
            <h1 itemProp="headline" className="mt-2 font-serif text-3xl font-black leading-tight text-neutral-950 md:text-[42px] md:leading-[1.15]">
              {article.title}
            </h1>
            <p itemProp="description" className="mt-4 font-body text-xl leading-relaxed text-neutral-600">
              {article.excerpt}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-neutral-200 py-3 font-sans text-xs text-neutral-600">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                di <strong className="text-neutral-900">{article.author}</strong>, {article.authorRole}
              </span>
              <time dateTime={article.publishedAt} itemProp="datePublished">Pubblicato il {formatDate(article.publishedAt)}</time>
              {article.updatedAt && <time dateTime={article.updatedAt} itemProp="dateModified">Aggiornato il {formatDate(article.updatedAt)}</time>}
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readingTime} min</span>
              <button className="ml-auto flex items-center gap-1.5 font-bold uppercase tracking-wider text-red-700" aria-label="Condividi articolo">
                <Share2 className="h-4 w-4" /> Condividi
              </button>
            </div>
          </header>

          <figure className="mt-6">
            <picture>
              <source srcSet={`/images/covers/${article.slug}.webp`} type="image/webp" />
              <img
                src={`/images/covers/${article.slug}.jpg`}
                alt={article.coverAlt}
                width={1200}
                height={675}
                fetchPriority="high"
                itemProp="image"
                className="aspect-[16/9] w-full object-cover"
              />
            </picture>
            <figcaption className="mt-1.5 font-sans text-[11px] text-neutral-500">{article.coverAlt}</figcaption>
          </figure>

          {/* key points — featured snippet / AI overview */}
          <section aria-label="In breve" className="mt-8 border-l-4 border-neutral-950 bg-neutral-50 p-6">
            <h2 className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.2em] text-neutral-950">
              <ListChecks className="h-4 w-4 text-red-700" /> In breve
            </h2>
            <ul className="mt-3 space-y-2">
              {article.keyPoints.map((k, i) => (
                <li key={i} className="flex gap-2 font-body text-[16px] leading-relaxed text-neutral-800">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-red-700" aria-hidden />
                  {k}
                </li>
              ))}
            </ul>
          </section>

          {/* corpo */}
          <div className="mt-2">
            {blocks.map((b, i) =>
              b === 'ad' ? (
                <AdSlot key={`ad-${i}`} format="inarticle" className="my-8" />
              ) : (
                <Fragment key={i}>{renderBlock(b, i)}</Fragment>
              ),
            )}
          </div>

          {/* FAQ — AEO / rich results */}
          <section aria-label="Domande frequenti" className="mt-12 border-t-2 border-neutral-950 pt-6">
            <h2 className="font-serif text-2xl font-black text-neutral-950">Domande frequenti</h2>
            <div className="mt-4 divide-y divide-neutral-200">
              {article.faq.map((f, i) => (
                <details key={i} className="group py-4">
                  <summary className="cursor-pointer list-none font-serif text-lg font-bold text-neutral-900 marker:hidden group-open:text-red-700">
                    <span className="mr-2 font-sans text-red-700">Q.</span>{f.q}
                  </summary>
                  <p className="mt-2 pl-6 font-body text-[17px] leading-relaxed text-neutral-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* tag */}
          <div className="mt-8 flex flex-wrap gap-2" aria-label="Tag">
            {article.tags.map((t) => (
              <Link
                key={t}
                to={`/tag/${slugifyTag(t)}`}
                className="border border-neutral-300 px-3 py-1 font-sans text-xs uppercase tracking-wider text-neutral-600 hover:border-red-700 hover:text-red-700"
              >
                #{t}
              </Link>
            ))}
          </div>

          {/* box autore — E-E-A-T */}
          <div className="mt-10 flex gap-4 border border-neutral-200 bg-neutral-50 p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-950 font-serif text-xl font-black text-white">
              {article.author.split(' ').map((w) => w[0]).join('')}
            </span>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-red-700">{article.authorRole}</p>
              <h3 className="font-serif text-lg font-bold text-neutral-950">{article.author}</h3>
              <p className="mt-1 font-sans text-sm leading-relaxed text-neutral-600">
                Firma de {SITE.name}, segue il comparto delle costruzioni tra normativa, mercato e innovazione di cantiere.
              </p>
            </div>
          </div>
        </article>

        {/* sidebar */}
        <aside className="space-y-8">
          <div className="flex justify-center lg:sticky lg:top-6 lg:flex-col lg:items-center lg:gap-8">
            <AdSlot format="rectangle" />
          </div>
          <div className="border border-neutral-200 bg-neutral-50 p-5">
            <h2 className="border-b-2 border-red-700 pb-2 font-sans text-sm font-bold uppercase tracking-[0.2em] text-neutral-900">
              Articoli correlati
            </h2>
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="compact" />
            ))}
          </div>
        </aside>
      </div>

      {/* altri articoli */}
      <section aria-label="Continua a leggere" className="mt-16">
        <div className="mb-6 border-b-2 border-neutral-950 pb-2">
          <h2 className="font-serif text-2xl font-black text-neutral-950">Continua a leggere</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {more.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="standard" />
          ))}
        </div>
      </section>
    </main>
  );
}
