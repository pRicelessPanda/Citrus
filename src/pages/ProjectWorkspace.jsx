import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Pencil,
  Check,
  FileText,
  MessageSquare,
  BookOpen,
  Library,
  StickyNote,
  Lightbulb,
  FlaskConical,
  Activity,
  Plus,
  Loader2,
  Trash2,
  Search as SearchIcon,
  Archive,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button, Badge, EmptyState, ConfirmPopup, useToast, formatDateTime } from '../components/ui.jsx';
import CredibilityScore from '../components/CredibilityScore.jsx';
import ChatPanel from '../components/ChatPanel.jsx';
import AskAISplitScreen, { AskAIButton } from '../components/AskAISplitScreen.jsx';
import ArxivPaperPage from '../components/ArxivPaperPage.jsx';
import FilterBar from '../components/FilterBar.jsx';
import { useStore } from '../store.js';
import { paperById, relatedPapers, PAPERS } from '../data/papers.js';
import UploadPaperModal from '../components/UploadPaperModal.jsx';

const TABS = [
  { id: 'background', label: 'Background', icon: FileText },
  { id: 'chat', label: 'AI Chatbot', icon: MessageSquare },
  { id: 'lit', label: 'Literature Review', icon: BookOpen },
  { id: 'refs', label: 'Reference Papers/Sources', icon: Library },
  { id: 'notes', label: 'Notes', icon: StickyNote, stub: true },
  { id: 'insights', label: 'Insights', icon: Lightbulb, stub: true },
  { id: 'experiment', label: 'Experiment Designer', icon: FlaskConical, stub: true },
  { id: 'monitor', label: 'Monitoring / Living Project', icon: Activity, stub: true },
];

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const project = useStore((s) => s.projects.find((p) => p.id === id));
  const updateProject = useStore((s) => s.updateProject);
  const deleteProject = useStore((s) => s.deleteProject);

  const [tab, setTab] = useState('background');
  const [askOpen, setAskOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!project) return <div className="p-8">Project not found.</div>;

  const inProgress = project.status === 'in progress';

  return (
    <>
      {/* header */}
      <div className="sticky top-0 z-30 border-b border-line bg-page/90 px-8 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full" style={{ background: project.color }} />
            <h1 className="font-display text-2xl">{project.name}</h1>
            {project.status === 'completed' ? (
              <Badge tone="success">Completed</Badge>
            ) : (
              <Badge tone="info">In progress</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {inProgress ? (
              <>
                <Button variant="outline" size="sm" onClick={() => { updateProject(id, { status: 'completed' }); toast('Project marked complete'); }}>
                  <CheckCircle2 size={15} /> Mark as complete
                </Button>
                <Button variant="outline" size="sm" onClick={() => { updateProject(id, { archived: true, status: 'in progress' }); toast('Archived'); }}>
                  <Archive size={15} /> Archive
                </Button>
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(true)}>
                  <Trash2 size={15} /> Delete
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => updateProject(id, { status: 'in progress' })}>
                Mark as in progress
              </Button>
            )}
            <AskAIButton onClick={() => setAskOpen(true)} />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* bookmark-style side tabs (all same level) */}
        <div className="w-60 shrink-0 border-r border-line bg-white px-3 py-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`mb-1 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm ${
                tab === t.id ? 'bg-navy text-white' : 'text-ink/80 hover:bg-page'
              }`}
            >
              <t.icon size={16} />
              <span className="flex-1">{t.label}</span>
              {t.stub && <span className="text-[10px] uppercase text-muted">soon</span>}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="min-w-0 flex-1 p-8">
          {tab === 'background' && <BackgroundTab project={project} updateProject={updateProject} />}
          {tab === 'chat' && <ChatTab project={project} />}
          {tab === 'lit' && <LiteratureTab project={project} />}
          {tab === 'refs' && <ReferencesTab project={project} />}
          {['notes', 'insights', 'experiment', 'monitor'].includes(tab) && (
            <StubTab tab={TABS.find((t) => t.id === tab)} />
          )}
        </div>
      </div>

      <AskAISplitScreen
        open={askOpen}
        onClose={() => setAskOpen(false)}
        context={project.name}
        scopeLabel="Full access to this project · shared memory"
        left={
          <div className="p-6">
            <h2 className="font-display text-xl">{project.overview.title}</h2>
            <p className="mt-2 text-sm text-muted">{project.overview.rationale}</p>
            <p className="mt-3 text-sm"><b>Hypothesis:</b> {project.overview.hypothesis}</p>
          </div>
        }
      />

      <ConfirmPopup
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteProject(id);
          navigate('/research');
        }}
        title="Delete project?"
        message="This project and its references will be permanently deleted."
        confirmLabel="Delete"
        danger
      />
    </>
  );
}

function BackgroundTab({ project, updateProject }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project.overview);
  const toast = useToast();

  const save = () => {
    updateProject(project.id, { overview: draft });
    setEditing(false);
    toast('Background saved');
  };

  const ov = editing ? draft : project.overview;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl">Background</h2>
        <div className="flex gap-2">
          {!project.outlineDone && (
            <Button size="sm" variant="lime" onClick={() => { updateProject(project.id, { outlineDone: true }); toast('Outline marked as done — suggested papers unlocked'); }}>
              Mark tab as done
            </Button>
          )}
          {editing ? (
            <Button size="sm" onClick={save}><Check size={15} /> Save</Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => { setDraft(project.overview); setEditing(true); }}>
              <Pencil size={15} /> Edit
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        {editing ? (
          <div className="space-y-4">
            {[
              ['title', 'Title'],
              ['rationale', 'Rationale'],
              ['hypothesis', 'Central hypothesis'],
              ['solution', 'Solution direction'],
            ].map(([k, label]) => (
              <div key={k}>
                <label className="text-xs font-medium uppercase tracking-wide text-muted">{label}</label>
                <textarea
                  value={draft[k]}
                  onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                  rows={k === 'solution' ? 5 : 2}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="prose-sm space-y-4">
            <h1 className="font-display text-3xl">{ov.title}</h1>
            <Doc label="Rationale" text={ov.rationale} />
            <Doc label="Central hypothesis" text={ov.hypothesis} />
            <Doc label="Solution direction" text={ov.solution} />
          </div>
        )}
      </div>
    </div>
  );
}

function Doc({ label, text }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</h3>
      <p className="mt-1 text-[15px] leading-relaxed text-ink/90">{text}</p>
    </div>
  );
}

function ChatTab({ project }) {
  return (
    <div className="mx-auto flex h-[calc(100vh-220px)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-line">
      <ChatPanel
        context={project.name}
        scopeLabel="Unified history · shared memory across collaborators"
        seedMessages={[
          { id: 1, role: 'ai', author: 'Citrus AI', at: '2026-07-01T10:00:00Z', text: `I have full access to “${project.name}” — Tab 1, Tab 2, papers, notes, deadlines and chat history. Ask me anything.` },
        ]}
      />
    </div>
  );
}

function LiteratureTab({ project }) {
  const [sub, setSub] = useState('suggested');
  const addProjectReference = useStore((s) => s.addProjectReference);
  const toast = useToast();

  return (
    <div>
      <div className="mb-5 flex gap-1">
        {[
          ['suggested', 'Suggested papers'],
          ['search', 'Search for papers'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSub(id)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm ${sub === id ? 'bg-navy text-white' : 'bg-white text-ink/80 border border-line'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {sub === 'suggested' ? (
        <SuggestedPapers project={project} onAdd={(pid) => { addProjectReference(project.id, pid); toast('Added to project reference'); }} />
      ) : (
        <LitSearch project={project} />
      )}
    </div>
  );
}

function SuggestedPapers({ project, onAdd }) {
  const [count, setCount] = useState(5);
  const [pool] = useState(() => {
    // 10 generated, strictly ordered by credibility × relevance
    const base = relatedPapers(project.overview?.title || '', 10);
    const filler = PAPERS.filter((p) => p.inDB && !base.includes(p));
    return [...base, ...filler]
      .slice(0, 10)
      .map((p, i) => ({ paper: p, relevance: +(9.5 - i * 0.4).toFixed(1) }))
      .sort((a, b) => (b.paper.scores?.final || 0) + b.relevance - ((a.paper.scores?.final || 0) + a.relevance));
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [extra, setExtra] = useState([]);

  if (!project.outlineDone) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Complete the outline first"
        message='Suggested papers activate after you press "Mark tab as done" on Background.'
      />
    );
  }

  const shown = [...pool, ...extra].slice(0, count);
  const atMax = count >= pool.length + extra.length;

  const generateMore = async () => {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 1000));
    const more = PAPERS.filter((p) => p.inDB)
      .slice(0, 10)
      .map((p, i) => ({ paper: p, relevance: +(7 - i * 0.2).toFixed(1), extra: true }));
    setExtra((e) => [...e, ...more]);
    setCount((c) => c + 10);
    setLoadingMore(false);
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Strictly ordered by Source Credibility Score with Relevance · showing {shown.length}
      </p>
      <div className="space-y-4">
        {shown.map(({ paper, relevance }) => (
          <div key={paper.id + relevance} className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <a
                  href={`/paper/${paper.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-lg leading-snug text-info hover:underline"
                >
                  {paper.title} <ExternalLink size={13} className="inline" />
                </a>
                <p className="mt-1 text-sm text-ink/80">{paper.authors.join(', ')}</p>
                <p className="text-sm text-muted">{paper.year} · {paper.journal}</p>
                <div className="mt-2">
                  <CredibilityScore
                    scores={paper.scores ? { ...paper.scores, relevance, final: +(((paper.scores.currency + paper.scores.journal + paper.scores.author + paper.scores.accuracy + relevance) / 5).toFixed(1)) } : null}
                    evidenceStrength={paper.evidenceStrength}
                  />
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAdd(paper.id)}>
                <Plus size={15} /> Add to project reference
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        {!atMax ? (
          <Button variant="outline" onClick={() => setCount(pool.length)}>Expand — show all 10</Button>
        ) : (
          <Button variant="outline" onClick={generateMore} disabled={loadingMore}>
            {loadingMore ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Ask AI to generate more
          </Button>
        )}
      </div>
    </div>
  );
}

function LitSearch({ project }) {
  const [q, setQ] = useState('');
  const [openPaper, setOpenPaper] = useState(null);
  const addProjectReference = useStore((s) => s.addProjectReference);
  const toast = useToast();
  const results = PAPERS.filter((p) => p.inDB && (!q || p.title.toLowerCase().includes(q.toLowerCase())));

  if (openPaper) {
    return (
      <div>
        <button onClick={() => setOpenPaper(null)} className="mb-3 cursor-pointer text-sm text-info hover:underline">
          ← Back to search
        </button>
        <div className="-mx-8">
          <ArxivPaperPage
            paperId={openPaper}
            actions={['translate', 'evaluate', 'addToProjectReference']}
            onTranslate={() => toast('Translating…')}
            onEvaluate={() => toast('Evaluating Source Credibility with Relevance…')}
            onAddToProjectReference={(p) => { addProjectReference(project.id, p.id); toast('Added to project reference'); setOpenPaper(null); }}
            extraNote='Inside Literature Review the only actions are Translate, Evaluate Source Credibility with Relevance, and Add to project reference.'
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5">
        <SearchIcon size={18} className="text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search papers — stays inside this tab…"
          className="flex-1 text-sm outline-none"
        />
      </div>
      <div className="space-y-4">
        {results.map((p) => (
          <div key={p.id} className="rounded-xl border border-line bg-white p-4">
            <button onClick={() => setOpenPaper(p.id)} className="cursor-pointer text-left">
              <p className="font-display text-lg text-info hover:underline">{p.title}</p>
            </button>
            <p className="text-sm text-ink/80">{p.authors.join(', ')}</p>
            <p className="text-sm text-muted">{p.year} · {p.journal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferencesTab({ project }) {
  const removeProjectReference = useStore((s) => s.removeProjectReference);
  const toast = useToast();
  const [filters, setFilters] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  let refs = (project.references || []).map((r) => ({ ...r, paper: paperById(r.paperId) })).filter((r) => r.paper);
  // N/A pinned to top logic is illustrated via credibility filter
  if (filters.credibility) refs = refs.filter((r) => (r.paper.scores?.final || 0) >= filters.credibility);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl">Reference papers &amp; sources</h2>
        <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
          <Plus size={15} /> Add your own
        </Button>
      </div>

      <div className="mb-4">
        <FilterBar
          filterTypes={[
            { key: 'credibility', label: 'Min credibility', type: 'range', min: 0, max: 10 },
          ]}
          active={filters}
          onChange={setFilters}
        />
      </div>

      {refs.length === 0 ? (
        <EmptyState icon={Library} title="No references yet" message='Add papers via "Add to project reference".' />
      ) : (
        <div className="space-y-4">
          {refs.map((r) => (
            <div key={r.paperId} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <a href={`/paper/${r.paper.id}`} target="_blank" rel="noreferrer" className="font-display text-lg text-info hover:underline">
                    {r.paper.title} <ExternalLink size={13} className="inline" />
                  </a>
                  <p className="text-sm text-ink/80">{r.paper.authors.join(', ')}</p>
                  <p className="text-xs text-muted">Added {formatDateTime(r.addedAt)}</p>
                  <div className="mt-2">
                    <CredibilityScore
                      scores={r.paper.scores ? { ...r.paper.scores, relevance: r.relevance, final: +(((r.paper.scores.currency + r.paper.scores.journal + r.paper.scores.author + r.paper.scores.accuracy + r.relevance) / 5).toFixed(1)) } : null}
                      evidenceStrength={r.paper.evidenceStrength}
                    />
                  </div>
                </div>
                <button onClick={() => setConfirm(r.paperId)} className="cursor-pointer text-muted hover:text-danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadPaperModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode="add"
        onResolved={(p) => { useStore.getState().addProjectReference(project.id, p.id); toast('Added to project reference'); }}
      />

      <ConfirmPopup
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => removeProjectReference(project.id, confirm)}
        title="Remove reference?"
        message="This paper will be removed from your project references."
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}

function StubTab({ tab }) {
  return (
    <EmptyState
      icon={tab.icon}
      title={`${tab.label} — coming soon`}
      message="This part of the workspace is in development. The navigation is complete; the content will arrive in a future release."
    />
  );
}
