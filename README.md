# Citrus

An AI-native scientific research platform — frontend build.

Citrus helps researchers understand, discover, compare, organize, and write
scientific research. This is a clickable, navigable desktop-web app with all AI
responses, credibility scores, and paper data **mocked** behind a swappable
service layer, so real APIs can drop in later.

## Stack

- **React + Vite**, **React Router** (every top-level nav item is a route)
- **Tailwind CSS v4** with the Citrus design tokens (dark navy + lime accent,
  DM Serif Display headings, DM Sans body)
- **Zustand** for the in-memory store (libraries, projects, papers, calendar,
  notifications)
- **lucide-react** icons
- Mock AI lives in `src/services/mockAI.js` — async functions returning canned
  responses after a short delay. Swap these for real API calls.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## What's implemented

- **Shell** — persistent side-panel nav, per-page top bars, shared primitives.
- **Paper search & discovery** — conversational search with clarifying
  messages, three home tabs, filters → chips, list/grid + sorting, recent
  searches, paste-link / upload-PDF routing (in-DB → arXiv page; fresh → process
  → translated; inaccessible → universal error).
- **Paper pages** — arXiv-style untranslated full page and the translated
  explainer (editable banner, collapsible sections, per-section reading levels,
  highlight-to-ask, Ask AI split-screen, credibility score, citation export,
  related papers).
- **Compare** — two slots → section-by-section result with highlight mode,
  similarity score, side-by-side credibility, Ask AI scoped to both papers.
- **Authors** — fuzzy search with filters, author pages (unclaimed / claimed /
  owner views) and the ORCID / manual claim flow.
- **Libraries** — Translations, Visited, Comparisons, Bookmarks (tabbed).
- **Research** — projects & papers library; project creation (write-your-own
  with conversational Tab 1/Tab 2, or Ask-AI-for-topic with idea generation) via
  a color wheel that greys out taken colors; project workspace (Background, AI
  Chatbot, Literature Review, Reference Papers/Sources, plus "coming soon"
  stubs); research-paper creation (Tab 1 sections, Tab 2 sources, generated
  document with clickable citations and flags) with sharing + regular/AI
  channels.
- **Calendar** — unified private deadline calendar in per-project colors, with a
  "Coming up" summary shared with the dashboard.
- **Community** — forums (hot / suggested, compose, threads), messaging (DMs +
  group channels), notifications (categorized, inline accept/decline).
- **Profile, Settings, Dashboard**.

The AI/data service layer is isolated so a real backend can replace it without
touching the UI.
