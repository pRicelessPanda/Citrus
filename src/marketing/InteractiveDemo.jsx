import { useState, useEffect, useRef } from 'react';
import { Languages, ShieldCheck, GitCompare, Search, Sparkles, Check } from 'lucide-react';

// Interactive demonstration, styled as a figure in a paper: light ground,
// hairline borders, mono labels. Fully clickable.

const TABS = [
  { id: 'translate', label: 'Translate', icon: Languages },
  { id: 'score', label: 'Credibility', icon: ShieldCheck },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'search', label: 'Search', icon: Search },
];

export default function InteractiveDemo() {
  const [tab, setTab] = useState('translate');
  return (
    <div className="font-sans mx-auto max-w-4xl">
      {/* tab bar */}
      <div className="mx-auto mb-5 flex w-fit flex-wrap justify-center gap-1 rounded-xl border border-inkline bg-paper p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === t.id ? 'bg-navy text-white' : 'text-ink/60 hover:text-ink'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* window */}
      <div className="overflow-hidden rounded-xl border border-inkline bg-white">
        <div className="flex items-center gap-2 border-b border-inkline bg-paper px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full border border-inkline" />
          <span className="h-2.5 w-2.5 rounded-full border border-inkline" />
          <span className="h-2.5 w-2.5 rounded-full border border-inkline" />
          <span className="font-mono ml-3 truncate text-[11px] uppercase tracking-widest text-ink/40">citrus.app / {tab}</span>
        </div>
        <div className="p-5 md:p-7">
          {tab === 'translate' && <TranslateDemo />}
          {tab === 'score' && <ScoreDemo />}
          {tab === 'compare' && <CompareDemo />}
          {tab === 'search' && <SearchDemo />}
        </div>
      </div>
    </div>
  );
}

// ---- Translate: reading-level slider swaps the explainer text live ----
const LEVELS = ['High School', 'Curious Adult', 'Domain Expert', 'Field Expert'];
const TEXT = {
  'High School':
    'Instead of reading a sentence word-by-word in order, this model looks at all the words at once and figures out which ones matter most to each other. That makes it faster and better at understanding language.',
  'Curious Adult':
    'The Transformer replaces step-by-step recurrence with an attention mechanism that weighs every word against every other word in parallel — improving both quality and training speed on translation tasks.',
  'Domain Expert':
    'Self-attention computes pairwise interactions across the full sequence, dispensing with recurrence and convolutions. Multi-head attention lets the model jointly attend to information from different representation subspaces.',
  'Field Expert':
    'Scaled dot-product attention over learned Q/K/V projections yields O(1) path length between positions, improving gradient flow versus RNNs; multi-head factorization and positional encodings recover order sensitivity lost by permutation invariance.',
};

function TranslateDemo() {
  const [idx, setIdx] = useState(1);
  const level = LEVELS[idx];
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_220px]">
      <div>
        <div className="font-paper text-lg text-ink">Attention Is All You Need</div>
        <div className="mt-0.5 text-xs text-ink/50">Vaswani et al. · 2017 · NeurIPS</div>
        <div className="mt-4 rounded-lg border border-inkline bg-paper p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-paper text-ink">Methodology</span>
            <span className="font-mono rounded bg-lime-bright/25 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink/70">{level}</span>
          </div>
          <p key={level} className="fade-up font-paper text-[15px] leading-relaxed text-ink/85" style={{ animationDuration: '.4s' }}>
            {TEXT[level]}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="font-mono mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/45">Reading level</p>
        <input
          type="range"
          min={0}
          max={3}
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          className="w-full accent-[var(--color-leaf)]"
        />
        <div className="mt-3 space-y-1">
          {LEVELS.map((l, i) => (
            <button
              key={l}
              onClick={() => setIdx(i)}
              className={`block w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                i === idx ? 'bg-ink/5 text-ink' : 'text-ink/50 hover:text-ink'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs italic text-ink/45">Drag to re-level any section instantly.</p>
      </div>
    </div>
  );
}

// ---- Credibility: animated subscore bars ----
function ScoreDemo() {
  const subs = [
    ['Currency', 9.4],
    ['Journal quality', 9.8],
    ['Author credentials', 9.6],
    ['Accuracy', 9.2],
  ];
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <div className="flex flex-col items-center justify-center rounded-lg border border-inkline bg-paper p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">Source credibility</p>
        <p className="font-paper mt-2 text-6xl text-success">9.5</p>
        <p className="text-ink/45">out of 10</p>
        <span className="font-mono mt-3 rounded bg-success-light px-2.5 py-1 text-[10px] uppercase tracking-wider text-success">Strong consensus</span>
      </div>
      <div className="space-y-4">
        {subs.map(([label, v], i) => (
          <div key={label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-ink/75">{label}</span>
              <span className="font-mono text-success">{v.toFixed(1)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink/8">
              <div
                className="h-full rounded-full bg-success transition-[width] duration-1000"
                style={{ width: animate ? `${(v / 10) * 100}%` : '0%', transitionDelay: `${i * 120}ms` }}
              />
            </div>
          </div>
        ))}
        <p className="pt-1 text-xs italic text-ink/45">Every score is transparent and expandable — no black box.</p>
      </div>
    </div>
  );
}

// ---- Compare: two columns with agreement highlighting ----
function CompareDemo() {
  const rows = [
    { section: 'Hypothesis', tone: 'border-success/40 bg-success-light/60' },
    { section: 'Methodology', tone: 'border-warning/40 bg-warning-light/60' },
    { section: 'Results', tone: 'border-danger/40 bg-danger-light/60' },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-inkline bg-paper px-3 py-1.5 text-sm text-ink/70">Paper A</span>
          <span className="font-paper italic text-ink/40">vs</span>
          <span className="rounded-md border border-inkline bg-paper px-3 py-1.5 text-sm text-ink/70">Paper B</span>
        </div>
        <span className="font-mono rounded bg-info-light px-2.5 py-1 text-[11px] text-info">Similarity 6.4/10</span>
      </div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.section} className="grid grid-cols-[110px_1fr_1fr] gap-2.5">
            <div className="font-paper flex items-center text-ink/85">{r.section}</div>
            <div className={`rounded-lg border p-3 ${r.tone}`}>
              <div className="h-2 w-11/12 rounded bg-ink/15" />
              <div className="mt-1.5 h-2 w-3/4 rounded bg-ink/15" />
            </div>
            <div className={`rounded-lg border p-3 ${r.tone}`}>
              <div className="h-2 w-10/12 rounded bg-ink/15" />
              <div className="mt-1.5 h-2 w-4/5 rounded bg-ink/15" />
            </div>
          </div>
        ))}
      </div>
      <div className="font-mono mt-4 flex items-center gap-4 text-[10px] uppercase tracking-wider text-ink/45">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success-light ring-1 ring-success/40" /> Agree</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning-light ring-1 ring-warning/40" /> Partial</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-danger-light ring-1 ring-danger/40" /> Differ</span>
      </div>
    </div>
  );
}

// ---- Search: conversational query "types" then reveals cards ----
const QUERY = 'papers on attention mechanisms in low-resource languages';
const RESULTS = [
  ['Attention Is All You Need', 'Vaswani et al. · 2017', 9.5],
  ['Measuring and Mitigating Social Bias in LLMs', 'Khan et al. · 2021', 7.6],
  ['Cross-lingual Transfer for Low-Resource NLP', 'Petrova et al. · 2022', 8.1],
];
function SearchDemo() {
  const [typed, setTyped] = useState('');
  const [show, setShow] = useState(false);
  const ranRef = useRef(false);
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    let i = 0;
    const type = setInterval(() => {
      i += 1;
      setTyped(QUERY.slice(0, i));
      if (i >= QUERY.length) {
        clearInterval(type);
        setTimeout(() => setShow(true), 400);
      }
    }, 34);
    return () => clearInterval(type);
  }, []);
  return (
    <div>
      <div className="flex items-center gap-3 rounded-lg border border-inkline bg-paper px-4 py-3">
        <Sparkles size={17} className="text-leaf" />
        <span className="font-paper text-[15px] text-ink/85">
          {typed}
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-leaf align-middle" />
        </span>
      </div>
      <div className="mt-3.5 space-y-2.5">
        {RESULTS.map(([title, meta, score], i) => (
          <div
            key={title}
            className="rounded-lg border border-inkline bg-white p-4"
            style={{
              opacity: show ? 1 : 0,
              transform: show ? 'none' : 'translateY(12px)',
              transition: `all .5s ease ${i * 140}ms`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-paper text-lg text-info">{title}</p>
                <p className="text-sm text-ink/50">{meta}</p>
              </div>
              <span className="font-mono flex items-center gap-1.5 whitespace-nowrap text-sm text-success">
                <Check size={14} /> {score}/10
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
