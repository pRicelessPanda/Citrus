import { MapPin, ArrowRight, Sparkles, Heart, Rocket, Globe } from 'lucide-react';
import { Reveal, Eyebrow, Highlight } from '../mkui.jsx';

const ROLES = [
  ['Senior ML Engineer', 'Engineering', 'Remote · Global'],
  ['Product Designer', 'Design', 'Remote · EU'],
  ['Research Scientist, NLP', 'Research', 'London / Remote'],
  ['Founding Account Executive', 'Go-to-market', 'Remote · US'],
  ['Full-stack Engineer', 'Engineering', 'Remote · Global'],
  ['Developer Advocate', 'Community', 'Remote · Global'],
];

const PERKS = [
  [Globe, 'Remote-first', 'Work from anywhere. We index on output, not hours.'],
  [Heart, 'Real ownership', 'Meaningful equity and autonomy from day one.'],
  [Rocket, 'Grow fast', 'A generous learning budget and room to lead.'],
  [Sparkles, 'Mission that matters', 'Help the world understand its own research.'],
];

export default function Careers() {
  return (
    <>
      <section className="relative pt-32 pb-14 text-center">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal><Eyebrow>Careers</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="font-paper mt-5 text-5xl leading-[1.12] text-ink md:text-6xl">
              Help build the <Highlight>future of research</Highlight>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-paper mx-auto mt-6 max-w-xl text-lg italic text-ink/60">
              We’re a small, senior team moving fast on a problem that matters. Come build with us.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(([Icon, t, b], i) => (
            <Reveal key={t} delay={i * 60}>
              <div className="h-full rounded-xl border border-inkline bg-white p-6">
                <Icon size={21} className="text-leaf" />
                <h3 className="font-paper mt-3 text-lg text-ink">{t}</h3>
                <p className="font-paper mt-1.5 text-sm leading-relaxed text-ink/60">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-12">
        <Reveal><h2 className="font-paper mb-6 text-3xl text-ink">Open roles</h2></Reveal>
        <div className="space-y-3">
          {ROLES.map((r, i) => (
            <Reveal key={r[0]} delay={i * 40}>
              <a href="#" className="group flex items-center justify-between gap-4 rounded-xl border border-inkline bg-white px-6 py-5 transition-all hover:border-leaf/50">
                <div>
                  <p className="font-paper text-lg text-ink transition-colors group-hover:text-leaf">{r[0]}</p>
                  <p className="font-mono mt-1 flex items-center gap-3 text-[10px] uppercase tracking-wider text-ink/45">
                    <span>{r[1]}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {r[2]}</span>
                  </p>
                </div>
                <ArrowRight size={18} className="text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-leaf" />
              </a>
            </Reveal>
          ))}
        </div>
        <p className="font-sans mt-8 text-center text-sm text-ink/55">
          Don’t see your role? <a href="/contact" className="text-leaf underline decoration-lime-bright/60 underline-offset-2 hover:text-ink">Tell us why we need you →</a>
        </p>
      </section>
    </>
  );
}
