export function StatusPill({ status }) {
  const styles = {
    DRAFT: 'bg-slate-100 text-slate-700',
    IN_REVIEW: 'bg-amber-100 text-amber-800',
    PUBLISHED: 'bg-emerald-100 text-emerald-800',
    NEW: 'bg-sky-100 text-sky-800',
    READ: 'bg-indigo-100 text-indigo-800',
    ARCHIVED: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}
