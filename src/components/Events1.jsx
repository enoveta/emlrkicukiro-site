import { Link } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDay, formatMonthShort, localized } from '../i18n/translations';

/** An event stays "upcoming" until the end of its day. */
export const isUpcoming = (event, now = new Date()) =>
  new Date(event.date).getTime() + 86_400_000 > now.getTime();

export const DateBlock = ({ date, lang, past = false, large = false }) => (
  <span
    className={`flex flex-none flex-col items-center justify-center text-white ${past ? 'bg-[#53666a]' : 'bg-ink'} ${
      large ? 'w-16 h-[76px] md:w-[70px] md:h-[84px]' : 'w-[54px] h-[66px] md:w-[58px] md:h-[70px]'
    }`}
  >
    <strong className={`font-serif font-normal leading-none ${large ? 'text-[1.9rem]' : 'text-[1.6rem]'}`}>{formatDay(date)}</strong>
    <span className="mt-0.5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.08em] leading-tight text-[#e2cf9f]">
      {formatMonthShort(date, lang)}
    </span>
    <span className="text-[10px] md:text-[11px] font-bold tracking-[0.08em] leading-tight text-[#e2cf9f]">
      {new Date(date).getUTCFullYear()}
    </span>
  </span>
);

/** Editorial event row: date block, label, serif title, detail. Used on the home page and the Events page. */
export const EventCard = ({ event, lang, showDescription = false, past = false, as: Tag = 'h3' }) => {
  const time = localized(event, 'time', lang);
  const place = localized(event, 'location', lang);
  const description = localized(event, 'description', lang);
  return (
    <Link
      to="/events"
      className="group flex items-center gap-3.5 md:gap-4 min-h-[104px] py-3.5 border-b border-line transition-all duration-200 hover:px-2 hover:bg-paper-card"
    >
      <DateBlock date={event.date} lang={lang} past={past} large={showDescription} />
      <span className="flex min-w-0 flex-1 flex-col">
        {time ? (
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.11em] text-[#657376]">{time}</span>
        ) : null}
        <Tag className={`font-serif font-normal leading-[1.2] text-ink mt-1 mb-0.5 ${showDescription ? 'text-[1.4rem] md:text-[1.55rem]' : 'text-[1.25rem] md:text-[1.3rem]'}`}>
          {localized(event, 'title', lang)}
        </Tag>
        {showDescription && description ? (
          <span className="text-[15px] leading-[1.55] text-[#596c70] line-clamp-3">{description}</span>
        ) : null}
        {place ? (
          <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] md:text-sm text-[#596c70]">
            <FaMapMarkerAlt className="text-gold text-xs" aria-hidden="true" />
            {place}
          </span>
        ) : null}
        {!showDescription && !place && description ? (
          <span className="text-[13px] md:text-sm leading-[1.45] text-[#596c70] line-clamp-2">{description}</span>
        ) : null}
      </span>
      <span className="self-start mt-1 mr-0.5 text-gold-dark text-sm" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
};

/** Kept for pages that want the clock icon next to a time. */
export const EventTime = ({ time }) =>
  time ? (
    <span className="inline-flex items-center gap-1.5">
      <FaClock className="text-gold" aria-hidden="true" />
      {time}
    </span>
  ) : null;

/** Home page: events column of the "updates" section. */
export const EventsColumn = () => {
  const { data: events } = usePublicData('/events', []);
  const { t, lang } = useLanguage();
  const upcoming = (events || []).filter((e) => isUpcoming(e)).slice(0, 3);
  if (!upcoming.length) return null;

  return (
    <div className="min-w-0">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <p className="eyebrow mb-3.5">{t('home.upcomingEvents')}</p>
        <Link to="/events" className="small-link">
          <span>{t('home.viewAllEvents')}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <h2 className="h-display text-[2.3rem] md:text-[2.75rem] leading-[1.06] mb-2">{t('home.upcomingEvents')}</h2>
      <p className="mb-5 text-[15px] text-[#596c70]">{t('home.eventsSubtitle')}</p>
      <div className="border-t border-line">
        {upcoming.map((event) => (
          <EventCard key={event.id} event={event} lang={lang} />
        ))}
      </div>
    </div>
  );
};

export default EventsColumn;
