export default function SectionHeading({ id, eyebrow, title, lede, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-2xl ${alignment}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        {eyebrow}
      </p>
      <h2 id={id} className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-ink md:text-4xl">
        {title}
      </h2>
      {lede ? <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{lede}</p> : null}
    </div>
  );
}
