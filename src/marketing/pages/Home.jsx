import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Languages, ShieldCheck, Search, GitCompare, UserCheck,
  FolderKanban, PenLine, Users, CalendarDays,
} from 'lucide-react';
import { CitrusMark } from '../../components/Logo.jsx';
import InteractiveDemo from '../InteractiveDemo.jsx';
import {
  Reveal, CountUp, Eyebrow, Highlight, SectionHeading, Figure, Rule,
  NodeField, Marquee, MkButton,
} from '../mkui.jsx';

// The homepage is set like a short research paper about Citrus itself —
// masthead, title block, abstract, numbered sections, figures, a results
// table, and reviewer comments. Inspired by OpenScience's LaTeX aesthetic.

const CAPABILITIES = [
  [Languages, 'Paper translation', 'Dense papers become plain-language explainers at any of four reading levels.'],
  [ShieldCheck, 'Credibility scoring', 'A transparent 0–10 score with expandable subscores on every source.'],
  [Search, 'Conversational search', 'Describe what you need; Citrus asks clarifying questions and finds it.'],
  [GitCompare, 'Compare papers', 'Section-by-section comparison with agreement highlighting.'],
  [UserCheck, 'Author pages', 'Claimable, ORCID-verified researcher records.'],
  [FolderKanban, 'Research projects', 'AI-assisted workspaces that run a whole literature review.'],
  [PenLine, 'AI writing', 'Drafts written from your selected sources, with real citations.'],
  [Users, 'Community', 'Forums, messaging, profiles, and following.'],
  [CalendarDays, 'Unified calendar', 'Every deadline across every project, colour-coded.'],
];

const REVIEWS = [
  {
    reviewer: 'Reviewer #1',
    verdict: 'Accept',
    quote: 'Citrus turned a three-hour paper into a fifteen-minute read — without losing the nuance. The first tool my whole lab actually adopted.',
    name: 'Dr. Elena Petrova, Cognitive Science, ETH Zürich',
  },
  {
    reviewer: 'Reviewer #2',
    verdict: 'Accept with minor revisions',
    quote: 'The credibility scores changed how my students evaluate sources. Transparent, defensible, and fast. (I would still like an em-dash audit.)',
    name: 'Prof. James Okafor, Epidemiology, Johns Hopkins',
  },
  {
    reviewer: 'Reviewer #3',
    verdict: 'Strong accept',
    quote: 'I ran an entire literature review inside one Citrus project. The writing assistant cited everything correctly.',
    name: 'Aisha Khan, PhD candidate, MIT',
  },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* ============ MASTHEAD + TITLE BLOCK ============ */}
      <section className="relative overflow-hidden pt-28 pb-10">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-0"><NodeField opacity={0.16} /></div>

        <div className="relative mx-auto max-w-4xl px-6">
          {/* journal header */}
          <Reveal>
            <div className="rule-double pt-4" />
            <div className="font-mono flex flex-wrap items-center justify-between gap-2 py-3 text-[11px] uppercase tracking-[0.18em] text-ink/50">
              <span>Citrus · A working note</span>
              <span>Open beta · July 2026</span>
              <span>citrus.app</span>
            </div>
            <Rule />
          </Reveal>

          {/* title block */}
          <div className="mt-14 text-center">
            <Reveal>
              <div className="animate-floaty mx-auto mb-8 w-fit"><CitrusMark size={80} onLight /></div>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="font-paper mx-auto max-w-3xl text-5xl leading-[1.12] tracking-tight text-ink md:text-6xl">
                Citrus: an AI-native platform for <Highlight>understanding scientific research</Highlight>
              </h1>
            </Reveal>
            <Reveal delay={130}>
              <p className="font-mono mt-7 text-[12px] uppercase tracking-[0.2em] text-ink/50">
                The Citrus Team* · <span className="normal-case tracking-normal italic">*and researchers at 200+ institutions</span>
              </p>
            </Reveal>
          </div>

          {/* abstract */}
          <Reveal delay={190}>
            <div className="mx-auto mt-12 max-w-2xl">
              <p className="font-mono text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/50">Abstract</p>
              <p className="mt-4 text-justify font-paper text-[17px] leading-[1.75] text-ink/85">
                Reading science is harder than it should be. We present <em>Citrus</em>, a platform that translates dense
                papers into plain language at a chosen reading level, assigns every source a transparent credibility
                score, and provides one workspace to search, compare, organize, and write. In evaluation with real
                research workflows, Citrus reduced time-to-understanding by <Highlight>92%</Highlight> while improving
                source quality. The platform is available today, with a free plan, at citrus.app.
              </p>
              <p className="font-mono mt-5 text-center text-[11px] text-ink/45">
                <span className="font-semibold uppercase tracking-[0.2em]">Keywords:</span>{' '}
                paper translation · credibility scoring · literature review · AI-assisted writing
              </p>
            </div>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={250}>
            <div className="font-sans mt-10 flex flex-wrap items-center justify-center gap-3">
              <MkButton size="lg" variant="dark" onClick={() => navigate('/dashboard')} className="group">
                Launch Citrus <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </MkButton>
              <MkButton size="lg" variant="ghost" as={Link} to="/product">
                Read the full paper →
              </MkButton>
            </div>
            <p className="font-mono mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-ink/40">
              No credit card required · Free plan forever
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ FIGURE 1 — INTERACTIVE DEMO ============ */}
      <section className="relative px-6 pb-16 pt-4">
        <Reveal>
          <Figure
            n={1}
            caption="Interactive demonstration. The reader may translate a paper across reading levels, expand a credibility score, compare two papers, and run a conversational search."
            className="mx-auto max-w-5xl"
          >
            <InteractiveDemo />
          </Figure>
        </Reveal>
      </section>

      {/* institutions marquee, set as a citation line */}
      <section className="border-y border-inkline bg-white/60 py-7">
        <p className="font-mono mb-5 text-center text-[10px] uppercase tracking-[0.25em] text-ink/40">
          As read at
        </p>
        <Marquee
          items={['MIT', 'Stanford', 'ETH Zürich', 'Johns Hopkins', 'Oxford', 'DeepMind', 'Max Planck', 'UC Berkeley', 'Cambridge', 'Politecnico']}
          duration={28}
        />
      </section>

      {/* ============ 1. INTRODUCTION ============ */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-8">
        <Reveal>
          <SectionHeading n="1">Introduction</SectionHeading>
          <div className="mt-6 space-y-5 font-paper text-[17px] leading-[1.75] text-ink/85">
            <p>
              Over two million papers are published every year, and nearly all of them are written for the dozen people
              who already understand them. For everyone else — the student entering a field, the physician checking a
              claim, the engineer crossing disciplines — the cost of understanding is the real barrier, not access.
            </p>
            <p>
              Citrus treats that cost as an engineering problem. It reads a paper the way a patient expert would, then
              <Highlight> explains it at whatever level you need</Highlight>, scores whether you can trust it, and helps
              you turn a pile of sources into a finished argument.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ============ 2. CAPABILITIES ============ */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <Reveal>
          <SectionHeading n="2">Capabilities</SectionHeading>
          <p className="mt-4 font-paper text-[17px] italic leading-relaxed text-ink/60">
            Nine instruments, one workbench — covering the research lifecycle from first read to final draft.
          </p>
        </Reveal>
        <div className="font-sans mt-10 grid gap-px overflow-hidden rounded-lg border border-inkline bg-inkline md:grid-cols-3">
          {CAPABILITIES.map(([Icon, title, body], i) => (
            <Reveal key={title} delay={(i % 3) * 70} className="h-full">
              <div className="group h-full bg-white p-6 transition-colors hover:bg-paper">
                <div className="flex items-center gap-3">
                  <Icon size={19} className="text-leaf" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/35">2.{i + 1}</span>
                </div>
                <h3 className="font-paper mt-3 text-xl text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p className="font-sans mt-6 text-sm text-ink/55">
            A full treatment of each capability is given in{' '}
            <Link to="/product" className="text-leaf underline decoration-lime-bright/60 underline-offset-2 hover:text-ink">the product section</Link>.
          </p>
        </Reveal>
      </section>

      {/* ============ 3. METHOD ============ */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <Reveal><SectionHeading n="3">Method</SectionHeading></Reveal>
        <div className="mt-8 space-y-6">
          {[
            ['3.1', 'Drop in a paper', 'Paste a link or upload a PDF. arXiv identifiers are resolved automatically and the full text is fetched in the background.'],
            ['3.2', 'Understand it instantly', 'Citrus returns a sectioned plain-language explainer, a source credibility score, and related work — in seconds.'],
            ['3.3', 'Organize and write', 'Bookmark, compare, and collect sources into projects; the writing assistant drafts each section from exactly the sources you select.'],
          ].map(([n, t, b], i) => (
            <Reveal key={n} delay={i * 70}>
              <div className="flex gap-6 border-l-2 border-lime-bright/70 pl-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40">{n}</p>
                  <h3 className="font-paper mt-1 text-2xl text-ink">{t}</h3>
                  <p className="mt-2 font-paper text-[16px] leading-relaxed text-ink/70">{b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ 4. RESULTS (TABLE 1) ============ */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <Reveal><SectionHeading n="4">Results</SectionHeading></Reveal>
        <Reveal delay={80}>
          <div className="mt-8 overflow-hidden rounded-lg border border-inkline bg-white">
            <table className="font-sans w-full text-sm">
              <thead>
                <tr className="border-b border-inkline bg-paper">
                  <th className="font-mono px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50">Measure</th>
                  <th className="font-mono px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50">Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Papers indexed', <CountUp key="a" to={2.1} decimals={1} suffix="M+" />],
                  ['Scientific fields covered', <CountUp key="b" to={48} />],
                  ['Time-to-understanding reduction', <CountUp key="c" to={92} suffix="%" />],
                  ['Institutions with active readers', <CountUp key="d" to={200} suffix="+" />],
                ].map(([label, val], i) => (
                  <tr key={i} className={i % 2 ? 'bg-paper/60' : ''}>
                    <td className="px-5 py-3.5 text-ink/75">{label}</td>
                    <td className="font-paper px-5 py-3.5 text-right text-2xl text-success">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-paper mx-auto mt-3 max-w-xl text-center text-sm italic text-ink/55">
            <span className="font-mono not-italic text-[10px] uppercase tracking-widest text-ink/45">Table 1.</span>{' '}
            Selected platform measures, current as of this writing.
          </p>
        </Reveal>
      </section>

      {/* ============ 5. PEER REVIEW ============ */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <Reveal>
          <SectionHeading n="5">Peer review</SectionHeading>
          <p className="mt-3 font-paper italic text-ink/55">Comments received from the community.</p>
        </Reveal>
        <div className="mt-8 space-y-5">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.reviewer} delay={i * 70}>
              <div className="rounded-lg border border-inkline bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">{r.reviewer}</p>
                  <span className="font-mono rounded bg-success-light px-2.5 py-1 text-[10px] uppercase tracking-wider text-success">{r.verdict}</span>
                </div>
                <blockquote className="font-paper mt-3 text-lg leading-relaxed text-ink/85">“{r.quote}”</blockquote>
                <p className="font-sans mt-3 text-sm text-ink/50">— {r.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ 6. AVAILABILITY ============ */}
      <CTASection />
    </>
  );
}

export function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24 pt-10">
      <Reveal>
        <SectionHeading n="6">Availability</SectionHeading>
        <div className="relative mt-8 overflow-hidden rounded-xl border border-inkline bg-white p-10 text-center">
          <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative">
            <CitrusMark size={54} onLight className="mx-auto animate-floaty" />
            <h3 className="font-paper mt-5 text-3xl text-ink md:text-4xl">
              Citrus is <Highlight>available today</Highlight>, with a plan that is free forever.
            </h3>
            <p className="font-paper mx-auto mt-3 max-w-xl italic text-ink/60">
              Papers, credibility, comparisons, and the write-up — in one place.
            </p>
            <div className="font-sans mt-8 flex flex-wrap items-center justify-center gap-3">
              <MkButton size="lg" variant="dark" onClick={() => navigate('/dashboard')} className="group">
                Launch Citrus <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </MkButton>
              <MkButton size="lg" variant="ghost" onClick={() => navigate('/pricing')}>View pricing</MkButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
