import { useState, useEffect } from 'react';
import { usePublicData } from '../api/usePublicData';
import Img from './ui/Img';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';

const Testimonials = () => {
  const { data: testimonials } = usePublicData('/testimonials', []);
  const { t, lang } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const list = testimonials || [];

  const nextSlide = () => {
    if (!list.length) return;
    setCurrentSlide((prev) => (prev + 1) % list.length);
  };

  const prevSlide = () => {
    if (!list.length) return;
    setCurrentSlide((prev) => (prev - 1 + list.length) % list.length);
  };

  useEffect(() => {
    if (list.length < 2) return undefined;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [list.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!list.length) return null;
  const current = list[currentSlide] || list[0];

  return (
    <section className="defer-render section-pad bg-paper" aria-labelledby="home-testimonials">
      <div className="site-container">
        <div className="mb-8 md:mb-10">
          <p className="eyebrow mb-3">{t('home.testimonials')}</p>
          <h2 id="home-testimonials" className="h-section">
            {t('home.testimonialsSubtitle')}
          </h2>
        </div>

        <figure className="relative bg-white border border-line p-7 md:p-12 grid gap-6 md:grid-cols-[120px_minmax(0,1fr)] md:gap-10 items-start">
          <div className="w-20 h-20 md:w-28 md:h-28 overflow-hidden bg-paper-tint">
            <Img src={current.imageUrl} alt={current.author} thumb className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="block font-serif text-6xl leading-[.6] text-gold-light mb-3" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote className="font-serif text-[1.45rem] md:text-[1.8rem] leading-[1.35] text-ink">
              {localized(current, 'text', lang)}
            </blockquote>
            <figcaption className="mt-6">
              <span className="block text-base font-bold text-ink">{current.author}</span>
              <span className="block text-xs font-bold uppercase tracking-[0.1em] text-gold-text mt-1">{localized(current, 'role', lang)}</span>
            </figcaption>
          </div>
          {list.length > 1 ? (
            <div className="md:col-start-2 flex items-center gap-1.5">
              {[
                { label: t('home.prevSlide'), onClick: prevSlide, glyph: '←' },
                { label: t('home.nextSlide'), onClick: nextSlide, glyph: '→' },
              ].map((b) => (
                <button
                  key={b.glyph}
                  type="button"
                  onClick={b.onClick}
                  aria-label={b.label}
                  className="grid place-items-center w-9 h-9 rounded-full border border-ink/20 text-ink text-sm hover:bg-ink hover:text-white transition-colors"
                >
                  {b.glyph}
                </button>
              ))}
              <span className="ml-3 text-xs font-bold tracking-[0.08em] text-[#7f8a89]">
                <span className="text-ink">{String(currentSlide + 1).padStart(2, '0')}</span> / {String(list.length).padStart(2, '0')}
              </span>
            </div>
          ) : null}
        </figure>
      </div>
    </section>
  );
};

export default Testimonials;
