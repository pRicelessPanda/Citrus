import { Target, Heart, Zap, Globe } from 'lucide-react';
import { Reveal, Eyebrow, GradientText, GlowBlob, CountUp, NodeField } from '../mkui.jsx';
import { CitrusMark } from '../../components/Logo.jsx';
import { CTASection } from './Home.jsx';

const VALUES = [
  { icon: Target, title: 'Clarity over jargon', body: 'Knowledge that can’t be understood can’t be used. We make science legible.' },
  { icon: Heart, title: 'Trust by transparency', body: 'Every score and citation shows its work. No black boxes.' },
  { icon: Zap, title: 'Speed with rigor', body: 'Faster research shouldn’t mean sloppier research. We refuse the trade-off.' },
  { icon: Globe, title: 'Open by default', body: 'We favor open access, open standards, and interoperable data.' },
];

const TEAM = [
  ['Ada Mensah', 'Co-founder & CEO'],
  ['Rahul Iyer', 'Co-founder & CTO'],
  ['Sofia Almeida', 'Head of Research'],
  ['Kenji Watanabe', 'Head of Design'],
  ['Lena Fischer', 'ML Lead'],
  ['Diego Torres', 'Product'],
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 text-center">
        <GlowBlob className="-top-24 left-1/2 -translate-x-1/2" size={560} opacity={0.18} />
        <div className="pointer-events-none absolute inset-0"><NodeField opacity={0.25} /></div>
        <div className="relative mx-auto max-w-3xl px-6">
          <div className="animate-floaty mx-auto mb-6 w-fit"><CitrusMark size={72} /></div>
          <Reveal><Eyebrow>Our mission</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="mt-5 font-display text-4xl leading-[1.1] md:text-6xl">
              We’re making the world’s research <GradientText>understandable to everyone</GradientText>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/65">
              Millions of papers are published every year, yet most are locked behind dense prose and paywalled context.
              Citrus exists to close that gap — turning the frontier of human knowledge into something any curious mind can grasp.
            </p>
          </Reveal>
        </div>
      </section>

      {/* story */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-white/70">
            <p>Citrus started in a lab, at 2 a.m., with a stack of forty papers and a deadline. We kept asking the same question: <span className="text-white">why is understanding research so much harder than it should be?</span></p>
            <p>So we built the tool we wished we had — one that reads a paper the way a patient expert would, scores whether you can trust it, and helps you turn a pile of sources into a finished argument.</p>
            <p>Today, researchers at over 200 institutions use Citrus to move from question to insight faster than ever. We’re just getting started.</p>
          </div>
        </Reveal>
      </section>

      {/* stats */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-6 py-16 text-center">
          {[[2021, '', 'Founded'], [200, '+', 'Institutions'], [48, '', 'Fields covered']].map(([n, s, l]) => (
            <Reveal key={l}>
              <p className="font-display text-5xl text-lime"><CountUp to={n} suffix={s} /></p>
              <p className="mt-2 text-sm text-white/60">{l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* values */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal><h2 className="mb-12 text-center font-display text-4xl md:text-5xl">What we believe</h2></Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/15 text-lime"><v.icon size={22} /></div>
                <h3 className="mt-4 font-display text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-white/60">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* team */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal><h2 className="mb-12 text-center font-display text-4xl md:text-5xl">The team</h2></Reveal>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {TEAM.map((m, i) => (
            <Reveal key={m[0]} delay={(i % 6) * 50}>
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-lime/25 to-info/20 font-display text-2xl text-lime">
                  {m[0].split(' ').map((w) => w[0]).join('')}
                </div>
                <p className="mt-3 text-sm font-medium">{m[0]}</p>
                <p className="text-xs text-white/50">{m[1]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
