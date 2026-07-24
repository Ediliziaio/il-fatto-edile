import { Link } from 'react-router';
import { SITE, CATEGORIES } from '@/data/articles';
import { useSeo } from '@/lib/seo';

export default function NotFound() {
  useSeo({
    title: `Pagina non trovata | ${SITE.name}`,
    description: 'La pagina che stai cercando non esiste o è stata spostata.',
    canonical: SITE.domain,
    noindex: true,
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="font-sans text-sm font-bold uppercase tracking-[0.25em] text-red-700">Errore 404</p>
      <h1 className="mt-3 font-serif text-4xl font-black tracking-tight text-neutral-950 md:text-5xl">
        Pagina non trovata
      </h1>
      <p className="mx-auto mt-4 max-w-xl font-body text-lg leading-relaxed text-neutral-600">
        La pagina che cerchi non esiste, è stata spostata o non è più disponibile. Riparti dalla home o
        scegli una sezione.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="bg-red-700 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600"
        >
          Torna alla home
        </Link>
        <Link
          to="/archivio"
          className="border border-neutral-950 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-neutral-100"
        >
          Archivio articoli
        </Link>
      </div>
      <nav aria-label="Sezioni" className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to={`/categoria/${c.slug}`}
            className="font-sans text-sm text-neutral-500 hover:text-red-700 hover:underline"
          >
            {c.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
