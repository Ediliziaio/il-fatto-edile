import { useEffect } from 'react';
import type { Article } from '@/types/article';
import { SITE, categoryLabel } from '@/data/articles';

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

/**
 * Firma unica di testata: l'autore è la redazione, non una persona.
 * Google accetta (e preferisce) author = Organization quando non ci sono
 * firme individuali reali e verificabili.
 */
function authorEntity() {
  return { '@type': 'NewsMediaOrganization', '@id': `${SITE.domain}/#organization`, name: SITE.name, url: SITE.domain };
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
    // firma di testata: l'autore e' la redazione, non una persona
    author: authorEntity(),
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
