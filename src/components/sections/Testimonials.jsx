import { Linkedin, Quote } from 'lucide-react';
import Container from '../ui/Container.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import SpotlightCard from '../ui/SpotlightCard.jsx';
import { testimonials } from '../../data/profile.js';

/*
 * LinkedIn recommendations, verbatim. CSS columns give a masonry flow so
 * long and short quotes balance; break-inside-avoid keeps cards whole.
 * Avatars are palette initials — LinkedIn photo URLs are tokenized,
 * expiring, and blocked by the CSP anyway.
 */
export default function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="testimonials-heading"
            index="05"
            eyebrow="Testimonials"
            title="Words from the people I've shipped with."
            lede="LinkedIn recommendations from managers and teammates — quoted verbatim."
          />
        </Reveal>

        <div className="mt-14 columns-1 gap-6 lg:columns-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={Math.min(i * 0.06, 0.18)} className="mb-6 break-inside-avoid">
              <SpotlightCard className="rounded-2xl border border-ink/8 bg-card p-7 transition-shadow duration-200 hover:[box-shadow:var(--shadow-card)] md:p-8">
                <figure>
                  <Quote size={22} aria-hidden className="text-accent" />
                  <blockquote className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted md:text-[0.9375rem]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3.5 border-t border-ink/8 pt-5">
                    <span
                      aria-hidden
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-bold text-accent"
                    >
                      {t.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-semibold text-ink">{t.name}</p>
                      <p className="truncate text-xs text-muted">{t.role}</p>
                      <p className="mt-0.5 text-xs font-medium text-accent">
                        {t.relation} · {t.date}
                      </p>
                    </div>
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.name} on LinkedIn (opens in a new tab)`}
                      className="ml-auto inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <Linkedin size={15} aria-hidden />
                    </a>
                  </figcaption>
                </figure>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
