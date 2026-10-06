import { useEffect, useState } from 'react';
import logo from '../../assets/emlr/logo1.png';

/**
 * Shown while a page's code downloads: a slim progress bar at the top straight away,
 * and the church logo only if loading takes longer than a moment (avoids flicker).
 */
export default function PageLoader({ fullScreen = false }) {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${fullScreen ? 'fixed inset-0 bg-paper' : 'min-h-screen'} flex items-center justify-center`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[70] overflow-hidden bg-gold/15">
        <div className="h-full w-1/3 bg-gold page-loader-bar" />
      </div>
      {showLogo ? (
        <div className="flex flex-col items-center gap-4 opacity-0 animate-[fadeIn_.3s_ease-out_forwards]">
          <span className="w-16 h-16 bg-white shadow-[0_10px_30px_rgba(20,54,66,.12)] flex items-center justify-center animate-pulse motion-reduce:animate-none">
            <img src={logo} alt="" className="w-11 h-11 object-contain" />
          </span>
          <span className="h-0.5 w-24 bg-line overflow-hidden">
            <span className="block h-full w-1/3 bg-gold page-loader-bar" />
          </span>
        </div>
      ) : null}
    </div>
  );
}
