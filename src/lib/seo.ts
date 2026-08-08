import { useEffect } from 'react';
import type { Article } from '@/types/article';
import { SITE, categoryLabel } from '@/data/articles';
import { AUTHORS, type Author } from '@/data/authors';

const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setJsonLd = (id: string, data: object | null) => {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

interface SeoInput {
  title: string;
  description: string;
  canonical: string;
  type?: 'website' | 'article';
  image?: string;
  jsonLd?: Record<string, object | null>;
  noindex?: boolean;
}

export function useSeo({ title, description, canonical, type = 'website', image, jsonLd, noindex }: SeoInput) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', type);
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (image) setMeta('name', 'twitter:image', image);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
    if (jsonLd) {
      for (const [id, data] of Object.entries(jsonLd)) setJsonLd(id, data);
    }
  }, [title, description, canonical, type, image, jsonLd, noindex]);
}

export const coverUrl = (slug: string) => `${SITE.domain}/images/covers/${slug}.jpg`;

/** entità autore collegata alla sua pagina /autore (evita il "Person" fantasma) */
function authorEntity(name: string, role: string) {
  const a = AUTHORS.find((x) => x.name === name);
  return a
    ? { '@type': 'Person', '@id': `${SITE.domain}/autore/${a.slug}#person`, name: a.name, jobTitle: a.role, url: `${SITE.domain}/autore/${a.slug}` }
    : { '@type': 'Person', name, jobTitle: role };
}

/** Schema.org Person + ProfilePage per la pagina autore (E-E-A-T) */
export function authorJsonLd(author: Author, articles: Article[]) {
  const url = `${SITE.domain}/autore/${author.slug}`;
  return {
    'author-profile': {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        '@id': `${url}#person`,
        name: author.name,
        url,
        jobTitle: author.role,
        description: author.bio,
        knowsAbout: author.beat.split(/,\s*/),
        email: author.email,
        worksFor: { '@type': 'NewsMediaOrganization', name: SITE.name, url: SITE.domain },
      },
    },
    'author-articles': {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE.domain}/articolo/${a.slug}`,
        name: a.title,
      })),
    },
  };
}

/** Schema.org NewsArticle + FAQPage + BreadcrumbList per la pagina articolo (SEO/AEO/GEO) */
export function articleJsonLd(a: Article) {
  const url = `${SITE.domain}/articolo/${a.slug}`;
  const newsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: a.title,
    description: a.excerpt,
    image: [coverUrl(a.slug)],
    keywords: a.keywords.join(', '),
    articleSection: categoryLabel(a.category),
    inLanguage: 'it-IT',
    // l'autore è un'entità reale del sito (pagina /autore dedicata): requisito E-E-A-T
    author: authorEntity(a.author, a.authorRole),
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.domain}/images/logo.png` },
    },
    datePublished: a.publishedAt,
    dateModified: a.updatedAt ?? a.publishedAt,
  };
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.domain },
      { '@type': 'ListItem', position: 2, name: categoryLabel(a.category), item: `${SITE.domain}/categoria/${a.category}` },
      { '@type': 'ListItem', position: 3, name: a.title, item: url },
    ],
  };
  return { 'news-article': newsArticle, 'faq-page': faqPage, breadcrumb };
}

export function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
