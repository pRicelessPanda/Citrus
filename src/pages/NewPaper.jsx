import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, FolderInput, FilePlus } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Button } from '../components/ui.jsx';
import ColorWheel from '../components/ColorWheel.jsx';
import { useStore, getActiveColors } from '../store.js';

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

export default function NewPaper() {
  const navigate = useNavigate();
  const addResearchPaper = useStore((s) => s.addResearchPaper);
  const allProjects = useStore((s) => s.projects);
  const researchPapers = useStore((s) => s.researchPapers);
  const projects = useMemo(() => allProjects.filter((p) => p.status === 'completed'), [allProjects]);
  const activeColors = useMemo(() => getActiveColors(allProjects, researchPapers), [allProjects, researchPapers]);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const create = (importedProject) => {
    const id = `rpaper-${Date.now()}`;
    addResearchPaper({
      id,
      name,
      color,
      status: 'in progress',
      createdAt: new Date().toISOString().slice(0, 10),
      academicTitle: name,
      context: importedProject ? importedProject.overview.rationale : '',
      sources: importedProject ? (importedProject.references || []).map((r, i) => ({ id: `s${i}`, paperId: r.paperId })) : [],
      tab1: Object.fromEntries(SECTIONS.map((s) => [s, { notes: '', sources: [], refs: [] }])),
      generated: null,
      deadlines: [],
      channels: [
        { id: 'ch1', type: 'regular', name: 'general' },
        { id: 'ch2', type: 'ai', name: 'AI · drafting' },
      ],
      collaborators: [{ username: 'me', role: 'Owner' }],
    });
    navigate(`/research/paper/${id}`);
  };

  return (
    <>
      <PageHeader title="New research paper" subtitle={`Step ${step} of 2`} />
      <PageBody>
        {step === 1 && (
          <div className="rounded-2xl border border-line bg-white p-8">
            <h2 className="font-display text-2xl">Name your paper</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Paper display name"
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
          <div className="rounded-2xl border border-line bg-white p-8">
            <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-ink cursor-pointer">
              <ArrowLeft size={15} /> Back
            </button>
            <h2 className="font-display text-2xl">How do you want to start?</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-line p-5">
                <FolderInput size={22} className="text-info" />
                <p className="mt-2 font-display text-lg">Import from a completed project</p>
                <p className="mt-1 text-sm text-muted">Auto-fills context and sources.</p>
                {projects.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">No completed projects yet.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => create(p)}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-left text-sm hover:border-info"
                      >
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => create(null)}
                className="cursor-pointer rounded-xl border border-line p-5 text-left hover:border-info hover:shadow-sm"
              >
                <FilePlus size={22} className="text-lime" />
                <p className="mt-2 font-display text-lg">Start from scratch</p>
                <p className="mt-1 text-sm text-muted">Begin with blank sections and add your own context.</p>
              </button>
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
