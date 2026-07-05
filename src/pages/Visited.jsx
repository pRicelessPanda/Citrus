import { useState } from 'react';
import { History } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import PaperCard from '../components/PaperCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { EmptyState, timeAgo } from '../components/ui.jsx';
import { useStore } from '../store.js';
import { paperById } from '../data/papers.js';
import { FIELDS } from '../data/fields.js';

const FILTERS = [
  { key: 'field', label: 'Field', type: 'select', options: FIELDS },
  { key: 'year', label: 'Year', type: 'range', min: 2000, max: 2026 },
];

export default function Visited() {
  const visited = useStore((s) => s.visited);
  const removeVisited = useStore((s) => s.removeVisited);
  const [filters, setFilters] = useState({});

  let items = visited.map((v) => ({ ...v, paper: paperById(v.paperId) })).filter((v) => v.paper);
  if (filters.field) items = items.filter((v) => v.paper.field === filters.field);
  if (filters.year) items = items.filter((v) => v.paper.year >= filters.year);
  items.sort((a, b) => new Date(b.at) - new Date(a.at));

  return (
    <>
      <PageHeader title="Visited papers" subtitle="Every paper you've opened" />
      <PageBody>
        <div className="mb-4">
          <FilterBar filterTypes={FILTERS} active={filters} onChange={setFilters} />
        </div>
        {items.length === 0 ? (
          <EmptyState icon={History} title="You haven't visited any papers yet" />
        ) : (
          <div className="space-y-4">
            {items.map((v) => (
              <PaperCard
                key={v.paperId}
                paper={v.paper}
                showScore
                timestamp={`Visited ${timeAgo(v.at)}`}
                onRemove={() => removeVisited(v.paperId)}
              />
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
