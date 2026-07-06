import { Link } from 'react-router-dom';
import { Reveal, Eyebrow, Highlight } from '../mkui.jsx';

export const POSTS = [
  {
    slug: 'how-we-score-credibility',
    tag: 'Product',
    title: 'How Citrus scores source credibility',
    excerpt: 'A look under the hood at the four subscores — currency, journal quality, author credentials, and accuracy — and why we make every one transparent.',
    date: 'Jun 28, 2026',
    read: '6 min read',
    author: 'Sofia Almeida',
    body: [
      'Credibility is not a vibe. When a researcher decides whether to trust a paper, they are running a fast, mostly-implicit checklist: is this recent, is the venue reputable, are the authors credible, and is the methodology sound?',
      'Citrus makes that checklist explicit. Every source receives four subscores — currency, journal quality, author credentials, and accuracy — each on a 0–10 scale, and the final score is their average. Inside a research project we add a fifth: relevance to your hypothesis.',
      'Crucially, every subscore expands to show its inputs: impact factor and peer-review status for the journal; h-index and affiliation for authors; sample size, replication, and retraction status for accuracy. No black box — just a defensible, reproducible number.',
      'We would rather show our work and be argued with than hand you a mysterious score you have to take on faith.',
    ],
  },
  {
    slug: 'reading-levels',
    tag: 'Research',
    title: 'One paper, four reading levels',
    excerpt: 'Why the same result should be explained differently to a high-schooler and a field expert — and how per-section re-leveling changes how people read.',
    date: 'Jun 14, 2026',
    read: '4 min read',
    author: 'Ada Mensah',
    body: [
      'The best explanation depends entirely on who is listening. A curious adult wants intuition; a field expert wants the estimator and the identifying assumptions.',
      'Citrus lets you set a reading level per section, so you can skim the background as a curious adult and drop into field-expert mode for the methodology. It is the closest thing we have found to reading alongside a patient expert.',
    ],
  },
  {
    slug: 'literature-review-in-a-day',
    tag: 'Guides',
    title: 'Run a literature review in a day',
    excerpt: 'A step-by-step walkthrough of using a Citrus project to go from a fuzzy idea to a credibility-ranked reading list and a first draft.',
    date: 'May 30, 2026',
    read: '8 min read',
    author: 'Rahul Iyer',
    body: [
      'Start with a rough idea — a few sentences is enough. Citrus turns it into a structured project overview with a hypothesis and a solution direction.',
      'From there, suggested papers arrive ranked strictly by credibility and relevance. Add the good ones to your references, then let the writing assistant draft each section from exactly those sources.',
      'What used to take a week of tab-hoarding now fits in an afternoon — with citations that actually check out.',
    ],
  },
  {
    slug: 'why-we-built-citrus',
    tag: 'Company',
    title: 'Why we built Citrus',
    excerpt: 'Forty papers, one deadline, and a question that would not go away: why is understanding research so much harder than it should be?',
    date: 'May 12, 2026',
    read: '5 min read',
    author: 'Ada Mensah',
    body: [
      'Every founder story has a 2 a.m. moment. Ours involved a stack of forty papers and a grant deadline.',
      'We realized the bottleneck was never a lack of information — it was the cost of understanding it. So we set out to build the tool we wished we had.',
    ],
  },
];

export default function Blog() {
  const [featured, ...rest] = POSTS;
  return (
    <>
      <section className="relative pt-32 pb-8 text-center">
        <div className="paper-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal><Eyebrow>Blog</Eyebrow></Reveal>
          <Reveal delay={60}>
            <h1 className="font-paper mt-5 text-5xl text-ink md:text-6xl">The <Highlight>Citrus</Highlight> journal</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-paper mx-auto mt-6 max-w-xl text-lg italic text-ink/60">
              Product notes, research guides, and the occasional strong opinion.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        {/* featured — set like a lead article */}
        <Reveal>
          <Link to={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-xl border border-inkline bg-white md:grid-cols-[1fr_1.4fr]">
            <div className="paper-grid relative min-h-48 border-b border-inkline bg-paper md:border-b-0 md:border-r" />
            <div className="p-8">
              <span className="font-mono rounded bg-lime-bright/25 px-2.5 py-1 text-[10px] uppercase tracking-wider text-ink/70">{featured.tag}</span>
              <h2 className="font-paper mt-4 text-3xl leading-snug text-ink transition-colors group-hover:text-leaf">{featured.title}</h2>
              <p className="font-paper mt-3 leading-relaxed text-ink/60">{featured.excerpt}</p>
              <p className="font-mono mt-5 text-[10px] uppercase tracking-wider text-ink/45">{featured.author} · {featured.date} · {featured.read}</p>
            </div>
          </Link>
        </Reveal>

        {/* grid */}
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <Link to={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-xl border border-inkline bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-leaf/50">
                <span className="font-mono w-fit rounded border border-inkline px-2.5 py-1 text-[10px] uppercase tracking-wider text-ink/55">{p.tag}</span>
                <h3 className="font-paper mt-4 text-xl leading-snug text-ink transition-colors group-hover:text-leaf">{p.title}</h3>
                <p className="font-paper mt-2 flex-1 text-sm leading-relaxed text-ink/60">{p.excerpt}</p>
                <p className="font-mono mt-4 text-[10px] uppercase tracking-wider text-ink/40">{p.date} · {p.read}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
