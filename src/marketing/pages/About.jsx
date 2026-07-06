import { Target, Heart, Zap, Globe } from 'lucide-react';
import { Reveal, Eyebrow, Highlight, SectionHeading, CountUp, Rule } from '../mkui.jsx';
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
      <section className="relative pt-32 pb-14 text-center">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-6">
          <div className="animate-floaty mx-auto mb-6 w-fit"><CitrusMark size={66} onLight /></div>
          <Reveal><Eyebrow>Our mission</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="font-paper mt-5 text-4xl leading-[1.15] text-ink md:text-6xl">
              Making the world’s research <Highlight>understandable to everyone</Highlight>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-paper mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/65">
              Millions of papers are published every year, yet most are locked behind dense prose and paywalled context.
              Citrus exists to close that gap — turning the frontier of human knowledge into something any curious mind can grasp.
            </p>
          </Reveal>
        </div>
      </section>

      {/* story */}
      <section className="mx-auto max-w-2xl px-6 py-12">
        <Reveal>
          <SectionHeading n="1">The story</SectionHeading>
          <div className="font-paper mt-6 space-y-5 text-justify text-[17px] leading-[1.8] text-ink/80">
            <p>
              Citrus started in a lab, at 2 a.m., with a stack of forty papers and a deadline. We kept asking the same
              question: <em>why is understanding research so much harder than it should be?</em>
            </p>
            <p>
              So we built the tool we wished we had — one that reads a paper the way a patient expert would, scores
              whether you can trust it, and helps you turn a pile of sources into a finished argument.
            </p>
            <p>
              Today, researchers at over 200 institutions use Citrus to move from question to insight faster than ever.
              We’re just getting started.
            </p>
          </div>
        </Reveal>
      </section>

      {/* stats */}
      <section className="mx-auto max-w-3xl px-6 py-8">
        <Rule />
        <div className="grid grid-cols-3 gap-8 py-10 text-center">
          {[[2021, '', 'Founded'], [200, '+', 'Institutions'], [48, '', 'Fields covered']].map(([n, s, l]) => (
            <Reveal key={l}>
              <p className="font-paper text-5xl text-success"><CountUp to={n} suffix={s} /></p>
              <p className="font-mono mt-2 text-[10px] uppercase tracking-[0.2em] text-ink/50">{l}</p>
            </Reveal>
          ))}
        </div>
        <Rule />
      </section>

      {/* values */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal><SectionHeading n="2" className="mb-10 text-center">What we believe</SectionHeading></Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 70}>
              <div className="h-full rounded-xl border border-inkline bg-white p-6">
                <v.icon size={21} className="text-leaf" />
                <h3 className="font-paper mt-4 text-xl text-ink">{v.title}</h3>
                <p className="font-paper mt-2 text-sm leading-relaxed text-ink/60">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* team */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Reveal><SectionHeading n="3" className="mb-10 text-center">The team</SectionHeading></Reveal>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {TEAM.map((m, i) => (
            <Reveal key={m[0]} delay={(i % 6) * 50}>
              <div className="text-center">
                <div className="font-paper mx-auto flex h-20 w-20 items-center justify-center rounded-xl border border-inkline bg-white text-2xl text-leaf">
                  {m[0].split(' ').map((w) => w[0]).join('')}
                </div>
                <p className="font-sans mt-3 text-sm font-medium text-ink">{m[0]}</p>
                <p className="font-mono mt-0.5 text-[10px] uppercase tracking-wider text-ink/45">{m[1]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
