import { Layout, Server, Sparkles, Wrench } from 'lucide-react';
import Container from '../ui/Container.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';
import Badge from '../ui/Badge.jsx';
import SpotlightCard from '../ui/SpotlightCard.jsx';
import { skills } from '../../data/profile.js';

const ICONS = {
  server: Server,
  layout: Layout,
  sparkles: Sparkles,
  wrench: Wrench,
};

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="bg-cloud py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="skills-heading"
            eyebrow="Skills"
            title="Full-stack depth, commerce breadth, AI fluency."
            lede="The toolkit behind resilient distributed systems — from BFF layers and event streams to RAG pipelines."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {skills.map((group, i) => {
            const Icon = ICONS[group.icon];
            return (
              <Reveal key={group.title} delay={i * 0.08}>
                <SpotlightCard className="h-full rounded-2xl border border-ink/8 bg-card p-7 transition-shadow duration-200 hover:[box-shadow:var(--shadow-card)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon size={19} aria-hidden />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-ink">{group.title}</h3>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
