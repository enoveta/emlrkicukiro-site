import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPrint, FaCalendarAlt, FaListUl, FaBullhorn, FaBroadcastTower, FaArrowRight } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';
import { DAY_NAMES, formatRange, nowAndNext, sameDay, styleFor } from '../../utils/schedule';
import WeeklyProgramme from './WeeklyProgramme';
import ChurchCalendar from './ChurchCalendar';
import NoticeList from './NoticeList';

const VIEWS = [
  { key: 'week', label: 'schedule.tabWeek', icon: FaListUl },
  { key: 'calendar', label: 'schedule.tabCalendar', icon: FaCalendarAlt },
  { key: 'notices', label: 'schedule.tabNotices', icon: FaBullhorn },
];

function NowNext({ items, lang, t }) {
  const { current, next, nextDate } = useMemo(() => nowAndNext(items), [items]);
  if (!current && !next) return null;
  const today = new Date();
  const when = (date) =>
    sameDay(date, today) ? t('schedule.today') : DAY_NAMES[lang][date.getDay()];
  return (
    <div className="grid sm:grid-cols-2 gap-3 mb-8 print:hidden">
      {current ? (
        <div className="flex items-start gap-3 rounded-xl bg-[#003366] text-white p-4">
          <FaBroadcastTower className="mt-1 text-[#feed17] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-wide text-[#feed17] font-semibold">{t('schedule.now')}</p>
            <p className="font-bold">{localized(current, 'title', lang)}</p>
            <p className="text-sm text-white/80">{formatRange(current, lang)}</p>
          </div>
        </div>
      ) : null}
      {next ? (
        <div className={`flex items-start gap-3 rounded-xl bg-white border border-gray-200 p-4 ${current ? '' : 'sm:col-span-2'}`}>
          <FaArrowRight className="mt-1 text-[#1a6f99]" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-wide text-[#1a6f99] font-semibold">{t('schedule.next')}</p>
            <p className="font-bold text-[#001d3a]">{localized(next, 'title', lang)}</p>
            <p className="text-sm text-gray-600">
              {when(nextDate)} · {formatRange(next, lang)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Notices() {
  const { t, lang } = useLanguage();
  const { data: schedule, loading: loadingSchedule } = usePublicData('/schedule', []);
  const { data: events } = usePublicData('/events', []);
  const { data: notices, loading: loadingNotices } = usePublicData('/notices', []);
  const [params, setParams] = useSearchParams();
  const view = VIEWS.some((v) => v.key === params.get('view')) ? params.get('view') : 'week';
  const [filter, setFilter] = useState('all');
  usePageMeta(t('schedule.pageTitle'), t('schedule.pageSubtitle'));

  const items = useMemo(() => schedule || [], [schedule]);
  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const visible = filter === 'all' ? items : items.filter((i) => i.category === filter);
  const calendarFilters = [...categories, 'event', 'notice'];
  const filters = view === 'calendar' ? calendarFilters : categories;

  const setView = (key) => {
    setFilter('all');
    setParams(key === 'week' ? {} : { view: key }, { replace: true });
  };

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50 print:bg-white print:py-0">
      <div className="container mx-auto max-w-7xl">
        <PageHeader title={t('schedule.pageTitle')} subtitle={t('schedule.pageSubtitle')} />

        <NowNext items={items} lang={lang} t={t} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 print:hidden">
          <div role="tablist" aria-label={t('schedule.pageTitle')} className="grid grid-cols-3 md:inline-flex w-full md:w-auto bg-white border border-gray-200 rounded-xl p-1 self-start">
            {VIEWS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={view === key}
                onClick={() => setView(key)}
                className={`inline-flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-center leading-tight transition-colors ${
                  view === key ? 'bg-[#003366] text-white' : 'text-[#003366] hover:bg-gray-100'
                }`}
              >
                <Icon aria-hidden="true" />
                <span>{t(label)}</span>
              </button>
            ))}
          </div>
          {view === 'week' ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden md:inline-flex items-center gap-2 self-start px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-[#003366] hover:border-[#003366]"
            >
              <FaPrint aria-hidden="true" />
              {t('schedule.print')}
            </button>
          ) : null}
        </div>

        {view !== 'notices' && filters.length > 1 ? (
          <div className="flex flex-wrap gap-2 mb-6 print:hidden" aria-label="Filter">
            {['all', ...filters].map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    active ? 'bg-[#001d3a] border-[#001d3a] text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-[#001d3a]'
                  }`}
                >
                  {cat !== 'all' ? <span className={`w-2.5 h-2.5 rounded-full ${styleFor(cat).dot}`} aria-hidden="true" /> : null}
                  {cat === 'all' ? t('schedule.all') : t(`schedule.categories.${cat}`)}
                </button>
              );
            })}
          </div>
        ) : null}

        <h2 className="hidden print:block text-xl font-bold mb-4">{t('schedule.tabWeek')} — EMLR Kicukiro</h2>

        {view === 'week' ? (
          loadingSchedule ? (
            <SkeletonCards count={3} className="h-40" />
          ) : (
            <WeeklyProgramme items={visible} lang={lang} t={t} />
          )
        ) : null}
        {view === 'calendar' ? (
          <ChurchCalendar items={items} events={events || []} notices={notices || []} lang={lang} t={t} filter={filter} />
        ) : null}
        {view === 'notices' ? <NoticeList data={notices} loading={loadingNotices} lang={lang} t={t} /> : null}
      </div>
    </div>
  );
}

export default Notices;
