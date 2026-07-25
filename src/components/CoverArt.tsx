import type { Article } from '@/types/article';
import { Building2, HardHat, DraftingCompass, Layers, Leaf, Ruler } from 'lucide-react';

const THEMES: Record<Article['coverTheme'], { bg: string; Icon: typeof Building2; pattern: string }> = {
  brick: { bg: 'linear-gradient(135deg,#7c2d12 0%,#9a3412 45%,#431407 100%)', Icon: Layers, pattern: 'repeating-linear-gradient(0deg,transparent 0 26px,rgba(255,255,255,.07) 26px 28px),repeating-linear-gradient(90deg,transparent 0 60px,rgba(255,255,255,.07) 60px 62px)' },
  crane: { bg: 'linear-gradient(135deg,#78350f 0%,#b45309 50%,#451a03 100%)', Icon: HardHat, pattern: 'repeating-linear-gradient(45deg,transparent 0 22px,rgba(255,255,255,.06) 22px 24px)' },
  blueprint: { bg: 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#172554 100%)', Icon: DraftingCompass, pattern: 'repeating-linear-gradient(0deg,transparent 0 30px,rgba(255,255,255,.09) 30px 31px),repeating-linear-gradient(90deg,transparent 0 30px,rgba(255,255,255,.09) 30px 31px)' },
  concrete: { bg: 'linear-gradient(135deg,#3f3f46 0%,#52525b 50%,#18181b 100%)', Icon: Building2, pattern: 'repeating-linear-gradient(90deg,transparent 0 14px,rgba(255,255,255,.05) 14px 15px)' },
  green: { bg: 'linear-gradient(135deg,#14532d 0%,#15803d 55%,#052e16 100%)', Icon: Leaf, pattern: 'repeating-linear-gradient(-45deg,transparent 0 20px,rgba(255,255,255,.07) 20px 22px)' },
  steel: { bg: 'linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#082f49 100%)', Icon: Ruler, pattern: 'repeating-linear-gradient(0deg,transparent 0 18px,rgba(255,255,255,.06) 18px 20px)' },
};

export default function CoverArt({
  theme,
  alt,
  className = '',
  label,
  slug,
  priority = false,
}: {
  theme: Article['coverTheme'];
  alt: string;
  className?: string;
  label?: string;
  /** se presente, mostra la copertina reale /images/covers/{slug}.jpg|.webp */
  slug?: string;
  /** immagine above-the-fold (hero): caricamento eager + alta priorità */
  priority?: boolean;
}) {
  const { bg, Icon, pattern } = THEMES[theme];
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden ${className}`}
      style={{ background: bg }}
    >
      {slug ? (
        // copertina reale sopra il gradiente (che resta come fallback in caricamento)
        <picture>
          <source srcSet={`/images/covers/${slug}.webp`} type="image/webp" />
          <img
            src={`/images/covers/${slug}.jpg`}
            alt={alt}
            width={1200}
            height={630}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      ) : (
        <>
          <div className="absolute inset-0" style={{ backgroundImage: pattern }} />
          <Icon className="absolute -right-6 -bottom-8 h-40 w-40 text-white/10" strokeWidth={1} aria-hidden />
        </>
      )}
      {label && (
        <span className="absolute left-3 top-3 z-10 bg-white/95 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-900">
          {label}
        </span>
      )}
    </div>
  );
}
