import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, LayoutGrid, List, Clock, Upload, Link2, Sparkles } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import PaperCard from '../components/PaperCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { Tabs, Button, EmptyState, Avatar } from '../components/ui.jsx';
import { useStore } from '../store.js';
import { PAPERS } from '../data/papers.js';
import { FIELDS } from '../data/fields.js';
import { searchPapers, needsClarification } from '../services/mockAI.js';
import { authorById, papersByAuthor } from '../data/authors.js';
import UploadPaperModal from '../components/UploadPaperModal.jsx';

const FILTER_TYPES = [
  { key: 'field', label: 'Field', type: 'select', options: FIELDS },
  { key: 'yearFrom', label: 'Year from', type: 'range', min: 2000, max: 2026 },
  { key: 'yearTo', label: 'Year to', type: 'range', min: 2000, max: 2026 },
  { key: 'minCitations', label: 'Min citations', type: 'number', placeholder: 'e.g. 100' },
  { key: 'access', label: 'Access type', type: 'select', options: ['open access', 'arXiv', 'already translated'] },
  { key: 'journal', label: 'Journal', type: 'text', placeholder: 'Journal name' },
  { key: 'keyword', label: 'Keyword', type: 'text', placeholder: 'Keyword' },
];

export default function Search() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const addSearch = useStore((s) => s.addSearch);
  const following = useStore((s) => s.bookmarks.following);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null); // null = home state
  const [loading, setLoading] = useState(false);
  const [clarify, setClarify] = useState(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('relevance');
  const [view, setView] = useState('list');
  const [homeTab, setHomeTab] = useState('suggested');
  const [uploadOpen, setUploadOpen] = useState(false);

  const runSearch = async (q, skipClarify = false) => {
    const term = q ?? query;
    if (!term.trim()) return;
    setLoading(true);
    setClarify(null);
    if (!skipClarify && (await needsClarification(term))) {
      setLoading(false);
      setClarify(
        `Could you tell me a bit more about what you're looking for in “${term}”? For example, a specific method, population, or year range. You can also skip and search anyway.`
      );
      return;
    }
    addSearch(term);
    const res = await searchPapers(term, filters);
    setResults(sortResults(res, sort));
    setLoading(false);
  };

  const sortResults = (list, s) => {
    const c = [...list];
    if (s === 'recent') c.sort((a, b) => b.year - a.year);
    if (s === 'cited') c.sort((a, b) => b.citations - a.citations);
    return c;
  };

  const onSortChange = (s) => {
    setSort(s);
    if (results) setResults(sortResults(results, s));
  };

  return (
    <>
      <PageHeader
        title="Paper search"
        subtitle="Conversational, AI-style discovery"
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/search/recent')}>
              <Clock size={15} /> Recent
            </Button>
            <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
              <Upload size={15} /> Upload / link
            </Button>
          </div>
        }
      >
        <div className="mx-auto max-w-6xl px-8 pb-5">
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm focus-within:border-info">
            <Sparkles size={20} className="text-lime" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              placeholder="Describe what you're looking for…"
              className="flex-1 bg-transparent text-base outline-none"
            />
            <Button onClick={() => runSearch()} disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageBody>
        <div className="mb-4">
          <FilterBar filterTypes={FILTER_TYPES} active={filters} onChange={setFilters} />
        </div>

        {clarify && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-line bg-info-light/50 p-4">
            <Avatar name="Citrus AI" size={32} />
            <div className="flex-1">
              <p className="text-sm text-ink">{clarify}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => runSearch(query, true)}>
                  Skip &amp; search anyway
                </Button>
              </div>
            </div>
          </div>
        )}

        {results === null ? (
          <HomeState
            tab={homeTab}
            setTab={setHomeTab}
            user={user}
            following={following}
            onSearchNow={() => document.querySelector('input')?.focus()}
          />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">{results.length} results</p>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="recent">Most recent</option>
                  <option value="cited">Most cited</option>
                </select>
                <div className="flex rounded-lg border border-line bg-white">
                  <button
                    onClick={() => setView('list')}
                    className={`cursor-pointer rounded-l-lg p-2 ${view === 'list' ? 'bg-page text-ink' : 'text-muted'}`}
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setView('grid')}
                    className={`cursor-pointer rounded-r-lg p-2 ${view === 'grid' ? 'bg-page text-ink' : 'text-muted'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>
            </div>
            {results.length === 0 ? (
              <EmptyState icon={SearchIcon} title="No papers found" message="Try a different query or adjust your filters." />
            ) : (
              <div className={view === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
                {results.map((p) => (
                  <PaperCard key={p.id} paper={p} showScore compact={view === 'grid'} />
                ))}
              </div>
            )}
          </>
        )}
      </PageBody>

      <UploadPaperModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}

function HomeState({ tab, setTab, user, following, onSearchNow }) {
  const navigate = useNavigate();
  const hasFields = user.fieldInterests.length > 0;

  const suggested = PAPERS.filter((p) => p.inDB).slice(0, 6);
  const trending = PAPERS.filter((p) => user.fieldInterests.includes(p.field));
  const fromFollowed = following.flatMap((aid) => papersByAuthor(aid)).filter((p) => p.inDB);

  return (
    <>
      <Tabs
        tabs={[
          { id: 'suggested', label: 'Suggested papers' },
          { id: 'trending', label: 'Trending in fields you follow' },
          { id: 'authors', label: 'From authors you follow' },
        ]}
        active={tab}
        onChange={setTab}
        className="mb-6"
      />

      {tab === 'suggested' &&
        (suggested.length === 0 ? (
          <EmptyState
            title="Search for something to get started"
            message="Search for something to get started or add your field interests in settings."
            action={
              <>
                <Button onClick={onSearchNow}>Search now →</Button>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  Go to settings →
                </Button>
              </>
            }
          />
        ) : (
          <div className="space-y-4">
            {suggested.map((p) => (
              <PaperCard key={p.id} paper={p} showScore />
            ))}
          </div>
        ))}

      {tab === 'trending' &&
        (!hasFields ? (
          <EmptyState
            title="You haven't selected any fields of interest yet"
            action={<Button onClick={() => navigate('/settings')}>Complete your profile →</Button>}
          />
        ) : (
          <div className="space-y-4">
            {trending.map((p) => (
              <PaperCard key={p.id} paper={p} showScore />
            ))}
          </div>
        ))}

      {tab === 'authors' &&
        (following.length === 0 ? (
          <EmptyState
            title="You haven't followed any authors yet"
            action={<Button onClick={() => navigate('/settings')}>Complete your profile →</Button>}
          />
        ) : fromFollowed.length === 0 ? (
          <EmptyState title="No recent papers from authors you follow" />
        ) : (
          <div className="space-y-4">
            {fromFollowed.map((p) => (
              <PaperCard key={p.id} paper={p} showScore />
            ))}
          </div>
        ))}
    </>
  );
}
