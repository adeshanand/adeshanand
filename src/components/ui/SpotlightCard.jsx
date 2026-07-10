import { useRef } from 'react';

/*
 * Card whose border glow follows the cursor (a soft radial highlight,
 * .spotlight-card::before in index.css). Pointer-only and hover-gated,
 * so it costs nothing on touch devices.
 */
export default function SpotlightCard({ className = '', children, ...rest }) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`spotlight-card ${className}`} {...rest}>
      {children}
    </div>
  );
}
