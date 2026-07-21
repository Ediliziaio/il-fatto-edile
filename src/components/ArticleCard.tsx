import { Link } from 'react-router';
import type { Article } from '@/types/article';
import { categoryLabel } from '@/data/articles';
import { formatDate } from '@/lib/seo';
import CoverArt from './CoverArt';

const FORMAT_BADGE: Record<Article['format'], string> = {
  top5: 'Top 5',
  top10: 'Top 10',
  news: 'News',
};

/** Card editoriale in tre varianti: hero (apertura), standard (griglia), compact (liste sidebar) */
export default function ArticleCard({
  article,
  variant = 'standard',
  rank,
}: {
  article: Article;
  variant?: 'hero' | 'standard' | 'compact';
  rank?: number;
}) {
  const a = article;
  const url = `/articolo/${a.slug}`;

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 border-b border-neutral-200 py-3 last:border-0">
        {rank !== undefined && (
          <span className="font-serif text-3xl font-black leading-none text-red-700">{rank}</span>
        )}
        <div>
          <Link to={url} className="block">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-red-700">
              {categoryLabel(a.category)}
            </span>
            <h3 className="mt-0.5 font-serif text-[15px] font-bold leading-snug text-neutral-900 group-hover:underline">
              {a.title}
            </h3>
          </Link>
          <time dateTime={a.publishedAt} className="mt-1 block font-sans text-[11px] text-neutral-500">
            {formatDate(a.publishedAt)}
          </time>
        </div>
      </article>
    );
  }

  if (variant === 'hero') {
    return (
      <article className="group relative">
        <Link to={url} className="block">
          <CoverArt theme={a.coverTheme} alt={a.coverAlt} label={FORMAT_BADGE[a.format]} className="aspect-[16/9] w-full" />
          <div className="mt-4">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-red-700">
              {categoryLabel(a.category)}
            </span>
            <h2 className="mt-1 font-serif text-3xl font-black leading-tight text-neutral-950 group-hover:underline md:text-4xl">
              {a.title}
            </h2>
            <p className="mt-2 max-w-3xl font-body text-[17px] leading-relaxed text-neutral-600">{a.excerpt}</p>
            <p className="mt-2 font-sans text-xs text-neutral-500">
              di <span className="font-semibold text-neutral-800">{a.author}</span> ·{' '}
              <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time> · {a.readingTime} min di lettura
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col border border-neutral-200 bg-white">
      <Link to={url} className="block">
        <CoverArt theme={a.coverTheme} alt={a.coverAlt} label={FORMAT_BADGE[a.format]} className="aspect-[16/10] w-full" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-red-700">
          {categoryLabel(a.category)}
        </span>
        <Link to={url}>
          <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-neutral-900 group-hover:underline">
            {a.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-neutral-600">{a.excerpt}</p>
        <p className="mt-auto pt-3 font-sans text-[11px] text-neutral-500">
          {a.author} · <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
        </p>
      </div>
    </article>
  );
}
