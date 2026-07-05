import { Link, useNavigate } from 'react-router-dom';
import {
  Languages,
  ShieldCheck,
  Search,
  GitCompare,
  UserCheck,
  FolderKanban,
  PenLine,
  Users,
  CalendarDays,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { CitrusMark } from '../components/Logo.jsx';

const PILLARS = [
  { icon: Languages, title: 'Paper translation', body: 'Turn dense academic papers into plain-language explainers at any reading level — high school to field expert.' },
  { icon: ShieldCheck, title: 'Credibility scoring', body: 'Every source gets a transparent 0–10 score with subscores for currency, journal, authors, and accuracy.' },
  { icon: Search, title: 'Conversational search', body: 'Describe what you need in plain English. Citrus asks clarifying questions and finds the papers that matter.' },
  { icon: GitCompare, title: 'Compare papers', body: 'Side-by-side, section-by-section — with agreement highlighting and a similarity score.' },
  { icon: UserCheck, title: 'Author pages', body: 'Google-Scholar-style records researchers can claim and verify with ORCID.' },
  { icon: FolderKanban, title: 'Research projects', body: 'AI-assisted workspaces to run a literature review and drive a whole research program.' },
  { icon: PenLine, title: 'Research writing', body: 'Draft academic papers from your sources, with automatic in-text citations and reference lists.' },
  { icon: Users, title: 'Community', body: 'Forums, messaging, profiles, and following — research is better together.' },
  { icon: CalendarDays, title: 'Unified calendar', body: 'Every deadline across every project and paper, colour-coded and in one place.' },
];

const STEPS = [
  { n: '01', title: 'Drop in a paper', body: 'Paste a link or upload a PDF. arXiv IDs are auto-resolved and the full text is fetched in the background.' },
  { n: '02', title: 'Understand it instantly', body: 'Get a sectioned plain-language explainer, a source credibility score, and related work — in seconds.' },
  { n: '03', title: 'Organize & write', body: 'Bookmark, compare, add to projects, and let Citrus help you write the paper from your chosen sources.' },
];

const TIERS = [
  { name: 'Free', price: '$0', tagline: 'For getting started', features: ['Paper translation', 'Credibility scores', 'Search & discovery', 'Bookmarks & libraries'], cta: 'Get started', highlight: false },
  { name: 'Pro', price: '$19', tagline: 'For active researchers', features: ['Everything in Free', 'Research projects & papers', 'Compare & AI writing', 'Author page claiming'], cta: 'Start Pro', highlight: true },
  { name: 'Plus', price: '$39', tagline: 'For research teams', features: ['Everything in Pro', 'Shared projects & channels', 'Living-project monitoring', 'Priority AI'], cta: 'Start Plus', highlight: false },
];

export default function Landing() {
  const navigate = useNavigate();
  const enter = () => navigate('/dashboard');

  return (
    <div className="min-h-screen bg-navy text-white">
      {/* ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-lime/20 blur-[120px] animate-glow" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-info/20 blur-[120px]" />
        <NodeField />
      </div>

      {/* nav */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <CitrusMark size={38} />
            <span className="font-display text-2xl">Citrus</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/login')} className="cursor-pointer rounded-lg px-4 py-2 text-sm text-white/80 hover:text-white">
              Sign in
            </button>
            <button onClick={enter} className="cursor-pointer rounded-lg bg-lime px-4 py-2 text-sm font-medium text-navy hover:brightness-95">
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 text-center">
        <div className="fade-up" style={{ animationDelay: '0ms' }}>
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/70">
            <Sparkles size={14} className="text-lime" /> The AI-native research platform
          </div>
        </div>
        <div className="animate-floaty mx-auto mb-2 w-fit">
          <CitrusMark size={92} />
        </div>
        <h1 className="fade-up font-display text-6xl leading-[1.05] tracking-tight md:text-7xl" style={{ animationDelay: '80ms' }}>
          Understand any paper.
          <br />
          <span className="bg-gradient-to-r from-lime via-lime-bright to-lime bg-clip-text text-transparent">Command your research.</span>
        </h1>
        <p className="fade-up mx-auto mt-6 max-w-2xl text-lg text-white/70" style={{ animationDelay: '160ms' }}>
          Citrus translates dense science into plain language, scores every source for credibility, and gives you one
          AI-assisted workspace to discover, compare, organize, and write.
        </p>
        <div className="fade-up mt-9 flex items-center justify-center gap-3" style={{ animationDelay: '240ms' }}>
          <button onClick={enter} className="group flex cursor-pointer items-center gap-2 rounded-xl bg-lime px-6 py-3.5 text-base font-medium text-navy shadow-lg shadow-lime/20 hover:brightness-95">
            Get started free
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <button onClick={() => navigate('/login')} className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base text-white hover:bg-white/10">
            Sign in
          </button>
        </div>
        <p className="fade-up mt-4 text-xs text-white/40" style={{ animationDelay: '300ms' }}>
          No credit card required · Free plan forever
        </p>

        {/* product mock */}
        <div className="fade-up mt-16" style={{ animationDelay: '360ms' }}>
          <ProductMock />
        </div>
      </section>

      {/* stat strip */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 text-center md:grid-cols-4">
          {[
            ['0–10', 'Credibility score on every paper'],
            ['4', 'Reading levels, per section'],
            ['1', 'Workspace for your whole program'],
            ['48', 'Fields across the sciences'],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-4xl text-lime">{n}</p>
              <p className="mt-1 text-sm text-white/60">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-lime">Everything in one place</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Nine tools. One research OS.</h2>
          <p className="mt-4 text-white/60">From first read to final draft, Citrus covers the entire research lifecycle.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PILLARS.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-lime/40 hover:bg-white/[0.05]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/15 text-lime transition-colors group-hover:bg-lime group-hover:text-navy">
                <f.icon size={22} />
              </div>
              <h3 className="mt-4 font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="relative z-10 border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-lime">How it works</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">From paper to published</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="font-display text-5xl text-lime/30">{s.n}</div>
                <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-white/60">{s.body}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-6 hidden text-white/20 md:block" size={22} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-lime">Pricing</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Start free. Upgrade when you're ready.</h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-7 ${
                t.highlight
                  ? 'border-lime/50 bg-lime/[0.06] shadow-xl shadow-lime/10'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-navy">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-2xl">{t.name}</h3>
              <p className="text-sm text-white/50">{t.tagline}</p>
              <p className="mt-4 font-display text-5xl">
                {t.price}
                <span className="text-lg text-white/50">/mo</span>
              </p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/75">
                    <Check size={16} className="text-lime" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={enter}
                className={`mt-7 w-full cursor-pointer rounded-xl px-4 py-3 text-sm font-medium ${
                  t.highlight ? 'bg-lime text-navy hover:brightness-95' : 'border border-white/15 text-white hover:bg-white/10'
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* final CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-lime/20 bg-gradient-to-br from-lime/10 to-info/10 px-8 py-16 text-center">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lime/20 blur-[100px]" />
          <div className="relative">
            <CitrusMark size={56} className="mx-auto" />
            <h2 className="mt-5 font-display text-4xl md:text-5xl">Ready to read smarter?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Join researchers using Citrus to understand, discover, and write science faster.
            </p>
            <button onClick={enter} className="mt-8 cursor-pointer rounded-xl bg-lime px-8 py-3.5 text-base font-medium text-navy shadow-lg shadow-lime/20 hover:brightness-95">
              Get started free
            </button>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <CitrusMark size={32} />
              <span className="font-display text-xl">Citrus</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/50">
              The AI-native scientific research platform.
            </p>
          </div>
          <FooterCol title="Product" links={['Features', 'Pricing', 'Search', 'Compare']} />
          <FooterCol title="Research" links={['Projects', 'Papers', 'Authors', 'Calendar']} />
          <FooterCol title="Company" links={['About', 'Blog', 'Privacy', 'Terms']} />
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Citrus. Built for researchers.
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-white/50">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-white">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Faux product window showing a mini translated-paper UI — pure CSS, on-brand.
function ProductMock() {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-danger/70" />
        <span className="h-3 w-3 rounded-full bg-warning/70" />
        <span className="h-3 w-3 rounded-full bg-success/70" />
        <span className="ml-3 text-xs text-white/40">citrus.app/paper/attention-is-all-you-need</span>
      </div>
      <div className="grid grid-cols-[1fr_260px] gap-4 p-5 text-left">
        <div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-lg font-medium text-white">Attention Is All You Need</div>
            <div className="mt-1 text-xs text-white/50">Vaswani et al. · 2017 · NeurIPS</div>
          </div>
          {['Background', 'Methodology', 'Results'].map((s, i) => (
            <div key={s} className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-white">{s}</span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-white/60">Curious Adult</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 rounded bg-white/10" />
                <div className="h-2 w-11/12 rounded bg-white/10" />
                <div className="h-2 w-4/5 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-[10px] uppercase tracking-wide text-white/40">Source credibility</div>
            <div className="mt-1 font-display text-3xl text-lime">9.5<span className="text-base text-white/40">/10</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[95%] rounded-full bg-lime" />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-2 text-xs font-medium text-white/70">Related papers</div>
            {['AlphaFold', 'BERT', 'GPT-3'].map((r) => (
              <div key={r} className="py-1 text-sm text-info">{r}</div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-medium text-navy">
            <Sparkles size={14} /> Ask AI
          </div>
        </div>
      </div>
    </div>
  );
}

// Subtle animated constellation behind the hero.
function NodeField() {
  const nodes = [
    [12, 20], [22, 55], [8, 78], [34, 30], [30, 72],
    [70, 18], [82, 44], [66, 60], [90, 72], [78, 85], [50, 15], [55, 88],
  ];
  const links = [
    [0, 3], [1, 3], [1, 4], [2, 4], [3, 10],
    [5, 6], [6, 7], [7, 8], [8, 9], [6, 10], [7, 11],
  ];
  return (
    <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
      <g stroke="#5DCAA5" strokeWidth="0.12" opacity="0.5">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.5" fill="#8ED630" style={{ animation: `nodePulse ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite` }} />
      ))}
    </svg>
  );
}
