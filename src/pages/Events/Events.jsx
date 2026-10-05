import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { formatEventDay, formatEventMonth } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';

function Events() {
  const { data: events, loading } = usePublicData('/events', []);
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#001d3a] mb-4">{t('events.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('events.subtitle')}</p>
        </div>

        {loading && <p className="text-center text-gray-500">{t('events.loading')}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(events || []).map((event) => (
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
                  <div className="bg-[#001d3a] text-white p-3 rounded-lg mr-4 text-center min-w-[60px]">
                    <div className="text-xl font-bold leading-tight">{formatEventDay(event.date)}</div>
                    <div className="text-xs uppercase tracking-wider text-[#fae924]">
                      {formatEventMonth(event.date)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{localized(event, 'title', lang)}</h3>
                </div>
                <p className="text-white/90 mb-4 text-sm">{localized(event, 'description', lang)}</p>
                <div className="space-y-3 pl-2 mt-auto">
                  <div className="flex items-center text-white">
                    <FaClock className="mr-3 text-[#fae924]" />
                    <span>{localized(event, 'time', lang)}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <FaMapMarkerAlt className="mr-3 text-[#fae924]" />
                    <span>{localized(event, 'location', lang) || 'EMLR Kicukiro'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
