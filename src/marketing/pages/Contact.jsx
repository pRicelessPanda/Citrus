import { useState } from 'react';
import { Mail, MessageSquare, Building2, Check } from 'lucide-react';
import { Reveal, Eyebrow, Highlight, MkButton } from '../mkui.jsx';

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="relative pt-32 pb-24">
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="text-center">
          <Reveal><Eyebrow>Contact</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="font-paper mt-5 text-5xl text-ink md:text-6xl">Let’s <Highlight>talk</Highlight></h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-paper mx-auto mt-5 max-w-xl text-lg italic text-ink/60">
              Questions, partnerships, or press — we’d love to hear from you.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="space-y-3">
              {[
                [Mail, 'Email us', 'hello@citrus.app'],
                [MessageSquare, 'Support', 'Available in-app, 7 days a week'],
                [Building2, 'Institutions', 'sales@citrus.app'],
              ].map(([Icon, t, d]) => (
                <div key={t} className="flex items-start gap-4 rounded-xl border border-inkline bg-white p-5">
                  <Icon size={20} className="mt-0.5 text-leaf" />
                  <div>
                    <p className="font-paper text-lg text-ink">{t}</p>
                    <p className="font-sans text-sm text-ink/55">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-xl border border-inkline bg-white p-7">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-light text-success"><Check size={28} /></div>
                  <p className="font-paper mt-4 text-2xl text-ink">Message sent</p>
                  <p className="font-sans mt-1 text-sm text-ink/55">We’ll get back to you within a day.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="font-sans space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" placeholder="Ada Lovelace" />
                    <Field label="Email" type="email" placeholder="you@lab.edu" />
                  </div>
                  <Field label="Organization" placeholder="Your institution (optional)" />
                  <div>
                    <label className="font-mono mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-ink/50">Message</label>
                    <textarea rows={4} required placeholder="How can we help?" className="w-full rounded-lg border border-inkline bg-paper px-4 py-3 text-sm outline-none placeholder:text-ink/30 focus:border-leaf" />
                  </div>
                  <MkButton variant="dark" className="w-full" type="submit">Send message</MkButton>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = 'text', placeholder }) {
  return (
    <div>
      <label className="font-mono mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-ink/50">{label}</label>
      <input type={type} required placeholder={placeholder} className="w-full rounded-lg border border-inkline bg-paper px-4 py-3 text-sm outline-none placeholder:text-ink/30 focus:border-leaf" />
    </div>
  );
}
