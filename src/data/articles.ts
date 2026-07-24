import type { Article, CategorySlug } from '@/types/article';
import { CATEGORIES } from '@/types/article';
import { batch1 } from './articles-batch1';
import { batch2 } from './articles-batch2';
import { batch3 } from './articles-batch3';

export const ARTICLES: Article[] = [...batch1, ...batch2, ...batch3].sort(
  (a, b) => b.publishedAt.localeCompare(a.publishedAt),
);

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);

export const byCategory = (cat: CategorySlug) => ARTICLES.filter((a) => a.category === cat);

export const byFormat = (format: Article['format']) => ARTICLES.filter((a) => a.format === format);

export const relatedArticles = (article: Article, n = 4) =>
  ARTICLES.filter((a) => a.slug !== article.slug && (a.category === article.category || a.format === article.format))
    .slice(0, n);

export const categoryLabel = (slug: CategorySlug) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

export { CATEGORIES };

// ─── Tag ────────────────────────────────────────────────────────────────────

export const slugifyTag = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export interface TagInfo {
  slug: string;
  label: string;
  articles: Article[];
}

const tagMap = new Map<string, TagInfo>();
for (const a of ARTICLES) {
  for (const t of a.tags) {
    const slug = slugifyTag(t);
    const entry = tagMap.get(slug) ?? { slug, label: t, articles: [] };
    entry.articles.push(a);
    tagMap.set(slug, entry);
  }
}
export const TAGS: TagInfo[] = [...tagMap.values()].sort((a, b) => b.articles.length - a.articles.length);
export const getTag = (slug: string) => tagMap.get(slug);

export const SITE = {
  name: 'Il Fatto Edile',
  domain: 'https://www.ilfattoedile.it',
  tagline: 'Il quotidiano digitale dell\u2019edilizia italiana',
  description:
    'Il Fatto Edile: news, guide e classifiche su edilizia, bonus, normativa, mercato delle costruzioni, materiali e innovazione in cantiere. Informazione indipendente per imprese e professionisti.',
  /** meta description home ottimizzata (<160 caratteri) per evitare il troncamento in SERP */
  metaDescription:
    'News, guide e classifiche sull\u2019edilizia italiana: bonus, normativa, mercato delle costruzioni, materiali e innovazione in cantiere. Aggiornato ogni giorno.',
};
