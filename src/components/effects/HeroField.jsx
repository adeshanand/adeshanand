import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { createField } from '../../gl/field.js';

/*
 * React shell around the WebGL field. The owner (Hero) only mounts this
 * when motion is allowed and unmounts it when reduced-motion flips on;
 * this component adds the remaining runtime gates: no WebGL2 → silently
 * blank (CSS aurora remains), offscreen → rAF and pointer listeners off,
 * GPU context loss → onLost so the owner restores the aurora.
 */
export default function HeroField({ onReady, onLost }) {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const onLostRef = useRef(onLost);
  onReadyRef.current = onReady;
  onLostRef.current = onLost;
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    let cancelled = false;
    let cleanupInner = null;

    // The monogram rasterizes "AA" in Sora — wait for fonts (bounded), so
    // the glyph sampling doesn't race the web-font load
    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 1200)),
    ]);

    fontsReady.then(() => {
      if (cancelled) return;
      let field;
      try {
        field = createField(canvas, {
          onContextLost: () => {
            fieldRef.current = null;
            onLostRef.current?.();
          },
        });
      } catch {
        return; // context/shader failure — keep the CSS fallback
      }
      if (!field) return;
      fieldRef.current = field;
      onReadyRef.current?.();
      syncColors(field, document.documentElement);

      // The monogram positions itself relative to the measured headline —
      // the DOM drives the scene, so text and letterform never collide
      const measureText = () => {
        const h1 = document.querySelector('#top h1');
        if (!h1) return;
        const hr = h1.getBoundingClientRect();
        const cr = canvas.getBoundingClientRect();
        if (!cr.width) return;
        // The h1 block box stretches to its container edge; measure the
        // rendered text's line boxes instead — the gap to the right of the
        // actual glyphs is real estate the monogram stack can claim
        const range = document.createRange();
        range.selectNodeContents(h1);
        const lineRects = Array.from(range.getClientRects());
        const textRight = lineRects.length
          ? Math.min(hr.right, Math.max(...lineRects.map((r) => r.right)))
          : hr.right;
        const badge = h1.previousElementSibling;
        const br = badge ? badge.getBoundingClientRect() : null;
        field.setTextBounds({
          right: textRight - cr.left,
          top: hr.top - cr.top,
          cy: (hr.top + hr.bottom) / 2 - cr.top,
          badgeRight: br ? br.right - cr.left : 0,
        });
      };
      measureText();
      field.resize();
      // The hero entrance translates the headline for ~1.3s; one settled
      // re-measure keeps the monogram centered on the text's final position
      const settleTimer = setTimeout(() => {
        measureText();
        field.resize();
      }, 1600);

      const hoverable = window.matchMedia('(hover: hover)').matches;
      const onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
        field.setPointer(Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y)), inside);
      };
      const onEnd = () => field.setPointer(0.5, 0.5, false);
      let pointerOn = false;
      const attachPointer = () => {
        if (!hoverable || pointerOn) return;
        pointerOn = true;
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('blur', onEnd);
        document.addEventListener('pointerleave', onEnd);
      };
      const detachPointer = () => {
        if (!pointerOn) return;
        pointerOn = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('blur', onEnd);
        document.removeEventListener('pointerleave', onEnd);
      };

      // Run (and listen) only while the hero is actually on screen
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          field.start();
          attachPointer();
        } else {
          field.stop();
          detachPointer();
        }
      });
      io.observe(canvas);
      const ro = new ResizeObserver(() => {
        measureText();
        field.resize();
      });
      ro.observe(canvas);

      // Zoom / monitor moves change devicePixelRatio without a CSS resize
      let dprMq = null;
      const watchDpr = () => {
        dprMq?.removeEventListener('change', onDprChange);
        dprMq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        dprMq.addEventListener('change', onDprChange);
      };
      const onDprChange = () => {
        field.resize();
        watchDpr();
      };
      watchDpr();

      cleanupInner = () => {
        clearTimeout(settleTimer);
        io.disconnect();
        ro.disconnect();
        detachPointer();
        dprMq?.removeEventListener('change', onDprChange);
        field.destroy();
        fieldRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanupInner?.();
    };
  }, []);

  useEffect(() => {
    if (fieldRef.current) syncColors(fieldRef.current, document.documentElement);
  }, [theme]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}

// Computed styles hand back the theme-correct values (#22d3ee dark /
// #0c657e light accent; accent-strong = the guaranteed-contrast fill), so
// the palette's contrast rules hold on canvas too
function syncColors(field, root) {
  const cs = getComputedStyle(root);
  // Light is the site default: only an explicit dark choice flips it
  const dark = root.dataset.theme === 'dark';
  // Monogram balls use fixed certification brand colors (AWS orange,
  // SFCC blue) — only the particle field follows the theme
  field.setColors({
    accent: cs.getPropertyValue('--c-accent').trim(),
    muted: cs.getPropertyValue('--c-muted').trim(),
    paper: cs.getPropertyValue('--c-paper').trim(),
    alpha: dark ? 1 : 0.85,
  });
}
