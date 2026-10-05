/** Grey placeholder blocks shown only on a visitor's very first load with no saved content. */
export function SkeletonCards({ count = 3, className = 'h-72' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rounded-xl bg-gray-200/70 animate-pulse ${className}`} />
      ))}
    </div>
  );
}
