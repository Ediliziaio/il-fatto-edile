/** House advertising: static assets, no tracking scripts or third-party cookies. */
export type AdFormat = 'leaderboard' | 'rectangle' | 'halfpage' | 'inarticle' | 'wide-skyscraper';

type Creative = { src: string; width: number; height: number; maxWidth: string; logo: { left: string; top: string; width: string; height: string } };

const CREATIVES: Record<'rectangle' | 'vertical' | 'wide', Creative> = {
  rectangle: {
    src: '/images/ads/eic-cantiere-rectangle.webp', width: 900, height: 750, maxWidth: '300px',
    logo: { left: '4%', top: '3%', width: '61%', height: '16%' },
  },
  vertical: {
    src: '/images/ads/eic-cantiere-vertical.webp', width: 600, height: 1200, maxWidth: '300px',
    logo: { left: '4%', top: '3%', width: '92%', height: '10.5%' },
  },
  wide: {
    src: '/images/ads/eic-cantiere-wide.webp', width: 1600, height: 666, maxWidth: '970px',
    logo: { left: '3%', top: '3%', width: '53%', height: '21%' },
  },
};

const CAMPAIGN_URL = 'https://www.ediliziaincloud.com/';
const ALT = 'Edilizia in Cloud — Il cantiere, sotto controllo. Lavori, costi e documenti in un’unica piattaforma. Scopri la piattaforma.';

function Banner({ creative, format, className = '' }: { creative: Creative; format: AdFormat; className?: string }) {
  const url = new URL(CAMPAIGN_URL);
  url.searchParams.set('utm_source', 'ilfattoedile');
  url.searchParams.set('utm_medium', 'banner');
  url.searchParams.set('utm_campaign', 'cantiere-sotto-controllo');
  url.searchParams.set('utm_content', format);
  return (
    <a
      href={url.toString()}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={ALT}
      className={`relative w-full overflow-hidden rounded-sm border border-neutral-200 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700 ${className}`}
      style={{ maxWidth: creative.maxWidth }}
    >
      <img src={creative.src} alt={ALT} width={creative.width} height={creative.height} loading="lazy" decoding="async" className="block h-auto w-full" />
      {/* Original, unmodified brand asset: generated art never redraws the logo. */}
      <span aria-hidden="true" className="absolute flex items-center justify-center rounded bg-white" style={{ ...creative.logo, padding: '1.2%' }}>
        <img src="/images/ads/edilizia-in-cloud-logo-original.webp" alt="" width={720} height={174} loading="lazy" decoding="async" className="block h-full w-full object-contain" />
      </span>
    </a>
  );
}

export default function AdSlot({ format, className = '' }: { format: AdFormat; className?: string }) {
  const tall = format === 'halfpage' || format === 'wide-skyscraper';
  const wide = format === 'leaderboard' || format === 'inarticle';
  const desktop = tall ? CREATIVES.vertical : wide ? CREATIVES.wide : CREATIVES.rectangle;
  return (
    <aside data-ad-slot={format} aria-label="Pubblicità: Edilizia in Cloud" className={`flex w-full flex-col items-center ${className}`}>
      <span className="mb-1 font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-400">Pubblicità</span>
      {tall || wide ? (
        <>
          <Banner creative={desktop} format={format} className="hidden lg:block" />
          <Banner creative={CREATIVES.rectangle} format={format} className="block lg:hidden" />
        </>
      ) : <Banner creative={desktop} format={format} className="block" />}
    </aside>
  );
}
