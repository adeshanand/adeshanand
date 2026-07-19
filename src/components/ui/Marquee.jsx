import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

/*
 * Infinite brand marquee: the track holds the item list twice; CSS slides
 * it -50% and loops. Second copy is aria-hidden so screen readers hear the
 * list once. Pausable three ways (WCAG 2.2.2): hover, focus-within, and an
 * explicit toggle button; reduced motion stops it entirely (CSS-gated).
 */
export default function Marquee({ items, className = '' }) {
  const [paused, setPaused] = useState(false);
  const row = (hidden) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-10 pr-10 font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink/70"
        >
          {item}
          <span aria-hidden className="size-1.5 rotate-45 bg-accent/60" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="marquee min-w-0 flex-1" data-paused={paused || undefined}>
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        aria-label={paused ? 'Play brand marquee' : 'Pause brand marquee'}
        className="mr-4 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cloud hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
      </button>
    </div>
  );
}
