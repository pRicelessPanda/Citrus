import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Languages,
  FolderKanban,
  Users,
  Bookmark,
  MessageSquare,
  Clock,
  TrendingUp,
  GitCompare,
} from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Badge, Avatar, timeAgo } from '../components/ui.jsx';
import { useStore, getAllDeadlines } from '../store.js';
import { paperById } from '../data/papers.js';
import { authorById } from '../data/authors.js';

const TODAY = new Date('2026-07-05');

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const translations = useStore((s) => s.translations);
  const projects = useStore((s) => s.projects);
  const papers = useStore((s) => s.researchPapers);
  const comparisons = useStore((s) => s.comparisons);
  const visited = useStore((s) => s.visited);
  const bookmarks = useStore((s) => s.bookmarks);
  const searches = useStore((s) => s.recentSearches);
  const following = useStore((s) => s.bookmarks.following);
  const deadlines = useMemo(() => getAllDeadlines(projects, papers), [projects, papers]);

  const upcoming = deadlines.filter((d) => !d.done && new Date(d.date) >= TODAY).slice(0, 4);

  const stats = [
    { label: 'Papers translated', value: translations.length, icon: Languages },
    { label: 'Active projects', value: projects.filter((p) => p.status === 'in progress').length, icon: FolderKanban },
    { label: 'Comparisons', value: comparisons.length, icon: GitCompare },
    { label: 'Following', value: following.length, icon: Users },
    { label: 'Bookmarks', value: bookmarks.papers.length + bookmarks.translations.length, icon: Bookmark },
    { label: 'Friends', value: user.friends.length, icon: Users },
  ];

  return (
    <>
      <PageHeader title={`Welcome back, ${user.displayName.split(' ')[0]}`} subtitle="Your research at a glance" />
      <PageBody>
        {/* analytics */}
        <div className="grid grid-cols-6 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-white p-4">
              <s.icon size={18} className="text-lime" />
              <p className="mt-2 font-display text-3xl">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">This month vs last</p>
            <p className="mt-1 flex items-center gap-2 font-display text-2xl">
              +3 <TrendingUp size={18} className="text-success" />
            </p>
            <p className="text-xs text-muted">translations</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Most-used reading level</p>
            <p className="mt-1 font-display text-2xl">Curious Adult</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Most-searched topic</p>
            <p className="mt-1 font-display text-2xl">Attention</p>
          </div>
        </div>

        {/* coming up */}
        <div className="mt-6 rounded-2xl border border-line bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <Clock size={18} /> Coming up
            </h2>
            <Link to="/calendar" className="text-sm text-info hover:underline">
              Open calendar →
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">No upcoming deadlines.</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-page">
                  <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                  <span className="flex-1 text-sm">{d.title}</span>
                  <span className="text-xs text-muted">{d.ownerName}</span>
                  <Badge>{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* most recent 3 of each */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <RecentList
            title="Projects"
            seeAll="/research"
            items={projects.slice(0, 3).map((p) => ({ key: p.id, to: `/research/project/${p.id}`, label: p.name, color: p.color }))}
            empty="No projects yet"
          />
          <RecentList
            title="Papers"
            seeAll="/research"
            items={papers.slice(0, 3).map((p) => ({ key: p.id, to: `/research/paper/${p.id}`, label: p.name, color: p.color }))}
            empty="No papers yet"
          />
          <RecentList
            title="Translations"
            seeAll="/translations"
            items={translations.slice(0, 3).map((t) => {
              const p = paperById(t.paperId);
              return { key: t.paperId, to: `/paper/${t.paperId}/translated`, label: p?.title, sub: timeAgo(t.at) };
            })}
            empty="No translations yet"
          />
          <RecentList
            title="Comparisons"
            seeAll="/comparisons"
            items={comparisons.slice(0, 3).map((c) => ({
              key: c.id,
              to: '/comparisons',
              label: `${paperById(c.a)?.title?.slice(0, 30)}… vs ${paperById(c.b)?.title?.slice(0, 20)}…`,
              sub: `Similarity ${c.similarity}/10`,
            }))}
            empty="No comparisons yet"
          />
          <RecentList
            title="Bookmarks"
            seeAll="/bookmarks"
            items={bookmarks.papers.slice(0, 3).map((id) => ({ key: id, to: `/paper/${id}`, label: paperById(id)?.title }))}
            empty="No bookmarks yet"
          />
          <RecentList
            title="Searched papers"
            seeAll="/search/recent"
            items={searches.slice(0, 3).map((s) => ({ key: s.id, to: '/search/recent', label: s.query, sub: timeAgo(s.at) }))}
            empty="No searches yet"
          />
          <RecentList
            title="Followed authors"
            seeAll="/bookmarks"
            items={following.slice(0, 3).map((aid) => {
              const a = authorById(aid);
              return { key: aid, to: `/authors/${aid}`, label: a?.name, sub: a?.institution };
            })}
            empty="No followed authors yet"
          />
          <RecentList title="Posts" seeAll="/forums" items={[]} empty="You haven't posted yet" />
        </div>
      </PageBody>
    </>
  );
}

function RecentList({ title, seeAll, items, empty }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg">{title}</h3>
        <Link to={seeAll} className="text-xs text-info hover:underline">
          See all
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <Link key={it.key} to={it.to} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-page">
              {it.color && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: it.color }} />}
              <span className="min-w-0 flex-1 truncate text-sm text-info">{it.label}</span>
              {it.sub && <span className="shrink-0 text-xs text-muted">{it.sub}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
