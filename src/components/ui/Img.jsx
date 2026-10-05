import { useEffect, useState } from 'react';
import { mediaThumb, mediaUrl } from '../../api/client';

/**
 * Lazy, responsive CMS image. Uses the 800px copy for cards (`thumb`) and the full image
 * otherwise; falls back to the original file if the smaller copy is missing.
 */
export default function Img({ src, alt = '', thumb = false, eager = false, className = '', ...rest }) {
  const full = mediaUrl(src);
  const preferred = thumb ? mediaThumb(src) : full;
  const [current, setCurrent] = useState(preferred);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrent(preferred);
    setFailed(false);
  }, [preferred]);

  if (!src || failed) {
    return <div className={`bg-gradient-to-br from-[#001d3a] to-[#5fb9e2] ${className}`} aria-hidden="true" />;
  }

  return (
    <img
      src={current}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      onError={() => (current !== full ? setCurrent(full) : setFailed(true))}
      className={className}
      {...rest}
    />
  );
}
