import { FaClock, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { formatEventDay, formatEventMonth } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';

const Events = () => {
  const { data: events } = usePublicData('/events', []);
  const { t, lang } = useLanguage();
  const display = (events || []).slice(0, 3);

  return (
    <section className="py-16 md:py-48 md:h-screen bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#001d3a] mb-4 relative">
            {t('home.upcomingEvents')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">{t('home.eventsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {display.map((event) => (
            <div
              key={event.id}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className="absolute inset-0 bg-[#5fb9e2] opacity-90"
                style={{
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-mamba.png")',
                }}
              />
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-start mb-4">
                  <div className="bg-[#001d3a] text-white p-3 rounded-lg mr-4 text-center min-w-[60px] z-10">
                    <div className="text-xl font-bold leading-tight">{formatEventDay(event.date)}</div>
                    <div className="text-xs uppercase tracking-wider text-[#fae924]">
                      {formatEventMonth(event.date)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-[#fae924] transition-colors z-10">
                    {localized(event, 'title', lang)}
                  </h3>
                </div>
                <div className="space-y-3 pl-2 z-10">
                  <div className="flex items-center text-white">
                    <FaClock className="mr-3 text-[#fae924]" />
                    <span>{localized(event, 'time', lang)}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <FaMapMarkerAlt className="mr-3 text-[#fae924]" />
                    <span>{localized(event, 'location', lang) || 'EMLR Kicukiro'}</span>
                  </div>
                </div>
                <a href="/events">
                  <button className="mt-6 w-full py-2 bg-[#001d3a] hover:bg-[#fae924] text-white hover:text-[#001d3a] rounded-lg font-medium transition-all duration-300 z-10">
                    {t('home.learnMore')}
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/events">
            <button className="px-8 py-3 bg-transparent border-2 border-[#001d3a] text-[#001d3a] hover:bg-[#001d3a] hover:text-white rounded-full font-semibold transition-colors duration-300 inline-flex items-center">
              <FaCalendarAlt className="mr-2" />
              {t('home.viewAllEvents')}
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Events;
