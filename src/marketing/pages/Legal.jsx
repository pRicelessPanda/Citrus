import { Reveal, GlowBlob } from '../mkui.jsx';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'July 1, 2026',
    intro: 'Your research is yours. This policy explains what we collect, why, and the control you have over it.',
    sections: [
      ['What we collect', 'Account details you provide (name, email), the papers and projects you create, and basic usage analytics that help us improve the product. We do not sell your data.'],
      ['How we use it', 'To operate Citrus, personalize your search and forum suggestions from your stated field interests, and keep your account secure. AI features process the content you submit to generate translations, scores, and drafts.'],
      ['Your controls', 'Projects, papers, and libraries are private by default. You choose what to make public and what to share. You can export or delete your data at any time from Settings.'],
      ['Data retention', 'We retain your content while your account is active. Deleting your account removes your personal data, subject to legal retention requirements.'],
      ['Contact', 'Questions about privacy? Email privacy@citrus.app.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'July 1, 2026',
    intro: 'These terms govern your use of Citrus. By using the product, you agree to them.',
    sections: [
      ['Your account', 'You are responsible for activity under your account and for keeping your credentials secure. You must be old enough to form a binding contract to use Citrus.'],
      ['Acceptable use', 'Use Citrus for lawful research purposes. Do not misuse the service, attempt to disrupt it, or infringe others’ rights.'],
      ['AI-generated content', 'Translations, scores, and drafts are assistive and may contain errors. You are responsible for verifying outputs before relying on them in published work.'],
      ['Plans and billing', 'Paid plans renew until cancelled. You can change or cancel anytime; the free plan remains available.'],
      ['Changes', 'We may update these terms; we’ll notify you of material changes. Continued use means acceptance.'],
    ],
  },
};

export default function Legal({ kind = 'privacy' }) {
  const c = CONTENT[kind] || CONTENT.privacy;
  return (
    <section className="relative overflow-hidden pt-36 pb-28">
      <GlowBlob className="-top-24 left-1/2 -translate-x-1/2" size={420} opacity={0.12} />
      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          <h1 className="font-display text-5xl">{c.title}</h1>
          <p className="mt-3 text-sm text-white/40">Last updated {c.updated}</p>
          <p className="mt-6 text-lg text-white/70">{c.intro}</p>
        </Reveal>
        <div className="mt-10 space-y-8">
          {c.sections.map(([h, b], i) => (
            <Reveal key={h} delay={i * 40}>
              <h2 className="font-display text-2xl">{h}</h2>
              <p className="mt-2 leading-relaxed text-white/65">{b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
