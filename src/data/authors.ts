import type { CategorySlug } from '@/types/article';

/**
 * Redazione de Il Fatto Edile.
 *
 * Ogni firma è associata a un'area di competenza stabile: le pagine /autore/{slug}
 * espongono biografia, contatto e archivio dei pezzi firmati, e sono referenziate
 * dallo schema Person di ogni NewsArticle (segnale E-E-A-T richiesto da Google per
 * i contenuti su fisco, incentivi e normativa).
 */
export interface Author {
  slug: string;
  name: string;
  role: string;
  /** aree tematiche presidiate */
  beat: string;
  bio: string;
  email: string;
  categories: CategorySlug[];
}

export const AUTHORS: Author[] = [
  {
    slug: 'giulia-marchetti',
    name: 'Giulia Marchetti',
    role: 'Redazione Normativa e Fisco',
    beat: 'Detrazioni, incentivi e adempimenti edilizi',
    bio: 'Segue per Il Fatto Edile la normativa fiscale applicata all’edilizia: detrazioni, bonus casa, adempimenti ENEA e Agenzia delle Entrate, scadenze e requisiti di accesso. Ricostruisce ogni misura a partire dai testi ufficiali e dalla prassi, con attenzione a ciò che cambia concretamente per imprese, tecnici e committenti.',
    email: 'normativa@ilfattoedile.it',
    categories: ['normativa-bonus'],
  },
  {
    slug: 'marco-ferraris',
    name: 'Marco Ferraris',
    role: 'Redazione Mercato ed Economia',
    beat: 'Congiuntura, prezzi, imprese e lavoro nelle costruzioni',
    bio: 'Si occupa dell’andamento del comparto costruzioni: produzione, investimenti, prezzi dei materiali, dinamiche occupazionali e specializzazioni d’impresa. Lavora su dati e osservatori di settore, con l’obiettivo di restituire numeri verificabili e confrontabili nel tempo.',
    email: 'mercato@ilfattoedile.it',
    categories: ['mercato'],
  },
  {
    slug: 'silvia-romano',
    name: 'Silvia Romano',
    role: 'Redazione Innovazione e Digitale',
    beat: 'BIM, cantiere 4.0, software e automazione',
    bio: 'Racconta la digitalizzazione del processo edilizio: adozione del BIM nelle imprese, strumenti di monitoraggio del cantiere, sensoristica, intelligenza artificiale applicata a rilievi e sicurezza. Verifica sul campo quali tecnologie sono realmente in produzione e quali restano annunci.',
    email: 'innovazione@ilfattoedile.it',
    categories: ['innovazione'],
  },
  {
    slug: 'marta-bianchi',
    name: 'Marta Bianchi',
    role: 'Redazione Progetti e Cantieri',
    beat: 'Opere, rigenerazione urbana e sicurezza in cantiere',
    bio: 'Segue i cantieri e le opere che trasformano le città italiane: rigenerazione urbana, edilizia pubblica e scolastica, housing sociale, oltre agli adempimenti di sicurezza che regolano il lavoro in quota e in cantiere. Privilegia lo stato di avanzamento reale rispetto agli annunci di progetto.',
    email: 'cantieri@ilfattoedile.it',
    categories: ['progetti', 'sicurezza'],
  },
  {
    slug: 'elena-moretti',
    name: 'Elena Moretti',
    role: 'Redazione Energia e Sostenibilità',
    beat: 'Efficienza energetica, direttiva case green, impianti',
    bio: 'Presidia i temi dell’efficienza energetica in edilizia: riqualificazione dell’involucro, pompe di calore, interventi condominiali, recepimento della direttiva europea sulle prestazioni energetiche. Segue inoltre l’agenda di fiere e appuntamenti tecnici del settore.',
    email: 'energia@ilfattoedile.it',
    categories: ['sostenibilita', 'eventi'],
  },
  {
    slug: 'davide-sartori',
    name: 'Davide Sartori',
    role: 'Redazione Materiali e Prodotti',
    beat: 'Isolanti, serramenti, coperture e materiali da costruzione',
    bio: 'Confronta materiali e soluzioni costruttive su prestazioni, durabilità, posa e costi: isolanti per cappotto, serramenti, sistemi di copertura, materiali a minore impatto ambientale. Le comparazioni partono da schede tecniche e prassi di cantiere.',
    email: 'materiali@ilfattoedile.it',
    categories: ['materiali'],
  },
];

const byCategory = new Map<CategorySlug, Author>();
for (const a of AUTHORS) for (const c of a.categories) byCategory.set(c, a);

/** autore di riferimento per la categoria di un articolo */
export const authorForCategory = (c: CategorySlug): Author => byCategory.get(c) ?? AUTHORS[0];

export const getAuthor = (slug: string): Author | undefined => AUTHORS.find((a) => a.slug === slug);

export const authorUrl = (slug: string) => `/autore/${slug}`;
