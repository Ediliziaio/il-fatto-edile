import { Link } from 'react-router';
import { ARTICLES, CATEGORIES, SITE } from '@/data/articles';
import { useSeo } from '@/lib/seo';
import { questionsJsonLd, totalQuestions } from '@/lib/questions';
import { HelpCircle, ArrowRight } from 'lucide-react';

/**
 * Secondo asset della testata: tutte le domande con risposta, in chiaro.
 * Le risposte sono visibili nel testo (non dentro accordion chiusi o JS)
 * perche' e' cosi' che i motori di risposta le possono estrarre e citare.
 */
export default function QuestionsPage() {
  const total = totalQuestions();

  useSeo({
    title: `Le domande sul cantiere — ${total} risposte | ${SITE.name}`,
    description: `${total} domande con risposta sulla pratica di cantiere: permessi, adempimenti, verifiche, documenti e costi, raggruppate per ambito e collegate alla guida che approfondisce.`,
    canonical: `${SITE.domain}/domande`,
    jsonLd: questionsJsonLd(),
  });

  return (
    <main className="mx-auto max-w-4xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-5">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-red-700">Indice delle risposte</p>
        <h1 className="mt-1 font-serif text-4xl font-black leading-tight text-neutral-950 md:text-5xl">
          Le domande sul cantiere
        </h1>
        <p className="mt-3 font-body text-lg leading-relaxed text-neutral-700">
          Le domande che ricorrono in cantiere, con la risposta essenziale in chiaro: permessi, adempimenti, verifiche,
          documenti e costi. Ogni risposta rimanda alla guida che la spiega per esteso.
        </p>
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
          <div>
            <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Risposte</dt>
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
        const list = ARTICLES.filter((a) => a.category === cat.slug && a.faq.length);
        if (!list.length) return null;
        return (
          <section key={cat.slug} id={cat.slug} className="mt-12 scroll-mt-24">
            <h2 className="border-b-2 border-neutral-950 pb-2 font-serif text-2xl font-black text-neutral-950">
              {cat.label}
            </h2>
            {list.map((a) => (
              <div key={a.slug} className="mt-8">
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Dalla guida
                </p>
                <h3 className="mt-0.5 font-serif text-lg font-bold leading-snug text-neutral-950">
                  <Link to={`/articolo/${a.slug}`} className="hover:text-red-700 hover:underline">
                    {a.title}
                  </Link>
                </h3>
                <div className="mt-4 space-y-5 border-l-2 border-neutral-200 pl-5">
                  {a.faq.map((f, i) => (
                    <div key={i}>
                      <h4 className="flex gap-2 font-sans text-[15px] font-bold leading-snug text-neutral-950">
                        <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden />
                        <span>{f.q}</span>
                      </h4>
                      <p className="mt-1.5 pl-6 font-body text-[16px] leading-relaxed text-neutral-700">{f.a}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/articolo/${a.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 pl-5 font-sans text-xs font-bold uppercase tracking-wider text-red-700 hover:underline"
                >
                  Guida completa <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            ))}
          </section>
        );
      })}

      <p className="mt-14 border-t border-neutral-200 pt-5 font-sans text-xs leading-relaxed text-neutral-500">
        Le risposte sono verificate in redazione e aggiornate insieme alle guide da cui provengono. Non sostituiscono
        la normativa vigente né il parere del tecnico incaricato.{' '}
        <Link to="/chi-siamo" className="font-semibold text-red-700 hover:underline">Come lavoriamo</Link>
      </p>
    </main>
  );
}
