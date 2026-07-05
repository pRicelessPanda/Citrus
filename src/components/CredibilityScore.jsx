import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

function toneFor(v) {
  if (v >= 8) return { bar: 'bg-success', text: 'text-success' };
  if (v >= 6) return { bar: 'bg-info', text: 'text-info' };
  return { bar: 'bg-warning', text: 'text-warning' };
}

function Bar({ value }) {
  const t = toneFor(value);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
      <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${(value / 10) * 100}%` }} />
    </div>
  );
}

const SUB_HELP = {
  Currency: 'Recency relative to how fast the field moves.',
  'Journal quality': 'Impact factor, peer-review status, predatory-journal check (averaged).',
  'Author credentials': 'Affiliation, field expertise, h-index, conflict-of-interest (averaged).',
  Accuracy: 'Methodology, sample size, retraction status, replication, evidence strength (averaged).',
  Relevance: 'How directly the paper addresses the project hypothesis.',
};

export default function CredibilityScore({ scores, evidenceStrength, compact = false, insufficientMessage }) {
  const [open, setOpen] = useState(false);

  if (!scores) {
    return (
      <div className="rounded-xl border border-line bg-warning-light/60 px-4 py-3 text-sm text-warning">
        {insufficientMessage || 'Add more paper details to generate a credibility score'}
      </div>
    );
  }

  const t = toneFor(scores.final);
  const sub = [
    ['Currency', scores.currency],
    ['Journal quality', scores.journal],
    ['Author credentials', scores.author],
    ['Accuracy', scores.accuracy],
  ];
  if (scores.relevance != null) sub.push(['Relevance', scores.relevance]);

  return (
    <div className="rounded-xl border border-line bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-left"
      >
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Source credibility</span>
          <span className={`font-display text-2xl ${t.text}`}>
            {scores.final}
            <span className="text-base text-muted">/10</span>
          </span>
        </div>
        <div className="flex-1">
          <Bar value={scores.final} />
        </div>
        <ChevronDown size={18} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="space-y-3 border-t border-line px-4 py-4">
          {sub.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-ink">
                  {label}
                  <span title={SUB_HELP[label]} className="cursor-help text-muted/60">
                    <Info size={13} />
                  </span>
                </span>
                <span className={toneFor(value).text}>{value.toFixed(1)}</span>
              </div>
              <Bar value={value} />
            </div>
          ))}
          {evidenceStrength != null && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <span className="font-medium">Evidence strength:</span>
              <span>
                {evidenceStrength}/4 —{' '}
                {['Preliminary', 'Contested', 'Mixed', 'Strong consensus'][evidenceStrength - 1]}
              </span>
            </div>
          )}
          <p className="pt-1 text-xs text-muted">
            Final = average of {sub.length} subscores.
          </p>
        </div>
      )}
    </div>
  );
}

// Inline mini badge used on cards.
export function ScoreBadge({ value }) {
  if (value == null) return null;
  const t = toneFor(value);
  return (
    <div className="flex items-center gap-2" title="Source credibility score">
      <span className={`text-sm font-semibold ${t.text}`}>{value}/10</span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-black/5">
        <div className={`h-full ${t.bar}`} style={{ width: `${(value / 10) * 100}%` }} />
      </div>
    </div>
  );
}
