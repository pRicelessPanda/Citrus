import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles, Loader2, Check } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Button, Avatar } from '../components/ui.jsx';
import ColorWheel from '../components/ColorWheel.jsx';
import { useStore, getActiveColors } from '../store.js';
import { FIELDS } from '../data/fields.js';
import {
  generateProjectOverview,
  generateFollowups,
  generateIdeas,
  generateSolutionDirections,
} from '../services/mockAI.js';

export default function NewProject() {
  const navigate = useNavigate();
  const addProject = useStore((s) => s.addProject);
  const projects = useStore((s) => s.projects);
  const researchPapers = useStore((s) => s.researchPapers);
  const activeColors = useMemo(() => getActiveColors(projects, researchPapers), [projects, researchPapers]);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [category, setCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');
  const [mode, setMode] = useState(null); // 'A' | 'B'

  const finalCategory = category === 'Other' ? otherCategory : category;

  const finish = (overview) => {
    const id = `proj-${Date.now()}`;
    addProject({
      id,
      name,
      color,
      category: finalCategory,
      status: 'in progress',
      createdAt: new Date().toISOString().slice(0, 10),
      overview,
      outlineDone: false,
      references: [],
      notes: '',
      deadlines: [],
    });
    navigate(`/research/project/${id}`);
  };

  return (
    <>
      <PageHeader title="New research project" subtitle={`Step ${step} of 2`} />
      <PageBody>
        {step === 1 && (
          <div className="rounded-2xl border border-line bg-white p-8">
            <h2 className="font-display text-2xl">Name your project</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project display name"
              className="mt-4 w-full rounded-xl border border-line px-4 py-3 text-lg outline-none focus:border-info"
            />
            <div className="mt-8">
              <h3 className="mb-3 font-display text-xl">Pick a color</h3>
              <ColorWheel value={color} onChange={setColor} takenColors={activeColors} />
            </div>
            <div className="mt-8 flex justify-end">
              <Button disabled={!name.trim() || !color} onClick={() => setStep(2)}>
                Continue <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-white p-6">
              <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-ink cursor-pointer">
                <ArrowLeft size={15} /> Back
              </button>
              <h2 className="font-display text-2xl">Category &amp; idea</h2>
              <div className="mt-4 flex gap-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none"
                >
                  <option value="">Select a category…</option>
                  {FIELDS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                  <option>Other</option>
                </select>
                {category === 'Other' && (
                  <input
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    placeholder="Type a category…"
                    className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
                  />
                )}
              </div>

              {!mode && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setMode('A')}
                    className="cursor-pointer rounded-xl border border-line p-5 text-left hover:border-info hover:shadow-sm"
                  >
                    <p className="font-display text-lg">Write your own idea directly</p>
                    <p className="mt-1 text-sm text-muted">
                      Jot rough ideas, then generate a structured project overview.
                    </p>
                  </button>
                  <button
                    onClick={() => setMode('B')}
                    className="cursor-pointer rounded-xl border border-line p-5 text-left hover:border-info hover:shadow-sm"
                  >
                    <p className="font-display text-lg">Ask AI for a topic</p>
                    <p className="mt-1 text-sm text-muted">
                      The AI proposes 5–7 ideas from gaps and high-impact directions.
                    </p>
                  </button>
                </div>
              )}
            </div>

            {mode === 'A' && (
              <OptionA category={finalCategory} onGenerated={finish} onBack={() => setMode(null)} />
            )}
            {mode === 'B' && (
              <OptionB category={finalCategory} onGenerated={finish} onBack={() => setMode(null)} />
            )}
          </div>
        )}
      </PageBody>
    </>
  );
}

// ---- Option A: bookmark-style tabs, conversational generation ----
function OptionA({ category, onGenerated, onBack, prefill = '' }) {
  const [innerTab, setInnerTab] = useState('rough');
  const [rough, setRough] = useState(prefill);
  const [busy, setBusy] = useState(false);
  const [followups, setFollowups] = useState(null);
  const [answers, setAnswers] = useState({});
  const [overview, setOverview] = useState(null);

  const generate = async () => {
    setBusy(true);
    // Conversational: if too little context, ask follow-ups first.
    if (rough.trim().split(/\s+/).length < 6 && !followups) {
      const fu = await generateFollowups();
      setFollowups(fu);
      setBusy(false);
      return;
    }
    const combined = rough + ' ' + Object.values(answers).join(' ');
    const ov = await generateProjectOverview(combined, category);
    setOverview(ov);
    setInnerTab('overview');
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <button onClick={onBack} className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-ink cursor-pointer">
        <ArrowLeft size={15} /> Choose a different option
      </button>

      {/* bookmark-style inner tabs */}
      <div className="flex gap-1">
        {[
          ['rough', 'Tab 1 — Rough ideas'],
          ['overview', 'Tab 2 — Project overview'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setInnerTab(id)}
            className={`cursor-pointer rounded-t-lg border border-b-0 px-4 py-2 text-sm ${
              innerTab === id ? 'border-line bg-page font-medium' : 'border-transparent text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-b-xl rounded-tr-xl border border-line bg-page p-5">
        {innerTab === 'rough' && (
          <>
            <p className="mb-2 text-sm text-muted">Free text — no structure required.</p>
            <textarea
              value={rough}
              onChange={(e) => setRough(e.target.value)}
              rows={6}
              placeholder="What's the rough idea? Jot down anything…"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-info"
            />

            {followups && (
              <div className="mt-4 space-y-3 rounded-xl border border-info/30 bg-info-light/40 p-4">
                <div className="flex items-center gap-2">
                  <Avatar name="Citrus AI" size={26} />
                  <span className="text-sm font-medium">A few questions to sharpen this:</span>
                </div>
                {followups.map((q, i) => (
                  <div key={i}>
                    <label className="text-sm text-ink">{q}</label>
                    <input
                      value={answers[i] || ''}
                      onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-info"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button onClick={generate} disabled={busy || !rough.trim()}>
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {followups ? 'Generate with answers' : 'Generate'}
              </Button>
            </div>
          </>
        )}

        {innerTab === 'overview' &&
          (overview ? (
            <OverviewEditor overview={overview} setOverview={setOverview} onConfirm={() => onGenerated(overview)} />
          ) : (
            <p className="py-8 text-center text-sm text-muted">
              Blank until generated. Fill Tab 1 and press Generate.
            </p>
          ))}
      </div>
    </div>
  );
}

function OverviewEditor({ overview, setOverview, onConfirm }) {
  const set = (k, v) => setOverview({ ...overview, [k]: v });
  const Field = ({ k, label, rows = 2 }) => (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-muted">{label}</label>
      <textarea
        value={overview[k]}
        onChange={(e) => set(k, e.target.value)}
        rows={rows}
        className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-info"
      />
    </div>
  );
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-muted">Project title</label>
        <input
          value={overview.title}
          onChange={(e) => set('title', e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 font-display text-lg outline-none focus:border-info"
        />
      </div>
      <Field k="rationale" label="Rationale" rows={2} />
      <Field k="hypothesis" label="Central hypothesis" rows={2} />
      <Field k="solution" label="Solution direction" rows={5} />
      <div className="flex justify-end">
        <Button onClick={onConfirm}>
          <Check size={16} /> Confirm &amp; open workspace
        </Button>
      </div>
      <p className="text-xs text-muted">Tab 2 must be completed before moving forward.</p>
    </div>
  );
}

// ---- Option B: AI chatbot proposing ideas ----
function OptionB({ category, onGenerated, onBack }) {
  const [phase, setPhase] = useState('field'); // field → ideas → solutions → prefill
  const [field, setField] = useState(category || '');
  const [ideas, setIdeas] = useState(null);
  const [chosenIdea, setChosenIdea] = useState(null);
  const [solutions, setSolutions] = useState(null);
  const [chosenSolution, setChosenSolution] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadIdeas = async (f) => {
    setBusy(true);
    setField(f);
    const res = await generateIdeas(f);
    setIdeas(res);
    setPhase('ideas');
    setBusy(false);
  };

  const loadSolutions = async (idea) => {
    setBusy(true);
    setChosenIdea(idea);
    const res = await generateSolutionDirections(idea);
    setSolutions(res);
    setPhase('solutions');
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <button onClick={onBack} className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-ink cursor-pointer">
        <ArrowLeft size={15} /> Choose a different option
      </button>
      <div className="flex items-center gap-2">
        <Avatar name="Citrus AI" size={30} />
        <span className="font-display text-lg">Ask AI for a topic</span>
      </div>

      {busy && (
        <div className="flex items-center gap-2 py-8 text-muted">
          <Loader2 size={18} className="animate-spin" /> Thinking…
        </div>
      )}

      {!busy && phase === 'field' && (
        <div className="mt-4">
          <p className="text-sm text-ink">Pick a field to explore, or let me pick for you.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FIELDS.slice(0, 12).map((f) => (
              <button
                key={f}
                onClick={() => loadIdeas(f)}
                className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-sm hover:border-info hover:text-info"
              >
                {f}
              </button>
            ))}
            <button
              onClick={() => loadIdeas('')}
              className="cursor-pointer rounded-full bg-navy px-3 py-1.5 text-sm text-white"
            >
              Pick for me →
            </button>
          </div>
        </div>
      )}

      {!busy && phase === 'ideas' && ideas && (
        <div className="mt-4">
          <p className="text-sm text-muted">
            {field ? `Ideas in ${field}` : 'Ideas across all fields'} — pick one to go deeper.
          </p>
          <div className="mt-3 space-y-3">
            {ideas.map((idea) => (
              <button
                key={idea.id}
                onClick={() => loadSolutions(idea)}
                className="block w-full cursor-pointer rounded-xl border border-line p-4 text-left hover:border-info hover:shadow-sm"
              >
                <p className="font-display text-lg">{idea.title}</p>
                <p className="mt-1 text-sm text-ink/80">
                  <span className="font-medium">Gap:</span> {idea.gap}
                </p>
                <p className="text-sm text-ink/70">
                  <span className="font-medium">Existing work:</span> {idea.existing}
                </p>
                <p className="text-sm text-ink/70">
                  <span className="font-medium">Possible solutions:</span> {idea.solutions}
                </p>
                <p className="text-sm text-info">{idea.why}</p>
              </button>
            ))}
          </div>
          <button onClick={() => loadIdeas(field)} className="mt-3 cursor-pointer text-sm text-info hover:underline">
            Reprompt for more ideas
          </button>
        </div>
      )}

      {!busy && phase === 'solutions' && solutions && (
        <div className="mt-4">
          <p className="text-sm text-muted">Solution directions for “{chosenIdea.title}” — pick one.</p>
          <div className="mt-3 space-y-3">
            {solutions.map((sol) => (
              <div
                key={sol.id}
                className={`rounded-xl border p-4 ${chosenSolution?.id === sol.id ? 'border-info bg-info-light' : 'border-line'}`}
              >
                <p className="font-medium">{sol.approach}</p>
                <p className="text-sm text-ink/80">{sol.why}</p>
                <p className="text-sm text-muted">Supporting: {sol.support} · Untried: {sol.untried} · Novelty: {sol.novelty}</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => { setChosenSolution(sol); setPhase('prefill'); }}>
                  Select this direction
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!busy && phase === 'prefill' && chosenSolution && (
        <div className="mt-4">
          <p className="text-sm text-muted">Carried into Tab 1 — generate your overview to confirm.</p>
          <OptionA
            category={category}
            onGenerated={onGenerated}
            onBack={() => setPhase('solutions')}
            prefill={`${chosenIdea.title}. ${chosenSolution.approach}. ${chosenSolution.why}`}
          />
        </div>
      )}
    </div>
  );
}
