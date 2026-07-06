import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Minus, ChevronDown, ArrowRight } from 'lucide-react';
import { Reveal, Eyebrow, GradientText, GlowBlob, MkButton } from '../mkui.jsx';
import { CTASection } from './Home.jsx';

const TIERS = [
  { name: 'Free', monthly: 0, tagline: 'For getting started', cta: 'Get started', features: ['Unlimited paper translations', 'Source credibility scores', 'Conversational search', 'Bookmarks & libraries', '3 reading levels'] },
  { name: 'Pro', monthly: 19, tagline: 'For active researchers', highlight: true, cta: 'Start Pro', features: ['Everything in Free', 'Research projects & papers', 'Compare papers', 'AI writing assistant', 'Author page claiming', 'All 4 reading levels'] },
  { name: 'Plus', monthly: 39, tagline: 'For research teams', cta: 'Start Plus', features: ['Everything in Pro', 'Shared projects & channels', 'Living-project monitoring', 'Experiment designer', 'Priority AI & support'] },
];

const MATRIX = [
  ['Paper translation', true, true, true],
  ['Credibility scoring', true, true, true],
  ['Conversational search', true, true, true],
  ['Compare papers', false, true, true],
  ['Research projects', false, true, true],
  ['AI writing assistant', false, true, true],
  ['Shared workspaces', false, false, true],
  ['Living-project monitoring', false, false, true],
  ['Priority support', false, false, true],
];

const FAQS = [
  ['Is there really a free plan?', 'Yes — the Free plan is free forever and includes unlimited paper translations and credibility scores. No credit card required to start.'],
  ['Can I change plans later?', 'Absolutely. Upgrade or downgrade anytime; changes take effect immediately and we prorate the difference.'],
  ['Do you offer academic discounts?', 'Verified students and academic labs get significant discounts on Pro and Plus. Reach out and we’ll set you up.'],
  ['How does the AI writing assistant cite sources?', 'It writes each section only from the sources you select, inserts in-text citations automatically, and flags any sentence that still needs one.'],
  ['Is my research data private?', 'Your projects, papers, and libraries are private by default. You choose exactly what to share and with whom.'],
];

export default function Pricing() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);
  const price = (m) => (m === 0 ? '$0' : annual ? `$${Math.round(m * 0.8)}` : `$${m}`);

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-12 text-center">
        <GlowBlob className="-top-20 left-1/2 -translate-x-1/2" size={520} opacity={0.18} />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal><Eyebrow>Pricing</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="mt-5 font-display text-5xl leading-tight md:text-7xl">
              Start free. <GradientText>Scale when ready.</GradientText>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">Simple, transparent pricing for researchers and teams of every size.</p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5">
              <button onClick={() => setAnnual(false)} className={`cursor-pointer rounded-full px-4 py-1.5 text-sm ${!annual ? 'bg-lime text-navy' : 'text-white/60'}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`cursor-pointer rounded-full px-4 py-1.5 text-sm ${annual ? 'bg-lime text-navy' : 'text-white/60'}`}>
                Annual <span className={annual ? 'text-navy/70' : 'text-lime'}>−20%</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* tier cards */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className={`relative h-full rounded-3xl border p-8 ${t.highlight ? 'border-lime/50 bg-lime/[0.06] shadow-2xl shadow-lime/10' : 'border-white/10 bg-white/[0.03]'}`}>
                {t.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-navy">Most popular</span>}
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="text-sm text-white/50">{t.tagline}</p>
                <p className="mt-5 font-display text-6xl">{price(t.monthly)}<span className="text-lg text-white/40">/mo</span></p>
                {annual && t.monthly > 0 && <p className="mt-1 text-xs text-lime">billed annually</p>}
                <MkButton variant={t.highlight ? 'lime' : 'ghost'} className="mt-6 w-full" onClick={() => navigate('/dashboard')}>{t.cta}</MkButton>
                <ul className="mt-7 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/75"><Check size={16} className="shrink-0 text-lime" /> {f}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* comparison table */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Reveal><h2 className="mb-8 text-center font-display text-3xl md:text-4xl">Compare plans</h2></Reveal>
        <Reveal delay={80}>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-5 py-4 text-left font-medium text-white/60">Feature</th>
                  {['Free', 'Pro', 'Plus'].map((n) => <th key={n} className="px-5 py-4 text-center font-medium">{n}</th>)}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, i) => (
                  <tr key={row[0]} className={i % 2 ? 'bg-white/[0.01]' : ''}>
                    <td className="px-5 py-3.5 text-white/80">{row[0]}</td>
                    {row.slice(1).map((v, j) => (
                      <td key={j} className="px-5 py-3.5 text-center">
                        {v ? <Check size={17} className="mx-auto text-lime" /> : <Minus size={17} className="mx-auto text-white/20" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal><h2 className="mb-8 text-center font-display text-3xl md:text-4xl">Frequently asked questions</h2></Reveal>
        <div className="space-y-3">
          {FAQS.map((f, i) => <FaqItem key={i} q={f[0]} a={f[1]} delay={i * 50} />)}
        </div>
      </section>

      <CTASection />
    </>
  );
}

function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
        <button onClick={() => setOpen((o) => !o)} className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left">
          <span className="font-medium text-white">{q}</span>
          <ChevronDown size={18} className={`shrink-0 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <p className="px-6 pb-5 text-sm leading-relaxed text-white/60">{a}</p>}
      </div>
    </Reveal>
  );
}
