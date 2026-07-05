import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Avatar } from './ui.jsx';
import { useStore } from '../store.js';
import { askAI } from '../services/mockAI.js';

// Message list + input. NO suggested questions anywhere (spec §6).
export default function ChatPanel({ context = '', seedMessages = [], scopeLabel, onMessagesChange }) {
  const user = useStore((s) => s.user);
  const [messages, setMessages] = useState(seedMessages);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages]); // eslint-disable-line

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const userMsg = {
      id: Date.now(),
      role: 'user',
      author: user.displayName,
      at: new Date().toISOString(),
      text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setBusy(true);
    const res = await askAI(text, context);
    setMessages((m) => [
      ...m,
      {
        id: Date.now() + 1,
        role: 'ai',
        author: 'Citrus AI',
        at: new Date().toISOString(),
        text: res.text,
        source: res.source,
      },
    ]);
    setBusy(false);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {scopeLabel && (
        <div className="border-b border-line bg-page px-4 py-2 text-xs text-muted">{scopeLabel}</div>
      )}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted">Ask anything about this content.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="flex gap-3">
            <Avatar name={m.role === 'ai' ? 'Citrus AI' : m.author} size={30} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{m.role === 'ai' ? 'Citrus AI' : m.author}</span>
                <span className="text-xs text-muted">
                  {new Date(m.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-ink/90 whitespace-pre-wrap">{m.text}</p>
              {m.source && <p className="mt-1 text-xs italic text-info">{m.source}</p>}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex gap-3">
            <Avatar name="Citrus AI" size={30} />
            <div className="flex items-center gap-1 pt-2">
              <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-end gap-2 rounded-xl border border-line bg-page px-3 py-2 focus-within:border-info">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask a question…"
            className="max-h-32 flex-1 resize-none bg-transparent text-sm outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim() || busy}
            className="rounded-lg bg-navy p-2 text-white disabled:opacity-40 cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = '0ms' }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-muted/50"
      style={{ animationDelay: delay }}
    />
  );
}
