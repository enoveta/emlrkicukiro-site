/** Consistent title block for inner pages. */
export default function PageHeader({ badge, title, subtitle, children }) {
  return (
    <div className="text-center mb-12">
      {badge ? (
        <span className="inline-block px-4 py-1 text-sm font-semibold text-[#1f7fae] bg-[#e8f5fb] rounded-full mb-4">
          {badge}
        </span>
      ) : null}
      <h1 className="text-3xl md:text-5xl font-bold text-[#001d3a] mb-4">{title}</h1>
      <div className="w-20 h-1.5 bg-[#5fb9e2] mx-auto mb-5 rounded-full" />
      {subtitle ? <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p> : null}
      {children}
    </div>
  );
}
