import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rows3 } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { EmptyState, ConfirmPopup, Badge, timeAgo } from '../components/ui.jsx';
import { useStore } from '../store.js';
import { paperById } from '../data/papers.js';
import { FIELDS } from '../data/fields.js';

const FILTERS = [
  { key: 'field', label: 'Field', type: 'select', options: FIELDS },
  { key: 'year', label: 'Year', type: 'range', min: 2000, max: 2026 },
];

export default function Comparisons() {
  const navigate = useNavigate();
  const comparisons = useStore((s) => s.comparisons);
  const removeComparison = useStore((s) => s.removeComparison);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('recent');
  const [confirm, setConfirm] = useState(null);

  let items = comparisons
    .map((c) => ({ ...c, pa: paperById(c.a), pb: paperById(c.b) }))
    .filter((c) => c.pa && c.pb);
  if (filters.field) items = items.filter((c) => c.pa.field === filters.field || c.pb.field === filters.field);
  items.sort((a, b) => (sort === 'similarity' ? b.similarity - a.similarity : new Date(b.at) - new Date(a.at)));

  return (
    <>
      <PageHeader title="Comparisons" subtitle={`${comparisons.length} saved comparisons`} />
      <PageBody>
        <div className="mb-4">
          <FilterBar
            filterTypes={FILTERS}
            active={filters}
            onChange={setFilters}
            right={
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none"
              >
                <option value="recent">Most recent</option>
                <option value="similarity">Highest similarity</option>
              </select>
            }
          />
        </div>
        {items.length === 0 ? (
          <EmptyState icon={Rows3} title="You haven't compared any papers yet" />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((c) => (
              <div key={c.id} className="rounded-xl border border-line bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge tone="info">Similarity {c.similarity}/10</Badge>
                  <span className="text-xs text-muted">{timeAgo(c.at)}</span>
                </div>
                <button
                  onClick={() => navigate('/compare/result', { state: { a: c.a, b: c.b } })}
                  className="block cursor-pointer text-left"
                >
                  <p className="font-display leading-snug text-info hover:underline">{c.pa.title}</p>
                  <p className="my-1 text-center text-xs text-muted">vs</p>
                  <p className="font-display leading-snug text-info hover:underline">{c.pb.title}</p>
                </button>
                <button
                  onClick={() => setConfirm(c.id)}
                  className="mt-3 cursor-pointer text-xs text-danger hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </PageBody>
      <ConfirmPopup
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => removeComparison(confirm)}
        title="Delete comparison?"
        message="This comparison will be removed from your library."
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
