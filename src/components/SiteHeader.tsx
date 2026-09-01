import { Link, NavLink } from 'react-router';
import { CATEGORIES, SITE } from '@/data/articles';
import { Menu, X, Mail, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';

declare const __BUILD_DATE__: string;

const fmt = (d: Date) =>
  d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** valore di partenza: uguale in SSR e nel primo render client (nessun mismatch) */
const buildDate = () => fmt(new Date(`${__BUILD_DATE__}T12:00:00`));
/** giorno reale di chi sta visitando */
const realToday = () => fmt(new Date());

const FORMAT_LINKS = [
  { to: '/checklist', label: 'Checklist' },
  { to: '/top-5', label: 'Top 5' },
  { to: '/top-10', label: 'Top 10' },
  { to: '/news', label: 'News' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  // la data prerenderizzata è quella della build: la porto al giorno reale lato client
  const [today, setToday] = useState(buildDate);
  useEffect(() => {
    setToday(realToday());
  }, []);

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap px-1 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
      isActive ? 'text-red-700 border-b-2 border-red-700' : 'text-neutral-800 hover:text-red-700 border-b-2 border-transparent'
    }`;

  return (
    <header className="border-b border-neutral-200 bg-white">
      {/* strip superiore */}
      <div className="border-b border-neutral-200 bg-neutral-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <p className="font-sans text-[11px] capitalize tracking-wide">{today}</p>
          <p className="hidden font-sans text-[11px] tracking-wide text-neutral-300 md:block">{SITE.tagline}</p>
          <a href="#newsletter" className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wider hover:text-red-400">
            <Mail className="h-3.5 w-3.5" /> Newsletter
          </a>
        </div>
      </div>

      {/* testata */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link to="/" aria-label="Il Fatto Edile — home">
          <img src={logo} alt="Il Fatto Edile" className="h-9 w-auto md:h-12" />
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/ricerca" aria-label="Cerca nel sito" className="p-2 text-neutral-800 hover:text-red-700">
            <Search className="h-5 w-5" />
          </Link>
          <button
            className="p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* navigazione */}
      <nav aria-label="Navigazione principale" className="hidden border-t border-neutral-200 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4">
          {FORMAT_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={navCls}>{l.label}</NavLink>
          ))}
          <span className="h-4 w-px bg-neutral-300" aria-hidden />
          {CATEGORIES.map((c) => (
            <NavLink key={c.slug} to={`/categoria/${c.slug}`} className={navCls}>{c.label}</NavLink>
          ))}
        </div>
      </nav>

      {/* menu mobile */}
      {open && (
        <nav aria-label="Navigazione mobile" className="border-t border-neutral-200 md:hidden">
          <ul className="divide-y divide-neutral-100 px-4 py-2">
            {FORMAT_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} onClick={() => setOpen(false)} className="block py-2.5 font-sans text-sm font-bold uppercase tracking-wider text-red-700">
                  {l.label}
                </NavLink>
              </li>
            ))}
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <NavLink to={`/categoria/${c.slug}`} onClick={() => setOpen(false)} className="block py-2.5 font-sans text-sm font-semibold text-neutral-800">
                  {c.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
