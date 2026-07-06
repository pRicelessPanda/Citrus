import { GraduationCap, Microscope, Users2, Building2, Check } from 'lucide-react';
import { Reveal, Eyebrow, Highlight } from '../mkui.jsx';
import { CTASection } from './Home.jsx';

const PERSONAS = [
  {
    icon: GraduationCap,
    who: 'Students',
    title: 'Get through the reading list — faster',
    body: 'Translate dense assignments into plain language, judge sources with transparent credibility scores, and organize everything for your thesis.',
    points: ['Plain-language explainers', 'Cite in one click', 'Bookmark & organize'],
  },
  {
    icon: Microscope,
    who: 'Principal investigators',
    title: 'Run a literature review end to end',
    body: 'Generate a project overview, pull credibility-ranked papers, and let the assistant draft sections from exactly the sources you choose.',
    points: ['AI-assisted lit review', 'Credibility with relevance', 'Draft with real citations'],
  },
  {
    icon: Users2,
    who: 'Research teams',
    title: 'Collaborate without the chaos',
    body: 'Shared projects, regular and AI channels, per-member calendars, and one unified history so the whole team stays in sync.',
    points: ['Shared workspaces', 'AI + team channels', 'Role-based access'],
  },
  {
    icon: Building2,
    who: 'Industry R&D',
    title: 'Monitor a fast-moving field',
    body: 'Living projects watch the literature and send weekly digests, so your team never misses a paper that changes the picture.',
    points: ['Living-project monitoring', 'Weekly digests & alerts', 'Export proposals'],
  },
];

export default function Solutions() {
  return (
    <>
      <section className="relative pt-32 pb-14 text-center">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal><Eyebrow>Solutions</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="font-paper mt-5 text-5xl leading-[1.12] text-ink md:text-6xl">
              Built for how <Highlight>you</Highlight> do research
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-paper mx-auto mt-6 max-w-xl text-lg italic text-ink/60">
              From a first-year student to a fifty-person lab — Citrus adapts to your workflow.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-2">
          {PERSONAS.map((p, i) => (
            <Reveal key={p.who} delay={(i % 2) * 90}>
              <div className="group h-full rounded-xl border border-inkline bg-white p-8 transition-all hover:-translate-y-0.5 hover:border-leaf/50">
                <div className="flex items-center justify-between">
                  <p.icon size={24} className="text-leaf" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/35">Case {i + 1}</span>
                </div>
                <p className="font-mono mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-leaf">{p.who}</p>
                <h3 className="font-paper mt-2 text-2xl text-ink">{p.title}</h3>
                <p className="font-paper mt-3 text-[16px] leading-relaxed text-ink/65">{p.body}</p>
                <ul className="font-sans mt-5 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-ink/75"><Check size={15} className="text-success" /> {pt}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
