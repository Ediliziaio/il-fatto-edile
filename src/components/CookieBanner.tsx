import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Cookie, X } from 'lucide-react';

const CONSENT_KEY = 'ife-cookie-consent-v1';

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export function getConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

function saveConsent(c: Omit<ConsentState, 'timestamp'>) {
  const state: ConsentState = { ...c, timestamp: new Date().toISOString() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  // hook per il consenso: qui attivare gli script di analytics/marketing
  window.dispatchEvent(new CustomEvent('ife-consent-updated', { detail: state }));
}

function Toggle({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
      <div>
        <p className="font-sans text-sm font-bold text-neutral-900">{label}</p>
        <p className="mt-0.5 font-sans text-xs leading-relaxed text-neutral-500">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-red-700' : 'bg-neutral-300'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!getConsent()) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // riapertura del banner da Cookie Policy ("Modifica preferenze")
  useEffect(() => {
    const reopen = () => setVisible(true);
    window.addEventListener('ife-open-cookie-banner', reopen);
    return () => window.removeEventListener('ife-open-cookie-banner', reopen);
  }, []);

  const close = (c: Omit<ConsentState, 'timestamp'>) => {
    saveConsent(c);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Consenso cookie"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-neutral-950 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.15)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-5">
        {!customizing ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex flex-1 items-start gap-3">
              <Cookie className="mt-1 h-6 w-6 shrink-0 text-red-700" aria-hidden />
              <div>
                <h2 className="font-serif text-lg font-black text-neutral-950">Questo sito usa i cookie</h2>
                <p className="mt-1 max-w-3xl font-sans text-[13px] leading-relaxed text-neutral-600">
                  Utilizziamo cookie tecnici necessari al funzionamento e — previo consenso — cookie di analisi e di
                  marketing, anche per mostrarti pubblicità pertinente con i contenuti de Il Fatto Edile. Puoi
                  accettare tutto, rifiutare i cookie non necessari o personalizzare le preferenze. Dettagli nella{' '}
                  <Link to="/cookie-policy" className="font-semibold text-red-700 underline">Cookie Policy</Link> e
                  nella <Link to="/privacy" className="font-semibold text-red-700 underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
              <button
                onClick={() => setCustomizing(true)}
                className="border border-neutral-950 px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-neutral-100"
              >
                Personalizza
              </button>
              <button
                onClick={() => close({ necessary: true, analytics: false, marketing: false })}
                className="border border-neutral-950 px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-neutral-100"
              >
                Rifiuta
              </button>
              <button
                onClick={() => close({ necessary: true, analytics: true, marketing: true })}
                className="bg-red-700 px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600"
              >
                Accetta tutti
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-black text-neutral-950">Preferenze cookie</h2>
              <button onClick={() => setCustomizing(false)} aria-label="Chiudi preferenze" className="p-1 hover:text-red-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 max-w-3xl">
              <Toggle
                label="Cookie tecnici (necessari)"
                desc="Indispensabili per navigazione, sicurezza e salvataggio di questa preferenza. Non richiedono consenso."
                checked
                disabled
              />
              <Toggle
                label="Cookie di analisi"
                desc="Statistiche anonime di utilizzo (es. misurazione del traffico) per migliorare contenuti e navigazione."
                checked={analytics}
                onChange={setAnalytics}
              />
              <Toggle
                label="Cookie di marketing e profilazione"
                desc="Usati per mostrarti annunci pertinenti e misurare le campagne pubblicitarie, anche da parte di partner."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => close({ necessary: true, analytics, marketing })}
                className="bg-red-700 px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600"
              >
                Salva preferenze
              </button>
              <button
                onClick={() => close({ necessary: true, analytics: true, marketing: true })}
                className="border border-neutral-950 px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider text-neutral-950 hover:bg-neutral-100"
              >
                Accetta tutti
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
