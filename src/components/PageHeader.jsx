// Top bar for content pages: title + optional subtitle + right-side actions.
export default function PageHeader({ title, subtitle, right, children }) {
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-8 py-5">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl leading-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function PageBody({ children, className = '', ...props }) {
  return (
    <div className={`mx-auto max-w-6xl px-8 py-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
