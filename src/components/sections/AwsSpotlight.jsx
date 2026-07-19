import { ExternalLink } from 'lucide-react';
import Container from '../ui/Container.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import SpotlightCard from '../ui/SpotlightCard.jsx';
import { awsCertifications } from '../../data/profile.js';

/*
 * The AWS credentials get their own stage: an oversized two-card section
 * directly after the hero, led by the official Credly badge artwork, with
 * a giant watermark and mono credential IDs.
 */
export default function AwsSpotlight() {
  return (
    <section id="aws" aria-labelledby="aws-heading" className="relative overflow-hidden bg-cloud py-24 md:py-32">
      <p
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(8rem,24vw,20rem)] font-bold leading-none tracking-tight text-ink/[0.04]"
      >
        AWS
      </p>
      <Container className="relative">
        <Reveal>
          <SectionHeading
            id="aws-heading"
            index="01"
            eyebrow="AWS Certified"
            title="Certified on AWS, twice over."
            lede="Generative AI and cloud architecture credentials — verified, current, and put to work in production commerce systems."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {awsCertifications.map((cert, i) => (
            <Reveal key={cert.name} delay={i * 0.1}>
              <SpotlightCard className="group flex h-full flex-col rounded-3xl border border-ink/8 bg-card p-8 transition-shadow duration-200 hover:[box-shadow:var(--shadow-card)] md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      {cert.level}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-snug tracking-tight text-ink md:text-3xl">
                      {cert.short}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium text-muted">
                      {cert.name}
                      {cert.date ? ` · ${cert.date}` : ''}
                    </p>
                  </div>
                  <img
                    src={cert.badge}
                    alt={`${cert.name} — ${cert.level} badge`}
                    width={160}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="w-24 shrink-0 drop-shadow-[0_10px_24px_var(--accent-glow)] transition-transform duration-300 group-hover:scale-105 md:w-32"
                  />
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">{cert.tagline}</p>
                <div className="mt-auto pt-7">
                  {cert.credentialId ? (
                    <p className="rounded-xl border border-ink/8 bg-paper px-4 py-3 font-mono text-xs text-muted">
                      <span className="mr-2 uppercase tracking-[0.14em] text-muted">ID</span>
                      <span className="break-all text-ink/80">{cert.credentialId}</span>
                    </p>
                  ) : null}
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    Verify credential
                    <span className="sr-only"> (opens in a new tab)</span>
                    <ExternalLink size={14} aria-hidden />
                  </a>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
