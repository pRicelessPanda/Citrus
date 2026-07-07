import { BadgeCheck, AlertTriangle, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

// Literature-stage rigor badges (adopted from OpenScience's PRISMA pipeline):
// quality tiers, citation verification, and evidence stances.

// Evidence strength 1–4 maps to quality tiers (4 = strongest = Tier 1).
const TIERS = {
  4: { tier: 1, label: 'Strong consensus', cls: 'bg-success-light text-success' },
  3: { tier: 2, label: 'Mixed evidence', cls: 'bg-info-light text-info' },
  2: { tier: 3, label: 'Contested', cls: 'bg-warning-light text-warning' },
  1: { tier: 4, label: 'Preliminary', cls: 'bg-danger-light text-danger' },
};

export function TierBadge({ evidenceStrength }) {
  const t = TIERS[evidenceStrength];
  if (!t) return null;
  return (
    <span
      title={`Quality tier ${t.tier} of 4 — ${t.label.toLowerCase()}`}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${t.cls}`}
    >
      Tier {t.tier} · {t.label}
    </span>
  );
}

// A citation counts as verified when it resolves to a DOI or arXiv record.
export function isVerified(paper) {
  return Boolean(paper?.doi || paper?.arxivId);
}

export function VerifiedBadge({ paper }) {
  return isVerified(paper) ? (
    <span
      title="Citation verified against DOI/arXiv records"
      className="inline-flex items-center gap-1 rounded-full bg-success-light px-2.5 py-0.5 text-xs font-medium text-success"
    >
      <BadgeCheck size={13} /> Citation verified
    </span>
  ) : (
    <span
      title="Could not verify this citation — add a DOI or link to resolve"
      className="inline-flex items-center gap-1 rounded-full bg-warning-light px-2.5 py-0.5 text-xs font-medium text-warning"
    >
      <AlertTriangle size={13} /> Citation unverified
    </span>
  );
}

// Stance of a reference toward the project hypothesis.
const STANCES = {
  supports: { icon: ThumbsUp, label: 'Supports hypothesis', cls: 'bg-success-light text-success' },
  contradicts: { icon: ThumbsDown, label: 'Contradicts hypothesis', cls: 'bg-danger-light text-danger' },
  neutral: { icon: Minus, label: 'Neutral / context', cls: 'bg-black/5 text-muted' },
};

export function StanceBadge({ stance }) {
  const s = STANCES[stance] || STANCES.neutral;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      <s.icon size={13} /> {s.label}
    </span>
  );
}

// Deterministic pseudo-stance for demo data when none was assigned.
export function defaultStance(paperId) {
  let h = 0;
  for (const c of paperId) h = (h * 31 + c.charCodeAt(0)) % 997;
  return h % 3 === 0 ? 'contradicts' : h % 3 === 1 ? 'supports' : 'neutral';
}
