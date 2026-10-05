const inputClass =
  'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5fb9e2] focus:border-transparent';

/** Labelled input/textarea/select. `as` picks the element. */
export default function FormField({ id, label, as = 'input', children, ...props }) {
  const Tag = as;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
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
