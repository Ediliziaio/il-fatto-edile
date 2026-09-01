import { Link } from 'react-router';
import { ARTICLES, CATEGORIES, SITE } from '@/data/articles';
import { useSeo } from '@/lib/seo';
import { checklistJsonLd, totalChecklistPoints } from '@/lib/checklist';
import { CheckSquare, ArrowRight } from 'lucide-react';

/**
 * Asset distintivo della testata: l'indice operativo di tutti i controlli
 * ricavati dalle guide. È ciò che il sito offre e che gli altri non hanno.
 */
export default function ChecklistPage() {
  const total = totalChecklistPoints();

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

      <nav aria-label="Ambiti" className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
        {CATEGORIES.map((c) => (
          <a key={c.slug} href={`#${c.slug}`} className="font-sans text-sm text-neutral-600 hover:text-red-700 hover:underline">
            {c.label}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((cat) => {
        const list = ARTICLES.filter((a) => a.category === cat.slug);
        if (!list.length) return null;
        return (
          <section key={cat.slug} id={cat.slug} className="mt-12 scroll-mt-24">
            <h2 className="border-b-2 border-neutral-950 pb-2 font-serif text-2xl font-black text-neutral-950">
              {cat.label}
            </h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {list.map((a) => (
                <article key={a.slug} className="border border-neutral-200 bg-white p-5">
                  <h3 className="font-serif text-lg font-bold leading-snug text-neutral-950">
                    <Link to={`/articolo/${a.slug}`} className="hover:text-red-700 hover:underline">
                      {a.title}
                    </Link>
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {a.keyPoints.map((k, i) => (
                      <li key={i} className="flex gap-2 font-body text-[15px] leading-relaxed text-neutral-700">
                        <CheckSquare className="mt-1 h-4 w-4 shrink-0 text-red-700" aria-hidden />
                        <span>{k}</span>
                      </li>
                    ))}
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
