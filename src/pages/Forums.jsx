import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Plus, Sparkles, Flame } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Tabs, Badge, Button, Modal, Avatar, timeAgo, useToast } from '../components/ui.jsx';
import { FORUM_POSTS } from '../data/community.js';
import { FIELDS, POST_TYPES } from '../data/fields.js';

export default function Forums() {
  const [view, setView] = useState('hot');
  const [typeFilter, setTypeFilter] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [posts, setPosts] = useState(FORUM_POSTS);
  const [votes, setVotes] = useState({});

  const vote = (id, dir) => setVotes((v) => ({ ...v, [id]: v[id] === dir ? 0 : dir }));

  let list = [...posts];
  if (typeFilter) list = list.filter((p) => p.type === typeFilter);
  if (view === 'hot') list.sort((a, b) => b.upvotes - a.upvotes);

  return (
    <>
      <PageHeader
        title="Forums"
        right={
          <Button onClick={() => setComposeOpen(true)}>
            <Plus size={16} /> New post
          </Button>
        }
      />
      <PageBody>
        <div className="mb-4 flex items-center justify-between">
          <Tabs
            tabs={[
              { id: 'hot', label: 'Hot this week' },
              { id: 'suggested', label: 'Suggested for you' },
            ]}
            active={view}
            onChange={setView}
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none"
          >
            <option value="">All types</option>
            {POST_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {list.map((post) => {
            const v = votes[post.id] || 0;
            return (
              <div key={post.id} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                <div className="flex flex-col items-center gap-0.5">
                  <button onClick={() => vote(post.id, 1)} className={`cursor-pointer ${v === 1 ? 'text-lime' : 'text-muted'}`}>
                    <ArrowBigUp size={20} fill={v === 1 ? 'currentColor' : 'none'} />
                  </button>
                  <span className="text-sm font-medium">{post.upvotes - post.downvotes + v}</span>
                  <button onClick={() => vote(post.id, -1)} className={`cursor-pointer ${v === -1 ? 'text-danger' : 'text-muted'}`}>
                    <ArrowBigDown size={20} fill={v === -1 ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="info">{post.type}</Badge>
                    {post.fields.map((f) => (
                      <Badge key={f}>{f}</Badge>
                    ))}
                  </div>
                  <Link to={`/forums/${post.id}`} className="mt-2 block font-display text-xl leading-snug hover:text-info">
                    {post.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/70">{post.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                    <Link to={`/profile/${post.author.username}`} className="flex items-center gap-1.5 hover:text-info">
                      <Avatar name={post.author.name} size={20} /> {post.author.name}
                    </Link>
                    <span>{timeAgo(post.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={13} /> {post.replies.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageBody>

      <ComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onPost={(p) => setPosts((ps) => [p, ...ps])}
      />
    </>
  );
}

function ComposeModal({ open, onClose, onPost }) {
  const toast = useToast();
  const [type, setType] = useState(POST_TYPES[0]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);

  const submit = () => {
    if (!title.trim()) return;
    onPost({
      id: `p-${Date.now()}`,
      type,
      title,
      body,
      fields: tags,
      author: { username: 'mwannabe', name: 'Mit Patel' },
      createdAt: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      linkedPaper: null,
      replies: [],
    });
    toast('Post published');
    onClose();
    setTitle('');
    setBody('');
    setTags([]);
  };

  return (
    <Modal open={open} onClose={onClose} title="New forum post" wide>
      <div className="space-y-3">
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-line px-3 py-2 text-sm outline-none">
          {POST_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-info"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="What's on your mind?"
          className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
        />
        <div>
          <p className="mb-1 text-xs font-medium text-muted">Field/topic tags</p>
          <div className="flex max-h-24 flex-wrap gap-1.5 overflow-auto">
            {FIELDS.slice(0, 15).map((f) => (
              <button
                key={f}
                onClick={() => setTags((t) => (t.includes(f) ? t.filter((x) => x !== f) : [...t, f]))}
                className={`cursor-pointer rounded-full px-2.5 py-1 text-xs ${tags.includes(f) ? 'bg-info text-white' : 'border border-line'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted">Attach any file type · links to an untranslated paper for Paper discussion.</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Publish</Button>
      </div>
    </Modal>
  );
}
