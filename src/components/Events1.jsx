import { Link } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDay, formatMonthShort, localized } from '../i18n/translations';

/** An event stays "upcoming" until the end of its day. */
export const isUpcoming = (event, now = new Date()) =>
  new Date(event.date).getTime() + 86_400_000 > now.getTime();

export const EventCard = ({ event, lang, showDescription = false, past = false }) => (
  <article className={`relative rounded-xl overflow-hidden shadow-md ${past ? 'bg-gray-100' : 'bg-[#2f8fbf]'}`}>
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-start mb-4">
        <div className="bg-[#001d3a] text-white p-3 rounded-lg mr-4 text-center min-w-[64px]">
          <div className="text-xl font-bold leading-tight">{formatDay(event.date)}</div>
          <div className="text-xs uppercase tracking-wider text-[#fae924]">{formatMonthShort(event.date, lang)}</div>
          <div className="text-[10px] text-white/70">{new Date(event.date).getUTCFullYear()}</div>
        </div>
        <h3 className={`text-xl font-bold mt-1 ${past ? 'text-[#001d3a]' : 'text-white'}`}>{localized(event, 'title', lang)}</h3>
      </div>
      {showDescription && localized(event, 'description', lang) ? (
        <p className={`mb-4 text-sm ${past ? 'text-gray-600' : 'text-white/90'}`}>{localized(event, 'description', lang)}</p>
      ) : null}
      <div className={`space-y-2 mt-auto ${past ? 'text-gray-700' : 'text-white'}`}>
        {localized(event, 'time', lang) ? (
          <div className="flex items-center">
            <FaClock className={`mr-3 ${past ? 'text-[#3a9bc4]' : 'text-[#fae924]'}`} aria-hidden="true" />
            <span>{localized(event, 'time', lang)}</span>
          </div>
        ) : null}
        <div className="flex items-center">
          <FaMapMarkerAlt className={`mr-3 ${past ? 'text-[#3a9bc4]' : 'text-[#fae924]'}`} aria-hidden="true" />
          <span>{localized(event, 'location', lang) || 'EMLR Kicukiro'}</span>
        </div>
      </div>
    </div>
  </article>
);

const Events = () => {
  const { data: events } = usePublicData('/events', []);
  const { t, lang } = useLanguage();
  const upcoming = (events || []).filter((e) => isUpcoming(e)).slice(0, 3);
  if (!upcoming.length) return null;

  return (
    <section className="defer-render py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#001d3a] mb-4">{t('home.upcomingEvents')}</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">{t('home.eventsSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} lang={lang} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/events"
            className="px-8 py-3 border-2 border-[#001d3a] text-[#001d3a] hover:bg-[#001d3a] hover:text-white rounded-full font-semibold transition-colors inline-flex items-center"
          >
            <FaCalendarAlt className="mr-2" aria-hidden="true" />
            {t('home.viewAllEvents')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Events;
