import { useNavigate } from 'react-router-dom';
import { GraduationCap, Microscope, Users2, Building2, ArrowRight, Check } from 'lucide-react';
import { Reveal, Eyebrow, GradientText, GlowBlob, MkButton } from '../mkui.jsx';
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
  const navigate = useNavigate();
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 text-center">
        <GlowBlob className="-top-20 left-1/2 -translate-x-1/2" size={520} opacity={0.18} />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal><Eyebrow>Solutions</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="mt-5 font-display text-5xl leading-tight md:text-7xl">Built for how <GradientText>you</GradientText> do research</h1>
          </Reveal>
          <Reveal delay={120}><p className="mx-auto mt-6 max-w-xl text-lg text-white/65">From a first-year student to a fifty-person lab — Citrus adapts to your workflow.</p></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-2">
          {PERSONAS.map((p, i) => (
            <Reveal key={p.who} delay={(i % 2) * 90}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:-translate-y-1 hover:border-lime/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/15 text-lime transition-colors group-hover:bg-lime group-hover:text-navy">
                  <p.icon size={24} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-lime">{p.who}</p>
                <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
                <p className="mt-3 text-white/60">{p.body}</p>
                <ul className="mt-5 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-white/75"><Check size={15} className="text-lime" /> {pt}</li>
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
