import { ARTICLES, CATEGORIES, SITE, categoryLabel } from '@/data/articles';

/** numero totale di controlli operativi indicizzati (asset distintivo della testata) */
export const totalChecklistPoints = () =>
  ARTICLES.reduce((n, a) => n + a.keyPoints.length, 0);

/**
 * Schema.org per l'indice delle checklist: CollectionPage + ItemList delle guide,
 * ciascuna con i suoi controlli come ItemList annidata.
 */
export function checklistJsonLd() {
  const url = `${SITE.domain}/checklist`;
  const total = totalChecklistPoints();
  return {
    'checklist-collection': {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': url,
      url,
      name: `Indice delle checklist di cantiere — ${total} controlli`,
      description: `${total} controlli operativi raccolti dalle guide de ${SITE.name}: adempimenti, verifiche ed errori da evitare, raggruppati per ambito di cantiere.`,
      inLanguage: 'it-IT',
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.domain },
      about: CATEGORIES.map((c) => ({ '@type': 'Thing', name: c.label })),
    },
    'checklist-items': {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Checklist operative di cantiere',
      numberOfItems: ARTICLES.length,
      itemListElement: ARTICLES.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'ItemList',
          name: a.title,
          url: `${SITE.domain}/articolo/${a.slug}`,
          about: categoryLabel(a.category),
          numberOfItems: a.keyPoints.length,
          itemListElement: a.keyPoints.map((k, j) => ({
            '@type': 'ListItem',
            position: j + 1,
            name: k,
          })),
        },
      })),
    },
  };
}
