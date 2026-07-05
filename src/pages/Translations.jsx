import { useState } from 'react';
import { Languages } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import PaperCard from '../components/PaperCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { EmptyState, ConfirmPopup, timeAgo } from '../components/ui.jsx';
import { useStore } from '../store.js';
import { paperById } from '../data/papers.js';
import { FIELDS, READING_LEVELS } from '../data/fields.js';

const FILTERS = [
  { key: 'field', label: 'Field', type: 'select', options: FIELDS },
  { key: 'year', label: 'Year', type: 'range', min: 2000, max: 2026 },
  { key: 'level', label: 'Reading level', type: 'select', options: READING_LEVELS },
];

export default function Translations() {
  const translations = useStore((s) => s.translations);
  const removeTranslation = useStore((s) => s.removeTranslation);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('date');
  const [confirm, setConfirm] = useState(null);

  let items = translations
    .map((t) => ({ ...t, paper: paperById(t.paperId) }))
    .filter((t) => t.paper);
  if (filters.field) items = items.filter((t) => t.paper.field === filters.field);
  if (filters.year) items = items.filter((t) => t.paper.year >= filters.year);
  if (filters.level) items = items.filter((t) => t.level === filters.level);
  items.sort((a, b) =>
    sort === 'citations'
      ? b.paper.citations - a.paper.citations
      : new Date(b.at) - new Date(a.at)
  );

  return (
    <>
      <PageHeader title="Translations" subtitle={`${translations.length} translated papers`} />
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
                <option value="date">Most recent</option>
                <option value="citations">Most cited</option>
              </select>
            }
          />
        </div>
        {items.length === 0 ? (
          <EmptyState icon={Languages} title="You haven't translated anything here yet" />
        ) : (
          <div className="space-y-4">
            {items.map((t) => (
              <PaperCard
                key={t.paperId}
                paper={t.paper}
                showScore
                timestamp={`Translated ${timeAgo(t.at)} · ${t.level}`}
                onRemove={() => setConfirm(t.paperId)}
              />
            ))}
          </div>
        )}
      </PageBody>
      <ConfirmPopup
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => removeTranslation(confirm)}
        title="Delete translation?"
        message="This translation will be removed from your library."
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
