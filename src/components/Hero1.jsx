import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublicData } from '../api/usePublicData';
import { mediaUrl } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';

const SmartLink = ({ to, className, children }) =>
  /^https?:/.test(to || '') ? (
    <a href={to} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link to={to || '/'} className={className}>
      {children}
    </Link>
  );

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const pad = (n) => String(n).padStart(2, '0');

const Hero = () => {
  const { lang, t } = useLanguage();
  const { data: banners } = usePublicData('/banners', []);
  const apiSlides = banners?.[0]?.slides || [];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [hovering, setHovering] = useState(false);
  // Slides beyond the first are only mounted once we reach them, so they don't compete with the first paint.
  const [visited, setVisited] = useState(() => new Set([0]));
  const videoRefs = useRef({});

  const slides = apiSlides.map((s) => ({
    type: s.mediaType === 'video' ? 'video' : 'image',
    src: mediaUrl(s.imageUrl),
    poster: s.mediaType === 'video' ? mediaUrl(s.imageUrl.replace(/\.mp4$/i, '-poster.jpg')) : undefined,
    duration: s.duration || 8000,
    title: localized(s, 'title', lang),
    highlight: localized(s, 'highlight', lang),
    subtitle: localized(s, 'subtitle', lang) || s.text || '',
    cta1: localized(s, 'cta1', lang) || t('home.learnMore'),
    cta1Link: s.cta1Link || '/about',
    cta2: localized(s, 'cta2', lang) || t('home.visitUs'),
    cta2Link: s.cta2Link || '/about/location',
  }));
  const count = slides.length;

  const goTo = (index) => {
    const next = (index + count) % count;
    setVisited((prev) => new Set(prev).add(next));
    setCurrent(next);
  };

  useEffect(() => {
    if (count < 2 || paused || hovering) return undefined;
    const timer = setTimeout(() => goTo(current + 1), slides[current]?.duration || 8000);
    return () => clearTimeout(timer);
  }, [current, count, paused, hovering]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([i, el]) => {
      if (!el) return;
      if (Number(i) === current) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [current]);

  const active = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-paper pt-10 pb-14 sm:pt-14 md:pt-16 md:pb-[4.5rem]"
      aria-label={t('home.heroKicker')}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Tint panel: right side on desktop, bottom band on phones */}
      <span
        className="absolute bg-paper-tint left-0 right-0 bottom-0 h-[34%] sm:left-auto sm:top-0 sm:h-full sm:w-[44%] lg:w-[43%]"
        aria-hidden="true"
      />

      <div className="site-container relative grid items-center gap-8 sm:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] sm:gap-6 lg:grid-cols-[minmax(0,.88fr)_minmax(0,1.12fr)] lg:gap-[clamp(42px,6vw,88px)]">
        {/* Copy */}
        <div className="relative z-[2] lg:py-3 min-h-[1px]" aria-live="polite">
          <p className="eyebrow mb-4 md:mb-5 flex-wrap !gap-x-2.5 !gap-y-1">
            <span>{t('home.heroKicker')}</span>
            <span className="text-[#667579] text-[10px] md:text-[11px] font-semibold tracking-[0.09em]">{t('home.heroPlace')}</span>
          </p>
          {active ? (
            <div key={`${current}-${lang}`} className="animate-[heroIn_.45s_ease-out] motion-reduce:animate-none">
              <h1 className="h-display max-w-[600px] mb-4 md:mb-5 text-[clamp(2.9rem,12vw,3.9rem)] sm:text-[clamp(3rem,7.1vw,3.9rem)] lg:text-[clamp(3.6rem,5.4vw,4.9rem)] leading-[.99]">
                {active.title} {active.highlight ? <em>{active.highlight}</em> : null}
              </h1>
              {active.subtitle ? (
                <p className="max-w-[460px] mb-6 md:mb-8 text-base md:text-[17px] leading-[1.75] text-[#435b60]">{active.subtitle}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <SmartLink to={active.cta1Link} className="btn btn-primary">
                  <span>{active.cta1}</span>
                  <span className="text-gold-light text-base" aria-hidden="true">
                    ↗
                  </span>
                </SmartLink>
                <SmartLink to={active.cta2Link} className="text-link">
                  <span>{active.cta2}</span>
                  <span aria-hidden="true">→</span>
                </SmartLink>
              </div>
            </div>
          ) : (
            <div className="space-y-4" aria-hidden="true">
              <div className="h-14 w-4/5 bg-ink/[.06]" />
              <div className="h-14 w-3/5 bg-ink/[.06]" />
              <div className="h-5 w-2/3 bg-ink/[.05]" />
            </div>
          )}
        </div>

        {/* Visual */}
        <div className="relative min-w-0 pr-2 pb-3 sm:pr-4 sm:pb-4">
          <span className="absolute z-0 right-0 bottom-0 w-[56%] h-[46%] bg-gold-light" aria-hidden="true" />
          <div className="relative z-[1] h-[clamp(260px,74vw,380px)] sm:h-[400px] lg:h-[clamp(400px,41vw,560px)] overflow-hidden bg-[#d5d0c4] shadow-[0_18px_50px_rgba(20,54,66,.12)]">
            {slides.map((slide, index) => {
              if (!visited.has(index)) return null;
              const shown = index === current;
              return (
                <div
                  key={`${slide.src}-${index}`}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${shown ? 'opacity-100' : 'opacity-0'}`}
                  aria-hidden={!shown}
                >
                  {slide.type === 'image' ? (
                    <img
                      src={slide.src}
                      alt=""
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchpriority={index === 0 ? 'high' : 'low'}
                      decoding="async"
                    />
                  ) : (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      className="w-full h-full object-cover"
                      src={slide.src}
                      poster={slide.poster}
                      muted
                      loop
                      playsInline
                      autoPlay={shown}
                      preload={shown ? 'auto' : 'none'}
                    />
                  )}
                </div>
              );
            })}
            <span
              className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(5,22,27,.08),transparent_39%,rgba(5,22,27,.25))]"
              aria-hidden="true"
            />
            <span className="absolute z-[2] -top-8 -right-8 w-[123px] h-[123px] rounded-full border border-gold-light/80 pointer-events-none" aria-hidden="true" />
            <span className="absolute z-[2] -top-2.5 -right-2.5 w-[81px] h-[81px] rounded-full border border-gold-light/80 pointer-events-none" aria-hidden="true" />
          </div>

          {count > 1 ? (
            <div className="relative z-[2] flex min-h-[52px] md:min-h-[60px] items-center justify-between gap-2 sm:gap-4 px-1">
              <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold tracking-[0.08em] text-[#7f8a89]">
                <span className="text-ink">{pad(current + 1)}</span>
                <span className="text-[#aaa99f]">/</span>
                <span>{pad(count)}</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2" role="group" aria-label="Slides">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`${i + 1} / ${count}`}
                    aria-current={i === current}
                    className={`h-[7px] rounded-full transition-all duration-200 ${
                      i === current ? 'w-6 bg-gold' : 'w-[7px] bg-[#c7c8c1] hover:bg-ink/40'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { label: t('home.prevSlide'), onClick: () => goTo(current - 1), glyph: '←' },
                  {
                    label: paused ? t('home.playSlides') : t('home.pauseSlides'),
                    onClick: () => setPaused((p) => !p),
                    glyph: paused ? (
                      <span className="block w-0 h-0 ml-0.5 border-y-[5px] border-y-transparent border-l-[7px] border-l-current" />
                    ) : (
                      <span className="inline-flex gap-[3px]">
                        <i className="block w-0.5 h-2.5 bg-current" />
                        <i className="block w-0.5 h-2.5 bg-current" />
                      </span>
                    ),
                  },
                  { label: t('home.nextSlide'), onClick: () => goTo(current + 1), glyph: '→' },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={b.onClick}
                    aria-label={b.label}
                    className="grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full border border-ink/20 text-ink text-sm leading-none hover:bg-ink hover:border-ink hover:text-white transition-colors"
                  >
                    {b.glyph}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <a
        href="#home-content"
        className="absolute left-1/2 -translate-x-1/2 bottom-3 md:bottom-5 z-[3] grid place-items-center w-7 h-7 md:w-8 md:h-8 rounded-full border border-ink/20 text-ink text-sm hover:bg-ink hover:text-white transition-colors"
        aria-label={t('home.scrollDown')}
      >
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
};

export default Hero;
