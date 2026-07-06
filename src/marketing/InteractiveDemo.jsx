import { useState, useEffect, useRef } from 'react';
import { Languages, ShieldCheck, GitCompare, Search, Sparkles, Check } from 'lucide-react';

const TABS = [
  { id: 'translate', label: 'Translate', icon: Languages },
  { id: 'score', label: 'Credibility', icon: ShieldCheck },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'search', label: 'Search', icon: Search },
];

export default function InteractiveDemo() {
  const [tab, setTab] = useState('translate');
  return (
    <div className="mx-auto max-w-5xl">
      {/* tab bar */}
      <div className="mx-auto mb-6 flex w-fit flex-wrap justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              tab === t.id ? 'bg-lime text-navy' : 'text-white/70 hover:text-white'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* window */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-danger/70" />
          <span className="h-3 w-3 rounded-full bg-warning/70" />
          <span className="h-3 w-3 rounded-full bg-success/70" />
          <span className="ml-3 truncate text-xs text-white/40">citrus.app / {tab}</span>
        </div>
        <div className="p-6 md:p-8">
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
    <div className="grid gap-6 md:grid-cols-[1fr_240px]">
      <div>
        <div className="text-lg font-medium text-white">Attention Is All You Need</div>
        <div className="mt-1 text-xs text-white/50">Vaswani et al. · 2017 · NeurIPS</div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-white">Methodology</span>
            <span className="rounded-md bg-lime/15 px-2 py-0.5 text-[11px] text-lime">{level}</span>
          </div>
          <p key={level} className="fade-up text-[15px] leading-relaxed text-white/80" style={{ animationDuration: '.4s' }}>
            {TEXT[level]}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">Reading level</p>
        <input
          type="range"
          min={0}
          max={3}
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          className="w-full accent-[var(--color-lime)]"
        />
        <div className="mt-3 space-y-1.5">
          {LEVELS.map((l, i) => (
            <button
              key={l}
              onClick={() => setIdx(i)}
              className={`block w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                i === idx ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/40">Drag to re-level any section instantly.</p>
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
  const final = 9.5;
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-lime/10 to-transparent p-6 text-center">
        <p className="text-xs uppercase tracking-wide text-white/40">Source credibility</p>
        <p className="mt-2 font-display text-6xl text-lime">{final}</p>
        <p className="text-white/40">out of 10</p>
        <span className="mt-3 rounded-full bg-lime/15 px-3 py-1 text-xs text-lime">Strong consensus</span>
      </div>
      <div className="space-y-4">
        {subs.map(([label, v], i) => (
          <div key={label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-white/80">{label}</span>
              <span className="text-lime">{v.toFixed(1)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime to-lime-bright transition-[width] duration-1000"
                style={{ width: animate ? `${(v / 10) * 100}%` : '0%', transitionDelay: `${i * 120}ms` }}
              />
            </div>
          </div>
        ))}
        <p className="pt-1 text-xs text-white/40">Every score is transparent and expandable — no black box.</p>
      </div>
    </div>
  );
}

// ---- Compare: two columns with agreement highlighting ----
function CompareDemo() {
  const rows = [
    { section: 'Hypothesis', agree: 'agree' },
    { section: 'Methodology', agree: 'partial' },
    { section: 'Results', agree: 'differ' },
  ];
  const tone = (a) => (a === 'agree' ? 'bg-success/15 border-success/30' : a === 'differ' ? 'bg-danger/15 border-danger/30' : 'bg-warning/15 border-warning/30');
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-3">
          <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/70">Paper A</span>
          <span className="text-white/30">vs</span>
          <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/70">Paper B</span>
        </div>
        <span className="rounded-full bg-info/20 px-3 py-1 text-xs text-info">Similarity 6.4/10</span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.section} className="grid grid-cols-[110px_1fr_1fr] gap-3">
            <div className="flex items-center font-display text-white/90">{r.section}</div>
            <div className={`rounded-xl border p-3 text-sm text-white/70 ${tone(r.agree)}`}>
              <div className="h-2 w-11/12 rounded bg-white/15" />
              <div className="mt-1.5 h-2 w-3/4 rounded bg-white/15" />
            </div>
            <div className={`rounded-xl border p-3 text-sm text-white/70 ${tone(r.agree)}`}>
              <div className="h-2 w-10/12 rounded bg-white/15" />
              <div className="mt-1.5 h-2 w-4/5 rounded bg-white/15" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-success/40" /> Agree</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-warning/40" /> Partial</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-danger/40" /> Differ</span>
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
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <Sparkles size={18} className="text-lime" />
        <span className="text-[15px] text-white/85">
          {typed}
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-lime align-middle" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {RESULTS.map(([title, meta, score], i) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all"
            style={{
              opacity: show ? 1 : 0,
              transform: show ? 'none' : 'translateY(12px)',
              transition: `all .5s ease ${i * 140}ms`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg text-info">{title}</p>
                <p className="text-sm text-white/50">{meta}</p>
              </div>
              <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-lime">
                <Check size={14} /> {score}/10
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
