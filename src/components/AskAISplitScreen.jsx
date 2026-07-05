import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import ChatPanel from './ChatPanel.jsx';

// Reused 50/50 split screen with a draggable divider (§4).
// Either side can be closed to make the other full-screen. Reopening restores
// the last-used ratio (kept in module-level memory).
let lastRatio = 0.5;

export default function AskAISplitScreen({ open, onClose, left, context, scopeLabel, seedMessages }) {
  const [ratio, setRatio] = useState(lastRatio);
  const [collapsed, setCollapsed] = useState(null); // 'left' | 'right' | null
  const containerRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (open) {
      setRatio(lastRatio);
      setCollapsed(null);
    }
  }, [open]);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let r = (e.clientX - rect.left) / rect.width;
    r = Math.min(0.8, Math.max(0.2, r));
    setRatio(r);
    lastRatio = r;
  }, []);

  useEffect(() => {
    const up = () => (dragging.current = false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', up);
    };
  }, [onMouseMove]);

  if (!open) return null;

  const leftWidth = collapsed === 'left' ? '0%' : collapsed === 'right' ? '100%' : `${ratio * 100}%`;
  const rightWidth = collapsed === 'right' ? '0%' : collapsed === 'left' ? '100%' : `${(1 - ratio) * 100}%`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-page">
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-2">
        <span className="font-display text-lg">Ask AI</span>
        <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-black/5 cursor-pointer">
          <X size={20} />
        </button>
      </div>
      <div ref={containerRef} className="flex min-h-0 flex-1">
        {/* Left: the underlying content */}
        <div
          className="relative min-w-0 overflow-auto border-r border-line bg-page"
          style={{ width: leftWidth, display: collapsed === 'left' ? 'none' : 'block' }}
        >
          <button
            onClick={() => setCollapsed(collapsed === 'right' ? null : 'right')}
            title={collapsed === 'right' ? 'Restore split' : 'Full screen'}
            className="absolute right-2 top-2 z-10 rounded-lg bg-white/90 p-1.5 text-muted shadow hover:bg-white cursor-pointer"
          >
            {collapsed === 'right' ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          {left}
        </div>

        {/* Divider */}
        {!collapsed && (
          <div
            onMouseDown={() => (dragging.current = true)}
            className="w-1 shrink-0 cursor-col-resize bg-line hover:bg-lime"
            title="Drag to resize"
          />
        )}

        {/* Right: chatbot */}
        <div
          className="relative min-w-0"
          style={{ width: rightWidth, display: collapsed === 'right' ? 'none' : 'block' }}
        >
          <button
            onClick={() => setCollapsed(collapsed === 'left' ? null : 'left')}
            title={collapsed === 'left' ? 'Restore split' : 'Full screen'}
            className="absolute left-2 top-2 z-10 rounded-lg bg-white/90 p-1.5 text-muted shadow hover:bg-white cursor-pointer"
          >
            {collapsed === 'left' ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <ChatPanel context={context} scopeLabel={scopeLabel} seedMessages={seedMessages} />
        </div>
      </div>
    </div>
  );
}

// A reusable "Ask AI" button that opens the split screen.
export function AskAIButton({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-lime px-4 py-2 text-sm font-medium text-navy hover:brightness-95 ${className}`}
    >
      Ask AI
    </button>
  );
}
