// ─── Modello dati editoriale — Il Fatto Edile ────────────────────────────────

export type ArticleFormat = 'top5' | 'top10' | 'news';

export type CategorySlug =
  | 'normativa-bonus'
  | 'mercato'
  | 'innovazione'
  | 'materiali'
  | 'sostenibilita'
  | 'progetti'
  | 'sicurezza'
  | 'eventi';

export interface Category {
  slug: CategorySlug;
  label: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'normativa-bonus', label: 'Normativa & Bonus', description: 'Leggi, decreti, detrazioni fiscali e incentivi per l\u2019edilizia: guide aggiornate per imprese, tecnici e privati.' },
  { slug: 'mercato', label: 'Mercato & Economia', description: 'Dati, scenari e analisi sul comparto costruzioni: produzione, occupazione, prezzi e investimenti.' },
  { slug: 'innovazione', label: 'Innovazione & Digitale', description: 'BIM, intelligenza artificiale, cantieri 4.0, software e tecnologie che trasformano il modo di costruire.' },
  { slug: 'materiali', label: 'Materiali & Prodotti', description: 'Confronti, schede e guide alla scelta di materiali da costruzione, serramenti, isolanti e finiture.' },
  { slug: 'sostenibilita', label: 'Sostenibilità', description: 'Efficienza energetica, economia circolare, bioedilizia e Direttiva Case Green: l\u2019edilizia che riduce l\u2019impatto.' },
  { slug: 'progetti', label: 'Progetti & Cantieri', description: 'Opere, rigenerazione urbana e grandi commesse: dentro i cantieri che cambiano le città italiane.' },
  { slug: 'sicurezza', label: 'Sicurezza in Cantiere', description: 'Adempimenti, DPI, coordinamento e prevenzione: tutto quello che serve per lavorare in sicurezza.' },
  { slug: 'eventi', label: 'Eventi & Fiere', description: 'Agenda del settore: fiere, convegni, premi e appuntamenti per professionisti dell\u2019edilizia.' },
];

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'readalso'; slug: string };

export interface FaqItem {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  title: string;
  /** meta description, max ~160 caratteri */
  excerpt: string;
  format: ArticleFormat;
  category: CategorySlug;
  tags: string[];
  author: string;
  authorRole: string;
  /** data ISO YYYY-MM-DD */
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  /** chiave del tema grafico di copertina: 'brick' | 'crane' | 'blueprint' | 'concrete' | 'green' | 'steel' */
  coverTheme: 'brick' | 'crane' | 'blueprint' | 'concrete' | 'green' | 'steel';
  coverAlt: string;
  keywords: string[];
  /** 4-6 punti chiave in apertura: box "In breve" per featured snippet e AI overview (AEO/GEO) */
  keyPoints: string[];
  /** 3-5 domande/risposte per AEO e rich snippet FAQ */
  faq: FaqItem[];
  /** corpo articolo: somma dei testi >= 4000 caratteri */
  content: Block[];
}
