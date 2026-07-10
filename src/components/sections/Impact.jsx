import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import Container from '../ui/Container.jsx';
import Reveal from '../ui/Reveal.jsx';
import { impact } from '../../data/profile.js';

function useCountUp(target, started, duration = 1400) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!started) return undefined;
    if (reduced) {
      setValue(target);
      return undefined;
    }
    let raf;
    let start;
    const tick = (now) => {
      if (start === undefined) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration, reduced]);

  return value;
}

function Stat({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const value = useCountUp(stat.value, inView);

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div ref={ref} className="h-full rounded-2xl border border-ink/8 bg-card p-6 md:p-7">
        <p className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          {stat.prefix ? <span className="text-2xl text-muted md:text-3xl">{stat.prefix}</span> : null}
          {value}
          {stat.suffix ? <span className="text-accent">{stat.suffix}</span> : null}
        </p>
        <p className="mt-3 text-sm font-medium leading-snug text-ink">{stat.label}</p>
        <p className="mt-1 text-xs text-muted">{stat.context}</p>
      </div>
    </Reveal>
  );
}

export default function Impact() {
  return (
    <section aria-label="Career impact" className="bg-cloud py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {impact.map((stat, i) => (
            <Stat key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
