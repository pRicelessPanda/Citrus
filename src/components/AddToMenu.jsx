import { useNavigate } from 'react-router-dom';
import { useStore } from '../store.js';
import { useToast } from './ui.jsx';

// §8 — "Add to…" logic. Outside a project: choose a project reference OR a
// research paper's Tab 2 sources. Always adds the untranslated version.
export function AddToMenu({ paperId, onClose }) {
  const navigate = useNavigate();
  const projects = useStore((s) => s.projects);
  const researchPapers = useStore((s) => s.researchPapers);
  const addProjectReference = useStore((s) => s.addProjectReference);
  const updateResearchPaper = useStore((s) => s.updateResearchPaper);
  const toast = useToast();

  const hasNothing = projects.length === 0 && researchPapers.length === 0;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-line bg-white py-2 shadow-xl">
        {hasNothing ? (
          <div className="px-4 py-3 text-sm">
            <p className="text-muted">You haven't created any projects or papers yet</p>
            <button
              onClick={() => {
                onClose();
                navigate('/research/new-project');
              }}
              className="mt-2 cursor-pointer font-medium text-info hover:underline"
            >
              Create new →
            </button>
          </div>
        ) : (
          <>
            {projects.length > 0 && (
              <div className="px-2">
                <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted">Project reference</p>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      addProjectReference(p.id, paperId);
                      toast(`Added to “${p.name}”`, 'success');
                      onClose();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-page"
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
            {researchPapers.length > 0 && (
              <div className="mt-1 border-t border-line px-2 pt-1">
                <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted">Paper sources (Tab 2)</p>
                {researchPapers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      updateResearchPaper(p.id, {
                        sources: [...(p.sources || []), { id: `s-${Date.now()}`, paperId }],
                      });
                      toast(`Added to “${p.name}” sources`, 'success');
                      onClose();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-page"
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
