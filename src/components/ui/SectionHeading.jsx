/** Editorial section heading: gold eyebrow + serif title, optional aside (text / link) on the right. */
export default function SectionHeading({ eyebrow, title, id, aside, light = false, as: Tag = 'h2', className = '' }) {
  return (
    <div
      className={`flex flex-col items-start gap-4 mb-7 md:mb-9 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}
    >
      <div className="min-w-0">
        {eyebrow ? <p className={`eyebrow mb-3 ${light ? 'eyebrow-light' : ''}`}>{eyebrow}</p> : null}
        <Tag id={id} className={`h-section ${light ? '!text-white [&_em]:!text-[#dbc28d]' : ''}`}>
          {title}
        </Tag>
      </div>
      {aside ? <div className="w-full max-w-[440px] md:w-[min(380px,40%)] md:pb-1">{aside}</div> : null}
    </div>
  );
}
