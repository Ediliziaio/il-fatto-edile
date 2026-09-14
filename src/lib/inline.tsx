import type { ReactNode } from 'react';

// Sintassi minima nei testi degli articoli:
// [testo](https://…) link esterno · [testo](https://… "sponsored") link a pagamento · **testo** grassetto
const INLINE_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)(?:\s+"([^"]*)")?\)|\*\*(.+?)\*\*/g;

export function renderInline(text: string): ReactNode {
  INLINE_RE.lastIndex = 0;
  if (!INLINE_RE.test(text)) return text;
  INLINE_RE.lastIndex = 0;
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[4] !== undefined) {
      parts.push(<strong key={key++}>{m[4]}</strong>);
    } else {
      const external = m[2].startsWith('http');
      parts.push(
        <a
          key={key++}
          href={m[2]}
          {...(external ? { target: '_blank', rel: m[3] === 'sponsored' ? 'sponsored noopener' : 'noopener' } : {})}
          className="font-semibold text-red-700 underline underline-offset-2 hover:text-neutral-950"
        >
          {m[1]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
