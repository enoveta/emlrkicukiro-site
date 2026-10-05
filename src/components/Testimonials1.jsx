import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
    <section className="defer-render py-20 bg-[#f8f9fa]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#001d3a] mb-4">{t('home.testimonials')}</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">{t('home.testimonialsSubtitle')}</p>
        </div>

        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-[#001d3a] hover:text-white transition-colors"
            aria-label="Previous"
            type="button"
          >
            <FaChevronLeft className="text-[#001d3a]" aria-hidden="true" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-[#001d3a] hover:text-white transition-colors"
            aria-label="Next"
            type="button"
          >
            <FaChevronRight className="text-[#001d3a]" aria-hidden="true" />
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#5fb9e2]">
                    <Img src={current.imageUrl} alt={current.author} thumb className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <FaQuoteLeft className="text-3xl text-[#5fb9e2] opacity-30 mb-4 mx-auto md:mx-0" />
                  <p className="text-lg md:text-xl text-gray-700 mb-6">{localized(current, 'text', lang)}</p>
                  <div>
                    <h4 className="text-xl font-bold text-[#001d3a]">{current.author}</h4>
                    <p className="text-[#5fb9e2] font-medium">{localized(current, 'role', lang)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
