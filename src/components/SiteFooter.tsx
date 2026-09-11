import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { CATEGORIES, SITE } from '@/data/articles';
import { inviaLead } from '@/lib/eicLead';
import logo from '@/assets/logo.png';

type StatoIscrizione = 'idle' | 'invio' | 'ok' | 'errore';

export default function SiteFooter() {
  const [email, setEmail] = useState('');
  const [stato, setStato] = useState<StatoIscrizione>('idle');

  // l'iscrizione va al CRM Edilizia in Cloud con la campagna di provenienza;
  // la conferma compare solo quando il CRM ha accettato
  async function iscrivi(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stato === 'invio') return;
    setStato('invio');
    try {
      await inviaLead(SITE.crmFormId, { email: email.trim(), tipo: 'newsletter' });
      setStato('ok');
    } catch {
      // l'email resta nel campo: si può riprovare senza riscriverla
      setStato('errore');
    }
  }

  return (
    <footer className="mt-16 bg-neutral-950 text-neutral-300">
      {/* newsletter */}
      <div id="newsletter" className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-black text-white">La newsletter del cantiere</h2>
            <p className="mt-1 max-w-xl font-sans text-sm text-neutral-400">
              Ogni mattina alle 7: normativa, bonus, mercato e le guide essenziali per chi costruisce. Gratis, senza spam.
            </p>
          </div>
          {stato === 'ok' ? (
            <p role="status" className="w-full max-w-md font-sans text-sm text-white">
              Iscrizione registrata per <strong>{email.trim()}</strong>. Grazie!
            </p>
          ) : (
            <div className="w-full max-w-md">
              <form className="flex w-full gap-2" onSubmit={iscrivi}>
                <label htmlFor="nl-email" className="sr-only">Indirizzo email</label>
                <input
                  id="nl-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="La tua email"
                  aria-describedby={stato === 'errore' ? 'nl-errore' : undefined}
                  className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2.5 font-sans text-sm text-white placeholder:text-neutral-500 focus:border-red-600 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={stato === 'invio'}
                  className="shrink-0 bg-red-700 px-5 py-2.5 font-sans text-sm font-bold uppercase tracking-wider text-white hover:bg-red-600 disabled:cursor-wait disabled:opacity-70"
                >
                  {stato === 'invio' ? 'Invio…' : 'Iscriviti'}
                </button>
              </form>
              {stato === 'errore' && (
                <p id="nl-errore" role="alert" className="mt-2 font-sans text-xs font-semibold text-red-400">
                  Invio non riuscito. Riprova tra poco.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* colonne */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <img src={logo} alt="Il Fatto Edile" width={160} height={40} loading="lazy" className="h-10 w-auto bg-white p-1" />
          <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-neutral-400">
            {SITE.tagline}. News, classifiche e guide per imprese edili, tecnici e professionisti delle costruzioni.
          </p>
        </div>
        <nav aria-label="Sezioni del sito">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white">Sezioni</h3>
          <ul className="mt-4 space-y-2">
            {CATEGORIES.slice(0, 4).map((c) => (
              <li key={c.slug}><Link className="font-sans text-sm hover:text-white" to={`/categoria/${c.slug}`}>{c.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Approfondimenti">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white">Approfondimenti</h3>
          <ul className="mt-4 space-y-2">
            {CATEGORIES.slice(4).map((c) => (
              <li key={c.slug}><Link className="font-sans text-sm hover:text-white" to={`/categoria/${c.slug}`}>{c.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Informazioni">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white">Testata</h3>
          <ul className="mt-4 space-y-2">
            <li><Link className="font-sans text-sm hover:text-white" to="/checklist">Indice checklist</Link></li>
            <li><Link className="font-sans text-sm hover:text-white" to="/domande">Domande e risposte</Link></li>
            <li><Link className="font-sans text-sm hover:text-white" to="/archivio">Archivio articoli</Link></li>
            <li><Link className="font-sans text-sm hover:text-white" to="/chi-siamo">Chi siamo</Link></li>
            <li><Link className="font-sans text-sm hover:text-white" to="/contatti">Contatti e pubblicità</Link></li>
            <li><Link className="font-sans text-sm hover:text-white" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="font-sans text-sm hover:text-white" to="/cookie-policy">Cookie Policy</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <p className="mt-4 font-sans text-xs text-neutral-500">
            © 2026 {SITE.name} — Periodico digitale di informazione sull’edilizia. Tutti i diritti riservati.
            <br />
            Editore: Domus Group S.r.l. — Via Aurelio Saffi 29, 20123 Milano (MI) — P.IVA 13132010961
          </p>
        </div>
      </div>
    </footer>
  );
}
