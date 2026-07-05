import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import PaperCard from '../components/PaperCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { Tabs, EmptyState, Avatar, Badge } from '../components/ui.jsx';
import { useStore } from '../store.js';
import { paperById } from '../data/papers.js';
import { authorById } from '../data/authors.js';
import { FORUM_POSTS } from '../data/community.js';
import { FIELDS } from '../data/fields.js';

const FILTERS = [
  { key: 'field', label: 'Field', type: 'select', options: FIELDS },
  { key: 'year', label: 'Year', type: 'range', min: 2000, max: 2026 },
];

export default function Bookmarks() {
  const bookmarks = useStore((s) => s.bookmarks);
  const [tab, setTab] = useState('all');
  const [filters, setFilters] = useState({});

  const papers = bookmarks.papers.map(paperById).filter(Boolean);
  const translations = bookmarks.translations.map(paperById).filter(Boolean);
  const forums = bookmarks.forums.map((id) => FORUM_POSTS.find((p) => p.id === id)).filter(Boolean);
  const following = bookmarks.following.map(authorById).filter(Boolean);

  const applyFilter = (list) => {
    let l = list;
    if (filters.field) l = l.filter((p) => p.field === filters.field);
    if (filters.year) l = l.filter((p) => p.year >= filters.year);
    return l;
  };

  return (
    <>
      <PageHeader title="Bookmarks" />
      <PageBody>
        <Tabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'papers', label: 'Papers' },
            { id: 'translations', label: 'Translations' },
            { id: 'forums', label: 'Forums' },
            { id: 'following', label: 'Following' },
          ]}
          active={tab}
          onChange={setTab}
          className="mb-4"
        />

        {(tab === 'all' || tab === 'papers' || tab === 'translations') && (
          <div className="mb-4">
            <FilterBar filterTypes={FILTERS} active={filters} onChange={setFilters} />
          </div>
        )}

        {(tab === 'all' || tab === 'papers') && (
          <Section title={tab === 'all' ? 'Papers' : null} list={applyFilter(papers)} empty="You haven't bookmarked anything here yet.">
            {applyFilter(papers).map((p) => (
              <PaperCard key={p.id} paper={p} showScore />
            ))}
          </Section>
        )}

        {(tab === 'all' || tab === 'translations') && (
          <Section title={tab === 'all' ? 'Translations' : null} list={applyFilter(translations)} empty="You haven't bookmarked anything here yet.">
            {applyFilter(translations).map((p) => (
              <div key={p.id}>
                <Badge tone="lime" className="mb-2">Translated</Badge>
                <PaperCard paper={p} showScore />
              </div>
            ))}
          </Section>
        )}

        {(tab === 'all' || tab === 'forums') && (
          <Section title={tab === 'all' ? 'Forums' : null} list={forums} empty="You haven't bookmarked anything here yet.">
            <div className="space-y-3">
              {forums.map((post) => (
                <Link
                  key={post.id}
                  to={`/forums/${post.id}`}
                  className="block rounded-xl border border-line bg-white p-4 hover:shadow-sm"
                >
                  <Badge tone="info">{post.type}</Badge>
                  <p className="mt-2 font-display text-lg text-ink">{post.title}</p>
                  <p className="text-sm text-muted">by {post.author.name}</p>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {(tab === 'all' || tab === 'following') && (
          <Section title={tab === 'all' ? 'Following' : null} list={following} empty="You haven't followed any authors yet.">
            <div className="grid grid-cols-2 gap-4">
              {following.map((a) => (
                <Link
                  key={a.id}
                  to={`/authors/${a.id}`}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 hover:shadow-sm"
                >
                  <Avatar name={a.name} size={44} />
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-muted">{a.institution}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}
      </PageBody>
    </>
  );
}

function Section({ title, list, empty, children }) {
  return (
    <div className="mb-8">
      {title && <h2 className="mb-3 font-display text-xl">{title}</h2>}
      {list.length === 0 ? (
        <EmptyState icon={Bookmark} title={empty} />
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  );
}
