import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { ToastProvider } from './components/ui.jsx';

// ---- Marketing site (public, no app shell) ----
import MarketingLayout from './marketing/MarketingLayout.jsx';
import Home from './marketing/pages/Home.jsx';
import Product from './marketing/pages/Product.jsx';
import Solutions from './marketing/pages/Solutions.jsx';
import Pricing from './marketing/pages/Pricing.jsx';
import About from './marketing/pages/About.jsx';
import Blog from './marketing/pages/Blog.jsx';
import BlogPost from './marketing/pages/BlogPost.jsx';
import Careers from './marketing/pages/Careers.jsx';
import Contact from './marketing/pages/Contact.jsx';
import Legal from './marketing/pages/Legal.jsx';
import Login from './pages/Login.jsx';

// ---- Product (inside the app shell) ----
import Dashboard from './pages/Dashboard.jsx';
import Search from './pages/Search.jsx';
import RecentSearches from './pages/RecentSearches.jsx';
import Authors from './pages/Authors.jsx';
import AuthorPage from './pages/AuthorPage.jsx';
import Compare from './pages/Compare.jsx';
import CompareResult from './pages/CompareResult.jsx';
import PaperPage from './pages/PaperPage.jsx';
import TranslatedPaper from './pages/TranslatedPaper.jsx';
import RelatedPapers from './pages/RelatedPapers.jsx';
import Translations from './pages/Translations.jsx';
import Visited from './pages/Visited.jsx';
import Comparisons from './pages/Comparisons.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import Research from './pages/Research.jsx';
import NewProject from './pages/NewProject.jsx';
import NewPaper from './pages/NewPaper.jsx';
import ProjectWorkspace from './pages/ProjectWorkspace.jsx';
import PaperWorkspace from './pages/PaperWorkspace.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import Forums from './pages/Forums.jsx';
import ForumPost from './pages/ForumPost.jsx';
import Messages from './pages/Messages.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import Profile from './pages/Profile.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Standalone sign-in */}
        <Route path="/login" element={<Login />} />

        {/* ===== Marketing website — public, separate from the product ===== */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
        </Route>

        {/* ===== The product — inside the app shell (sidebar) ===== */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/recent" element={<RecentSearches />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:id" element={<AuthorPage />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/compare/result" element={<CompareResult />} />
          <Route path="/paper/:id" element={<PaperPage />} />
          <Route path="/paper/:id/translated" element={<TranslatedPaper />} />
          <Route path="/related/:id" element={<RelatedPapers />} />
          <Route path="/translations" element={<Translations />} />
          <Route path="/visited" element={<Visited />} />
          <Route path="/comparisons" element={<Comparisons />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/new-project" element={<NewProject />} />
          <Route path="/research/new-paper" element={<NewPaper />} />
          <Route path="/research/project/:id" element={<ProjectWorkspace />} />
          <Route path="/research/paper/:id" element={<PaperWorkspace />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/forums/:postId" element={<ForumPost />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Unknown → back to the marketing home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
