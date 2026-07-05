// Citrus mark: a glowing lime cross-section (6 segments) overlaid with a white
// node network radiating from the center — recreated as a crisp, scalable SVG.

const SEGMENTS = 6;
const CENTER = 60;
const R_TIP = 46; // petal tip radius
const R_BASE = 9; // petal base near center
const HALF = (26 * Math.PI) / 180; // half angular width of a petal

function pt(r, aDeg) {
  const a = (aDeg * Math.PI) / 180;
  return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)];
}

function petalPath(i) {
  const base = pt(R_BASE, -90 + i * 60);
  const tip = pt(R_TIP, -90 + i * 60);
  const midR = R_TIP * 0.58;
  const a = (-90 + i * 60) * (Math.PI / 180);
  const s1 = [CENTER + midR * Math.cos(a - HALF), CENTER + midR * Math.sin(a - HALF)];
  const s2 = [CENTER + midR * Math.cos(a + HALF), CENTER + midR * Math.sin(a + HALF)];
  return `M ${base[0]} ${base[1]} Q ${s1[0]} ${s1[1]} ${tip[0]} ${tip[1]} Q ${s2[0]} ${s2[1]} ${base[0]} ${base[1]} Z`;
}

export function CitrusMark({ size = 40, glow = true, className = '' }) {
  const uid = 'cm'; // static ids are fine; multiple instances share defs
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Citrus"
    >
      <defs>
        <radialGradient id={`${uid}-flesh`} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#CBF56A" />
          <stop offset="55%" stopColor="#8ED630" />
          <stop offset="100%" stopColor="#5FA61C" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${uid}-softglow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <g filter={glow ? `url(#${uid}-glow)` : undefined}>
        {/* glowing rind */}
        <circle cx={CENTER} cy={CENTER} r="52" fill="none" stroke="#8ED630" strokeWidth="3.5" />
        <circle cx={CENTER} cy={CENTER} r="48" fill="#0D1B2A" opacity="0.35" />

        {/* lime segments */}
        <g stroke="#0D1B2A" strokeWidth="1.5" strokeLinejoin="round">
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <path key={i} d={petalPath(i)} fill={`url(#${uid}-flesh)`} />
          ))}
        </g>

        {/* white node network */}
        <g stroke="#FFFFFF" strokeWidth="1.6" opacity="0.95">
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const [x, y] = pt(R_TIP - 4, -90 + i * 60);
            return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} />;
          })}
        </g>
        <g fill="#FFFFFF">
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const [x, y] = pt(R_TIP - 4, -90 + i * 60);
            return <circle key={i} cx={x} cy={y} r="3" />;
          })}
          <circle cx={CENTER} cy={CENTER} r="4.5" />
        </g>
      </g>
    </svg>
  );
}

// Emblem + wordmark lockup.
export function CitrusLogo({ size = 40, textClass = 'text-white', className = '', showWord = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CitrusMark size={size} />
      {showWord && (
        <span className={`font-display leading-none ${textClass}`} style={{ fontSize: size * 0.62 }}>
          Citrus
        </span>
      )}
    </span>
  );
}
