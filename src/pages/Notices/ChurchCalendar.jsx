import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { localized } from '../../i18n/translations';
import { DAY_NAMES, DAY_SHORT, WEEK_ORDER, occursOn, sameDay, sortByTime, styleFor, utcDay } from '../../utils/schedule';
import { isExpired } from '../../utils/notices';
import { ActivityCard } from './ActivityCard';

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  rw: ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicurasi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeri', 'Ukwakira', 'Ugushyingo', 'Ukuboza'],
};

/** Monday-first grid of 6 weeks covering the month. */
const buildGrid = (year, month) => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i));
};

export default function ChurchCalendar({ items, events, notices, lang, t, filter }) {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(today);
  const grid = useMemo(() => buildGrid(cursor.y, cursor.m), [cursor]);
  const show = (cat) => filter === 'all' || filter === cat;

  const entriesFor = (date) => {
    const recurring = sortByTime(items.filter((i) => occursOn(i, date) && show(i.category))).map((i) => ({
      kind: 'activity',
      item: i,
    }));
    const dated = show('event')
      ? events.filter((e) => sameDay(utcDay(e.date), date)).map((e) => ({ kind: 'event', item: e }))
      : [];
    const posted = show('notice')
      ? notices
          .filter((n) => !isExpired(n) && sameDay(new Date(n.publishDate), date))
          .map((n) => ({ kind: 'notice', item: n }))
      : [];
    return [...dated, ...recurring, ...posted];
  };

  const move = (delta) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };

  const selectedEntries = entriesFor(selected);
  const label = (entry) => localized(entry.item, 'title', lang);
  const colour = (entry) => styleFor(entry.kind === 'activity' ? entry.item.category : entry.kind);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-3 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => move(-1)} className="p-2.5 rounded-lg hover:bg-gray-100" aria-label={t('schedule.prevMonth')}>
            <FaChevronLeft aria-hidden="true" />
          </button>
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#003366]">
              {MONTHS[lang][cursor.m]} {cursor.y}
            </h3>
            <button
              type="button"
              onClick={() => {
                setCursor({ y: today.getFullYear(), m: today.getMonth() });
                setSelected(today);
              }}
              className="text-xs font-semibold text-[#1a6f99] hover:underline"
            >
              {t('schedule.thisMonth')}
            </button>
          </div>
          <button type="button" onClick={() => move(1)} className="p-2.5 rounded-lg hover:bg-gray-100" aria-label={t('schedule.nextMonth')}>
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden" role="grid">
          {WEEK_ORDER.map((d) => (
            <div key={d} className="bg-gray-50 text-center text-[11px] md:text-xs font-semibold text-gray-600 py-2" role="columnheader">
              {DAY_SHORT[lang][d]}
            </div>
          ))}
          {grid.map((date) => {
            const inMonth = date.getMonth() === cursor.m;
            const entries = entriesFor(date);
            const isToday = sameDay(date, today);
            const isSelected = sameDay(date, selected);
            return (
              <button
                key={date.toISOString()}
                type="button"
                role="gridcell"
                aria-selected={isSelected}
                aria-label={`${DAY_NAMES[lang][date.getDay()]} ${date.getDate()} ${MONTHS[lang][date.getMonth()]}: ${entries.length}`}
                onClick={() => setSelected(date)}
                className={`relative flex flex-col items-stretch justify-start text-left min-h-[64px] md:min-h-[96px] p-1 md:p-1.5 transition-colors ${
                  isSelected ? 'bg-[#e8f5fb] ring-2 ring-inset ring-[#5fb9e2]' : inMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-xs md:text-sm font-semibold ${
                    isToday ? 'bg-[#003366] text-white' : inMonth ? 'text-[#001d3a]' : ''
                  }`}
                >
                  {date.getDate()}
                </span>
                {/* Phones: coloured dots. Larger screens: short labels. */}
                <span className="flex flex-wrap gap-0.5 mt-1 md:hidden">
                  {entries.slice(0, 4).map((e, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${colour(e).dot}`} />
                  ))}
                </span>
                <span className="hidden md:block space-y-0.5 mt-0.5">
                  {entries.slice(0, 3).map((e, i) => (
                    <span key={i} className={`block truncate text-[11px] leading-tight px-1 py-0.5 rounded border ${colour(e).chip}`}>
                      {e.kind === 'activity' ? `${e.item.startTime} ` : ''}
                      {label(e)}
                    </span>
                  ))}
                  {entries.length > 3 ? (
                    <span className="block text-[11px] text-gray-500 px-1">{t('schedule.more', { n: entries.length - 3 })}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 self-start lg:sticky lg:top-40" aria-live="polite">
        <h3 className="text-lg font-bold text-[#003366] mb-1">{DAY_NAMES[lang][selected.getDay()]}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {selected.getDate()} {MONTHS[lang][selected.getMonth()]} {selected.getFullYear()}
          {sameDay(selected, today) ? ` · ${t('schedule.today')}` : ''}
        </p>
        {selectedEntries.length ? (
          <div className="space-y-3">
            {selectedEntries.map((entry, i) =>
              entry.kind === 'activity' ? (
                <ActivityCard key={`a${i}`} item={entry.item} lang={lang} t={t} />
              ) : entry.kind === 'event' ? (
                <Link key={`e${i}`} to="/events" className={`block bg-white rounded-lg border border-gray-200 border-l-4 ${styleFor('event').bar} p-3 hover:shadow`}>
                  <p className="text-xs font-semibold text-red-700 uppercase">{t('schedule.categories.event')}</p>
                  <h4 className="font-bold text-[#001d3a]">{localized(entry.item, 'title', lang)}</h4>
                  {localized(entry.item, 'time', lang) ? (
                    <p className="flex items-center text-xs text-gray-600 mt-1">
                      <FaClock className="mr-1.5 text-gray-400" aria-hidden="true" />
                      {localized(entry.item, 'time', lang)}
                    </p>
                  ) : null}
                  {localized(entry.item, 'location', lang) ? (
                    <p className="flex items-center text-xs text-gray-600">
                      <FaMapMarkerAlt className="mr-1.5 text-gray-400" aria-hidden="true" />
                      {localized(entry.item, 'location', lang)}
                    </p>
                  ) : null}
                </Link>
              ) : (
                <div key={`n${i}`} className={`bg-white rounded-lg border border-gray-200 border-l-4 ${styleFor('notice').bar} p-3`}>
                  <p className="text-xs font-semibold text-yellow-800 uppercase">{t('schedule.categories.notice')}</p>
                  <h4 className="font-bold text-[#001d3a]">{localized(entry.item, 'title', lang)}</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">{localized(entry.item, 'body', lang)}</p>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-gray-500">{t('schedule.empty')}</p>
        )}
      </aside>
    </div>
  );
}
