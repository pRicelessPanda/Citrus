import { MapPin, ArrowRight, Sparkles, Heart, Rocket, Globe } from 'lucide-react';
import { Reveal, Eyebrow, GradientText, GlowBlob, MkButton } from '../mkui.jsx';

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
      <section className="relative overflow-hidden pt-36 pb-16 text-center">
        <GlowBlob className="-top-20 left-1/2 -translate-x-1/2" size={520} opacity={0.18} />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal><Eyebrow>Careers</Eyebrow></Reveal>
          <Reveal delay={60}><h1 className="mt-5 font-display text-5xl md:text-7xl">Help build the <GradientText>future of research</GradientText></h1></Reveal>
          <Reveal delay={120}><p className="mx-auto mt-6 max-w-xl text-lg text-white/65">We’re a small, senior team moving fast on a problem that matters. Come build with us.</p></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(([Icon, t, b], i) => (
            <Reveal key={t} delay={i * 60}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Icon size={22} className="text-lime" />
                <h3 className="mt-3 font-display text-lg">{t}</h3>
                <p className="mt-1.5 text-sm text-white/60">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal><h2 className="mb-6 font-display text-3xl">Open roles</h2></Reveal>
        <div className="space-y-3">
          {ROLES.map((r, i) => (
            <Reveal key={r[0]} delay={i * 40}>
              <a href="#" className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 transition-all hover:border-lime/40 hover:bg-white/[0.04]">
                <div>
                  <p className="font-medium transition-colors group-hover:text-lime">{r[0]}</p>
                  <p className="mt-1 flex items-center gap-3 text-sm text-white/50">
                    <span>{r[1]}</span>
                    <span className="flex items-center gap-1"><MapPin size={13} /> {r[2]}</span>
                  </p>
                </div>
                <ArrowRight size={18} className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-lime" />
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-white/50">
          Don’t see your role? <a href="/contact" className="text-lime hover:underline">Tell us why we need you →</a>
        </p>
      </section>
    </>
  );
}
