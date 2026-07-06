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

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="font-paper relative min-h-screen bg-paper text-ink">
      <Grain />

      {/* nav — a quiet masthead */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all ${
          scrolled ? 'border-inkline bg-paper/90 backdrop-blur-xl' : 'border-transparent bg-paper/60'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <CitrusMark size={34} onLight />
            <span className="font-display text-2xl text-ink">Citrus</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `font-sans rounded-lg px-3.5 py-2 text-sm transition-colors ${
                    isActive ? 'text-leaf' : 'text-ink/60 hover:text-ink'
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
              className="font-sans hidden cursor-pointer rounded-lg px-3.5 py-2 text-sm text-ink/60 hover:text-ink sm:block"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="font-sans group flex cursor-pointer items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-soft"
            >
              Launch Citrus
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button onClick={() => setMenuOpen((o) => !o)} className="cursor-pointer p-1.5 text-ink lg:hidden">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-inkline bg-paper px-6 py-4 lg:hidden">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="font-sans block py-2 text-ink/70 hover:text-ink">
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

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
    <footer className="relative z-10 mt-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rule-double" />
        <div className="grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <CitrusMark size={30} onLight />
              <span className="font-display text-xl text-ink">Citrus</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm italic text-ink/55">
              The AI-native scientific research platform. Papers, credibility, comparisons, and the write-up — in one place.
            </p>
            <div className="font-sans mt-5 flex gap-3">
              {['X', 'in', 'GH'].map((s) => (
                <a key={s} href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-inkline text-xs text-ink/50 hover:border-leaf hover:text-leaf">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="font-sans">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">{c.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink/60">
                {c.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="hover:text-ink">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="font-mono flex flex-col items-center justify-between gap-3 border-t border-inkline py-6 text-[11px] uppercase tracking-widest text-ink/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Citrus, Inc.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
