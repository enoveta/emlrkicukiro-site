import { Link } from 'react-router-dom';
import { FiAlertCircle, FiInbox } from 'react-icons/fi';

/** Page title row: title + description on the left, actions on the right. */
export function PageHeader({ title, description, actions, back, badge }) {
  return (
    <div className="mb-6 md:mb-8">
      {back ? (
        <Link to={back.to} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#66777a] hover:text-ink">
          <span aria-hidden="true">←</span> {back.label}
        </Link>
      ) : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="a-title">{title}</h1>
            {badge}
          </div>
          {description ? <p className="a-subtitle max-w-2xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div> : null}
      </div>
    </div>
  );
}

/** White card with optional header row. */
export function Card({ title, description, action, children, className = '', bodyClassName = '', padded = true }) {
  return (
    <section className={`a-card ${className}`}>
      {title || action ? (
        <div className="flex items-start justify-between gap-4 border-b border-[#f0ede6] px-5 py-4 md:px-6">
          <div className="min-w-0">
            {title ? <h2 className="a-h2">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-[13px] text-[#7b8a8c]">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={`${padded ? 'a-card-pad' : ''} ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/** Segmented control (tabs / periods / filters). */
export function Segmented({ options, value, onChange, label }) {
  return (
    <div className="inline-flex max-w-full overflow-x-auto rounded-lg border border-[#e3ded3] bg-white p-1 [scrollbar-width:none]" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`inline-flex h-8 flex-none items-center gap-2 whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition-colors ${
            value === o.value ? 'bg-ink text-white shadow-sm' : 'text-[#4b5d61] hover:bg-[#f6f5f1] hover:text-ink'
          }`}
        >
          {o.label}
          {o.count !== undefined ? (
            <span
              className={`min-w-[20px] rounded-full px-1.5 text-[11px] leading-5 ${
                value === o.value ? 'bg-white/20 text-white' : 'bg-[#f1ede4] text-[#4b5d61]'
              }`}
            >
              {o.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

/** Search input with icon. */
export function SearchInput({ value, onChange, placeholder, className = '' }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa6a7]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 3.5 3.5" strokeLinecap="round" />
      </svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="a-input h-10 py-0 pl-9" />
    </label>
  );
}

export function EmptyState({ title, text, action, icon: Icon = FiInbox }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#f3f1ec] text-xl text-gold">
        <Icon aria-hidden="true" />
      </span>
      <p className="font-semibold text-ink">{title}</p>
      {text ? <p className="mt-1 max-w-sm text-sm text-[#7b8a8c]">{text}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]" role="alert">
      <FiAlertCircle className="mt-0.5 flex-none" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

/** Label + control + hint. */
export function Field({ label, htmlFor, hint, required, tag, children, className = '' }) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={htmlFor} className="a-label">
          <span>
            {label}
            {required ? <span className="text-[#b42318]"> *</span> : null}
          </span>
          {tag}
        </label>
      ) : null}
      {children}
      {hint ? <p className="a-hint">{hint}</p> : null}
    </div>
  );
}

/** On/off switch. */
export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description ? <span className="mt-0.5 block text-[13px] text-[#7b8a8c]">{description}</span> : null}
      </span>
      <span className="relative mt-0.5 inline-flex flex-none">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-[#dcd7cc] transition-colors peer-checked:bg-ink peer-focus-visible:ring-4 peer-focus-visible:ring-gold/25" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
