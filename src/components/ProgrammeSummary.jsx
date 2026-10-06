import { Link } from 'react-router-dom';
import { localized } from '../i18n/translations';
import { daysLabel, daysOf, occursOn, sortProgramme, timeRange } from '../utils/schedule';

/**
 * The weekly programme in short: every activity once, with its days summarised
 * (e.g. "Ku wa Mbere - ku wa Gatandatu · 05:00 - 06:00"), like the parish slides.
 * Square cards; services are highlighted.
 */
export default function ProgrammeSummary({ items, lang, t, showPlace = false, linkTo }) {
  const today = new Date();
  const list = sortProgramme(items);

  return (
    <ul className="grid gap-2 sm:gap-2.5 sm:grid-cols-2 lg:grid-cols-3 md:gap-3">
      {list.map((item) => {
        const isToday = occursOn(item, today);
        const place = localized(item, 'location', lang);
        const featured = item.category === 'service';
        const body = (
          <>
            <span
              className="absolute top-0 right-0 w-[3px] h-full bg-gold-light origin-bottom scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
              aria-hidden="true"
            />
            <span className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs font-bold uppercase tracking-[0.1em] text-[#6b592f]">
              {daysLabel(daysOf(item), lang)}
              {isToday ? (
                <span className="px-2 py-0.5 rounded-full bg-[#45645d] text-white text-[9px] md:text-[10px] tracking-[0.08em]">
                  {t('schedule.today')}
                </span>
              ) : null}
            </span>
            <span className="text-[13px] md:text-sm font-semibold tracking-[0.03em] text-[#627276] tabular-nums">
              {timeRange(item)}
              {item.recurrence && item.recurrence !== 'every' ? ` · ${t(`schedule.${item.recurrence}`)}` : ''}
            </span>
            <span className="max-w-[calc(100%-18px)] font-serif text-[1.2rem] sm:text-[1.3rem] md:text-[1.4rem] leading-[1.18] text-ink">
              {localized(item, 'title', lang)}
            </span>
            {showPlace && place ? <span className="text-sm text-muted">{place}</span> : null}
            {linkTo ? (
              <span className="absolute top-3.5 right-4 sm:top-4 sm:right-[18px] text-gold text-sm" aria-hidden="true">
                ↗
              </span>
            ) : null}
          </>
        );
        const cls = `group relative flex h-full sm:min-h-[128px] md:min-h-[150px] flex-col items-start justify-end gap-1 sm:gap-1.5 px-4 py-3.5 sm:px-5 sm:py-[18px] md:px-[22px] md:py-5 overflow-hidden border text-ink transition-all duration-200 hover:border-[#c8b98e] hover:shadow-[0_10px_24px_rgba(20,54,66,.07)] hover:-translate-y-0.5 ${
          featured ? 'bg-paper-featured' : 'bg-paper-card'
        } ${isToday ? 'border-[#c8b98e]' : 'border-line'}`;
        return (
          <li key={item.id}>
            {linkTo ? (
              <Link to={linkTo} className={cls}>
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
