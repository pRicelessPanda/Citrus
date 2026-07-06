import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { CitrusMark } from '../components/Logo.jsx';
import { Grain } from './mkui.jsx';

const NAV = [
  { to: '/product', label: 'Product' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
];

export default function MarketingLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-navy text-white">
      <Grain />

      {/* nav */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled ? 'border-b border-white/10 bg-navy/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <CitrusMark size={36} />
            <span className="font-display text-2xl">Citrus</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm transition-colors ${
                    isActive ? 'text-lime' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="hidden cursor-pointer rounded-lg px-4 py-2 text-sm text-white/80 hover:text-white sm:block"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="group flex cursor-pointer items-center gap-1.5 rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-navy shadow-lg shadow-lime/20 hover:brightness-95"
            >
              Launch Citrus
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button onClick={() => setMenuOpen((o) => !o)} className="cursor-pointer p-1.5 text-white lg:hidden">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-navy/95 px-6 py-4 lg:hidden">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="block py-2 text-white/80 hover:text-white">
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-10"><Outlet /></main>

      <MarketingFooter />
    </div>
  );
}

function MarketingFooter() {
  const cols = [
    { title: 'Product', links: [['Overview', '/product'], ['Pricing', '/pricing'], ['Solutions', '/solutions'], ['Changelog', '/blog']] },
    { title: 'Company', links: [['About', '/about'], ['Blog', '/blog'], ['Careers', '/careers'], ['Contact', '/contact']] },
    { title: 'Resources', links: [['Docs', '/product'], ['Help center', '/contact'], ['Community', '/solutions'], ['Status', '/']] },
    { title: 'Legal', links: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Security', '/privacy'], ['Cookies', '/privacy']] },
  ];
  return (
    <footer className="relative z-10 border-t border-white/10 bg-navy">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <CitrusMark size={34} />
              <span className="font-display text-xl">Citrus</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              The AI-native scientific research platform. Understand, discover, compare, organize, and write — all in one place.
            </p>
            <div className="mt-5 flex gap-3">
              {['X', 'in', 'GH'].map((s) => (
                <a key={s} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs text-white/60 hover:border-lime/40 hover:text-lime">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold">{c.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/50">
                {c.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Citrus, Inc. Built for researchers.</p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime" /> All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
