import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Plus,
  Loader2,
  Check,
  Share2,
  FileDown,
  CheckCircle2,
  Archive,
  Trash2,
  AlertTriangle,
  Flag,
  X,
  MessageSquare,
  Hash,
  Bot,
} from 'lucide-react';
import { Button, Badge, Modal, ConfirmPopup, useToast, Avatar } from '../components/ui.jsx';
import AskAISplitScreen, { AskAIButton } from '../components/AskAISplitScreen.jsx';
import ChatPanel from '../components/ChatPanel.jsx';
import { useStore } from '../store.js';
import { paperById, PAPERS } from '../data/papers.js';
import { generatePaper, reviewDraft } from '../services/mockAI.js';
import { useEffect } from 'react';

const SECTIONS = [
  'Abstract',
  'Introduction',
  'Literature Review',
  'Methodology',
  'Results',
  'Discussion',
  'Limitations',
  'Conclusion',
];
const CITATION_STYLES = ['APA', 'MLA', 'Chicago', 'IEEE'];

export default function PaperWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const paper = useStore((s) => s.researchPapers.find((p) => p.id === id));
  const updatePaper = useStore((s) => s.updateResearchPaper);
  const deletePaper = useStore((s) => s.deleteResearchPaper);

  const [tab, setTab] = useState('sections');
  const [askOpen, setAskOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [generating, setGenerating] = useState(false);

  if (!paper) return <div className="p-8">Paper not found.</div>;
  const inProgress = paper.status === 'in progress';

  const generate = async () => {
    setGenerating(true);
    const selectedSources = paper.sources.map((s) => paperById(s.paperId)).filter(Boolean);
    const gen = await generatePaper(SECTIONS, selectedSources);
    updatePaper(id, { generated: gen });
    setGenerating(false);
    setTab('generated');
    toast('Paper generated');
  };

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-line bg-page/90 px-8 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full" style={{ background: paper.color }} />
            <h1 className="font-display text-2xl">{paper.name}</h1>
            <Badge tone={paper.status === 'completed' ? 'success' : 'info'}>
              {paper.status === 'completed' ? 'Completed' : 'In progress'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
              <Share2 size={15} /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast('Exporting…')}>
              <FileDown size={15} /> Export
            </Button>
            {inProgress ? (
              <>
                <Button variant="outline" size="sm" onClick={() => { updatePaper(id, { status: 'completed' }); toast('Marked complete'); }}>
                  <CheckCircle2 size={15} /> Mark complete
                </Button>
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(true)}>
                  <Trash2 size={15} /> Delete
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => updatePaper(id, { status: 'in progress' })}>
                Mark as in progress
              </Button>
            )}
            <AskAIButton onClick={() => setAskOpen(true)} />
          </div>
        </div>

        <div className="mt-4 flex gap-1">
          {[
            ['sections', 'Tab 1 — Sections'],
            ['sources', 'Tab 2 — Sources'],
            ['generated', 'Generated paper'],
          ].map(([tid, label]) => (
            <button
              key={tid}
              onClick={() => setTab(tid)}
              className={`cursor-pointer rounded-t-lg px-4 py-2 text-sm ${tab === tid ? 'bg-white font-medium shadow-sm' : 'text-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-8 py-6">
        {tab === 'sections' && (
          <SectionsTab paper={paper} updatePaper={updatePaper} onGenerate={generate} generating={generating} goToSources={() => setTab('sources')} />
        )}
        {tab === 'sources' && <SourcesTab paper={paper} updatePaper={updatePaper} />}
        {tab === 'generated' && <GeneratedTab paper={paper} updatePaper={updatePaper} onGenerate={generate} generating={generating} />}
      </div>

      <AskAISplitScreen
        open={askOpen}
        onClose={() => setAskOpen(false)}
        context={paper.name}
        scopeLabel="AI channel · edits the paper directly · persistent memory"
        left={
          <div className="p-6">
            <h2 className="font-display text-xl">{paper.academicTitle}</h2>
            {paper.generated ? (
              paper.generated.map((g) => (
                <div key={g.section} className="mt-3">
                  <h3 className="font-semibold">{g.section}</h3>
                  <p className="text-sm text-ink/80">{g.text}</p>
                </div>
              ))
            ) : (
              <p className="mt-2 text-sm text-muted">Generate the paper to see it here.</p>
            )}
          </div>
        }
      />

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} paper={paper} updatePaper={updatePaper} />

      <ConfirmPopup
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { deletePaper(id); navigate('/research'); }}
        title="Delete paper?"
        message="This paper and its drafts will be permanently deleted."
        confirmLabel="Delete"
        danger
      />
    </>
  );
}

function SectionsTab({ paper, updatePaper, onGenerate, generating, goToSources }) {
  const [instructions, setInstructions] = useState('');
  const setSection = (section, patch) => {
    updatePaper(paper.id, { tab1: { ...paper.tab1, [section]: { ...paper.tab1[section], ...patch } } });
  };

  return (
    <div>
      <div className="mb-5 rounded-xl border border-line bg-white p-4">
        <label className="text-xs font-medium uppercase tracking-wide text-muted">Project context</label>
        <textarea
          defaultValue={paper.context}
          onBlur={(e) => updatePaper(paper.id, { context: e.target.value })}
          rows={2}
          placeholder="Rationale / description — the AI reads this first."
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
        />
      </div>

      <div className="space-y-3">
        {SECTIONS.map((section) => {
          const data = paper.tab1[section] || { notes: '', sources: [], refs: [] };
          return (
            <div key={section} className="rounded-xl border border-line bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-display text-lg">{section}</h3>
                <button onClick={goToSources} title="Jump to Tab 2" className="cursor-pointer rounded-lg p-1 text-muted hover:bg-page">
                  <Plus size={16} />
                </button>
              </div>
              <textarea
                value={data.notes}
                onChange={(e) => setSection(section, { notes: e.target.value })}
                rows={2}
                placeholder="Notes for this section…"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
              />
              <div className="mt-2">
                <p className="mb-1 text-xs font-medium text-muted">Sources (from Tab 2)</p>
                <div className="flex flex-wrap gap-2">
                  {paper.sources.length === 0 && <span className="text-xs text-muted">No sources yet — add in Tab 2.</span>}
                  {paper.sources.map((s, i) => {
                    const p = paperById(s.paperId);
                    const checked = data.sources.includes(s.id);
                    return (
                      <label key={s.id} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-xs">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSection(section, {
                              sources: checked ? data.sources.filter((x) => x !== s.id) : [...data.sources, s.id],
                            })
                          }
                        />
                        [{i + 1}] {p ? p.title.slice(0, 30) : 'Source'}…
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-line bg-white p-4">
        <label className="text-xs font-medium uppercase tracking-wide text-muted">
          Additional references &amp; instructions
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={2}
          placeholder="Style / content / structure / tone instructions…"
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <Button size="lg" onClick={onGenerate} disabled={generating}>
          {generating ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          Generate paper
        </Button>
      </div>
    </div>
  );
}

function SourcesTab({ paper, updatePaper }) {
  const [input, setInput] = useState('');
  const add = () => {
    if (!input.trim()) return;
    // broken-link demo: contains "error"
    const broken = /error/i.test(input);
    updatePaper(paper.id, {
      sources: [...paper.sources, { id: `s-${Date.now()}`, paperId: matchPaper(input), custom: input, broken }],
    });
    setInput('');
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Numbered list — paste links or upload PDFs. arXiv links auto-fetched. Sources auto-appear in Tab 1.
      </p>
      <div className="space-y-2">
        {paper.sources.map((s, i) => {
          const p = paperById(s.paperId);
          return (
            <div
              key={s.id}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${s.broken ? 'border-danger/40 bg-danger-light' : 'border-line bg-white'}`}
            >
              <span className="font-mono text-sm text-muted">[{i + 1}]</span>
              <div className="min-w-0 flex-1">
                {s.broken ? (
                  <p className="flex items-center gap-1.5 text-sm text-danger">
                    <AlertTriangle size={14} /> An error has occurred processing this paper — please upload something else.
                  </p>
                ) : p ? (
                  <>
                    <p className="truncate text-sm font-medium text-info">{p.title}</p>
                    <p className="text-xs text-muted">{p.inDB ? 'Full content fetched' : 'Abstract + metadata'}</p>
                  </>
                ) : (
                  <p className="truncate text-sm">{s.custom}</p>
                )}
              </div>
              <button
                onClick={() => updatePaper(paper.id, { sources: paper.sources.filter((x) => x.id !== s.id) })}
                className="cursor-pointer text-muted hover:text-danger"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Paste a link or type a title… (Enter for new line)"
          className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
        />
        <Button onClick={add}><Plus size={15} /> Add</Button>
      </div>
    </div>
  );
}

function GeneratedTab({ paper, updatePaper, onGenerate, generating }) {
  const toast = useToast();
  const [style, setStyle] = useState('APA');
  const [citePopup, setCitePopup] = useState(null);
  const [review, setReview] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [dismissed, setDismissed] = useState(() => new Set());
  const sources = paper.sources.map((s) => paperById(s.paperId)).filter(Boolean);

  const runReview = async () => {
    setReviewing(true);
    const res = await reviewDraft(paper.generated, sources);
    setReview(res);
    setDismissed(new Set());
    setReviewing(false);
  };

  // Advisory review runs automatically once a draft exists — it informs,
  // never blocks (a human is watching; warnings are theirs to act on).
  useEffect(() => {
    if (paper.generated && !review && !reviewing) runReview();
  }, [paper.generated]); // eslint-disable-line

  if (generating) {
    return (
      <div className="flex flex-col items-center py-24">
        <Loader2 className="animate-spin text-lime" size={40} />
        <p className="mt-4 text-muted">Writing each section from your selected sources…</p>
      </div>
    );
  }

  if (!paper.generated) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white/50 p-12 text-center">
        <p className="font-display text-lg">Nothing generated yet</p>
        <p className="mt-1 text-sm text-muted">Fill Tab 1, add sources in Tab 2, then generate.</p>
        <Button className="mt-4" onClick={onGenerate}>Generate paper</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <input
          defaultValue={paper.academicTitle}
          onBlur={(e) => updatePaper(paper.id, { academicTitle: e.target.value })}
          className="w-full max-w-xl border-b border-transparent bg-transparent font-display text-2xl outline-none hover:border-line focus:border-info"
        />
        <div className="flex items-center gap-2">
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none">
            {CITATION_STYLES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={runReview} disabled={reviewing}>
            {reviewing ? <Loader2 size={15} className="animate-spin" /> : <Flag size={15} />}
            {review ? 'Re-run review' : 'Run advisory review'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast('Version saved')}>Version history</Button>
        </div>
      </div>

      <AdvisoryReview review={review} reviewing={reviewing} dismissed={dismissed} setDismissed={setDismissed} />

      <article className="rounded-2xl border border-line bg-white p-8">
        {paper.generated.map((g) => (
          <section key={g.section} className="mb-6">
            <h2 className="font-display text-xl">{g.section}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/90">
              {renderWithCitations(g.text, sources, setCitePopup)}
            </p>
            {g.flags.map((f, i) => (
              <div key={i} className="mt-2 flex items-center gap-2 rounded-lg bg-warning-light px-3 py-2 text-xs text-warning">
                <Flag size={13} /> {f.why}
                <div className="ml-auto flex gap-1">
                  <button className="cursor-pointer rounded px-1.5 py-0.5 hover:bg-warning/10">Ignore</button>
                  <button className="cursor-pointer rounded px-1.5 py-0.5 hover:bg-warning/10">Search</button>
                  <button className="cursor-pointer rounded px-1.5 py-0.5 hover:bg-warning/10">Bookmarks</button>
                </div>
              </div>
            ))}
          </section>
        ))}

        <section className="mt-8 border-t border-line pt-5">
          <h2 className="font-display text-xl">References</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            {sources.map((p) => (
              <li key={p.id}>
                {p.authors[0]} et al. ({p.year}). {p.title}. {p.journal}.{' '}
                {p.doi && (
                  <a href={p.link || '#'} target="_blank" rel="noreferrer" className="text-info hover:underline">
                    {p.doi}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>
      </article>

      <p className="mt-3 text-xs text-muted">
        Type <b>@</b> to insert a citation inline · highlight text to “Add citation” · amber flags mark sentences needing citations.
      </p>

      <Modal open={citePopup !== null} onClose={() => setCitePopup(null)} title="Reference">
        {citePopup && (
          <div>
            <p className="font-medium">{citePopup.title}</p>
            <p className="text-sm text-muted">{citePopup.authors.join(', ')} · {citePopup.year} · {citePopup.journal}</p>
            {citePopup.doi && <p className="mt-2 text-sm text-info">DOI: {citePopup.doi}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}

// Advisory review panel — surfaces findings the author can act on or dismiss.
// Unlike a blocking critique gate, nothing here prevents export or completion.
function AdvisoryReview({ review, reviewing, dismissed, setDismissed }) {
  const [open, setOpen] = useState(true);
  if (reviewing && !review) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted">
        <Loader2 size={15} className="animate-spin" /> Advisory review in progress — checking claims, citations, statistics, and consistency…
      </div>
    );
  }
  if (!review) return null;

  const active = review.findings.filter((f) => !dismissed.has(f.id));
  const warnings = active.filter((f) => f.severity === 'warning');
  const observations = active.filter((f) => f.severity === 'observation');
  const dismiss = (id) => setDismissed((d) => new Set([...d, id]));

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-line bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
      >
        <Flag size={16} className={warnings.length ? 'text-warning' : 'text-success'} />
        <span className="flex-1 text-sm font-medium">
          Advisory review — {warnings.length} warning{warnings.length !== 1 && 's'}, {observations.length} observation{observations.length !== 1 && 's'}
          {dismissed.size > 0 && <span className="font-normal text-muted"> · {dismissed.size} dismissed</span>}
        </span>
        <Badge tone="neutral">advisory · never blocks</Badge>
      </button>

      {open && (
        <div className="border-t border-line px-4 py-3">
          {active.length === 0 ? (
            <p className="py-2 text-sm text-success">All findings addressed or dismissed. Nice.</p>
          ) : (
            <div className="space-y-2">
              {[...warnings, ...observations].map((f) => (
                <div
                  key={f.id}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${
                    f.severity === 'warning' ? 'bg-warning-light/70' : 'bg-black/[0.03]'
                  }`}
                >
                  <span
                    className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      f.severity === 'warning' ? 'bg-warning/15 text-warning' : 'bg-black/10 text-muted'
                    }`}
                  >
                    {f.severity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink/90">{f.text}</p>
                    <p className="mt-0.5 text-xs text-muted">{f.category} · {f.where}</p>
                  </div>
                  <button
                    onClick={() => dismiss(f.id)}
                    className="cursor-pointer text-xs text-muted hover:text-ink"
                    title="Dismiss — your call, not the reviewer's"
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          )}
          {review.passed?.length > 0 && (
            <div className="mt-3 border-t border-line pt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Verification passed</p>
              {review.passed.map((p) => (
                <p key={p} className="flex items-center gap-2 py-0.5 text-xs text-success">
                  <Check size={13} /> {p}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function renderWithCitations(text, sources, setCitePopup) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/\[(\d+)\]/);
    if (m) {
      const src = sources[(Number(m[1]) - 1) % Math.max(sources.length, 1)];
      return (
        <button
          key={i}
          onClick={() => src && setCitePopup(src)}
          className="cursor-pointer font-medium text-info hover:underline"
        >
          {part}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function matchPaper(input) {
  const q = input.toLowerCase();
  const m = PAPERS.find((p) => p.arxivId && q.includes(p.arxivId));
  return m ? m.id : null;
}

// ---- Sharing + AI channels ----
function ShareModal({ open, onClose, paper, updatePaper }) {
  const toast = useToast();
  const [invite, setInvite] = useState('');
  const [role, setRole] = useState('Viewer');
  const [newChannel, setNewChannel] = useState('');
  const [channelType, setChannelType] = useState('regular');
  const [activeChannel, setActiveChannel] = useState(paper.channels[0]?.id);

  const addChannel = () => {
    if (!newChannel.trim()) return;
    updatePaper(paper.id, {
      channels: [...paper.channels, { id: `ch-${Date.now()}`, type: channelType, name: newChannel }],
    });
    setNewChannel('');
    toast('Channel added');
  };

  const current = paper.channels.find((c) => c.id === activeChannel);

  return (
    <Modal open={open} onClose={onClose} title="Share & channels" wide>
      <div className="grid grid-cols-2 gap-6">
        {/* sharing */}
        <div>
          <h3 className="mb-2 font-medium">Invite people</h3>
          <div className="flex gap-2">
            <input
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
              placeholder="Username or link…"
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-line px-2 text-sm">
              {['Owner', 'Editor', 'Commenter', 'Viewer'].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <Button size="sm" className="mt-2" onClick={() => { toast(`Invited ${invite || 'user'} as ${role}`); setInvite(''); }}>
            Send invite
          </Button>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Collaborators</p>
            {paper.collaborators.map((c) => (
              <div key={c.username} className="flex items-center gap-2 py-1">
                <Avatar name={c.username} size={26} />
                <span className="text-sm">@{c.username}</span>
                <Badge className="ml-auto">{c.role}</Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Roles: Owner / Editor / Commenter / Viewer. Editors manage both regular and AI channels.
          </p>
        </div>

        {/* channels */}
        <div>
          <h3 className="mb-2 font-medium">Channels</h3>
          <div className="space-y-1">
            {paper.channels.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChannel(c.id)}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${activeChannel === c.id ? 'bg-navy text-white' : 'hover:bg-page'}`}
              >
                {c.type === 'ai' ? <Bot size={15} /> : <Hash size={15} />}
                {c.name}
                <Badge className="ml-auto" tone={c.type === 'ai' ? 'lime' : 'neutral'}>
                  {c.type}
                </Badge>
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <select value={channelType} onChange={(e) => setChannelType(e.target.value)} className="rounded-lg border border-line px-2 text-sm">
              <option value="regular">Regular</option>
              <option value="ai">AI</option>
            </select>
            <input
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              placeholder="New channel…"
              className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-info"
            />
            <Button size="sm" onClick={addChannel}>Add</Button>
          </div>

          {current && (
            <div className="mt-3 h-56 overflow-hidden rounded-xl border border-line">
              {current.type === 'ai' ? (
                <ChatPanel scopeLabel={`AI channel · ${current.name}`} context={paper.name} />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted">
                  <div>
                    <MessageSquare size={22} className="mx-auto mb-2" />
                    Regular channel for team discussion.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
