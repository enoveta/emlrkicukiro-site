import { FaMapMarkerAlt, FaUser, FaRedo } from 'react-icons/fa';
import { localized } from '../../i18n/translations';
import { DAY_NAMES, WEEK_ORDER, daysOf, formatRange, sortByTime, styleFor } from '../../utils/schedule';

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  rw: ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicurasi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeri', 'Ukwakira', 'Ugushyingo', 'Ukuboza'],
};

/** Date of the given weekday in the current Monday-to-Sunday week. */
const dateThisWeek = (day, today = new Date()) => {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  return new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + ((day + 6) % 7));
};

/** One activity: time on the left, details on the right. Used by the calendar side panel too. */
export function ActivityCard({ item, lang, t }) {
  const style = styleFor(item.category);
  const location = localized(item, 'location', lang);
  const notes = localized(item, 'notes', lang);
  return (
    <article className="grid grid-cols-[4.5rem_1fr] sm:grid-cols-[5.5rem_1fr] gap-4 py-4">
      <div className="text-right">
        <p className="text-xl font-bold text-[#001d3a] tabular-nums leading-none">{item.startTime}</p>
        {item.endTime ? (
          <p className="text-sm text-gray-500 tabular-nums mt-1">
            {t('schedule.until')} {item.endTime}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 border-l-2 border-gray-100 pl-4">
        <h4 className="text-base sm:text-lg font-semibold text-[#001d3a] leading-snug">{localized(item, 'title', lang)}</h4>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} aria-hidden="true" />
            {t(`schedule.categories.${item.category}`)}
          </span>
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-gray-400" aria-hidden="true" />
              {location}
            </span>
          ) : null}
          {item.leader ? (
            <span className="inline-flex items-center gap-1.5">
              <FaUser className="text-gray-400" aria-hidden="true" />
              {item.leader}
            </span>
          ) : null}
        </p>
        {lang === 'rw' ? <p className="text-sm text-gray-500 mt-1">{formatRange(item, lang)}</p> : null}
        {item.recurrence && item.recurrence !== 'every' ? (
          <p className="inline-flex items-center gap-1.5 text-sm text-[#1a6f99] mt-1">
            <FaRedo className="text-xs" aria-hidden="true" />
            {t(`schedule.${item.recurrence}`)}
          </p>
        ) : null}
        {notes ? <p className="text-sm text-gray-600 mt-1">{notes}</p> : null}
      </div>
    </article>
  );
}

/** The week as a list of day cards (Monday to Sunday). Days without activities are left out. */
export default function WeeklyProgramme({ items, lang, t }) {
  const today = new Date();
  const todayDay = today.getDay();

  if (!items.length) {
    return <p className="text-center text-gray-600 bg-white rounded-xl p-8 border border-gray-200">{t('schedule.emptyWeek')}</p>;
  }

  const days = WEEK_ORDER.map((d) => ({ day: d, list: sortByTime(items.filter((i) => daysOf(i).includes(d))) })).filter(
    ({ day, list }) => list.length || day === todayDay
  );

  return (
    <div className="grid lg:grid-cols-2 gap-5 print:grid-cols-2 print:gap-3">
      {days.map(({ day, list }) => {
        const isToday = day === todayDay;
        const date = dateThisWeek(day, today);
        return (
          <section
            key={day}
            aria-label={DAY_NAMES[lang][day]}
            className={`bg-white rounded-2xl border overflow-hidden break-inside-avoid ${
              isToday ? 'border-[#feed17] ring-2 ring-[#feed17] shadow-md' : 'border-gray-200 shadow-sm'
            }`}
          >
            <header
              className={`flex items-center justify-between gap-3 px-5 py-3 ${
                isToday ? 'bg-[#003366] text-white' : 'bg-gray-50 text-[#003366]'
              }`}
            >
              <h3 className="text-lg font-bold">{DAY_NAMES[lang][day]}</h3>
              <span className="flex items-center gap-2 text-sm">
                {isToday ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#feed17] text-[#001d3a] text-xs font-bold">{t('schedule.today')}</span>
                ) : null}
                <span className={isToday ? 'text-white/80' : 'text-gray-500'}>
                  {date.getDate()} {MONTHS[lang][date.getMonth()]}
                </span>
              </span>
            </header>
            <div className="px-5 divide-y divide-gray-100">
              {list.length ? (
                list.map((item) => <ActivityCard key={item.id} item={item} lang={lang} t={t} />)
              ) : (
                <p className="py-5 text-gray-500">{t('schedule.empty')}</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
