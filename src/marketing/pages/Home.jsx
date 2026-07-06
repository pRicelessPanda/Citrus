import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Languages, ShieldCheck, Search, GitCompare, UserCheck,
  FolderKanban, PenLine, Users, CalendarDays, Sparkles, Quote, Star,
} from 'lucide-react';
import { CitrusMark } from '../../components/Logo.jsx';
import InteractiveDemo from '../InteractiveDemo.jsx';
import { Reveal, CountUp, GradientText, Eyebrow, GlowBlob, NodeField, Marquee, MkButton } from '../mkui.jsx';

const PILLARS = [
  { icon: Languages, title: 'Paper translation', body: 'Dense papers become plain-language explainers at any reading level.' },
  { icon: ShieldCheck, title: 'Credibility scoring', body: 'A transparent 0–10 score with subscores on every source.' },
  { icon: Search, title: 'Conversational search', body: 'Describe what you need; Citrus finds the papers that matter.' },
  { icon: GitCompare, title: 'Compare papers', body: 'Section-by-section, with agreement highlighting.' },
  { icon: UserCheck, title: 'Author pages', body: 'Claimable, ORCID-verified researcher records.' },
  { icon: FolderKanban, title: 'Research projects', body: 'AI-assisted workspaces for a whole literature review.' },
  { icon: PenLine, title: 'AI writing', body: 'Draft papers from your sources with automatic citations.' },
  { icon: Users, title: 'Community', body: 'Forums, messaging, profiles, and following.' },
  { icon: CalendarDays, title: 'Unified calendar', body: 'Every deadline across every project, colour-coded.' },
];

const TESTIMONIALS = [
  { quote: 'Citrus turned a three-hour paper into a fifteen-minute read — without losing the nuance. It’s the first tool my whole lab actually adopted.', name: 'Dr. Elena Petrova', role: 'Cognitive Science, ETH Zürich' },
  { quote: 'The credibility scores changed how my students evaluate sources. Transparent, defensible, and fast.', name: 'Prof. James Okafor', role: 'Epidemiology, Johns Hopkins' },
  { quote: 'I ran an entire literature review inside one Citrus project. The writing assistant cited everything correctly.', name: 'Aisha Khan', role: 'PhD candidate, MIT' },
  { quote: 'Comparing two papers side by side with agreement highlighting is genuinely magic for peer review.', name: 'Dr. Marco Rossi', role: 'Materials Science, Politecnico' },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pt-36 pb-24">
        <GlowBlob className="-top-32 left-1/2 -translate-x-1/2" size={620} opacity={0.2} />
        <GlowBlob className="top-40 -right-40" color="var(--color-info)" size={460} opacity={0.18} />
        <div className="pointer-events-none absolute inset-0"><NodeField opacity={0.35} /></div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
              <span className="flex h-2 w-2"><span className="h-2 w-2 animate-ping rounded-full bg-lime opacity-75" /></span>
              Now in open beta · No credit card required
            </div>
          </Reveal>
          <div className="animate-floaty mx-auto mb-4 w-fit"><CitrusMark size={88} /></div>
          <Reveal delay={60}>
            <h1 className="font-display text-6xl leading-[1.03] tracking-tight md:text-[5.5rem]">
              Read less.
              <br />
              <GradientText>Understand more.</GradientText>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-white/65 md:text-xl">
              Citrus is the AI-native research platform that translates dense science into plain language, scores every
              source for credibility, and runs your entire research program in one place.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <MkButton size="lg" onClick={() => navigate('/dashboard')} className="group">
                Launch Citrus <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </MkButton>
              <MkButton size="lg" variant="ghost" as={Link} to="/product">
                See how it works
              </MkButton>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40">
              <div className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} className="fill-lime text-lime" />)}</div>
              Loved by researchers at 200+ institutions
            </div>
          </Reveal>
        </div>

        {/* interactive demo */}
        <div className="relative mt-16 px-6">
          <Reveal delay={120}><InteractiveDemo /></Reveal>
        </div>
      </section>

      {/* ================= LOGO MARQUEE ================= */}
      <section className="border-y border-white/10 bg-white/[0.02] py-8">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/30">
          Trusted across the sciences
        </p>
        <Marquee
          items={['MIT', 'Stanford', 'ETH Zürich', 'Johns Hopkins', 'Oxford', 'DeepMind', 'Max Planck', 'UC Berkeley', 'Cambridge', 'Politecnico']}
          duration={28}
        />
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><Eyebrow>Everything in one place</Eyebrow></Reveal>
          <Reveal delay={60}><h2 className="mt-4 font-display text-4xl md:text-5xl">Nine tools. One research OS.</h2></Reveal>
          <Reveal delay={120}><p className="mt-4 text-white/60">From the first read to the final draft, Citrus covers the entire research lifecycle.</p></Reveal>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {PILLARS.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-lime/40 hover:bg-white/[0.05]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/15 text-lime transition-colors group-hover:bg-lime group-hover:text-navy">
                  <f.icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-xl">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <MkButton variant="ghost" as={Link} to="/product">Explore the product <ArrowRight size={16} /></MkButton>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <GlowBlob className="left-1/4 top-0" size={360} opacity={0.12} />
        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-20 text-center md:grid-cols-4">
          {[
            { to: 2.1, suffix: 'M+', label: 'Papers indexed', decimals: 1 },
            { to: 48, suffix: '', label: 'Scientific fields' },
            { to: 92, suffix: '%', label: 'Time saved per paper' },
            { to: 200, suffix: '+', label: 'Institutions' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <p className="font-display text-5xl text-lime md:text-6xl">
                <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
              </p>
              <p className="mt-2 text-sm text-white/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><Eyebrow>How it works</Eyebrow></Reveal>
          <Reveal delay={60}><h2 className="mt-4 font-display text-4xl md:text-5xl">From paper to published</h2></Reveal>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            ['01', 'Drop in a paper', 'Paste a link or upload a PDF. arXiv IDs are auto-resolved and the full text is fetched in the background.'],
            ['02', 'Understand it instantly', 'Get a sectioned plain-language explainer, a source credibility score, and related work — in seconds.'],
            ['03', 'Organize & write', 'Bookmark, compare, add to projects, and let Citrus draft the paper from your chosen sources.'],
          ].map(([n, t, b], i) => (
            <Reveal key={n} delay={i * 100}>
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                <div className="font-display text-5xl text-lime/25">{n}</div>
                <h3 className="mt-3 font-display text-2xl">{t}</h3>
                <p className="mt-2 text-white/60">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal><Eyebrow>Loved by researchers</Eyebrow></Reveal>
            <Reveal delay={60}><h2 className="mt-4 font-display text-4xl md:text-5xl">Research, unblocked</h2></Reveal>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={(i % 2) * 90}>
                <figure className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                  <Quote size={26} className="text-lime/50" />
                  <blockquote className="mt-4 text-lg leading-relaxed text-white/85">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime/15 font-medium text-lime">
                      {t.name.split(' ').map((w) => w[0]).slice(-2).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-white/50">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <CTASection />
    </>
  );
}

export function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-lime/20 bg-gradient-to-br from-lime/10 via-navy to-info/10 px-8 py-20 text-center">
        <GlowBlob className="left-1/2 top-0 -translate-x-1/2" size={420} opacity={0.25} />
        <div className="pointer-events-none absolute inset-0"><NodeField opacity={0.25} /></div>
        <div className="relative">
          <CitrusMark size={60} className="mx-auto animate-floaty" />
          <h2 className="mt-6 font-display text-4xl md:text-6xl">Ready to read smarter?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Join thousands of researchers using Citrus to understand, discover, and write science faster.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MkButton size="lg" onClick={() => navigate('/dashboard')} className="group">
              Launch Citrus <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </MkButton>
            <MkButton size="lg" variant="ghost" onClick={() => navigate('/pricing')}>View pricing</MkButton>
          </div>
          <p className="mt-5 text-xs text-white/40">Free forever plan · Upgrade anytime</p>
        </div>
      </div>
    </section>
  );
}
