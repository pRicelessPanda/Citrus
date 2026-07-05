import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FolderKanban, Plus, FileText, FolderPlus } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Tabs, Badge, EmptyState, Button } from '../components/ui.jsx';
import { useStore } from '../store.js';

export default function Research() {
  const navigate = useNavigate();
  const projects = useStore((s) => s.projects);
  const papers = useStore((s) => s.researchPapers);
  const [tab, setTab] = useState('all');
  const [status, setStatus] = useState('All');

  const items = [
    ...(tab === 'papers' ? [] : projects),
    ...(tab === 'projects' ? [] : papers),
  ].filter((it) => status === 'All' || it.status === status.toLowerCase());

  return (
    <>
      <PageHeader
        title="Research projects & papers"
        right={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/research/new-project')}>
              <FolderPlus size={15} /> New project
            </Button>
            <Button size="sm" onClick={() => navigate('/research/new-paper')}>
              <Plus size={15} /> New paper
            </Button>
          </div>
        }
      />
      <PageBody>
        <div className="flex items-center justify-between">
          <Tabs
            tabs={[
              { id: 'projects', label: 'Projects' },
              { id: 'papers', label: 'Papers' },
              { id: 'all', label: 'All' },
            ]}
            active={tab}
            onChange={setTab}
          />
          <div className="flex gap-1 rounded-lg bg-page p-1">
            {['All', 'In progress', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm ${status === s ? 'bg-white shadow-sm' : 'text-muted'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {items.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="Nothing here yet"
              message="Create a research project or paper to get started."
              action={
                <>
                  <Button onClick={() => navigate('/research/new-project')}>New project</Button>
                  <Button variant="outline" onClick={() => navigate('/research/new-paper')}>
                    New paper
                  </Button>
                </>
              }
            />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {items.map((it) => (
                <ItemCard key={it.id} item={it} />
              ))}
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}

function ItemCard({ item }) {
  const isPaper = item.kind === 'paper';
  const to = isPaper ? `/research/paper/${item.id}` : `/research/project/${item.id}`;
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-line bg-white p-5 hover:shadow-md"
    >
      {/* white-hued gradient from the item's color */}
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: `linear-gradient(180deg, ${item.color}33, transparent)` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
            {isPaper ? <FileText size={14} /> : <FolderKanban size={14} />}
            {isPaper ? 'Paper' : 'Project'}
          </span>
          <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
        </div>
        <h3 className="mt-8 font-display text-xl leading-snug">{item.name}</h3>
        {item.category && <p className="mt-1 text-sm text-muted">{item.category}</p>}
        <div className="mt-4 flex items-center gap-2">
          {item.status === 'completed' ? (
            <Badge tone="success">Completed</Badge>
          ) : (
            <Badge tone="info">In progress</Badge>
          )}
          {!isPaper && item.references && (
            <span className="text-xs text-muted">{item.references.length} references</span>
          )}
        </div>
      </div>
    </Link>
  );
}
