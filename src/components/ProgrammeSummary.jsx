import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { localized } from '../i18n/translations';
import { daysLabel, daysOf, occursOn, sortProgramme, styleFor, timeRange } from '../utils/schedule';

/**
 * The weekly programme in short: every activity once, with its days summarised
 * (e.g. "Ku wa Mbere - ku wa Gatandatu · 05:00 - 06:00"), like the parish slides.
 */
export default function ProgrammeSummary({ items, lang, t, dark = false, showPlace = false }) {
  const today = new Date();
  const list = sortProgramme(items);

  return (
    <ul className={`grid gap-3 ${dark ? 'sm:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
      {list.map((item) => {
        const isToday = occursOn(item, today);
        const place = localized(item, 'location', lang);
        return (
          <li
            key={item.id}
            className={`rounded-xl p-4 flex gap-4 items-start ${
              dark
                ? `bg-white/5 border ${isToday ? 'border-[#feed17]/70' : 'border-white/10'}`
                : `bg-white border shadow-sm ${isToday ? 'border-[#feed17] ring-1 ring-[#feed17]' : 'border-gray-200'}`
            }`}
          >
            <span
              className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                dark && item.category === 'service' ? 'bg-[#5fb9e2]' : styleFor(item.category).dot
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className={`font-semibold leading-snug ${dark ? 'text-white' : 'text-[#001d3a] text-lg'}`}>
                {localized(item, 'title', lang)}
              </p>
              <p className={`text-sm mt-1 ${dark ? 'text-white/75' : 'text-gray-600'}`}>{daysLabel(daysOf(item), lang)}</p>
              <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mt-1 ${dark ? 'text-white' : 'text-[#003366]'}`}>
                <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
                  <FaClock className={dark ? 'text-[#feed17]' : 'text-[#1a6f99]'} aria-hidden="true" />
                  {timeRange(item)}
                </span>
                {showPlace && place ? (
                  <span className="inline-flex items-center gap-1.5 text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" aria-hidden="true" />
                    {place}
                  </span>
                ) : null}
                {item.recurrence && item.recurrence !== 'every' ? (
                  <span className={dark ? 'text-white/70' : 'text-gray-500'}>{t(`schedule.${item.recurrence}`)}</span>
                ) : null}
              </p>
            </div>
            {isToday ? (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#feed17] text-[#001d3a] text-xs font-bold">{t('schedule.today')}</span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
