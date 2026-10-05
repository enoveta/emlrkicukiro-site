import { FaChevronDown } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { usePublicData } from '../api/usePublicData';
import { mediaUrl } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';

const Hero = () => {
  const videoRef = useRef(null);
  const { lang } = useLanguage();
  const { data: banners } = usePublicData('/banners', []);
  const apiSlides = banners?.[0]?.slides || [];

  const slides = apiSlides.map((s) => ({
    type: s.mediaType === 'video' ? 'video' : 'image',
    bg: mediaUrl(s.imageUrl),
    hasBlur: s.hasBlur !== false,
    duration: s.duration || 8000,
    content: {
      title: localized(s, 'title', lang) || '',
      highlight: localized(s, 'highlight', lang) || '',
      subtitle: localized(s, 'subtitle', lang) || s.text || '',
      cta1: localized(s, 'cta1', lang) || (lang === 'rw' ? 'Menya byinshi' : 'Learn More'),
      cta1Link: s.cta1Link || '/about',
      cta2: localized(s, 'cta2', lang) || (lang === 'rw' ? 'Dusure' : 'Visit Us'),
      cta2Link: s.cta2Link || '/about/location',
    },
  }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!slides.length) return undefined;
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(false);
      }, 1000);
    }, slides[currentSlide]?.duration || 8000);
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    if (slides[currentSlide]?.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentSlide, slides.length]);

  if (!slides.length) {
    return <section className="min-h-screen bg-[#001d3a]" />;
  }

  const active = slides[currentSlide];

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {slides.map((slide, index) => {
          if (slide.type === 'image') {
            return (
              <div
                key={`slide-${index}`}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.3), rgba(0, 51, 102, 0.6)), url(${slide.bg})`,
                  transition: fade ? 'opacity 1s ease-in-out' : 'none',
                }}
              />
            );
          }
          return (
            <div
              key={`slide-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: fade ? 'opacity 1s ease-in-out' : 'none' }}
            >
              <video
                ref={index === currentSlide ? videoRef : null}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
              >
                <source src={slide.bg} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[#003366]/40" />
            </div>
          );
        })}
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-36 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            {active.content.title}{' '}
            <span className="text-[#5eb9df]">{active.content.highlight}</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-lg leading-relaxed">
            {active.content.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={active.content.cta1Link}
              className="px-8 py-4 bg-[#001d3a] border border-[#001d3a] hover:bg-[#002244] text-white rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-lg flex items-center justify-center"
            >
              {active.content.cta1}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href={active.content.cta2Link}
              className="px-8 py-4 border border-white text-white hover:bg-white hover:text-[#003366] rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-lg"
            >
              {active.content.cta2}
            </a>
          </div>
        </div>
      </div>

      <a
        href="/about"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-2xl animate-bounce cursor-pointer"
        aria-label="Scroll down"
      >
        <FaChevronDown />
      </a>
    </section>
  );
};

export default Hero;
