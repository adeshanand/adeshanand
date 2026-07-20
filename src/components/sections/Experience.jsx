import { motion, useReducedMotion } from 'framer-motion';
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
        wide ? 'xl:col-span-2' : ''
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

/* Each role is a numbered editorial row: sticky meta rail on the left,
 * project cards on the right, a hairline that draws itself in as the row
 * enters the viewport. */
function RoleRow({ role, index }) {
  const reduced = useReducedMotion();
  return (
    <li className="relative pt-10 md:pt-12">
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-ink/10"
        initial={reduced ? undefined : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.27, 0.98] }}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <p aria-hidden className="font-mono text-sm tabular-nums text-accent-deep">
            {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            {role.role}
          </h3>
          <p className="mt-1.5 text-lg font-semibold text-accent">
            {role.company}
            {role.meta ? (
              <span className="ml-2 text-sm font-normal text-muted">({role.meta})</span>
            ) : null}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 text-sm text-muted">
            <span className="font-medium text-ink/70">{role.period}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} aria-hidden />
              {role.location}
            </span>
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="grid gap-5 xl:grid-cols-1">
            {role.projects.map((project) => (
              <ProjectCard key={project.name} project={project} wide={role.projects.length === 1} />
            ))}
          </div>
        </Reveal>
      </div>
    </li>
  );
}

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="experience-heading"
            index="02"
            eyebrow="Work"
            size="text-[clamp(1.625rem,8.2vw,2.25rem)] md:text-6xl"
            title={
              <>
                Eight years, <br className="md:hidden" />
                five teams, <br className="md:hidden" />
                one throughline: <br className="md:hidden" />
                platforms that scale.
              </>
            }
            lede="From AWS-backed service apps to composable storefronts for global brands — each role built on the last."
          />
        </Reveal>

        <ol className="mt-16 space-y-16 md:space-y-20">
          {experience.map((role, i) => (
            <RoleRow key={`${role.company}-${role.period}`} role={role} index={i} />
          ))}
        </ol>
      </Container>
    </section>
  );
}
