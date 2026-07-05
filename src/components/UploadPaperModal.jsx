import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link2, Loader2 } from 'lucide-react';
import { Modal, Button } from './ui.jsx';
import { PAPERS } from '../data/papers.js';

// §7 routing logic on submit. Papers accept links or PDFs only.
// - in DB → arXiv page. - not in DB → processing → translated page.
// - inaccessible → universal error popup.
export default function UploadPaperModal({ open, onClose, mode = 'translate', onResolved }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('link');
  const [value, setValue] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(false);

  const submit = async () => {
    setError(false);
    // Demo: typing "error" anywhere triggers the universal error.
    if (/error/i.test(value)) {
      setProcessing(false);
      setError(true);
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1400));

    // Try to match an existing DB paper by arxiv id / doi / title keyword.
    const q = value.toLowerCase();
    const match = PAPERS.find(
      (p) =>
        p.inDB &&
        ((p.arxivId && q.includes(p.arxivId)) ||
          (p.doi && q.includes(p.doi.toLowerCase())) ||
          q.includes(p.title.toLowerCase().slice(0, 12)))
    );
    setProcessing(false);
    onClose();
    setValue('');

    if (onResolved) {
      onResolved(match || PAPERS.find((p) => !p.inDB));
      return;
    }
    if (match) {
      navigate(`/paper/${match.id}`); // in DB → arXiv page first
    } else {
      // fresh upload → straight to translated page of the fresh item
      const fresh = PAPERS.find((p) => !p.inDB);
      navigate(`/paper/${fresh.id}/translated`, { state: { fresh: true } });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add a paper">
      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger-light px-4 py-4 text-sm text-danger">
          An error has occurred processing this paper — please upload something else.
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => setError(false)}>
              Try again
            </Button>
          </div>
        </div>
      ) : processing ? (
        <div className="flex flex-col items-center py-10">
          <Loader2 className="animate-spin text-lime" size={36} />
          <p className="mt-4 text-sm text-muted">Processing paper…</p>
          <p className="mt-1 text-xs text-muted">Fetching full text and metadata</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-1 rounded-lg bg-page p-1">
            <button
              onClick={() => setTab('link')}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm ${
                tab === 'link' ? 'bg-white shadow-sm' : 'text-muted'
              }`}
            >
              <Link2 size={15} /> Paste a link
            </button>
            <button
              onClick={() => setTab('pdf')}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm ${
                tab === 'pdf' ? 'bg-white shadow-sm' : 'text-muted'
              }`}
            >
              <Upload size={15} /> Upload a PDF
            </button>
          </div>

          {tab === 'link' ? (
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="https://arxiv.org/abs/1706.03762"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-info"
            />
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-page/50 py-10 hover:border-info">
              <Upload size={28} className="text-muted" />
              <span className="mt-2 text-sm text-muted">Click to choose a PDF or drop it here</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setValue(e.target.files?.[0]?.name || 'uploaded.pdf')}
              />
              {value && <span className="mt-2 text-xs text-info">{value}</span>}
            </label>
          )}

          <p className="mt-3 text-xs text-muted">
            Papers accept links or PDFs only. Tip: include “error” to preview the error state.
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!value.trim()}>
              {mode === 'translate' ? 'Process paper' : 'Add'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
