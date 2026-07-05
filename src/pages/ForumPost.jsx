import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, Bookmark, Trash2 } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Badge, Button, Avatar, ConfirmPopup, useToast, timeAgo } from '../components/ui.jsx';
import PaperCard from '../components/PaperCard.jsx';
import { FORUM_POSTS } from '../data/community.js';
import { useStore } from '../store.js';

export default function ForumPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const post = FORUM_POSTS.find((p) => p.id === postId);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const isBookmarked = useStore((s) => s.isBookmarked);
  const [replies, setReplies] = useState(post?.replies || []);
  const [reply, setReply] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  if (!post) return <PageBody>Post not found.</PageBody>;
  const bookmarked = isBookmarked('forums', post.id);

  const addReply = () => {
    if (!reply.trim()) return;
    setReplies((r) => [
      ...r,
      {
        id: `r-${Date.now()}`,
        author: { username: 'mwannabe', name: 'Mit Patel' },
        body: reply,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
      },
    ]);
    setReply('');
  };

  return (
    <>
      <PageHeader
        title="Discussion"
        right={
          <Button
            variant={bookmarked ? 'subtle' : 'outline'}
            size="sm"
            onClick={() => toggleBookmark('forums', post.id)}
          >
            <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
            {bookmarked ? 'Saved' : 'Bookmark'}
          </Button>
        }
      />
      <PageBody>
        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center gap-2">
            <Badge tone="info">{post.type}</Badge>
            {post.fields.map((f) => (
              <Badge key={f}>{f}</Badge>
            ))}
          </div>
          <h1 className="mt-3 font-display text-3xl leading-tight">{post.title}</h1>
          <Link to={`/profile/${post.author.username}`} className="mt-2 flex items-center gap-2 text-sm text-muted hover:text-info">
            <Avatar name={post.author.name} size={26} /> {post.author.name} · {timeAgo(post.createdAt)}
          </Link>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/90">{post.body}</p>

          {post.linkedPaper && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Linked paper</p>
              <PaperCard paperId={post.linkedPaper} showScore />
            </div>
          )}
        </div>

        <h2 className="mb-3 mt-6 font-display text-xl">{replies.length} replies</h2>

        <div className="mb-4 flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addReply()}
            placeholder="Write a reply…"
            className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-info"
          />
          <Button onClick={addReply}>Reply</Button>
        </div>

        <div className="space-y-3">
          {replies.map((r) => (
            <div key={r.id} className="flex gap-3 rounded-xl border border-line bg-white p-4">
              <div className="flex flex-col items-center">
                <ArrowBigUp size={18} className="cursor-pointer text-muted hover:text-lime" />
                <span className="text-xs">{r.upvotes}</span>
                <ArrowBigDown size={18} className="cursor-pointer text-muted hover:text-danger" />
              </div>
              <div className="flex-1">
                <Link to={`/profile/${r.author.username}`} className="flex items-center gap-2 text-sm font-medium hover:text-info">
                  <Avatar name={r.author.name} size={22} /> {r.author.name}
                  <span className="text-xs font-normal text-muted">{timeAgo(r.createdAt)}</span>
                </Link>
                <p className="mt-1 text-sm text-ink/90">{r.body}</p>
              </div>
              {r.author.username === 'mwannabe' && (
                <button onClick={() => setConfirmDel(r.id)} className="cursor-pointer text-muted hover:text-danger">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </PageBody>

      <ConfirmPopup
        open={confirmDel !== null}
        onClose={() => setConfirmDel(null)}
        onConfirm={() => { setReplies((r) => r.filter((x) => x.id !== confirmDel)); toast('Comment deleted'); }}
        title="Delete comment?"
        message="This comment will be permanently deleted."
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
