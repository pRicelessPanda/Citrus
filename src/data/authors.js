import { PAPERS } from './papers.js';

// Author records. `claimed` toggles the verified/Citrus-account states.
export const AUTHORS = [
  {
    id: 'a-vaswani',
    name: 'Ashish Vaswani',
    institution: 'Essential AI',
    field: 'Machine Learning',
    hIndex: 42,
    citations: 190000,
    followers: 12840,
    lastUpdated: '2026-06-28',
    claimed: true,
    citrusUsername: 'avaswani',
    bio: 'Working on sequence models and attention mechanisms.',
    photo: null,
  },
  {
    id: 'a-doudna',
    name: 'Jennifer Doudna',
    institution: 'UC Berkeley',
    field: 'Genomics',
    hIndex: 138,
    citations: 120000,
    followers: 30210,
    lastUpdated: '2026-06-30',
    claimed: true,
    citrusUsername: 'jdoudna',
    bio: 'CRISPR genome editing, RNA biology, Nobel laureate.',
    photo: null,
  },
  {
    id: 'a-hassabis',
    name: 'Demis Hassabis',
    institution: 'Google DeepMind',
    field: 'Artificial Intelligence',
    hIndex: 96,
    citations: 210000,
    followers: 45120,
    lastUpdated: '2026-07-01',
    claimed: false,
    photo: null,
  },
  {
    id: 'a-lenton',
    name: 'Timothy Lenton',
    institution: 'University of Exeter',
    field: 'Climate Science',
    hIndex: 88,
    citations: 64000,
    followers: 8420,
    lastUpdated: '2026-06-20',
    claimed: false,
    photo: null,
  },
  {
    id: 'a-born',
    name: 'Jan Born',
    institution: 'University of Tübingen',
    field: 'Neuroscience',
    hIndex: 121,
    citations: 78000,
    followers: 5230,
    lastUpdated: '2026-05-30',
    claimed: false,
    photo: null,
  },
  {
    id: 'a-wargo',
    name: 'Jennifer Wargo',
    institution: 'MD Anderson Cancer Center',
    field: 'Immunology',
    hIndex: 74,
    citations: 42000,
    followers: 3110,
    lastUpdated: '2026-06-11',
    claimed: false,
    photo: null,
  },
];

// Any author id referenced by a paper but not detailed above gets a stub.
const detailed = new Set(AUTHORS.map((a) => a.id));
const stubs = [];
for (const p of PAPERS) {
  p.authorIds.forEach((id, i) => {
    if (id && !detailed.has(id) && !stubs.find((s) => s.id === id)) {
      stubs.push({
        id,
        name: p.authors[i],
        institution: 'Independent',
        field: p.field,
        hIndex: 10 + ((i * 7) % 40),
        citations: 1200 + i * 800,
        followers: 100 + i * 60,
        lastUpdated: '2026-06-01',
        claimed: false,
        photo: null,
      });
    }
  });
}

export const ALL_AUTHORS = [...AUTHORS, ...stubs];

export const authorById = (id) => ALL_AUTHORS.find((a) => a.id === id);

export function papersByAuthor(id) {
  return PAPERS.filter((p) => p.authorIds.includes(id));
}
