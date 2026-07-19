import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/*
 * Layered depth-parallax artwork (the portable version of Lusion's
 * image+depth featured-work cards): three pre-baked webp layers shift at
 * different rates against the pointer, springs give the motion weight.
 * The art is always noir-based, so the panel reads as a window into the
 * WebGL world in both themes. Decorative — hidden from the tree.
 */
const DEPTHS = { bg: 6, mid: 14, fg: 24 };
const SCALES = { bg: 1.06, mid: 1.08, fg: 1.1 };

function Layer({ name, base, sx, sy, still }) {
  const x = useTransform(sx, (v) => v * -DEPTHS[name]);
  const y = useTransform(sy, (v) => v * -DEPTHS[name] * 0.6);
  return (
    <motion.img
      src={`${base}-${name}.webp`}
      alt=""
      draggable={false}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
      style={still ? { scale: SCALES[name] } : { x, y, scale: SCALES[name] }}
    />
  );
}

export default function ParallaxArt({ base }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative mb-5 aspect-[5/2] select-none overflow-hidden rounded-xl border border-ink/8 bg-[#060a0f]"
      onPointerMove={reduced ? undefined : onMove}
      onPointerLeave={reduced ? undefined : onLeave}
    >
      <Layer name="bg" base={base} sx={sx} sy={sy} still={reduced} />
      <Layer name="mid" base={base} sx={sx} sy={sy} still={reduced} />
      <Layer name="fg" base={base} sx={sx} sy={sy} still={reduced} />
    </div>
  );
}
