/** Placeholder blocks shown only on a visitor's very first load with no saved content. */
export function SkeletonCards({ count = 3, className = 'h-72' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bg-paper-tint/70 animate-pulse ${className}`} />
      ))}
    </div>
  );
}
