import { Reveal, Rule } from '../mkui.jsx';

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
    <section className="relative pt-32 pb-24">
      <div className="relative mx-auto max-w-2xl px-6">
        <Reveal>
          <h1 className="font-paper text-5xl text-ink">{c.title}</h1>
          <p className="font-mono mt-3 text-[10px] uppercase tracking-[0.2em] text-ink/45">Last updated {c.updated}</p>
          <p className="font-paper mt-6 text-lg leading-relaxed text-ink/75">{c.intro}</p>
          <Rule className="mt-8" />
        </Reveal>
        <div className="mt-10 space-y-8">
          {c.sections.map(([h, b], i) => (
            <Reveal key={h} delay={i * 40}>
              <h2 className="font-paper text-2xl text-ink">
                <span className="mr-3 text-ink/35">{i + 1}.</span>
                {h}
              </h2>
              <p className="font-paper mt-2 text-justify leading-[1.8] text-ink/70">{b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
