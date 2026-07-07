import { create } from 'zustand';
import { PAPERS, paperById } from './data/papers.js';
import { NOTIFICATIONS } from './data/community.js';

// Project / paper color rules (§14.1): no two ACTIVE items share a color.
const SEED_PROJECTS = [
  {
    id: 'proj-1',
    kind: 'project',
    name: 'Attention mechanisms in low-resource NLP',
    color: '#5DCAA5',
    category: 'Machine Learning',
    status: 'in progress',
    createdAt: '2026-05-10',
    overview: {
      title: 'Attention mechanisms in low-resource NLP',
      rationale:
        'Attention-based models dominate high-resource benchmarks but their behavior in low-resource languages is under-characterized.',
      hypothesis: 'Attention sparsity patterns transfer across typologically similar low-resource languages.',
      solution:
        'A staged study: probe attention maps on high-resource models, transfer to low-resource pairs, and validate on held-out typologies. Novel in combining probing with cross-lingual transfer. Main challenge is data scarcity.',
    },
    outlineDone: true,
    references: [
      { paperId: 'attention-2017', addedAt: '2026-05-12T15:42:00Z', relevance: 9.4, stance: 'supports' },
      { paperId: 'nlp-bias-2021', addedAt: '2026-05-20T10:15:00Z', relevance: 7.8, stance: 'contradicts' },
    ],
    notes: 'Focus first on Dravidian language family.',
    chat: [
      {
        id: 'c1',
        role: 'user',
        author: 'Ashish Vaswani',
        at: '2026-07-01T09:58:00Z',
        text: 'Where do we stand on the literature for the transfer claim?',
      },
      {
        id: 'c2',
        role: 'ai',
        author: 'Citrus AI',
        at: '2026-07-01T10:00:00Z',
        text: 'Reading from the project artifacts: 2 references so far — 1 supports the transfer claim, 1 contradicts it. Both sides are retained in the reference list. The Background hypothesis may need scoping once we add Tier 1 sources.',
        grounded: ['Background', 'References (2)'],
      },
    ],
    deadlines: [
      { id: 'd1', title: 'Submit abstract', date: '2026-07-08', desc: 'ACL workshop', done: false, notify: ['1w', '3d'] },
      { id: 'd2', title: 'Finish literature review', date: '2026-07-22', desc: '', done: false, notify: ['1w'] },
    ],
  },
  {
    id: 'proj-2',
    kind: 'project',
    name: 'Microbiome & immunotherapy response',
    color: '#1A6B9A',
    category: 'Immunology',
    status: 'completed',
    createdAt: '2026-02-01',
    overview: {
      title: 'Microbiome & immunotherapy response',
      rationale: 'Gut microbial composition may predict checkpoint-blockade response.',
      hypothesis: 'Specific taxa are enriched in responders and causally modulate response.',
      solution: 'Meta-analysis of published cohorts plus germ-free mouse validation.',
    },
    outlineDone: true,
    references: [{ paperId: 'gut-microbiome-2019', addedAt: '2026-02-05T09:00:00Z', relevance: 9.1 }],
    notes: '',
    deadlines: [],
  },
];

const SEED_RESEARCH_PAPERS = [
  {
    id: 'rpaper-1',
    kind: 'paper',
    name: 'A survey of transformer architectures',
    color: '#BA7517',
    status: 'in progress',
    createdAt: '2026-06-01',
    academicTitle: 'Transformer Architectures: A Structured Survey',
    context: 'A comprehensive survey aimed at graduate students entering NLP.',
    sources: [
      { id: 's1', paperId: 'attention-2017' },
      { id: 's2', paperId: 'nlp-bias-2021' },
    ],
    tab1: {
      Abstract: { notes: '', sources: [], refs: [] },
      Introduction: { notes: 'Motivate why transformers matter.', sources: ['s1'], refs: [] },
      'Literature Review': { notes: '', sources: ['s1', 's2'], refs: [] },
      Methodology: { notes: '', sources: [], refs: [] },
      Results: { notes: '', sources: [], refs: [] },
      Discussion: { notes: '', sources: [], refs: [] },
      Limitations: { notes: '', sources: [], refs: [] },
      Conclusion: { notes: '', sources: [], refs: [] },
    },
    generated: null,
    deadlines: [
      { id: 'd3', title: 'Draft complete', date: '2026-07-15', desc: '', done: false, notify: ['1w', '2d'] },
    ],
    channels: [
      { id: 'ch1', type: 'regular', name: 'general' },
      { id: 'ch2', type: 'ai', name: 'AI · methodology' },
    ],
    collaborators: [{ username: 'me', role: 'Owner' }],
  },
];

export const useStore = create((set, get) => ({
  // ---- current user ----
  user: {
    username: 'mwannabe',
    displayName: 'Mit Patel',
    photo: null,
    subheader: 'PhD student · Computational biology',
    bio: 'Interested in the intersection of machine learning and molecular biology.',
    links: [{ name: 'Website', url: 'https://example.com' }],
    fieldInterests: ['Machine Learning', 'Genomics', 'Immunology'],
    topicInterests: ['protein folding', 'attention models'],
    role: 'PhD student',
    goal: 'Publish first-author paper',
    hasAuthorPage: false,
    friends: ['jdoudna', 'epetrova'],
  },

  // ---- libraries ----
  translations: [{ paperId: 'attention-2017', at: '2026-06-15T12:00:00Z', level: 'Curious Adult' }],
  visited: [
    { paperId: 'attention-2017', at: '2026-07-04T12:00:00Z' },
    { paperId: 'crispr-2012', at: '2026-07-03T09:00:00Z' },
  ],
  comparisons: [
    {
      id: 'cmp-1',
      a: 'attention-2017',
      b: 'nlp-bias-2021',
      similarity: 6.4,
      at: '2026-06-20T14:00:00Z',
    },
  ],
  bookmarks: {
    papers: ['crispr-2012'],
    translations: ['attention-2017'],
    forums: ['p1'],
    following: ['a-doudna', 'a-hassabis'],
  },
  recentSearches: [
    { id: 'rs1', query: 'transformer attention mechanisms', at: '2026-07-04T10:00:00Z' },
    { id: 'rs2', query: 'CRISPR delivery', at: '2026-07-03T15:00:00Z' },
  ],

  projects: SEED_PROJECTS,
  researchPapers: SEED_RESEARCH_PAPERS,

  notifications: NOTIFICATIONS,

  // ---- actions ----
  addVisited: (paperId) =>
    set((s) => {
      const rest = s.visited.filter((v) => v.paperId !== paperId);
      return { visited: [{ paperId, at: new Date().toISOString() }, ...rest] };
    }),

  addTranslation: (paperId, level) =>
    set((s) => {
      if (s.translations.find((t) => t.paperId === paperId)) return s;
      return { translations: [{ paperId, at: new Date().toISOString(), level }, ...s.translations] };
    }),

  removeTranslation: (paperId) =>
    set((s) => ({ translations: s.translations.filter((t) => t.paperId !== paperId) })),

  removeVisited: (paperId) =>
    set((s) => ({ visited: s.visited.filter((v) => v.paperId !== paperId) })),

  toggleBookmark: (kind, id) =>
    set((s) => {
      const list = s.bookmarks[kind] || [];
      const has = list.includes(id);
      return {
        bookmarks: {
          ...s.bookmarks,
          [kind]: has ? list.filter((x) => x !== id) : [id, ...list],
        },
      };
    }),

  isBookmarked: (kind, id) => (get().bookmarks[kind] || []).includes(id),

  addComparison: (a, b, similarity) =>
    set((s) => ({
      comparisons: [
        { id: `cmp-${Date.now()}`, a, b, similarity, at: new Date().toISOString() },
        ...s.comparisons,
      ],
    })),

  removeComparison: (id) =>
    set((s) => ({ comparisons: s.comparisons.filter((c) => c.id !== id) })),

  addSearch: (query) =>
    set((s) => {
      if (!query.trim()) return s;
      return {
        recentSearches: [
          { id: `rs-${Date.now()}`, query, at: new Date().toISOString() },
          ...s.recentSearches.filter((r) => r.query !== query),
        ],
      };
    }),

  removeSearch: (id) =>
    set((s) => ({ recentSearches: s.recentSearches.filter((r) => r.id !== id) })),

  clearSearches: () => set({ recentSearches: [] }),

  followAuthor: (authorId) =>
    set((s) => {
      const has = s.bookmarks.following.includes(authorId);
      return {
        bookmarks: {
          ...s.bookmarks,
          following: has
            ? s.bookmarks.following.filter((x) => x !== authorId)
            : [authorId, ...s.bookmarks.following],
        },
      };
    }),

  // projects & papers
  addProject: (project) =>
    set((s) => ({ projects: [{ ...project, kind: 'project' }, ...s.projects] })),

  addResearchPaper: (paper) =>
    set((s) => ({ researchPapers: [{ ...paper, kind: 'paper' }, ...s.researchPapers] })),

  updateProject: (id, patch) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  updateResearchPaper: (id, patch) =>
    set((s) => ({
      researchPapers: s.researchPapers.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  deleteProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

  deleteResearchPaper: (id) =>
    set((s) => ({ researchPapers: s.researchPapers.filter((p) => p.id !== id) })),

  addProjectReference: (projectId, paperId, relevance = 8.0, stance) =>
    set((s) => {
      // deterministic demo stance when none was assessed yet
      let h = 0;
      for (const c of paperId) h = (h * 31 + c.charCodeAt(0)) % 997;
      const st = stance || (h % 3 === 0 ? 'contradicts' : h % 3 === 1 ? 'supports' : 'neutral');
      return {
        projects: s.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                references: [
                  ...(p.references || []).filter((r) => r.paperId !== paperId),
                  { paperId, addedAt: new Date().toISOString(), relevance, stance: st },
                ],
              }
            : p
        ),
      };
    }),

  addProjectChatMessage: (projectId, msg) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId ? { ...p, chat: [...(p.chat || []), msg] } : p
      ),
    })),

  removeProjectReference: (projectId, paperId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? { ...p, references: (p.references || []).filter((r) => r.paperId !== paperId) }
          : p
      ),
    })),

  addDeadline: (ownerId, deadline) =>
    set((s) => {
      const apply = (arr) =>
        arr.map((x) =>
          x.id === ownerId
            ? { ...x, deadlines: [...(x.deadlines || []), { id: `d-${Date.now()}`, done: false, ...deadline }] }
            : x
        );
      return { projects: apply(s.projects), researchPapers: apply(s.researchPapers) };
    }),

  updateDeadline: (ownerId, deadlineId, patch) =>
    set((s) => {
      const apply = (arr) =>
        arr.map((x) =>
          x.id === ownerId
            ? { ...x, deadlines: (x.deadlines || []).map((d) => (d.id === deadlineId ? { ...d, ...patch } : d)) }
            : x
        );
      return { projects: apply(s.projects), researchPapers: apply(s.researchPapers) };
    }),

  // notifications
  markNotification: (id, read) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read } : n)),
    })),
  markAllNotifications: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  deleteNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  clearNotifications: () => set({ notifications: [] }),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));

// Pure derived helpers. Call these inside useMemo in components — NOT inside a
// zustand selector, since they return fresh arrays and would loop forever.
export function getActiveColors(projects, researchPapers) {
  return [...projects, ...researchPapers]
    .filter((x) => x.status === 'in progress')
    .map((x) => x.color.toUpperCase());
}

export function getAllDeadlines(projects, researchPapers) {
  const items = [...projects, ...researchPapers];
  const out = [];
  for (const it of items) {
    for (const d of it.deadlines || []) {
      out.push({ ...d, ownerId: it.id, ownerName: it.name, color: it.color, kind: it.kind });
    }
  }
  return out.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export { paperById, PAPERS };
