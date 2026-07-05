import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { BadgeCheck, UserPlus, UserCheck, Info } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Avatar, Button, Badge, ConfirmPopup, useToast } from '../components/ui.jsx';
import PaperCard from '../components/PaperCard.jsx';
import { authorById, papersByAuthor } from '../data/authors.js';
import { useStore } from '../store.js';
import { FIELDS } from '../data/fields.js';

export default function AuthorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const author = authorById(id);
  const following = useStore((s) => s.bookmarks.following);
  const followAuthor = useStore((s) => s.followAuthor);
  const user = useStore((s) => s.user);

  const [ownerView, setOwnerView] = useState(false); // demo toggle for author's own view
  const [claimOpen, setClaimOpen] = useState(false);
  const [notMine, setNotMine] = useState(null);
  const [sort, setSort] = useState('recent');
  const [yearFilter, setYearFilter] = useState('');

  if (!author) return <PageBody>Author not found.</PageBody>;

  const isFollowing = following.includes(author.id);
  let papers = papersByAuthor(author.id);
  if (yearFilter) papers = papers.filter((p) => String(p.year) === yearFilter);
  papers = [...papers].sort((a, b) => (sort === 'cited' ? b.citations - a.citations : b.year - a.year));

  return (
    <>
      <PageHeader
        title="Author page"
        right={
          author.claimed && (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={ownerView} onChange={(e) => setOwnerView(e.target.checked)} />
              Preview author's own view
            </label>
          )
        }
      />
      <PageBody>
        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-start gap-5">
            <Avatar name={author.name} src={author.claimed ? author.photo : null} size={80} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl">{author.name}</h1>
                {author.claimed && (
                  <span
                    title="This author has a Citrus account"
                    className="inline-flex items-center gap-1 text-info"
                  >
                    <BadgeCheck size={22} fill="currentColor" className="text-info" />
                  </span>
                )}
              </div>
              {author.claimed && author.bio && <p className="mt-1 text-sm text-ink/80">{author.bio}</p>}
              <p className="mt-1 text-sm text-muted">
                {author.institution} · {author.field}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <Stat label="Followers" value={author.followers.toLocaleString()} />
                <Stat label="h-index" value={author.hIndex} />
                <Stat label="Citations" value={author.citations.toLocaleString()} />
                <Stat label="Publications" value={papersByAuthor(author.id).length} />
              </div>
              <p className="mt-2 text-xs text-muted">Last updated {author.lastUpdated}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button
                variant={isFollowing ? 'subtle' : 'primary'}
                onClick={() => {
                  followAuthor(author.id);
                  toast(isFollowing ? 'Unfollowed' : `Following ${author.name}`);
                }}
              >
                {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              {author.claimed ? (
                <Button variant="outline" size="sm" onClick={() => navigate(`/profile/${author.citrusUsername}`)}>
                  View Citrus Profile
                </Button>
              ) : (
                <button
                  onClick={() => setClaimOpen(true)}
                  className="cursor-pointer text-sm text-info hover:underline"
                >
                  Is this you? Claim this page
                </button>
              )}
            </div>
          </div>

          {ownerView && author.claimed && (
            <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-page p-4">
              <div>
                <p className="mb-2 text-sm font-semibold">Citrus accounts following you</p>
                <div className="flex flex-wrap gap-2">
                  {['jdoudna', 'mrossi', 'epetrova'].map((u) => (
                    <Link key={u} to={`/profile/${u}`} className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm hover:shadow-sm">
                      <Avatar name={u} size={22} /> @{u}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Missing a publication?</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/authors')}>
                  Request missing papers →
                </Button>
                <p className="mt-2 text-xs text-muted">
                  Opens Paper Search; the arXiv page’s only action is “Add to author publications.”
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Publications */}
        <div className="mt-6 mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl">Publications</h2>
          <div className="flex items-center gap-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none"
            >
              <option value="">All years</option>
              {[...new Set(papersByAuthor(author.id).map((p) => p.year))].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm outline-none"
            >
              <option value="recent">Most recent</option>
              <option value="cited">Most cited</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {papers.map((p) => (
            <PaperCard
              key={p.id}
              paper={p}
              showScore
              footer={
                ownerView && (
                  <button
                    onClick={() => setNotMine(p.id)}
                    className="mt-2 cursor-pointer text-xs text-danger hover:underline"
                  >
                    This is not my paper
                  </button>
                )
              }
            />
          ))}
        </div>
      </PageBody>

      {/* Claim flow */}
      <ClaimModal open={claimOpen} onClose={() => setClaimOpen(false)} author={author} />

      <ConfirmPopup
        open={notMine !== null}
        onClose={() => setNotMine(null)}
        onConfirm={() => toast('Paper removed from your publications')}
        title="Remove this paper?"
        message="This paper will be removed from your author page. You can request it back later."
        confirmLabel="Remove"
        danger
      />
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <span className="font-semibold">{value}</span> <span className="text-muted">{label}</span>
    </div>
  );
}

function ClaimModal({ open, onClose, author }) {
  const toast = useToast();
  const [method, setMethod] = useState(null);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-6" onMouseDown={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl">Claim {author.name}’s page</h2>
        <p className="mt-1 text-sm text-muted">Verify you are this author to sync your Citrus profile.</p>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setMethod('orcid')}
            className={`w-full cursor-pointer rounded-xl border p-4 text-left ${method === 'orcid' ? 'border-info bg-info-light' : 'border-line'}`}
          >
            <p className="font-medium">Verify with ORCID</p>
            <p className="text-sm text-muted">OAuth — instant verification.</p>
          </button>
          <button
            onClick={() => setMethod('manual')}
            className={`w-full cursor-pointer rounded-xl border p-4 text-left ${method === 'manual' ? 'border-info bg-info-light' : 'border-line'}`}
          >
            <p className="font-medium">Manual review</p>
            <p className="text-sm text-muted">
              Submit a Google Scholar URL, LinkedIn, personal site, or paper PDF — reviewed in a few business days.
            </p>
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!method}
            onClick={() => {
              toast(method === 'orcid' ? 'Verified via ORCID — page claimed' : 'Submitted for manual review');
              onClose();
            }}
          >
            {method === 'orcid' ? 'Verify instantly' : 'Submit for review'}
          </Button>
        </div>
      </div>
    </div>
  );
}
