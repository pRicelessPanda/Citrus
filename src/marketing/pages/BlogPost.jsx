import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Reveal, Rule } from '../mkui.jsx';
import { POSTS } from './Blog.jsx';
import { CTASection } from './Home.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug) || POSTS[0];
  return (
    <>
      <article className="relative pt-32 pb-10">
        <div className="mx-auto max-w-2xl px-6">
          <Link to="/blog" className="font-sans inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink">
            <ArrowLeft size={15} /> All posts
          </Link>
          <Reveal>
            <p className="font-mono mt-8 text-[10px] uppercase tracking-[0.2em] text-ink/45">
              {post.tag} · {post.date} · {post.read}
            </p>
            <h1 className="font-paper mt-3 text-4xl leading-[1.15] text-ink md:text-5xl">{post.title}</h1>
            <div className="mt-5 flex items-center gap-3">
              <div className="font-paper flex h-9 w-9 items-center justify-center rounded-lg border border-inkline bg-white text-xs text-leaf">
                {post.author.split(' ').map((w) => w[0]).join('')}
              </div>
              <span className="font-sans text-sm text-ink/60">{post.author}</span>
            </div>
            <Rule className="mt-8" />
          </Reveal>

          <div className="font-paper mt-10 space-y-6 text-justify text-[17px] leading-[1.85] text-ink/85">
            {post.body.map((para, i) => (
              <Reveal key={i} delay={i * 40}>
                <p className={i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-leaf' : ''}>
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </article>
      <CTASection />
    </>
  );
}
