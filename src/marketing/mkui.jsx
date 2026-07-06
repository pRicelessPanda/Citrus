import { useEffect, useRef, useState } from 'react';

// ---------- scroll reveal ----------
export function useInView(options = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        obs.unobserve(el);
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, []); // eslint-disable-line
  return [ref, inView];
}

export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(24px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

// ---------- count up ----------
export function CountUp({ to, suffix = '', prefix = '', duration = 1400, decimals = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ---------- decorative ----------
export function GradientText({ children, className = '' }) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{ backgroundImage: 'linear-gradient(100deg,#8ED630,#5DCAA5 55%,#8ED630)' }}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime ${className}`}>
      {children}
    </span>
  );
}

// Soft blurred color blob for ambient backgrounds.
export function GlowBlob({ className = '', color = 'var(--color-lime)', size = 480, opacity = 0.22 }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{ width: size, height: size, background: color, opacity, filter: 'blur(120px)' }}
    />
  );
}

// Subtle film grain overlay for texture (artsy).
export function Grain({ opacity = 0.04 }) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
  );
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-overlay"
      style={{ backgroundImage: `url("data:image/svg+xml,${svg}")`, opacity }}
    />
  );
}

// Animated node constellation.
export function NodeField({ className = '', opacity = 0.4 }) {
  const nodes = [
    [12, 20], [22, 55], [8, 78], [34, 30], [30, 72],
    [70, 18], [82, 44], [66, 60], [90, 72], [78, 85], [50, 12], [55, 90], [48, 48],
  ];
  const links = [
    [0, 3], [1, 3], [1, 4], [2, 4], [3, 12], [12, 5],
    [5, 6], [6, 7], [7, 8], [8, 9], [6, 10], [7, 11], [12, 7],
  ];
  return (
    <svg className={`absolute inset-0 h-full w-full ${className}`} style={{ opacity }} preserveAspectRatio="none" viewBox="0 0 100 100">
      <g stroke="#5DCAA5" strokeWidth="0.1" opacity="0.5">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.45" fill="#8ED630" style={{ animation: `nodePulse ${3 + (i % 4)}s ease-in-out ${i * 0.25}s infinite` }} />
      ))}
    </svg>
  );
}

// Infinite marquee row.
export function Marquee({ items, className = '', duration = 30 }) {
  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      {[0, 1].map((k) => (
        <div
          key={k}
          className="flex shrink-0 items-center gap-12 pr-12"
          style={{ animation: `marquee ${duration}s linear infinite` }}
          aria-hidden={k === 1}
        >
          {items.map((it, i) => (
            <span key={i} className="whitespace-nowrap text-lg font-medium text-white/40">
              {it}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------- buttons ----------
export function MkButton({ variant = 'lime', size = 'md', className = '', as: Tag = 'button', ...props }) {
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' };
  const variants = {
    lime: 'bg-lime text-navy hover:brightness-95 shadow-lg shadow-lime/20',
    ghost: 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
    dark: 'bg-white text-navy hover:brightness-95',
  };
  return (
    <Tag
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-all ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
