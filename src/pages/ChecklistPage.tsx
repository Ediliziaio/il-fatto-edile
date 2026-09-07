import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ARTICLES, CATEGORIES, SITE } from '@/data/articles';
import { useSeo } from '@/lib/seo';
import { checklistJsonLd, totalChecklistPoints } from '@/lib/checklist';
import { ArrowRight, RotateCcw } from 'lucide-react';

/**
 * Asset distintivo della testata: l'indice operativo di tutti i controlli
 * ricavati dalle guide. È ciò che il sito offre e che gli altri non hanno.
 */
const STORAGE_KEY = 'ife-checklist-v1';

export default function ChecklistPage() {
  const total = totalChecklistPoints();

  /* Stato dei controlli spuntati. Parte vuoto: il primo render (e quindi
     l'HTML prerenderizzato dato ai crawler) e' sempre l'indice completo,
     senza dipendere da localStorage — che in fase di prerender non esiste. */
  const [spuntati, setSpuntati] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [caricato, setCaricato] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSpuntati(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* localStorage non disponibile: la checklist funziona lo stesso, senza memoria */
    }
    setCaricato(true);
  }, []);

  useEffect(() => {
    if (!caricato) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(spuntati));
    } catch {
      /* quota o modalita' privata: si prosegue senza salvare */
    }
  }, [spuntati, caricato]);

  const toggle = (id: string) =>
    setSpuntati((s) => {
      const next = { ...s };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  const fatti = Object.keys(spuntati).length;

  const norm = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const q = norm(query.trim());
  const visibili = useMemo(
    () =>
      ARTICLES.map((a) => ({
        a,
        punti: q
          ? a.keyPoints.filter((k) => norm(k).includes(q) || norm(a.title).includes(q))
          : a.keyPoints,
      })).filter((x) => x.punti.length > 0),
    [q],
  );
  const trovati = visibili.reduce((n, x) => n + x.punti.length, 0);

  useSeo({
    title: `Indice delle checklist di cantiere — ${total} controlli | ${SITE.name}`,
    description: `${total} controlli operativi raccolti dalle guide de Il Fatto Edile: adempimenti, verifiche e errori da evitare, raggruppati per ambito di cantiere.`,
    canonical: `${SITE.domain}/checklist`,
    jsonLd: checklistJsonLd(),
  });

  return (
    <main className="mx-auto max-w-7xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-5">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-red-700">Indice operativo</p>
        <h1 className="mt-1 font-serif text-4xl font-black leading-tight text-neutral-950 md:text-5xl">
          L’indice delle checklist di cantiere
        </h1>
        <p className="mt-3 max-w-3xl font-body text-lg leading-relaxed text-neutral-700">
          Tutti i controlli operativi ricavati dalle nostre guide, raccolti in un unico indice: cosa verificare, quali
          adempimenti rispettare e quali errori evitare, ambito per ambito. Ogni voce rimanda alla guida che la spiega
          per esteso.
        </p>
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
          <div>
            <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Controlli</dt>
            <dd className="font-serif text-3xl font-black text-neutral-950">{total}</dd>
          </div>
          <div>
            <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Guide</dt>
            <dd className="font-serif text-3xl font-black text-neutral-950">{ARTICLES.length}</dd>
          </div>
          <div>
            <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Ambiti</dt>
            <dd className="font-serif text-3xl font-black text-neutral-950">{CATEGORIES.length}</dd>
          </div>
        </dl>
      </header>

      <section className="mt-6 border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-1 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              Cerca un controllo
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Es. POS, ponteggio, DURC, amianto…"
              className="w-full border border-neutral-300 bg-white px-3 py-2.5 font-body text-sm"
            />
          </label>
          <div className="font-sans text-sm text-neutral-700">
            <p aria-live="polite">
              <strong>{fatti}</strong> di {total} controlli completati
              {q ? <> · {trovati} corrispondono alla ricerca</> : null}
            </p>
            {fatti > 0 && (
              <button
                type="button"
                onClick={() => setSpuntati({})}
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700 hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Azzera i segni di spunta
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full bg-neutral-200" role="presentation">
          <div
            className="h-full bg-red-700 transition-[width]"
            style={{ width: total ? `${Math.round((fatti / total) * 100)}%` : '0%' }}
          />
        </div>
        <p className="mt-2 font-sans text-xs text-neutral-500">
          I segni di spunta restano su questo dispositivo e non vengono inviati a nessuno.
        </p>
      </section>

      <nav aria-label="Ambiti" className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
        {CATEGORIES.map((c) => (
          <a key={c.slug} href={`#${c.slug}`} className="font-sans text-sm text-neutral-600 hover:text-red-700 hover:underline">
            {c.label}
          </a>
        ))}
      </nav>

      {q && trovati === 0 && (
        <p className="mt-8 border border-neutral-200 bg-white p-6 font-body text-neutral-600">
          Nessun controllo corrisponde alla ricerca. Prova con il nome di un adempimento o di
          una lavorazione, per esempio &laquo;ponteggio&raquo; o &laquo;POS&raquo;.
        </p>
      )}

      {CATEGORIES.map((cat) => {
        const list = visibili.filter((x) => x.a.category === cat.slug);
        if (!list.length) return null;
        return (
          <section key={cat.slug} id={cat.slug} className="mt-12 scroll-mt-24">
            <h2 className="border-b-2 border-neutral-950 pb-2 font-serif text-2xl font-black text-neutral-950">
              {cat.label}
            </h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {list.map(({ a, punti }) => (
                <article key={a.slug} className="border border-neutral-200 bg-white p-5">
                  <h3 className="font-serif text-lg font-bold leading-snug text-neutral-950">
                    <Link to={`/articolo/${a.slug}`} className="hover:text-red-700 hover:underline">
                      {a.title}
                    </Link>
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {punti.map((k, i) => {
                      const id = `${a.slug}-${k.slice(0, 40)}`;
                      const done = !!spuntati[id];
                      return (
                        <li key={i} className="font-body text-[15px] leading-relaxed">
                          <label className="flex cursor-pointer gap-2 text-neutral-700">
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={() => toggle(id)}
                              className="mt-1 h-4 w-4 shrink-0 accent-red-700"
                            />
                            <span className={done ? 'text-neutral-400 line-through' : undefined}>{k}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    to={`/articolo/${a.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-red-700 hover:underline"
                  >
                    Guida completa <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <p className="mt-14 border-t border-neutral-200 pt-5 font-sans text-xs leading-relaxed text-neutral-500">
        L’indice viene aggiornato a ogni nuova guida pubblicata. Le voci sono estratte dai punti chiave verificati in
        redazione: non sostituiscono la normativa vigente né il parere del tecnico incaricato.{' '}
        <Link to="/chi-siamo" className="font-semibold text-red-700 hover:underline">Come lavoriamo</Link>
      </p>
    </main>
  );
}
