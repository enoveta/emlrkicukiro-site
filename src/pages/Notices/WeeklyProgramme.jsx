import { useState } from 'react';
import { FaClock, FaMapMarkerAlt, FaUser, FaRedo } from 'react-icons/fa';
import { localized } from '../../i18n/translations';
import { DAY_NAMES, DAY_SHORT, WEEK_ORDER, formatRange, sortByTime, styleFor } from '../../utils/schedule';

const numericRange = (item) => (item.endTime ? `${item.startTime} – ${item.endTime}` : item.startTime);

export function ActivityCard({ item, lang, t, compact = false }) {
  const style = styleFor(item.category);
  const location = localized(item, 'location', lang);
  const notes = localized(item, 'notes', lang);
  return (
    <article className={`bg-white rounded-lg border border-gray-200 border-l-4 ${style.bar} p-3 shadow-sm break-inside-avoid`}>
      <p className="flex items-center text-sm font-semibold text-[#001d3a] tabular-nums">
        <FaClock className="mr-1.5 text-gray-400 shrink-0" aria-hidden="true" />
        {numericRange(item)}
      </p>
      {lang === 'rw' && !compact ? <p className="text-xs text-gray-500 mt-0.5">{formatRange(item, lang)}</p> : null}
      <h3 className={`font-bold text-[#001d3a] leading-snug mt-1 ${compact ? 'text-sm' : 'text-base'}`}>
        {localized(item, 'title', lang)}
      </h3>
      <div className="mt-1.5 space-y-0.5 text-xs text-gray-600">
        {item.recurrence && item.recurrence !== 'every' ? (
          <p className="flex items-center">
            <FaRedo className="mr-1.5 text-gray-400" aria-hidden="true" />
            {t(`schedule.${item.recurrence}`)}
          </p>
        ) : null}
        {location ? (
          <p className="flex items-center">
            <FaMapMarkerAlt className="mr-1.5 text-gray-400" aria-hidden="true" />
            {location}
          </p>
        ) : null}
        {item.leader ? (
          <p className="flex items-center">
            <FaUser className="mr-1.5 text-gray-400" aria-hidden="true" />
            {t('schedule.leader')}: {item.leader}
          </p>
        ) : null}
        {notes && !compact ? <p className="text-gray-500 pt-0.5">{notes}</p> : null}
      </div>
    </article>
  );
}

/** Monday→Sunday table on desktop; day tabs on phones (opens on today). */
export default function WeeklyProgramme({ items, lang, t }) {
  const todayDay = new Date().getDay();
  const [mobileDay, setMobileDay] = useState(todayDay);
  const byDay = (day) => sortByTime(items.filter((i) => i.dayOfWeek === day));

  if (!items.length) {
    return <p className="text-center text-gray-600 bg-white rounded-xl p-8 border border-gray-200">{t('schedule.emptyWeek')}</p>;
  }

  return (
    <>
      {/* Phones: one day at a time */}
      <div className="md:hidden print:hidden">
        <div className="grid grid-cols-7 gap-1 pb-2" role="tablist">
          {WEEK_ORDER.map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={mobileDay === d}
              onClick={() => setMobileDay(d)}
              className={`px-0.5 py-2 rounded-lg text-xs font-semibold border ${
                mobileDay === d
                  ? 'bg-[#003366] border-[#003366] text-white'
                  : d === todayDay
                    ? 'bg-[#fff8c2] border-[#feed17] text-[#001d3a]'
                    : 'bg-white border-gray-200 text-[#001d3a]'
              }`}
            >
              {DAY_SHORT[lang][d]}
              {byDay(d).length ? <span className="block text-[10px] font-normal opacity-75">{byDay(d).length}</span> : null}
            </button>
          ))}
        </div>
        <h3 className="text-lg font-bold text-[#003366] mt-3 mb-3">
          {DAY_NAMES[lang][mobileDay]}
          {mobileDay === todayDay ? <span className="ml-2 text-xs font-semibold text-[#6b5d00] bg-[#fff8c2] px-2 py-0.5 rounded-full">{t('schedule.today')}</span> : null}
        </h3>
        <div className="space-y-3">
          {byDay(mobileDay).length ? (
            byDay(mobileDay).map((item) => <ActivityCard key={item.id} item={item} lang={lang} t={t} />)
          ) : (
            <p className="text-gray-500 bg-white rounded-lg border border-gray-200 p-4">{t('schedule.empty')}</p>
          )}
        </div>
      </div>

      {/* Tablets / desktop / print: the whole week */}
      <div className="hidden md:grid print:grid grid-cols-7 gap-2 lg:gap-3">
        {WEEK_ORDER.map((d) => {
          const list = byDay(d);
          const isToday = d === todayDay;
          return (
            <section
              key={d}
              aria-label={DAY_NAMES[lang][d]}
              className={`rounded-xl p-2 lg:p-3 min-h-[180px] ${isToday ? 'bg-[#fff8c2] ring-2 ring-[#feed17]' : 'bg-gray-100'}`}
            >
              <h3 className="text-center text-sm font-bold text-[#003366] mb-2">
                {DAY_NAMES[lang][d]}
                {isToday ? <span className="block text-[11px] font-semibold text-[#6b5d00]">{t('schedule.today')}</span> : null}
              </h3>
              <div className="space-y-2">
                {list.length ? (
                  list.map((item) => <ActivityCard key={item.id} item={item} lang={lang} t={t} compact />)
                ) : (
                  <p className="text-center text-xs text-gray-400 pt-4">—</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
