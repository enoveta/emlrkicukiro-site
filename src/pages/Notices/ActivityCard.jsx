import { FaMapMarkerAlt, FaUser, FaRedo } from 'react-icons/fa';
import { localized } from '../../i18n/translations';
import { formatRange, styleFor } from '../../utils/schedule';

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
