import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Slim top progress bar between a link click (or back/forward) and the new page appearing.
 * React Router keeps the old page visible while the next one loads, so without this a slow
 * connection would feel unresponsive. Hidden when the page opens instantly (no flicker).
 */
export default function NavigationProgress() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const start = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(true), 120);
    };
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      start();
    };
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', start);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', start);
    };
  }, []);

  useEffect(() => {
    clearTimeout(timer.current);
    setActive(false);
  }, [pathname]);

  if (!active) return null;
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[70] overflow-hidden bg-[#feed17]/20" role="progressbar" aria-label="Loading page">
      <div className="h-full w-1/3 bg-[#feed17] page-loader-bar" />
    </div>
  );
}
