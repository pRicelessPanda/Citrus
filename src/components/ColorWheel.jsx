import { useState } from 'react';
import { Check, Lock } from 'lucide-react';

// A color wheel (not just standard swatches) for project/paper color.
// Taken (active) colors are greyed out and unselectable (§14.1).
const HUES = Array.from({ length: 24 }, (_, i) => i * 15);
const RINGS = [
  { s: 70, l: 55 },
  { s: 55, l: 45 },
  { s: 45, l: 65 },
];

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export default function ColorWheel({ value, onChange, takenColors = [] }) {
  const taken = new Set(takenColors.map((c) => c.toUpperCase()));
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {RINGS.map((ring, ri) => {
          const rOuter = 110 - ri * 32;
          const rInner = rOuter - 28;
          return HUES.map((h) => {
            const hex = hslToHex(h, ring.s, ring.l);
            const isTaken = taken.has(hex);
            const a0 = ((h - 7.5) * Math.PI) / 180;
            const a1 = ((h + 7.5) * Math.PI) / 180;
            const p = (r, a) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
            const path = `M ${p(rInner, a0)} L ${p(rOuter, a0)} A ${rOuter} ${rOuter} 0 0 1 ${p(rOuter, a1)} L ${p(rInner, a1)} A ${rInner} ${rInner} 0 0 0 ${p(rInner, a0)} Z`;
            const selected = value?.toUpperCase() === hex;
            return (
              <path
                key={`${ri}-${h}`}
                d={path}
                fill={isTaken ? '#D7D7D2' : hex}
                stroke={selected ? '#0D1B2A' : 'white'}
                strokeWidth={selected ? 3 : 1}
                className={isTaken ? 'cursor-not-allowed' : 'cursor-pointer'}
                onClick={() => !isTaken && onChange(hex)}
              />
            );
          });
        })}
        <circle cx={cx} cy={cy} r={22} fill={value || '#EEE'} stroke="white" strokeWidth={3} />
      </svg>

      <div>
        <p className="text-sm font-medium">Selected color</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg border border-line" style={{ background: value || '#eee' }} />
          <span className="font-mono text-sm text-muted">{value || 'none'}</span>
        </div>
        {taken.size > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <Lock size={12} /> Greyed colors are used by other active projects/papers.
          </p>
        )}
        <p className="mt-1 text-xs text-muted">Completing or archiving an item releases its color.</p>
      </div>
    </div>
  );
}
