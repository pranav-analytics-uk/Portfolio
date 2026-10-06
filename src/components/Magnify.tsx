import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { createContext, useContext, useMemo, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';

// macOS Dock-style magnification: items grow as the cursor approaches, the one
// under the cursor the most, with a smooth falloff to its neighbours.
// Only active on devices with a real hover pointer (no effect on phones/tablets).

type Ctx = { x: MotionValue<number>; y: MotionValue<number>; max: number; range: number };
const MagnifyContext = createContext<Ctx | null>(null);

const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

interface GroupProps {
  children: ReactNode;
  /** Scale of the item directly under the cursor. */
  max?: number;
  /** Distance in px over which the effect fades out. */
  range?: number;
  as?: ElementType;
  className?: string;
}

export function MagnifyGroup({ children, max = 1.08, range = 260, as: Tag = 'div', className }: GroupProps) {
  const x = useMotionValue(Infinity);
  const y = useMotionValue(Infinity);
  const value = useMemo(() => ({ x, y, max, range }), [x, y, max, range]);
  const reset = () => {
    x.set(Infinity);
    y.set(Infinity);
  };
  return (
    <MagnifyContext.Provider value={value}>
      <Tag
        className={className}
        onMouseMove={
          canHover
            ? (e: React.MouseEvent) => {
                x.set(e.clientX);
                y.set(e.clientY);
              }
            : undefined
        }
        onMouseLeave={reset}
      >
        {children}
      </Tag>
    </MagnifyContext.Provider>
  );
}

interface ItemProps {
  children: ReactNode;
  as?: 'div' | 'li';
  className?: string;
  style?: CSSProperties;
}

export function MagnifyItem({ children, as = 'div', className, style }: ItemProps) {
  const ctx = useContext(MagnifyContext);
  if (!ctx) throw new Error('MagnifyItem must be inside a MagnifyGroup');
  const ref = useRef<HTMLElement>(null);
  const MotionTag = as === 'li' ? motion.li : motion.div;

  const target = useTransform([ctx.x, ctx.y], ([mx, my]: number[]) => {
    const el = ref.current;
    if (!el || !Number.isFinite(mx)) return 1;
    // Scaling happens around the centre, so the measured centre stays put while the item grows
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const d = Math.min(Math.hypot(mx - cx, my - cy) / ctx.range, 1);
    // Cosine falloff, like the Dock: full size at d=0, back to 1 at d=1
    return 1 + (ctx.max - 1) * ((Math.cos(Math.PI * d) + 1) / 2);
  });
  const scale = useSpring(target, { stiffness: 320, damping: 26, mass: 0.4 });
  const zIndex = useTransform(scale, (s) => (s > 1.002 ? Math.round(s * 100) : 0));

  return (
    <MotionTag
      ref={ref as never}
      className={`relative ${className ?? ''}`}
      // No will-change: it would keep text rasterised at 1x and blur it while magnified
      style={{ ...style, scale, zIndex }}
    >
      {children}
    </MotionTag>
  );
}
