import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Container from '../ui/Container.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Badge from '../ui/Badge.jsx';
import SpotlightCard from '../ui/SpotlightCard.jsx';
import { experience } from '../../data/profile.js';

function ProjectCard({ project, wide = false }) {
  return (
    <SpotlightCard
      className={`rounded-2xl border border-ink/8 bg-card p-6 transition-shadow duration-200 hover:[box-shadow:var(--shadow-card)] md:p-7 ${
        wide ? 'lg:col-span-2' : ''
      }`}
    >
      <h4 className="font-display text-lg font-semibold text-ink">{project.name}</h4>
      <p className="mt-2.5 text-sm leading-relaxed text-muted md:text-[0.9375rem]">{project.blurb}</p>
      {project.points ? (
        <ul className="mt-4 space-y-2.5">
          {project.points.map((point) => (
            <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/60" />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
    </SpotlightCard>
  );
}

export default function Experience() {
  const timelineRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.7', 'end 0.55'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="experience-heading"
            eyebrow="Experience"
            title="Seven years, five teams, one throughline: platforms that scale."
            lede="From AWS-backed service apps to composable storefronts for global brands — each role built on the last."
          />
        </Reveal>

        <div ref={timelineRef} className="relative mt-16">
          {/* Timeline rail: static hairline plus the accent line that draws itself on scroll */}
          <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-ink/10" />
          <motion.div
            aria-hidden
            style={{ scaleY: reduced ? 1 : scaleY }}
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent"
          />

          <ol className="space-y-14 md:space-y-16">
            {experience.map((role) => (
              <li key={`${role.company}-${role.period}`} className="relative pl-10 md:pl-14">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 size-[15px] rounded-full border-2 border-accent bg-paper shadow-[0_0_12px_var(--btn-glow)]"
                />
                <Reveal>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-xl font-semibold text-ink md:text-2xl">
                      {role.role}
                      {/* Inline "Role · Company" from sm up; stacked lines on mobile, no dot */}
                      <span className="text-accent max-sm:hidden"> ·&nbsp;</span>
                      <span className="block sm:inline">{role.company}</span>
                    </h3>
                    {role.meta ? <span className="text-sm text-muted">({role.meta})</span> : null}
                  </div>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-sm text-muted">
                    <span className="font-medium text-ink/70">{role.period}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} aria-hidden />
                      {role.location}
                    </span>
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {role.projects.map((project) => (
                      <ProjectCard
                        key={project.name}
                        project={project}
                        wide={role.projects.length === 1}
                      />
                    ))}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
