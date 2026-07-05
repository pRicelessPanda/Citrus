import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BadgeCheck, Pencil, UserPlus, MessageSquare, Send, Link2, ExternalLink } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Avatar, Tabs, Button, Badge, EmptyState, useToast } from '../components/ui.jsx';
import { useStore } from '../store.js';
import { authorById } from '../data/authors.js';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const me = useStore((s) => s.user);
  const projects = useStore((s) => s.projects);
  const papers = useStore((s) => s.researchPapers);
  const following = useStore((s) => s.bookmarks.following);

  const isOwn = !username || username === me.username;
  const isFriend = username && me.friends.includes(username);

  // For other users we show a light stub profile.
  const profile = isOwn
    ? me
    : {
        username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        subheader: 'Researcher on Citrus',
        bio: 'This is a public profile.',
        links: [],
        fieldInterests: [],
        friends: [],
      };

  const [tab, setTab] = useState('bio');
  const authorPage = me.hasAuthorPage ? authorById('a-vaswani') : null;

  return (
    <>
      <PageHeader title={isOwn ? 'Your profile' : `@${profile.username}`} />
      <PageBody>
        <div className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-start gap-5">
            <Avatar name={profile.displayName} src={profile.photo} size={84} className="ring-2 ring-lime/40" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl">{profile.displayName}</h1>
                {me.hasAuthorPage && isOwn && (
                  <span title="This user has a verified author page on Citrus" className="text-info">
                    <BadgeCheck size={22} fill="currentColor" />
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">@{profile.username}</p>
              {profile.subheader && <p className="mt-1 text-sm">{profile.subheader}</p>}
              {profile.links?.length > 0 && (
                <div className="mt-2 flex gap-3">
                  {profile.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-info hover:underline">
                      <Link2 size={13} /> {l.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {isOwn ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                    <Pencil size={15} /> Edit profile
                  </Button>
                  {me.hasAuthorPage && (
                    <Button variant="subtle" size="sm" onClick={() => navigate('/authors/a-vaswani')}>
                      View Author Page
                    </Button>
                  )}
                </>
              ) : isFriend ? (
                <>
                  <Button size="sm" onClick={() => navigate('/messages')}>
                    <MessageSquare size={15} /> Message
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast('Invite sent')}>
                    <Send size={15} /> Invite to project or paper
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => toast('Friend request sent')}>
                    <UserPlus size={15} /> Add friend
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast('Invite sent')}>
                    <Send size={15} /> Invite to project or paper
                  </Button>
                </>
              )}
            </div>
          </div>
          {profile.bio && <p className="mt-4 text-[15px] leading-relaxed text-ink/90">{profile.bio}</p>}
        </div>

        <div className="mt-6">
          <Tabs
            tabs={['Bio', 'Posts', 'Comments', 'Projects', 'Papers', 'Friends', ...(isOwn ? ['Following'] : [])].map((t) => ({
              id: t.toLowerCase(),
              label: t,
            }))}
            active={tab}
            onChange={setTab}
            className="mb-5"
          />

          {tab === 'bio' && (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-display text-xl">About</h3>
              <p className="mt-2 text-[15px] text-ink/90">{profile.bio}</p>
              {profile.fieldInterests?.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Field interests</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.fieldInterests.map((f) => (
                      <Badge key={f} tone="lime">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'posts' && <EmptyState icon={MessageSquare} title="No posts yet" />}
          {tab === 'comments' && <EmptyState icon={MessageSquare} title="No comments yet" />}

          {tab === 'projects' &&
            (projects.length === 0 || !isOwn ? (
              <EmptyState title="No public projects yet" />
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {projects.map((p) => (
                  <Link key={p.id} to={`/research/project/${p.id}`} className="rounded-xl border border-line bg-white p-4 hover:shadow-sm">
                    <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                    <p className="mt-2 font-display text-lg">{p.name}</p>
                  </Link>
                ))}
              </div>
            ))}

          {tab === 'papers' &&
            (papers.length === 0 || !isOwn ? (
              <EmptyState title="No public papers yet" />
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {papers.map((p) => (
                  <Link key={p.id} to={`/research/paper/${p.id}`} className="rounded-xl border border-line bg-white p-4 hover:shadow-sm">
                    <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                    <p className="mt-2 font-display text-lg">{p.name}</p>
                  </Link>
                ))}
              </div>
            ))}

          {tab === 'friends' && (
            <div className="grid grid-cols-2 gap-4">
              {me.friends.map((u) => (
                <Link key={u} to={`/profile/${u}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 hover:shadow-sm">
                  <Avatar name={u} size={40} />
                  <span className="font-medium">@{u}</span>
                </Link>
              ))}
            </div>
          )}

          {tab === 'following' && isOwn && (
            <div className="grid grid-cols-2 gap-4">
              {following.map((aid) => {
                const a = authorById(aid);
                if (!a) return null;
                return (
                  <Link key={aid} to={`/authors/${aid}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 hover:shadow-sm">
                    <Avatar name={a.name} size={40} />
                    <div>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-muted">{a.institution}</p>
                    </div>
                  </Link>
                );
              })}
              <p className="col-span-2 text-xs text-muted">Following is private — only you can see this.</p>
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
