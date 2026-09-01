import { ARTICLES, CATEGORIES, SITE } from '@/data/articles';

/** numero totale di domande con risposta pubblicate (secondo asset della testata) */
export const totalQuestions = () => ARTICLES.reduce((n, a) => n + a.faq.length, 0);

/**
 * Schema.org per l'indice delle domande.
 *
 * NB: volutamente NON usa FAQPage: ogni articolo marca gia' le proprie FAQ con
 * FAQPage, e ripetere lo stesso markup qui sarebbe dati strutturati duplicati.
 * Qui si dichiara la natura della raccolta (CollectionPage) e l'elenco delle
 * domande con il rimando alla guida che risponde.
 */
export function questionsJsonLd() {
  const url = `${SITE.domain}/domande`;
  const total = totalQuestions();
  return {
    'questions-collection': {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': url,
      url,
      name: `Le domande sul cantiere — ${total} risposte`,
      description: `${total} domande con risposta raccolte dalle guide de ${SITE.name}: permessi, adempimenti, verifiche, documenti e costi, con il rimando alla guida che approfondisce.`,
      inLanguage: 'it-IT',
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.domain },
      about: CATEGORIES.map((c) => ({ '@type': 'Thing', name: c.label })),
    },
    'questions-items': {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Domande frequenti sulla pratica di cantiere',
      numberOfItems: total,
      itemListElement: ARTICLES.flatMap((a) =>
        a.faq.map((f) => ({ name: f.q, url: `${SITE.domain}/articolo/${a.slug}` })),
      ).map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, url: x.url })),
    },
  };
}
