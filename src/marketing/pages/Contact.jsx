import { useState } from 'react';
import { Mail, MessageSquare, Building2, Check } from 'lucide-react';
import { Reveal, Eyebrow, GradientText, GlowBlob, MkButton } from '../mkui.jsx';

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="relative overflow-hidden pt-36 pb-28">
      <GlowBlob className="-top-20 left-1/2 -translate-x-1/2" size={520} opacity={0.16} />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="text-center">
          <Reveal><Eyebrow>Contact</Eyebrow></Reveal>
          <Reveal delay={60}><h1 className="mt-5 font-display text-5xl md:text-6xl">Let’s <GradientText>talk</GradientText></h1></Reveal>
          <Reveal delay={120}><p className="mx-auto mt-5 max-w-xl text-lg text-white/65">Questions, partnerships, or press — we’d love to hear from you.</p></Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="space-y-4">
              {[
                [Mail, 'Email us', 'hello@citrus.app'],
                [MessageSquare, 'Support', 'Available in-app, 7 days a week'],
                [Building2, 'Institutions', 'sales@citrus.app'],
              ].map(([Icon, t, d]) => (
                <div key={t} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/15 text-lime"><Icon size={20} /></div>
                  <div>
                    <p className="font-medium">{t}</p>
                    <p className="text-sm text-white/55">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime/15 text-lime"><Check size={28} /></div>
                  <p className="mt-4 font-display text-2xl">Message sent</p>
                  <p className="mt-1 text-sm text-white/55">We’ll get back to you within a day.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" placeholder="Ada Lovelace" />
                    <Field label="Email" type="email" placeholder="you@lab.edu" />
                  </div>
                  <Field label="Organization" placeholder="Your institution (optional)" />
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">Message</label>
                    <textarea rows={4} required placeholder="How can we help?" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-lime" />
                  </div>
                  <MkButton className="w-full" type="submit">Send message</MkButton>
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
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">{label}</label>
      <input type={type} required placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-lime" />
    </div>
  );
}
