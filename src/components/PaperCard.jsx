import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, GitCompare, Plus } from 'lucide-react';
import { ScoreBadge } from './CredibilityScore.jsx';
import { useStore } from '../store.js';
import { paperById } from '../data/papers.js';
import { AddToMenu } from './AddToMenu.jsx';
import { useState } from 'react';

// Google-Scholar-style card, reused everywhere (§3).
export default function PaperCard({
  paper,
  paperId,
  showScore = false,
  timestamp,
  actions = ['bookmark', 'compare', 'add'],
  onSelect, // when present, renders green "Select" instead (compare flow)
  onRemove,
  relevanceScore,
  openInNewTab = false,
  compact = false,
  footer,
}) {
  const p = paper || paperById(paperId);
  const navigate = useNavigate();
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const isBookmarked = useStore((s) => s.isBookmarked);
  const [addOpen, setAddOpen] = useState(false);
  if (!p) return null;

  const bookmarked = isBookmarked('papers', p.id);
  const scoreVal = relevanceScore != null ? relevanceScore : p.scores?.final;

  const titleEl = openInNewTab ? (
    <a
      href={`/paper/${p.id}`}
      target="_blank"
      rel="noreferrer"
      className="font-display text-lg leading-snug text-info hover:underline"
    >
      {p.title}
    </a>
  ) : (
    <Link to={`/paper/${p.id}`} className="font-display text-lg leading-snug text-info hover:underline">
      {p.title}
    </Link>
  );

  return (
    <div className="group rounded-xl border border-line bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {titleEl}
          <p className="mt-1 text-sm text-ink/80">
            {p.authors.map((a, i) => (
              <span key={i}>
                {p.authorIds[i] ? (
                  <Link to={`/authors/${p.authorIds[i]}`} className="hover:text-info hover:underline">
                    {a}
                  </Link>
                ) : (
                  a
                )}
                {i < p.authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {p.year} · {p.journal} · {p.citations.toLocaleString()} citations
          </p>
          {!compact && <p className="mt-2 line-clamp-2 text-sm text-ink/70">{p.abstract}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {showScore && <ScoreBadge value={scoreVal} />}
            {timestamp && <span className="text-xs text-muted">{timestamp}</span>}
          </div>
          {footer}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {onSelect ? (
            <button
              onClick={() => onSelect(p)}
              className="cursor-pointer rounded-lg bg-success px-4 py-1.5 text-sm font-medium text-white hover:brightness-110"
            >
              Select
            </button>
          ) : (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {actions.includes('bookmark') && (
                <button
                  onClick={() => toggleBookmark('papers', p.id)}
                  title="Bookmark"
                  className={`rounded-lg p-2 hover:bg-black/5 cursor-pointer ${bookmarked ? 'text-lime' : 'text-muted'}`}
                >
                  <Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} />
                </button>
              )}
              {actions.includes('compare') && (
                <button
                  onClick={() => navigate('/compare', { state: { first: p.id } })}
                  title="Compare to…"
                  className="rounded-lg p-2 text-muted hover:bg-black/5 cursor-pointer"
                >
                  <GitCompare size={17} />
                </button>
              )}
              {actions.includes('add') && (
                <div className="relative">
                  <button
                    onClick={() => setAddOpen((o) => !o)}
                    title="Add to…"
                    className="rounded-lg p-2 text-muted hover:bg-black/5 cursor-pointer"
                  >
                    <Plus size={17} />
                  </button>
                  {addOpen && <AddToMenu paperId={p.id} onClose={() => setAddOpen(false)} />}
                </div>
              )}
            </div>
          )}
          {onRemove && (
            <button onClick={() => onRemove(p.id)} className="text-xs text-danger hover:underline cursor-pointer">
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
