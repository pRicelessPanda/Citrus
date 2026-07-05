import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, Users } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Avatar, EmptyState } from '../components/ui.jsx';
import { ALL_AUTHORS } from '../data/authors.js';
import { FIELDS } from '../data/fields.js';

export default function Authors() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [institution, setInstitution] = useState('');
  const [field, setField] = useState('');

  const recent = ALL_AUTHORS.slice(0, 4);
  const typing = q.trim().length > 0 || institution || field;

  let results = ALL_AUTHORS.filter((a) => {
    const matchName = !q || a.name.toLowerCase().includes(q.toLowerCase());
    const matchInst = !institution || a.institution.toLowerCase().includes(institution.toLowerCase());
    const matchField = !field || a.field === field;
    return matchName && matchInst && matchField;
  });

  return (
    <>
      <PageHeader title="Author search">
        <div className="mx-auto max-w-6xl px-8 pb-5">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm focus-within:border-info">
              <SearchIcon size={20} className="text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search authors by name…"
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`cursor-pointer rounded-xl border border-line px-4 py-3 ${showFilters ? 'bg-navy text-white' : 'bg-white text-ink'}`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
          {showFilters && (
            <div className="mt-3 flex gap-3 rounded-xl border border-line bg-white p-3">
              <input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Institution…"
                className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-info"
              />
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="rounded-lg border border-line px-3 py-2 text-sm outline-none"
              >
                <option value="">Any field</option>
                {FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </PageHeader>

      <PageBody>
        {!typing && (
          <p className="mb-3 text-sm font-medium text-muted">Recently viewed authors</p>
        )}
        {typing && results.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No authors found"
            message="No authors found — try a different name or check your spelling."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {(typing ? results : recent).map((a) => (
              <button
                key={a.id}
                onClick={() => navigate(`/authors/${a.id}`)}
                className="flex cursor-pointer items-center gap-4 rounded-xl border border-line bg-white p-4 text-left hover:shadow-sm"
              >
                <Avatar name={a.name} src={a.photo} size={52} />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-medium">
                    {a.name}
                    {a.claimed && (
                      <span title="This author has a Citrus account" className="text-info">
                        ✓
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-muted">{a.institution}</p>
                  <p className="text-xs text-muted">
                    {a.field} · {a.followers.toLocaleString()} followers
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
