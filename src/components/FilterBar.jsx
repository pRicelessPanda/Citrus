import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

// Dropdown filter types → removable active-filter chips (§6, §12).
export default function FilterBar({ filterTypes, active, onChange, right }) {
  const [openType, setOpenType] = useState(null);

  const setValue = (key, value) => {
    onChange({ ...active, [key]: value });
    setOpenType(null);
  };
  const removeChip = (key) => {
    const next = { ...active };
    delete next[key];
    onChange(next);
  };
  const clearAll = () => onChange({});

  const chips = Object.entries(active).filter(([, v]) => v != null && v !== '');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setOpenType(openType === '__menu' ? null : '__menu')}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-ink hover:bg-page"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
        {openType === '__menu' && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenType(null)} />
            <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-line bg-white py-1 shadow-xl">
              {filterTypes.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setOpenType(f.key)}
                  className="block w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-page"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </>
        )}
        {openType && openType !== '__menu' && (
          <FilterValuePicker
            filter={filterTypes.find((f) => f.key === openType)}
            current={active[openType]}
            onPick={(v) => setValue(openType, v)}
            onClose={() => setOpenType(null)}
          />
        )}
      </div>

      {chips.map(([key, value]) => {
        const f = filterTypes.find((x) => x.key === key);
        return (
          <span
            key={key}
            className="flex items-center gap-1 rounded-full bg-info-light px-3 py-1 text-xs font-medium text-info"
          >
            {f?.label}: {String(value)}
            <button onClick={() => removeChip(key)} className="cursor-pointer hover:text-info/70">
              <X size={13} />
            </button>
          </span>
        );
      })}
      {chips.length > 0 && (
        <button onClick={clearAll} className="cursor-pointer text-xs text-muted hover:text-ink">
          Clear all
        </button>
      )}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

function FilterValuePicker({ filter, current, onPick, onClose }) {
  const [range, setRange] = useState(current || '');
  if (!filter) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 top-full z-50 mt-1 max-h-72 w-64 overflow-auto rounded-xl border border-line bg-white p-2 shadow-xl">
        {filter.type === 'select' &&
          filter.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onPick(opt)}
              className={`block w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-sm hover:bg-page ${
                current === opt ? 'text-info' : 'text-ink'
              }`}
            >
              {opt}
            </button>
          ))}
        {filter.type === 'number' && (
          <div className="p-2">
            <input
              type="number"
              autoFocus
              defaultValue={current}
              placeholder={filter.placeholder}
              className="w-full rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-info"
              onKeyDown={(e) => e.key === 'Enter' && onPick(Number(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted">Press Enter to apply</p>
          </div>
        )}
        {filter.type === 'range' && (
          <div className="space-y-2 p-2">
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              defaultValue={current || filter.min}
              className="w-full accent-[var(--color-lime)]"
              onChange={(e) => setRange(e.target.value)}
            />
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{filter.min}</span>
              <span className="font-medium text-ink">{range || filter.min}</span>
              <span>{filter.max}</span>
            </div>
            <button
              onClick={() => onPick(Number(range || filter.min))}
              className="w-full cursor-pointer rounded-lg bg-navy px-3 py-1.5 text-sm text-white"
            >
              Apply
            </button>
          </div>
        )}
        {filter.type === 'text' && (
          <div className="p-2">
            <input
              autoFocus
              defaultValue={current}
              placeholder={filter.placeholder}
              className="w-full rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-info"
              onKeyDown={(e) => e.key === 'Enter' && onPick(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted">Press Enter to apply</p>
          </div>
        )}
      </div>
    </>
  );
}
