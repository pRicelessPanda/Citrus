import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Bookmark, GitCompare, Plus, ExternalLink, Languages } from 'lucide-react';
import { useStore } from '../store.js';
import { paperById } from '../data/papers.js';
import { AddToMenu } from './AddToMenu.jsx';
import { Button } from './ui.jsx';
import { PageBody } from './PageHeader.jsx';

// Untranslated full paper page, arXiv style (§7).
// `actions` is configurable so Literature Review can show a reduced set.
export default function ArxivPaperPage({
  paperId,
  actions = ['translate', 'compare', 'add', 'bookmark'],
  onSelect, // compare flow: Compare to… becomes green Select
  selectMode = false,
  onTranslate,
  onEvaluate,
  onAddToProjectReference,
  extraNote,
}) {
  const p = paperById(paperId);
  const navigate = useNavigate();
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const isBookmarked = useStore((s) => s.isBookmarked);
  const addVisited = useStore((s) => s.addVisited);
  const [addOpen, setAddOpen] = useState(false);

  if (!p) return <PageBody>Paper not found.</PageBody>;
  const bookmarked = isBookmarked('papers', p.id);

  return (
    <PageBody>
      <div className="rounded-2xl border border-line bg-white p-8">
        <h1 className="font-display text-3xl leading-tight text-ink">{p.title}</h1>
        <p className="mt-3 text-base text-ink/80">
          {p.authors.map((a, i) => (
            <span key={i}>
              {p.authorIds[i] ? (
                <Link to={`/authors/${p.authorIds[i]}`} className="text-info hover:underline">
                  {a}
                </Link>
              ) : (
                a
              )}
              {i < p.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        <p className="mt-1 text-sm text-muted">
          {p.year} · {p.journal} · {p.citations.toLocaleString()} citations
          {p.doi && (
            <>
              {' · '}
              <span>DOI: {p.doi}</span>
            </>
          )}
        </p>
        {p.link && (
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-sm text-info hover:underline"
          >
            {p.arxivId ? `arXiv:${p.arxivId}` : 'View original'} <ExternalLink size={13} />
          </a>
        )}

        <div className="mt-6 border-t border-line pt-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Abstract</h2>
          <p className="text-[15px] leading-relaxed text-ink/90">{p.abstract}</p>
        </div>

        {extraNote && <div className="mt-4 rounded-lg bg-info-light px-4 py-3 text-sm text-info">{extraNote}</div>}

        <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-line pt-5">
          {selectMode ? (
            <Button variant="success" onClick={() => onSelect?.(p)}>
              Select
            </Button>
          ) : (
            actions.includes('translate') && (
              <Button
                variant="lime"
                onClick={() => {
                  addVisited(p.id);
                  if (onTranslate) onTranslate(p);
                  else navigate(`/paper/${p.id}/translated`);
                }}
              >
                <Languages size={16} /> Translate with Citrus
              </Button>
            )
          )}

          {actions.includes('evaluate') && (
            <Button variant="outline" onClick={() => onEvaluate?.(p)}>
              Evaluate Source Credibility Score with Relevance
            </Button>
          )}

          {actions.includes('compare') && !selectMode && (
            <Button variant="outline" onClick={() => navigate('/compare', { state: { first: p.id } })}>
              <GitCompare size={16} /> Compare to…
            </Button>
          )}

          {actions.includes('add') && !selectMode && (
            <div className="relative">
              <Button variant="outline" onClick={() => setAddOpen((o) => !o)}>
                <Plus size={16} /> Add to…
              </Button>
              {addOpen && <AddToMenu paperId={p.id} onClose={() => setAddOpen(false)} />}
            </div>
          )}

          {actions.includes('addToProjectReference') && (
            <Button variant="outline" onClick={() => onAddToProjectReference?.(p)}>
              <Plus size={16} /> Add to project reference
            </Button>
          )}

          {actions.includes('addToPublications') && (
            <Button variant="outline" onClick={() => onAddToProjectReference?.(p)}>
              <Plus size={16} /> Add to author publications
            </Button>
          )}

          {actions.includes('bookmark') && !selectMode && (
            <Button
              variant={bookmarked ? 'subtle' : 'outline'}
              onClick={() => toggleBookmark('papers', p.id)}
            >
              <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          )}
        </div>
      </div>
    </PageBody>
  );
}
