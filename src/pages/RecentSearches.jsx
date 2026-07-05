import { useNavigate } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Button, EmptyState } from '../components/ui.jsx';
import { useStore } from '../store.js';
import { timeAgo } from '../components/ui.jsx';

export default function RecentSearches() {
  const navigate = useNavigate();
  const searches = useStore((s) => s.recentSearches);
  const removeSearch = useStore((s) => s.removeSearch);
  const clearSearches = useStore((s) => s.clearSearches);

  return (
    <>
      <PageHeader
        title="Recent searches"
        right={
          searches.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearSearches}>
              Clear all
            </Button>
          )
        }
      />
      <PageBody>
        {searches.length === 0 ? (
          <EmptyState icon={Clock} title="You haven't searched for anything yet" />
        ) : (
          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {searches.map((s) => (
              <div key={s.id} className="group flex items-center gap-3 px-4 py-3 hover:bg-page">
                <Clock size={16} className="text-muted" />
                <button
                  onClick={() => navigate('/search', { state: { rerun: s.query } })}
                  className="flex-1 cursor-pointer text-left text-sm text-info hover:underline"
                >
                  {s.query}
                </button>
                <span className="text-xs text-muted">{timeAgo(s.at)}</span>
                <button
                  onClick={() => removeSearch(s.id)}
                  className="cursor-pointer text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
