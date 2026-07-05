import { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';

// ---- Button ----
export function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap';
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };
  const variants = {
    primary: 'bg-navy text-white hover:bg-navy-soft',
    lime: 'bg-lime text-navy hover:brightness-95',
    success: 'bg-success text-white hover:brightness-110',
    outline: 'border border-line bg-white text-ink hover:bg-page',
    ghost: 'text-ink hover:bg-black/5',
    danger: 'bg-danger text-white hover:brightness-110',
    subtle: 'bg-info-light text-info hover:brightness-95',
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}

// ---- Badge ----
export function Badge({ tone = 'neutral', children, className = '' }) {
  const tones = {
    neutral: 'bg-black/5 text-muted',
    info: 'bg-info-light text-info',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
    lime: 'bg-lime/20 text-success',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

// ---- Modal ----
export function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-6" onMouseDown={onClose}>
      <div
        className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-2xl bg-white shadow-2xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-display text-xl">{title}</h2>
            <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-black/5 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ---- ConfirmPopup ----
export function ConfirmPopup({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

// ---- EmptyState ----
export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/50 px-8 py-16 text-center">
      {Icon && <Icon size={40} className="mb-4 text-muted/60" />}
      {title && <p className="font-display text-lg text-ink">{title}</p>}
      {message && <p className="mt-1 max-w-md text-sm text-muted">{message}</p>}
      {action && <div className="mt-5 flex gap-2">{action}</div>}
    </div>
  );
}

// ---- Tabs ----
export function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 border-b border-line ${className}`}>
      {tabs.map((t) => {
        const id = typeof t === 'string' ? t : t.id;
        const label = typeof t === 'string' ? t : t.label;
        const count = typeof t === 'object' ? t.count : undefined;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`relative -mb-px cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors ${
              active === id ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
            {count != null && <span className="ml-1.5 text-xs text-muted">{count}</span>}
            {active === id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-lime" />}
          </button>
        );
      })}
    </div>
  );
}

// ---- Card wrapper ----
export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-xl border border-line bg-white ${className}`} {...props}>
      {children}
    </div>
  );
}

// ---- Toast ----
const ToastCtx = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = (msg, tone = 'neutral') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-[fadeIn_.2s] rounded-lg px-4 py-3 text-sm shadow-lg ${
              t.tone === 'danger'
                ? 'bg-danger text-white'
                : t.tone === 'success'
                ? 'bg-success text-white'
                : 'bg-navy text-white'
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx) || (() => {});

// ---- small helpers ----
export function Avatar({ name, src, size = 36, className = '' }) {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  if (src) return <img src={src} alt={name} width={size} height={size} className={`rounded-full object-cover ${className}`} />;
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-navy/10 font-medium text-navy ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function timeAgo(iso) {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
