import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Users,
  GitCompare,
  Languages,
  History,
  Rows3,
  Bookmark,
  FolderKanban,
  Calendar,
  MessagesSquare,
  Mail,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import { useStore } from '../store.js';
import { Avatar } from './ui.jsx';
import { CitrusMark } from './Logo.jsx';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/search', label: 'Paper Search', icon: Search },
  { to: '/authors', label: 'Author Search', icon: Users },
  { to: '/compare', label: 'Compare Papers', icon: GitCompare },
  { to: '/translations', label: 'Translations', icon: Languages },
  { to: '/visited', label: 'Visited Papers', icon: History },
  { to: '/comparisons', label: 'Comparisons', icon: Rows3 },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/research', label: 'Research Projects & Papers', icon: FolderKanban },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/forums', label: 'Forums', icon: MessagesSquare, dot: true },
  { to: '/messages', label: 'Messages', icon: Mail },
  { to: '/notifications', label: 'Notifications', icon: Bell, unread: true },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-4 py-5">
      <CitrusMark size={38} />
      <span className="font-display text-2xl text-white">Citrus</span>
    </Link>
  );
}

export default function Layout({ children }) {
  const user = useStore((s) => s.user);
  const unread = useStore((s) => s.unreadCount());
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <aside className="flex w-64 shrink-0 flex-col bg-navy text-white">
        <Logo />
        <Link
          to="/profile"
          className="mx-3 mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5"
        >
          <Avatar name={user.displayName} src={user.photo} size={40} className="ring-2 ring-lime/40" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.displayName}</p>
            <p className="truncate text-xs text-white/50">@{user.username}</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-lime/15 text-lime' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.unread && unread > 0 && (
                <span className="rounded-full bg-lime px-1.5 text-xs font-semibold text-navy">{unread}</span>
              )}
              {item.dot && <span className="h-2 w-2 rounded-full bg-lime" />}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => navigate('/dashboard')}
          className="m-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <LogOut size={18} /> Sign out
        </button>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
