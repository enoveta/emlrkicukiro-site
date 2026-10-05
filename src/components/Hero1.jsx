import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
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

const Hero = () => {
  const { lang, t } = useLanguage();
  const { data: banners } = usePublicData('/banners', []);
  const apiSlides = banners?.[0]?.slides || [];
  const [current, setCurrent] = useState(0);
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

  useEffect(() => {
    if (count < 2 || prefersReducedMotion()) return undefined;
    const timer = setTimeout(() => {
      const next = (current + 1) % count;
      setVisited((prev) => new Set(prev).add(next));
      setCurrent(next);
    }, slides[current]?.duration || 8000);
    return () => clearTimeout(timer);
  }, [current, count]); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (!count) {
    return <section className="min-h-[85vh] md:min-h-screen bg-[#001d3a]" aria-hidden="true" />;
  }

  const active = slides[current];

  return (
    <section className="min-h-[85vh] md:min-h-screen flex items-center relative overflow-hidden bg-[#001d3a]">
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          if (!visited.has(index)) return null;
          const shown = index === current;
          return (
            <div
              key={`${slide.src}-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${shown ? 'opacity-100' : 'opacity-0'}`}
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
              <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/40 via-[#003366]/45 to-[#001d3a]/80" />
            </div>
          );
        })}
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-28 md:mt-36 relative z-10">
        <div className="max-w-2xl" aria-live="polite">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            {active.title} <span className="text-[#5eb9df]">{active.highlight}</span>
          </h1>
          {active.subtitle ? (
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-lg leading-relaxed">{active.subtitle}</p>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-4">
            <SmartLink
              to={active.cta1Link}
              className="px-8 py-4 bg-[#feed17] text-[#001d3a] hover:bg-white rounded-lg font-semibold transition-colors text-lg flex items-center justify-center"
            >
              {active.cta1}
            </SmartLink>
            <SmartLink
              to={active.cta2Link}
              className="px-8 py-4 border border-white text-white hover:bg-white hover:text-[#003366] rounded-lg font-semibold transition-colors text-lg text-center"
            >
              {active.cta2}
            </SmartLink>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-20 md:bottom-8 left-6 lg:left-12 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setVisited((prev) => new Set(prev).add(i));
                setCurrent(i);
              }}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === current}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-[#feed17]' : 'w-2 bg-white/60 hover:bg-white'}`}
            />
          ))}
        </div>
      )}

      <a
        href="#home-content"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-2xl animate-bounce motion-reduce:animate-none hidden md:block"
        aria-label="Scroll down"
      >
        <FaChevronDown />
      </a>
    </section>
  );
};

export default Hero;
