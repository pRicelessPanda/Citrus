import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Minus, ChevronDown } from 'lucide-react';
import { Reveal, Eyebrow, Highlight, MkButton } from '../mkui.jsx';
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
      <section className="relative pt-32 pb-10 text-center">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal><Eyebrow>Pricing</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="font-paper mt-5 text-5xl leading-[1.12] text-ink md:text-6xl">
              Start free. <Highlight>Scale when ready.</Highlight>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-paper mx-auto mt-6 max-w-xl text-lg italic text-ink/60">
              Simple, transparent pricing for researchers and teams of every size.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="font-sans mt-8 inline-flex items-center gap-1 rounded-full border border-inkline bg-white p-1">
              <button onClick={() => setAnnual(false)} className={`cursor-pointer rounded-full px-4 py-1.5 text-sm ${!annual ? 'bg-navy text-white' : 'text-ink/55'}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`cursor-pointer rounded-full px-4 py-1.5 text-sm ${annual ? 'bg-navy text-white' : 'text-ink/55'}`}>
                Annual <span className={annual ? 'text-lime-bright' : 'text-leaf'}>−20%</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* tier cards */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className={`relative h-full rounded-xl border bg-white p-7 ${t.highlight ? 'border-leaf shadow-[0_2px_0_rgba(76,139,31,0.25)]' : 'border-inkline'}`}>
                {t.highlight && (
                  <span className="font-mono absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-lime-bright px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-navy">
                    Most popular
                  </span>
                )}
                <h3 className="font-paper text-2xl text-ink">{t.name}</h3>
                <p className="text-sm text-ink/50">{t.tagline}</p>
                <p className="font-paper mt-5 text-6xl text-ink">{price(t.monthly)}<span className="text-lg text-ink/40">/mo</span></p>
                {annual && t.monthly > 0 && <p className="font-mono mt-1 text-[10px] uppercase tracking-wider text-leaf">billed annually</p>}
                <MkButton variant={t.highlight ? 'dark' : 'ghost'} className="font-sans mt-6 w-full" onClick={() => navigate('/dashboard')}>{t.cta}</MkButton>
                <ul className="font-sans mt-7 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-ink/75"><Check size={16} className="shrink-0 text-success" /> {f}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* comparison table */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        <Reveal><h2 className="font-paper mb-3 text-center text-3xl text-ink md:text-4xl">Compare plans</h2></Reveal>
        <Reveal delay={80}>
          <div className="overflow-hidden rounded-xl border border-inkline bg-white">
            <table className="font-sans w-full text-sm">
              <thead>
                <tr className="border-b border-inkline bg-paper">
                  <th className="font-mono px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50">Feature</th>
                  {['Free', 'Pro', 'Plus'].map((n) => <th key={n} className="font-mono px-5 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">{n}</th>)}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, i) => (
                  <tr key={row[0]} className={i % 2 ? 'bg-paper/60' : ''}>
                    <td className="px-5 py-3.5 text-ink/75">{row[0]}</td>
                    {row.slice(1).map((v, j) => (
                      <td key={j} className="px-5 py-3.5 text-center">
                        {v ? <Check size={17} className="mx-auto text-success" /> : <Minus size={17} className="mx-auto text-ink/20" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-paper mx-auto mt-3 max-w-xl text-center text-sm italic text-ink/55">
            <span className="font-mono not-italic text-[10px] uppercase tracking-widest text-ink/45">Table 1.</span>{' '}
            Feature availability by plan.
          </p>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <Reveal><h2 className="font-paper mb-8 text-center text-3xl text-ink md:text-4xl">Frequently asked questions</h2></Reveal>
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
      <div className="rounded-xl border border-inkline bg-white">
        <button onClick={() => setOpen((o) => !o)} className="font-paper flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left">
          <span className="text-lg text-ink">{q}</span>
          <ChevronDown size={18} className={`shrink-0 text-ink/45 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <p className="font-paper px-6 pb-5 text-[15px] leading-relaxed text-ink/65">{a}</p>}
      </div>
    </Reveal>
  );
}
