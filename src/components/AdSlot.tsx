/**
 * Slot pubblicitario pronto per l\u2019integrazione di ad server (Google Ad Manager, AdSense o direct).
 * Sostituire il contenuto del box con lo snippet del tag pubblicitario mantenendo id e dimensioni.
 */
export type AdFormat = 'leaderboard' | 'rectangle' | 'halfpage' | 'inarticle' | 'wide-skyscraper';

const FORMATS: Record<AdFormat, { size: string; cls: string; id: string }> = {
  leaderboard: { size: '970 × 90', cls: 'h-[90px] max-w-[970px]', id: 'ad-leaderboard' },
  rectangle: { size: '300 × 250', cls: 'h-[250px] w-[300px]', id: 'ad-rectangle' },
  halfpage: { size: '300 × 600', cls: 'h-[600px] w-[300px]', id: 'ad-halfpage' },
  inarticle: { size: 'fluid in-article', cls: 'h-[140px]', id: 'ad-inarticle' },
  'wide-skyscraper': { size: '160 × 600', cls: 'h-[600px] w-[160px]', id: 'ad-skyscraper' },
};

export default function AdSlot({ format, className = '' }: { format: AdFormat; className?: string }) {
  const f = FORMATS[format];
  return (
    <div className={`flex flex-col items-center ${className}`} aria-hidden="true">
      <span className="mb-1 font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-400">Pubblicità</span>
      <div
        id={f.id}
        data-ad-slot={format}
        className={`flex w-full items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 ${f.cls}`}
      >
        <span className="font-sans text-[11px] text-neutral-400">
          Spazio pubblicitario · {f.size}
        </span>
      </div>
    </div>
  );
}
