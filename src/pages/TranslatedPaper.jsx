import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Bookmark,
  GitCompare,
  Plus,
  ExternalLink,
  Pencil,
  Copy,
  Quote,
} from 'lucide-react';
import { PageBody } from '../components/PageHeader.jsx';
import { Button, Badge, useToast } from '../components/ui.jsx';
import CredibilityScore from '../components/CredibilityScore.jsx';
import PaperCard from '../components/PaperCard.jsx';
import { AskAIButton } from '../components/AskAISplitScreen.jsx';
import AskAISplitScreen from '../components/AskAISplitScreen.jsx';
import { AddToMenu } from '../components/AddToMenu.jsx';
import { useStore } from '../store.js';
import { paperById, relatedPapers } from '../data/papers.js';
import { READING_LEVELS, EXPLAINER_SECTIONS, CITATION_STYLES } from '../data/fields.js';
import { relevel } from '../services/mockAI.js';

export default function TranslatedPaper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const paper = paperById(id);
  const addTranslation = useStore((s) => s.addTranslation);
  const addVisited = useStore((s) => s.addVisited);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const isBookmarked = useStore((s) => s.isBookmarked);

  const [banner, setBanner] = useState(null);
  const [levels, setLevels] = useState({});
  const [open, setOpen] = useState(() => Object.fromEntries(EXPLAINER_SECTIONS.map((s) => [s, true])));
  const [askOpen, setAskOpen] = useState(false);
  const [askSeed, setAskSeed] = useState('');
  const [citeOpen, setCiteOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (paper) {
      setBanner({
        title: paper.title,
        authors: paper.authors.join(', '),
        year: paper.year,
        journal: paper.journal,
        doi: paper.doi || '',
        link: paper.link || '',
      });
      setLevels(Object.fromEntries(EXPLAINER_SECTIONS.map((s) => [s, 'Curious Adult'])));
      addTranslation(id, 'Curious Adult');
      addVisited(id);
    }
  }, [id]); // eslint-disable-line

  if (!paper) return <PageBody>Paper not found.</PageBody>;
  const bookmarked = isBookmarked('translations', id);

  const setLevel = async (section, level) => {
    setLevels((l) => ({ ...l, [section]: level }));
    await relevel(paper.explainer[section], level); // simulate re-level fetch
  };

  const onMouseUp = () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && text.length > 3 && contentRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0).getBoundingClientRect();
      setSelection({ text, x: range.left + range.width / 2, y: range.top - 8 });
    } else {
      setSelection(null);
    }
  };

  const related = relatedPapers(id, 3);

  return (
    <>
      {/* top action bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-page/80 px-8 py-3 backdrop-blur">
        <Link to={`/paper/${id}`} className="text-sm text-info hover:underline">
          ← View original paper
        </Link>
        <AskAIButton onClick={() => { setAskSeed(''); setAskOpen(true); }} />
      </div>

      <PageBody onMouseUp={onMouseUp}>
        {/* Banner (editable inline, NOT arXiv style) */}
        <EditableBanner banner={banner} setBanner={setBanner} paper={paper} />

        <div className="mt-5 grid grid-cols-[1fr_320px] gap-6">
          <div ref={contentRef} onMouseUp={onMouseUp}>
            {EXPLAINER_SECTIONS.map((section) => (
              <Section
                key={section}
                title={section}
                open={open[section]}
                onToggle={() => setOpen((o) => ({ ...o, [section]: !o[section] }))}
                level={levels[section]}
                onLevel={(lv) => setLevel(section, lv)}
                text={paper.explainer[section][levels[section]]}
              />
            ))}
          </div>

          {/* right rail */}
          <aside className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={bookmarked ? 'subtle' : 'outline'}
                size="sm"
                onClick={() => {
                  toggleBookmark('translations', id);
                  toast(bookmarked ? 'Bookmark removed' : 'Bookmarked');
                }}
              >
                <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
                {bookmarked ? 'Saved' : 'Bookmark'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/compare', { state: { first: id } })}>
                <GitCompare size={15} /> Compare to…
              </Button>
              <AddButton paperId={id} />
            </div>

            <CredibilityScore
              scores={paper.scores}
              evidenceStrength={paper.evidenceStrength}
              insufficientMessage="Add more paper details to generate a credibility score"
            />

            <div className="rounded-xl border border-line bg-white p-4">
              <button
                onClick={() => setCiteOpen((o) => !o)}
                className="flex w-full cursor-pointer items-center justify-between text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  <Quote size={15} /> Export citation
                </span>
                <ChevronDown size={16} className={citeOpen ? 'rotate-180' : ''} />
              </button>
              {citeOpen && (
                <div className="mt-3 space-y-2">
                  {CITATION_STYLES.map((style) => (
                    <div key={style} className="flex items-center justify-between rounded-lg bg-page px-3 py-2">
                      <span className="text-sm">{style}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(citation(paper, style));
                          toast(`${style} citation copied`);
                        }}
                        className="cursor-pointer text-muted hover:text-ink"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {paper.inDB && related.length > 0 && (
              <div className="rounded-xl border border-line bg-white p-4">
                <h3 className="mb-3 text-sm font-semibold">Related papers</h3>
                <div className="space-y-3">
                  {related.map((p) => (
                    <Link key={p.id} to={`/paper/${p.id}`} className="block">
                      <p className="font-display text-sm leading-snug text-info hover:underline">{p.title}</p>
                      <p className="text-xs text-muted">
                        {p.authors[0]} et al. · {p.year}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/related/${id}`}
                  className="mt-3 inline-block text-sm font-medium text-info hover:underline"
                >
                  View full list of related papers →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </PageBody>

      {/* Highlight-to-ask floating button */}
      {selection && (
        <button
          onClick={() => {
            setAskSeed(selection.text);
            setAskOpen(true);
            setSelection(null);
          }}
          style={{ left: selection.x, top: selection.y, transform: 'translate(-50%,-100%)' }}
          className="fixed z-40 cursor-pointer rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white shadow-lg"
        >
          Ask AI about this
        </button>
      )}

      <AskAISplitScreen
        open={askOpen}
        onClose={() => setAskOpen(false)}
        context={askSeed || paper.title}
        scopeLabel={`Scoped to “${paper.title}” + general knowledge`}
        seedMessages={
          askSeed
            ? [
                {
                  id: 1,
                  role: 'user',
                  author: 'You',
                  at: new Date().toISOString(),
                  text: `About this passage: “${askSeed}”`,
                },
              ]
            : []
        }
        left={
          <div className="p-6">
            <EditableBanner banner={banner} setBanner={setBanner} paper={paper} readOnly />
            <div className="mt-4">
              {EXPLAINER_SECTIONS.map((s) => (
                <div key={s} className="mb-4">
                  <h3 className="font-display text-lg">{s}</h3>
                  <p className="text-sm text-ink/80">{paper.explainer[s][levels[s]]}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </>
  );
}

function EditableBanner({ banner, setBanner, paper, readOnly = false }) {
  const [editing, setEditing] = useState(false);
  if (!banner) return null;

  const Field = ({ k, className }) =>
    editing ? (
      <input
        value={banner[k]}
        onChange={(e) => setBanner({ ...banner, [k]: e.target.value })}
        className={`rounded-md border border-line bg-white px-2 py-1 outline-none focus:border-info ${className}`}
      />
    ) : null;

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {editing ? (
            <Field k="title" className="w-full font-display text-2xl" />
          ) : (
            <h1 className="font-display text-3xl leading-tight">{banner.title}</h1>
          )}
          <div className="mt-2 text-sm text-ink/80">
            {editing ? (
              <div className="space-y-2">
                <Field k="authors" className="w-full text-sm" />
                <div className="flex gap-2">
                  <Field k="year" className="w-24 text-sm" />
                  <Field k="journal" className="flex-1 text-sm" />
                </div>
                <Field k="doi" className="w-full text-sm" />
                <Field k="link" className="w-full text-sm" />
              </div>
            ) : (
              <>
                <p>
                  {paper.authors.map((a, i) => (
                    <span key={i}>
                      {paper.authorIds[i] ? (
                        <Link to={`/authors/${paper.authorIds[i]}`} className="text-info hover:underline">
                          {a}
                        </Link>
                      ) : (
                        a
                      )}
                      {i < paper.authors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <p className="mt-0.5 text-muted">
                  {banner.year} · {banner.journal}
                  {banner.doi && <> · DOI: {banner.doi}</>}
                </p>
                {banner.link && (
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-info hover:underline"
                  >
                    Original <ExternalLink size={12} />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="lime">Translated</Badge>
          {!readOnly && (
            <button
              onClick={() => setEditing((e) => !e)}
              className="rounded-lg p-2 text-muted hover:bg-black/5 cursor-pointer"
              title="Edit banner"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, open, onToggle, level, onLevel, text }) {
  return (
    <div className="mb-3 rounded-xl border border-line bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onToggle} className="flex flex-1 cursor-pointer items-center gap-2 text-left">
          <ChevronDown size={18} className={`text-muted transition-transform ${open ? '' : '-rotate-90'}`} />
          <span className="font-display text-xl">{title}</span>
        </button>
        {open && (
          <select
            value={level}
            onChange={(e) => onLevel(e.target.value)}
            className="rounded-lg border border-line bg-page px-2 py-1 text-xs outline-none"
            title="Reading level"
          >
            {READING_LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        )}
      </div>
      {open && <p className="px-4 pb-4 text-[15px] leading-relaxed text-ink/90">{text}</p>}
    </div>
  );
}

function AddButton({ paperId }) {
  const [addOpen, setAddOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setAddOpen((o) => !o)}>
        <Plus size={15} /> Add to…
      </Button>
      {addOpen && <AddToMenu paperId={paperId} onClose={() => setAddOpen(false)} />}
    </div>
  );
}

function citation(p, style) {
  const authors = p.authors.join(', ');
  switch (style) {
    case 'APA':
      return `${authors} (${p.year}). ${p.title}. ${p.journal}. ${p.doi || ''}`;
    case 'MLA':
      return `${p.authors[0]} et al. "${p.title}." ${p.journal}, ${p.year}.`;
    case 'Chicago':
      return `${authors}. "${p.title}." ${p.journal} (${p.year}).`;
    case 'BibTeX':
      return `@article{${p.id},\n  title={${p.title}},\n  author={${authors}},\n  journal={${p.journal}},\n  year={${p.year}}\n}`;
    default:
      return p.title;
  }
}
