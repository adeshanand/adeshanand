export default function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'border-ink/10 bg-paper text-muted',
    accent: 'border-accent/20 bg-accent-soft text-accent-deep',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
