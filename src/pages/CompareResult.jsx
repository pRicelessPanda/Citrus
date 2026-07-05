import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loader2, Bookmark, Plus, FileDown, Highlighter } from 'lucide-react';
import { PageBody } from '../components/PageHeader.jsx';
import { Button, Badge, useToast } from '../components/ui.jsx';
import CredibilityScore from '../components/CredibilityScore.jsx';
import { AskAIButton } from '../components/AskAISplitScreen.jsx';
import AskAISplitScreen from '../components/AskAISplitScreen.jsx';
import { paperById } from '../data/papers.js';
import { compareSections } from '../services/mockAI.js';
import { useStore } from '../store.js';

export default function CompareResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { a, b } = location.state || {};
  const pa = a && paperById(a);
  const pb = b && paperById(b);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [highlight, setHighlight] = useState(true);
  const [askOpen, setAskOpen] = useState(false);
  const addComparison = useStore((s) => s.addComparison);

  useEffect(() => {
    if (!pa || !pb) {
      navigate('/compare');
      return;
    }
    let alive = true;
    setLoading(true);
    compareSections(pa, pb)
      .then((res) => {
        if (!alive) return;
        setData(res);
        setLoading(false);
        addComparison(pa.id, pb.id, res.similarity);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
    return () => (alive = false);
  }, [a, b]); // eslint-disable-line

  if (!pa || !pb) return null;

  if (error) {
    return (
      <PageBody>
        <div className="rounded-xl border border-danger/30 bg-danger-light px-6 py-6 text-danger">
          Something went wrong generating your comparison — please try again.
          <div className="mt-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </PageBody>
    );
  }

  if (loading) {
    return (
      <PageBody>
        <div className="flex flex-col items-center py-24">
          <Loader2 className="animate-spin text-lime" size={40} />
          <p className="mt-4 text-muted">Comparing papers section by section…</p>
        </div>
      </PageBody>
    );
  }

  const toneFor = (agreement) =>
    agreement === 'agree'
      ? 'bg-success-light'
      : agreement === 'differ'
      ? 'bg-danger-light'
      : 'bg-warning-light';

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-page/80 px-8 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg">Comparison</span>
          <Badge tone="info">Similarity {data.similarity}/10</Badge>
          <Badge>Private · not shareable</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={highlight ? 'subtle' : 'outline'}
            size="sm"
            onClick={() => setHighlight((h) => !h)}
          >
            <Highlighter size={15} /> Highlight mode
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast('Bookmarked comparison')}>
            <Bookmark size={15} /> Bookmark
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast('Added to project')}>
            <Plus size={15} /> Add to project
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast('Exporting…')}>
            <FileDown size={15} /> Export
          </Button>
          <AskAIButton onClick={() => setAskOpen(true)} />
        </div>
      </div>

      <PageBody>
        {highlight && (
          <div className="mb-4 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-success-light" /> Agree
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-warning-light" /> Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-danger-light" /> Differ
            </span>
          </div>
        )}

        {/* column headers */}
        <div className="grid grid-cols-[180px_1fr_1fr] gap-4">
          <div />
          {[pa, pb].map((p) => (
            <div key={p.id} className="rounded-xl border border-line bg-white p-4">
              <Link to={`/paper/${p.id}`} className="font-display text-lg leading-snug text-info hover:underline">
                {p.title}
              </Link>
              <p className="mt-1 text-xs text-muted">
                {p.citations.toLocaleString()} citations · {p.year}
              </p>
              <div className="mt-3">
                <CredibilityScore scores={p.scores} evidenceStrength={p.evidenceStrength} />
              </div>
            </div>
          ))}
        </div>

        {/* section rows */}
        <div className="mt-4 space-y-3">
          {data.rows.map((row) => (
            <div key={row.section} className="grid grid-cols-[180px_1fr_1fr] gap-4">
              <div className="flex items-center">
                <span className="font-display text-lg">{row.section}</span>
              </div>
              <div className={`rounded-xl border border-line p-4 text-sm text-ink/90 ${highlight ? toneFor(row.agreement) : 'bg-white'}`}>
                {row.left}
              </div>
              <div className={`rounded-xl border border-line p-4 text-sm text-ink/90 ${highlight ? toneFor(row.agreement) : 'bg-white'}`}>
                {row.right}
              </div>
            </div>
          ))}
        </div>
      </PageBody>

      <AskAISplitScreen
        open={askOpen}
        onClose={() => setAskOpen(false)}
        context={`${pa.title} vs ${pb.title}`}
        scopeLabel="Scoped to both papers + general knowledge"
        left={
          <div className="p-6">
            <h2 className="font-display text-xl">Comparison summary</h2>
            <p className="mt-2 text-sm text-muted">
              Similarity {data.similarity}/10 across {data.rows.length} sections.
            </p>
            {data.rows.map((r) => (
              <div key={r.section} className="mt-3">
                <p className="text-sm font-semibold">{r.section}</p>
                <p className="text-xs text-muted">{r.agreement}</p>
              </div>
            ))}
          </div>
        }
      />
    </>
  );
}
