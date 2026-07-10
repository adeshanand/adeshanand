import { Award, ExternalLink, GraduationCap } from 'lucide-react';
import Container from '../ui/Container.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import SpotlightCard from '../ui/SpotlightCard.jsx';
import { certifications, education } from '../../data/profile.js';

export default function Credentials() {
  return (
    <section id="credentials" aria-labelledby="credentials-heading" className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="credentials-heading"
            eyebrow="Credentials"
            title="Certified where it counts."
            lede="Cloud architecture and commerce platform certifications, backed by formal computer-science training."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Certifications
            </h3>
            <div className="mt-5 space-y-4">
              {certifications.map((cert, i) => (
                <Reveal key={cert.credentialId} delay={i * 0.08}>
                  <SpotlightCard className="flex gap-4 rounded-2xl border border-ink/8 bg-card p-6 transition-shadow duration-200 hover:[box-shadow:var(--shadow-card)]">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Award size={20} aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold leading-snug text-ink">
                        {cert.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {cert.issuer} · {cert.date}
                      </p>
                      <p className="mt-1.5 text-xs text-muted">
                        Credential ID:{' '}
                        <span className="font-mono text-ink/70">{cert.credentialId}</span>
                      </p>
                      {cert.verifyUrl ? (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-colors hover:text-accent-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                          Verify credential
                          <ExternalLink size={12} aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Education
            </h3>
            <div className="mt-5 space-y-4">
              {education.map((entry, i) => (
                <Reveal key={entry.degree} delay={i * 0.08}>
                  <div className="flex gap-4 rounded-2xl border border-ink/8 bg-card p-6">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-cloud text-muted">
                      <GraduationCap size={20} aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold leading-snug text-ink">
                        {entry.degree}
                      </p>
                      <p className="mt-1 text-sm text-muted">{entry.school}</p>
                      <p className="mt-1.5 text-xs text-muted">
                        {entry.period} · Score {entry.score}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
