import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Badge, Button } from '../components/ui.jsx';
import { useStore, getAllDeadlines } from '../store.js';

const TODAY = new Date('2026-07-05');

export default function CalendarPage() {
  const navigate = useNavigate();
  const projects = useStore((s) => s.projects);
  const researchPapers = useStore((s) => s.researchPapers);
  const deadlines = useMemo(() => getAllDeadlines(projects, researchPapers), [projects, researchPapers]);
  const updateDeadline = useStore((s) => s.updateDeadline);
  const [month, setMonth] = useState(6); // July (0-indexed)
  const [year, setYear] = useState(2026);

  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = first.toLocaleString('en-US', { month: 'long' });

  const byDate = {};
  for (const d of deadlines) {
    const dt = new Date(d.date);
    if (dt.getMonth() === month && dt.getFullYear() === year) {
      (byDate[dt.getDate()] ||= []).push(d);
    }
  }

  const upcoming = deadlines
    .filter((d) => !d.done && new Date(d.date) >= TODAY)
    .slice(0, 5);

  const prev = () => (month === 0 ? (setMonth(11), setYear((y) => y - 1)) : setMonth((m) => m - 1));
  const next = () => (month === 11 ? (setMonth(0), setYear((y) => y + 1)) : setMonth((m) => m + 1));

  const isOverdue = (d) => !d.done && new Date(d.date) < TODAY;

  return (
    <>
      <PageHeader title="Calendar" subtitle="Your private, unified deadline calendar" />
      <PageBody>
        {/* Coming up */}
        <div className="mb-6 rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl">
            <Clock size={18} /> Coming up
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">No upcoming deadlines.</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((d) => (
                <button
                  key={d.id}
                  onClick={() => navigate(d.kind === 'paper' ? `/research/paper/${d.ownerId}` : `/research/project/${d.ownerId}`)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-page"
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                  <span className="flex-1 text-sm">{d.title}</span>
                  <span className="text-xs text-muted">{d.ownerName}</span>
                  <Badge tone={isOverdue(d) ? 'danger' : 'neutral'}>
                    {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Month grid */}
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">
              {monthName} {year}
            </h2>
            <div className="flex gap-1">
              <button onClick={prev} className="cursor-pointer rounded-lg border border-line p-2 hover:bg-page">
                <ChevronLeft size={16} />
              </button>
              <button onClick={next} className="cursor-pointer rounded-lg border border-line p-2 hover:bg-page">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="bg-page py-2 text-center text-xs font-medium text-muted">
                {d}
              </div>
            ))}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`e${i}`} className="min-h-24 bg-white" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = year === 2026 && month === 6 && day === 5;
              return (
                <div key={day} className={`min-h-24 bg-white p-1.5 ${isToday ? 'ring-2 ring-inset ring-lime' : ''}`}>
                  <span className={`text-xs ${isToday ? 'font-bold text-lime' : 'text-muted'}`}>{day}</span>
                  <div className="mt-1 space-y-1">
                    {(byDate[day] || []).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => updateDeadline(d.ownerId, d.id, { done: !d.done })}
                        title={`${d.title} — ${d.ownerName}`}
                        className="flex w-full cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-left text-[11px]"
                        style={{
                          background: d.done ? '#E5E5E0' : isOverdue(d) ? 'var(--color-danger-light)' : `${d.color}33`,
                          color: d.done ? '#999' : isOverdue(d) ? 'var(--color-danger)' : 'var(--color-ink)',
                          textDecoration: d.done ? 'line-through' : 'none',
                        }}
                      >
                        {d.done && <Check size={10} />}
                        <span className="truncate">{d.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-danger-light" /> Overdue</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-[#E5E5E0]" /> Completed</span>
            <span>Click a deadline to toggle complete.</span>
          </p>
        </div>
      </PageBody>
    </>
  );
}
