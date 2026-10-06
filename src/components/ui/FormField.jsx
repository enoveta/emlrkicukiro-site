const inputClass = 'field';

/** Labelled input/textarea/select. `as` picks the element. */
export default function FormField({ id, label, as = 'input', children, ...props }) {
  const Tag = as;
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-bold uppercase tracking-[0.08em] text-[#435b60] mb-2">
        {label}
      </label>
      <Tag id={id} name={id} className={inputClass} {...props}>
        {children}
      </Tag>
    </div>
  );
}

/** Invisible field that only bots fill in; the API silently drops those submissions. */
export const Honeypot = ({ value, onChange }) => (
  <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
    <label htmlFor="website">Website</label>
    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
  </div>
);
