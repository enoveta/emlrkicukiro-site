const STYLES = {
  DRAFT: { label: 'Draft', cls: 'bg-[#f2f4f7] text-[#475467]', dot: 'bg-[#98a2b3]' },
  IN_REVIEW: { label: 'In review', cls: 'bg-[#fffaeb] text-[#b54708]', dot: 'bg-[#f79009]' },
  PUBLISHED: { label: 'Published', cls: 'bg-[#ecfdf3] text-[#067647]', dot: 'bg-[#17b26a]' },
  NEW: { label: 'New', cls: 'bg-[#f6efe1] text-[#7a5a22]', dot: 'bg-gold' },
  READ: { label: 'Read', cls: 'bg-[#eef4f6] text-[#214f5b]', dot: 'bg-ink-soft' },
  ARCHIVED: { label: 'Archived', cls: 'bg-[#f2f4f7] text-[#667085]', dot: 'bg-[#98a2b3]' },
};

export function StatusPill({ status }) {
  const s = STYLES[status] || { label: status, cls: 'bg-[#f2f4f7] text-[#475467]', dot: 'bg-[#98a2b3]' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-[#ece8df] ${className}`} />;
}
