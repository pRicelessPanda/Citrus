import { useState } from 'react';
import { Search, Pin, BellOff, Send, Hash, Bot, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { Avatar, Badge, timeAgo } from '../components/ui.jsx';
import { CONVERSATIONS } from '../data/community.js';
import { paperById } from '../data/papers.js';

export default function Messages() {
  const [convos, setConvos] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [q, setQ] = useState('');
  const [channel, setChannel] = useState('general');
  const [draft, setDraft] = useState('');

  const active = convos.find((c) => c.id === activeId);

  const sorted = [...convos]
    .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const messages =
    active.kind === 'group'
      ? active.messages.filter((m) => (m.channel || 'general') === channel)
      : active.messages;

  const send = () => {
    if (!draft.trim()) return;
    setConvos((cs) =>
      cs.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: `m-${Date.now()}`, from: 'me', text: draft, at: new Date().toISOString(), channel: c.kind === 'group' ? channel : undefined },
              ],
            }
          : c
      )
    );
    setDraft('');
  };

  return (
    <>
      <PageHeader title="Messages" />
      <div className="mx-auto flex h-[calc(100vh-110px)] max-w-6xl gap-4 px-8 pb-6">
        {/* conversation list */}
        <div className="flex w-72 shrink-0 flex-col rounded-2xl border border-line bg-white">
          <div className="border-b border-line p-3">
            <div className="flex items-center gap-2 rounded-lg bg-page px-3 py-2">
              <Search size={15} className="text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {sorted.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveId(c.id); setChannel(c.channels?.[0] || 'general'); }}
                className={`flex w-full items-center gap-3 border-b border-line px-3 py-3 text-left ${activeId === c.id ? 'bg-page' : 'hover:bg-page'}`}
              >
                <Avatar name={c.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 truncate text-sm font-medium">
                    {c.pinned && <Pin size={12} className="text-muted" />}
                    {c.muted && <BellOff size={12} className="text-muted" />}
                    {c.name}
                  </p>
                  <p className="truncate text-xs text-muted">{c.messages[c.messages.length - 1]?.text}</p>
                </div>
                {c.unread > 0 && <span className="rounded-full bg-lime px-1.5 text-xs font-semibold text-navy">{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* thread */}
        <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Avatar name={active.name} size={36} />
            <div>
              <p className="font-medium">{active.name}</p>
              {active.kind === 'group' && <p className="text-xs text-muted">{active.members?.length} members</p>}
            </div>
          </div>

          {active.kind === 'group' && (
            <div className="flex gap-1 border-b border-line px-3 py-2">
              {active.channels.map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs ${channel === ch ? 'bg-navy text-white' : 'text-muted hover:bg-page'}`}
                >
                  {ch.startsWith('AI') ? <Bot size={12} /> : <Hash size={12} />}
                  {ch}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 space-y-3 overflow-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.from === 'me' ? 'flex-row-reverse' : ''}`}>
                <Avatar name={m.ai ? 'Citrus AI' : m.from === 'me' ? 'Mit Patel' : active.name} size={28} />
                <div className={`max-w-md ${m.from === 'me' ? 'items-end text-right' : ''}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium">{m.ai ? 'Citrus AI' : m.from === 'me' ? 'You' : m.from}</span>
                    <span className="text-[10px] text-muted">{timeAgo(m.at)}</span>
                  </div>
                  <div className={`mt-0.5 rounded-2xl px-3 py-2 text-sm ${m.ai ? 'bg-lime/15' : m.from === 'me' ? 'bg-navy text-white' : 'bg-page'}`}>
                    {m.card ? <PaperCardMini id={m.card.id} /> : m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line p-3">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-page px-3 py-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={`Message ${active.kind === 'group' ? '#' + channel : active.name}…`}
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <button onClick={send} className="cursor-pointer rounded-lg bg-navy p-2 text-white">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PaperCardMini({ id }) {
  const p = paperById(id);
  if (!p) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white p-2 text-left text-ink">
      <FileText size={20} className="text-info" />
      <div>
        <p className="text-xs font-medium text-info">{p.title}</p>
        <p className="text-[10px] text-muted">{p.year} · {p.journal}</p>
      </div>
    </div>
  );
}
