import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Reveal, GlowBlob } from '../mkui.jsx';
import { POSTS } from './Blog.jsx';
import { CTASection } from './Home.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug) || POSTS[0];
  return (
    <>
      <article className="relative overflow-hidden pt-36 pb-12">
        <GlowBlob className="-top-24 left-1/2 -translate-x-1/2" size={480} opacity={0.14} />
        <div className="relative mx-auto max-w-3xl px-6">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
            <ArrowLeft size={15} /> All posts
          </Link>
          <Reveal>
            <span className="mt-6 inline-block rounded-full bg-lime/15 px-3 py-1 text-xs text-lime">{post.tag}</span>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{post.title}</h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-white/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime/15 text-xs text-lime">
                {post.author.split(' ').map((w) => w[0]).join('')}
              </div>
              {post.author} · {post.date} · {post.read}
            </div>
          </Reveal>

          <div className="mt-8 h-56 rounded-3xl bg-gradient-to-br from-lime/20 via-navy to-info/20" />

          <div className="prose prose-invert mt-10 max-w-none space-y-6 text-lg leading-relaxed text-white/75">
            {post.body.map((para, i) => (
              <Reveal key={i} delay={i * 40}><p>{para}</p></Reveal>
            ))}
          </div>
        </div>
      </article>
      <CTASection />
    </>
  );
}
