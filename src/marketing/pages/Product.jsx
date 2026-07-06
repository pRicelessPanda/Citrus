import { useNavigate } from 'react-router-dom';
import {
  Languages, ShieldCheck, GitCompare, FolderKanban, PenLine,
  ArrowRight, Check,
} from 'lucide-react';
import { Reveal, Eyebrow, Highlight, SectionHeading, Figure, MkButton } from '../mkui.jsx';
import InteractiveDemo from '../InteractiveDemo.jsx';
import { CTASection } from './Home.jsx';

const SECTIONS = [
  {
    icon: Languages,
    n: '1',
    eyebrow: 'Understand',
    title: 'Every paper, in plain language',
    body: 'Paste a link or upload a PDF and Citrus returns a sectioned explainer — Background, Methodology, Results, and more — written at the reading level you choose. Highlight any sentence to ask a question with full paper context.',
    points: ['Four reading levels, per section', 'Highlight-to-ask with source citations', 'One-click APA / MLA / Chicago / BibTeX export'],
    mock: <MockTranslate />,
  },
  {
    icon: ShieldCheck,
    n: '2',
    eyebrow: 'Evaluate',
    title: 'Credibility you can defend',
    body: 'Every source gets a transparent 0–10 score built from currency, journal quality, author credentials, and accuracy — each expandable so you always know why. Inside projects, a fifth Relevance subscore ranks sources against your hypothesis.',
    points: ['Predatory-journal & retraction checks', 'Evidence-strength rating (1–4)', 'Relevance scoring inside projects'],
    mock: <MockScore />,
    flip: true,
  },
  {
    icon: GitCompare,
    n: '3',
    eyebrow: 'Compare',
    title: 'Two papers, side by side',
    body: 'Compare any two papers section-by-section on their raw academic text. Agreement is highlighted green, disagreement red, and a similarity score summarizes the overlap — with an AI chat scoped to both papers.',
    points: ['Auto-identified sections', 'Agreement highlighting', 'Side-by-side credibility'],
    mock: <MockCompare />,
  },
  {
    icon: FolderKanban,
    n: '4',
    eyebrow: 'Organize',
    title: 'Run your whole research program',
    body: 'Projects are AI-assisted workspaces: generate a project overview, get credibility-ranked suggested papers, keep references with timestamps, and chat with an assistant that has full context of everything inside.',
    points: ['AI idea generation & literature review', 'Credibility-ranked suggestions', 'Shared workspace with collaborators'],
    mock: <MockProject />,
    flip: true,
  },
  {
    icon: PenLine,
    n: '5',
    eyebrow: 'Write',
    title: 'Draft papers from your sources',
    body: 'Select sources per section and Citrus writes each one with automatic in-text citations, clickable references, and flags on any sentence that needs a citation. Collaborate in real time with regular and AI channels.',
    points: ['Automatic in-text citations', 'Citation-needed flagging', 'APA / IEEE / Nature writing styles'],
    mock: <MockWrite />,
  },
];

export default function Product() {
  const navigate = useNavigate();
  return (
    <>
      <section className="relative pt-32 pb-12 text-center">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal><Eyebrow>The product</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="font-paper mt-5 text-5xl leading-[1.12] text-ink md:text-6xl">
              One workspace for <Highlight>the entire research lifecycle</Highlight>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-paper mx-auto mt-6 max-w-xl text-lg italic text-ink/60">
              Understand, evaluate, compare, organize, and write — without leaving Citrus.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="font-sans mt-8 flex justify-center gap-3">
              <MkButton size="lg" variant="dark" onClick={() => navigate('/dashboard')}>
                Launch Citrus <ArrowRight size={18} />
              </MkButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-10">
        <Reveal>
          <Figure n={1} caption="The four core instruments, live." className="mx-auto max-w-5xl">
            <InteractiveDemo />
          </Figure>
        </Reveal>
      </section>

      {/* deep-dive alternating sections */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {SECTIONS.map((s) => (
          <div key={s.title} className={`grid items-center gap-12 border-t border-inkline py-16 md:grid-cols-2 ${s.flip ? 'md:[direction:rtl]' : ''}`}>
            <Reveal className="md:[direction:ltr]">
              <Eyebrow><s.icon size={13} /> {s.n} · {s.eyebrow}</Eyebrow>
              <h2 className="font-paper mt-4 text-4xl leading-tight text-ink">{s.title}</h2>
              <p className="font-paper mt-4 text-[16px] leading-relaxed text-ink/70">{s.body}</p>
              <ul className="font-sans mt-6 space-y-3">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-ink/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-bright/30 text-success"><Check size={13} /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100} className="md:[direction:ltr]">
              <div className="font-sans rounded-xl border border-inkline bg-white p-6 shadow-[0_1px_0_rgba(13,27,42,0.05)]">{s.mock}</div>
            </Reveal>
          </div>
        ))}
      </div>

      <CTASection />
    </>
  );
}

/* ---- lightweight mocks, paper-styled ---- */
function MockTranslate() {
  return (
    <div>
      <div className="font-paper text-base text-ink">Attention Is All You Need</div>
      <div className="mt-1 text-xs text-ink/50">Vaswani et al. · 2017</div>
      {['Background', 'Methodology'].map((s) => (
        <div key={s} className="mt-3 rounded-lg border border-inkline bg-paper p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-paper text-ink">{s}</span>
            <span className="font-mono rounded bg-lime-bright/25 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink/70">Curious Adult</span>
          </div>
          <div className="space-y-1.5"><div className="h-2 rounded bg-ink/10" /><div className="h-2 w-4/5 rounded bg-ink/10" /></div>
        </div>
      ))}
    </div>
  );
}
function MockScore() {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-4">
      <div className="flex flex-col items-center justify-center rounded-lg border border-inkline bg-paper p-3">
        <span className="font-paper text-4xl text-success">9.5</span><span className="text-xs text-ink/40">/10</span>
      </div>
      <div className="space-y-2.5">
        {[['Currency', 94], ['Journal', 98], ['Authors', 96], ['Accuracy', 92]].map(([l, w]) => (
          <div key={l}>
            <div className="mb-1 flex justify-between text-xs text-ink/60"><span>{l}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-ink/8"><div className="h-full rounded-full bg-success" style={{ width: `${w}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function MockCompare() {
  const tones = [
    'border-success/40 bg-success-light/60',
    'border-warning/40 bg-warning-light/60',
    'border-danger/40 bg-danger-light/60',
  ];
  return (
    <div className="space-y-2">
      {tones.map((tone, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <div className={`rounded-lg border p-2.5 ${tone}`}><div className="h-2 w-4/5 rounded bg-ink/15" /></div>
          <div className={`rounded-lg border p-2.5 ${tone}`}><div className="h-2 w-3/4 rounded bg-ink/15" /></div>
        </div>
      ))}
    </div>
  );
}
function MockProject() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-inkline bg-paper p-2.5"><span className="h-3 w-3 rounded-full bg-lime-bright" /><span className="font-paper text-sm text-ink">Attention in low-resource NLP</span></div>
      {['Attention Is All You Need · 9.5', 'Cross-lingual Transfer · 8.1'].map((r) => (
        <div key={r} className="rounded-lg border border-inkline bg-white p-2.5 text-sm text-info">{r}</div>
      ))}
    </div>
  );
}
function MockWrite() {
  return (
    <div className="rounded-lg border border-inkline bg-paper p-4">
      <div className="font-paper text-lg text-ink">Introduction</div>
      <p className="font-paper mt-2 text-sm leading-relaxed text-ink/75">
        Transformer models have reshaped NLP <span className="text-info">[1]</span>. Recent work extends them to low-resource settings <span className="text-info">[2]</span>,
        <span className="rounded bg-warning-light px-1 text-warning"> though prevalence figures remain uncited.</span>
      </p>
    </div>
  );
}
