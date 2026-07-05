import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search as SearchIcon, X, Bookmark } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Button, Modal, EmptyState } from '../components/ui.jsx';
import PaperCard from '../components/PaperCard.jsx';
import { paperById, PAPERS } from '../data/papers.js';
import { useStore } from '../store.js';
import UploadPaperModal from '../components/UploadPaperModal.jsx';

export default function Compare() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookmarks = useStore((s) => s.bookmarks);
  const [slots, setSlots] = useState([null, null]);
  const [pickerFor, setPickerFor] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.first) setSlots([location.state.first, null]);
  }, [location.state]);

  const fill = (idx, paperId) => {
    setSlots((s) => {
      const n = [...s];
      n[idx] = paperId;
      return n;
    });
    setPickerFor(null);
  };

  const generate = () => {
    if (!slots[0] || !slots[1]) {
      setError('Select a second paper to compare.');
      return;
    }
    navigate('/compare/result', { state: { a: slots[0], b: slots[1] } });
  };

  return (
    <>
      <PageHeader title="Compare papers" subtitle="Two papers, side by side" />
      <PageBody>
        <div className="grid grid-cols-2 gap-6">
          {[0, 1].map((idx) => (
            <Slot
              key={idx}
              paperId={slots[idx]}
              onPick={() => setPickerFor(idx)}
              onClear={() => fill(idx, null)}
            />
          ))}
        </div>

        {error && <p className="mt-4 text-center text-sm text-danger">{error}</p>}

        <div className="mt-6 flex justify-center">
          <Button size="lg" onClick={generate} disabled={!slots[0] && !slots[1]}>
            Generate comparison
          </Button>
        </div>
      </PageBody>

      <PickPaperModal
        open={pickerFor !== null}
        onClose={() => setPickerFor(null)}
        onSelect={(id) => fill(pickerFor, id)}
        bookmarks={bookmarks}
      />
    </>
  );
}

function Slot({ paperId, onPick, onClear }) {
  const p = paperId ? paperById(paperId) : null;
  if (!p) {
    return (
      <button
        onClick={onPick}
        className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-white/50 p-8 text-muted hover:border-info hover:text-info"
      >
        <Plus size={32} />
        <span className="mt-2 text-sm font-medium">Add a paper</span>
        <span className="mt-1 text-xs">Search · paste link · upload · browse bookmarks</span>
      </button>
    );
  }
  return (
    <div className="relative rounded-2xl border border-line bg-white p-6">
      <button
        onClick={onClear}
        className="absolute right-3 top-3 cursor-pointer rounded-lg p-1.5 text-muted hover:bg-black/5"
      >
        <X size={16} />
      </button>
      <h3 className="pr-8 font-display text-xl leading-snug text-info">{p.title}</h3>
      <p className="mt-2 text-sm text-ink/80">{p.authors.join(', ')}</p>
      <p className="mt-0.5 text-sm text-muted">
        {p.year} · {p.journal} · {p.citations.toLocaleString()} citations
      </p>
      <p className="mt-3 line-clamp-3 text-sm text-ink/70">{p.abstract}</p>
    </div>
  );
}

function PickPaperModal({ open, onClose, onSelect, bookmarks }) {
  const [tab, setTab] = useState('search');
  const [q, setQ] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  const searchResults = PAPERS.filter(
    (p) => p.inDB && (!q || p.title.toLowerCase().includes(q.toLowerCase()))
  );
  const bookmarked = bookmarks.papers.map(paperById).filter(Boolean);

  return (
    <>
      <Modal open={open} onClose={onClose} title="Add a paper to compare" wide>
        <div className="mb-4 flex gap-1 rounded-lg bg-page p-1">
          {[
            ['search', 'Search'],
            ['bookmarks', 'Bookmarks'],
            ['upload', 'Paste / upload'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => (id === 'upload' ? setUploadOpen(true) : setTab(id))}
              className={`flex-1 cursor-pointer rounded-md py-2 text-sm ${tab === id ? 'bg-white shadow-sm' : 'text-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'search' && (
          <>
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-line px-3 py-2">
              <SearchIcon size={16} className="text-muted" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search papers…"
                className="flex-1 text-sm outline-none"
              />
            </div>
            <div className="max-h-96 space-y-3 overflow-auto">
              {searchResults.map((p) => (
                <PaperCard key={p.id} paper={p} actions={[]} onSelect={(pp) => onSelect(pp.id)} />
              ))}
            </div>
          </>
        )}

        {tab === 'bookmarks' &&
          (bookmarked.length === 0 ? (
            <EmptyState icon={Bookmark} title="No bookmarked papers" />
          ) : (
            <div className="max-h-96 space-y-3 overflow-auto">
              {bookmarked.map((p) => (
                <PaperCard key={p.id} paper={p} actions={[]} onSelect={(pp) => onSelect(pp.id)} />
              ))}
            </div>
          ))}
      </Modal>
      <UploadPaperModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        mode="compare"
        onResolved={(p) => {
          setUploadOpen(false);
          onSelect(p.id);
        }}
      />
    </>
  );
}
