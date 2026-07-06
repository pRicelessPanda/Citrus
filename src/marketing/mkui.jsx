import { useEffect, useRef, useState } from 'react';

// Marketing design system — "interactive research paper" aesthetic inspired by
// OpenScience (openscience.sh): paper-white ground, near-black ink, serif body,
// monospace labels, thin rules, and a lime highlighter as the accent.

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
        transform: inView ? 'none' : 'translateY(18px)',
        transition: `opacity .65s ease ${delay}ms, transform .65s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
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

// ---------- academic elements ----------

// Small-caps mono label, e.g. "§ 2 · Capabilities".
export function Eyebrow({ children, className = '' }) {
  return (
    <span className={`font-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-leaf ${className}`}>
      {children}
    </span>
  );
}

// Lime highlighter over key phrases — a reader's marker on the paper.
export function Highlight({ children }) {
  return <span className="hl">{children}</span>;
}

// Numbered section heading, LaTeX style: "2  Capabilities".
export function SectionHeading({ n, children, className = '' }) {
  return (
    <h2 className={`font-paper text-3xl text-ink md:text-4xl ${className}`}>
      {n != null && <span className="mr-4 text-ink/40">{n}</span>}
      {children}
    </h2>
  );
}

// Figure frame with numbered caption.
export function Figure({ n, caption, children, className = '' }) {
  return (
    <figure className={className}>
      <div className="rounded-lg border border-inkline bg-white p-4 shadow-[0_1px_0_rgba(13,27,42,0.05)] md:p-6">{children}</div>
      <figcaption className="mx-auto mt-3 max-w-2xl text-center font-paper text-sm italic text-ink/60">
        <span className="font-mono not-italic text-[11px] uppercase tracking-widest text-ink/50">Figure {n}.</span>{' '}
        {caption}
      </figcaption>
    </figure>
  );
}

// Thin horizontal rule.
export function Rule({ className = '' }) {
  return <hr className={`border-t border-inkline ${className}`} />;
}

// ---------- decorative ----------
export function GlowBlob({ className = '', color = 'rgba(142,214,48,0.5)', size = 480, opacity = 0.1 }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{ width: size, height: size, background: color, opacity, filter: 'blur(110px)' }}
    />
  );
}

export function Grain({ opacity = 0.05 }) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
  );
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-multiply"
      style={{ backgroundImage: `url("data:image/svg+xml,${svg}")`, opacity }}
    />
  );
}

// Faint node constellation, in ink/leaf on paper.
export function NodeField({ className = '', opacity = 0.25 }) {
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
      <g stroke="#0D1B2A" strokeWidth="0.08" opacity="0.4">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.4" fill="#4C8B1F" style={{ animation: `nodePulse ${3 + (i % 4)}s ease-in-out ${i * 0.25}s infinite` }} />
      ))}
    </svg>
  );
}

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
            <span key={i} className="font-paper whitespace-nowrap text-lg italic text-ink/35">
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
    lime: 'bg-lime-bright text-navy hover:brightness-95 shadow-[0_1px_0_rgba(13,27,42,0.2)]',
    ghost: 'border border-inkline bg-white text-ink hover:bg-ink/5',
    dark: 'bg-navy text-white hover:bg-navy-soft',
  };
  return (
    <Tag
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-all ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function GradientText({ children, className = '' }) {
  // On paper, "gradient text" becomes highlighted text — keeps the API stable.
  return <span className={`hl ${className}`}>{children}</span>;
}
