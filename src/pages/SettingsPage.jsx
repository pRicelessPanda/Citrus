import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Button, Badge, useToast } from '../components/ui.jsx';
import { useStore } from '../store.js';
import { FIELDS } from '../data/fields.js';

const NOTIF_TYPES = ['Forum', 'Collaboration', 'Messaging', 'Research', 'Authors', 'Friends', 'Calendar'];

export default function SettingsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useStore((s) => s.user);
  const [role, setRole] = useState(user.role);
  const [goal, setGoal] = useState(user.goal);
  const [fields, setFields] = useState(user.fieldInterests);
  const [topics, setTopics] = useState(user.topicInterests.join(', '));
  const [notifs, setNotifs] = useState(Object.fromEntries(NOTIF_TYPES.map((t) => [t, true])));

  return (
    <>
      <PageHeader title="Settings" />
      <PageBody className="space-y-6">
        {/* Reader profile */}
        <Section title="Reader profile" note="Field & topic interests drive forum suggestions and search personalization. Role & goal are stored but don't drive features yet.">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role">
              <input value={role} onChange={(e) => setRole(e.target.value)} className="input" />
            </Field>
            <Field label="Goal">
              <input value={goal} onChange={(e) => setGoal(e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Field interests">
            <div className="flex max-h-40 flex-wrap gap-1.5 overflow-auto rounded-lg border border-line p-2">
              {FIELDS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFields((fs) => (fs.includes(f) ? fs.filter((x) => x !== f) : [...fs, f]))}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-xs ${fields.includes(f) ? 'bg-lime text-navy' : 'border border-line'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Topic interests">
            <input value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="Comma-separated topics" className="input" />
          </Field>
          <Button onClick={() => toast('Reader profile saved')}>Save reader profile</Button>
        </Section>

        {/* Author page */}
        <Section title="Author page">
          <p className="text-sm text-muted">Claim your author page to sync your Citrus profile and get a verified checkmark.</p>
          <Button variant="outline" className="mt-3" onClick={() => navigate('/authors')}>
            Claim your author page →
          </Button>
        </Section>

        {/* Notification preferences */}
        <Section title="Notification preferences" note="In-app only.">
          <div className="space-y-2">
            {NOTIF_TYPES.map((t) => (
              <label key={t} className="flex items-center justify-between rounded-lg border border-line px-4 py-2.5">
                <span className="text-sm">{t}</span>
                <button
                  onClick={() => setNotifs((n) => ({ ...n, [t]: !n[t] }))}
                  className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${notifs[t] ? 'bg-lime' : 'bg-black/10'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${notifs[t] ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </label>
            ))}
          </div>
        </Section>

        {/* Account */}
        <Section title="Account">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast('Email change flow')}>Change email</Button>
            <Button variant="outline" onClick={() => toast('Password change flow')}>Change password</Button>
            <Button variant="danger" onClick={() => toast('Account deletion requires confirmation')}>Delete account</Button>
          </div>
        </Section>
      </PageBody>

      <style>{`.input{width:100%;border:1px solid var(--color-line);border-radius:.5rem;padding:.5rem .75rem;font-size:.875rem;outline:none;background:white}.input:focus{border-color:var(--color-info)}`}</style>
    </>
  );
}

function Section({ title, note, children }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-xl">{title}</h2>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">{label}</label>
      {children}
    </div>
  );
}
