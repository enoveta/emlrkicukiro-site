import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPrint, FaCalendarAlt, FaListUl, FaBullhorn } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';
import { styleFor } from '../../utils/schedule';
import ProgrammeSummary from '../../components/ProgrammeSummary';
import ChurchCalendar from './ChurchCalendar';
import NoticeList from './NoticeList';

const VIEWS = [
  { key: 'week', label: 'schedule.tabWeek', icon: FaListUl },
  { key: 'calendar', label: 'schedule.tabCalendar', icon: FaCalendarAlt },
  { key: 'notices', label: 'schedule.tabNotices', icon: FaBullhorn },
];

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
    <div className="min-h-screen bg-paper print:bg-white">
      <div className="print:hidden">
        <PageHeader title={t('schedule.pageTitle')} />
      </div>
      <div className="site-container py-10 md:py-16 print:py-0">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 print:hidden">
          <div role="tablist" aria-label={t('schedule.pageTitle')} className="grid grid-cols-3 md:inline-flex w-full md:w-auto bg-white border border-line self-start">
            {VIEWS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={view === key}
                onClick={() => setView(key)}
                className={`inline-flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2.5 px-2 md:px-5 py-3 text-[13px] md:text-[15px] font-semibold text-center leading-tight transition-colors border-r border-line last:border-r-0 ${
                  view === key ? 'bg-ink text-white' : 'text-[#334c51] hover:bg-paper'
                }`}
              >
                <Icon className={view === key ? 'text-gold-light' : 'text-gold'} aria-hidden="true" />
                <span>{t(label)}</span>
              </button>
            ))}
          </div>
          {view === 'week' ? (
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden md:inline-flex btn btn-outline !min-h-[46px] self-start"
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
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold border transition-colors ${
                    active ? 'bg-ink border-ink text-white' : 'bg-white border-line text-[#334c51] hover:border-ink/40'
                  }`}
                >
                  {cat !== 'all' ? <span className={`w-2.5 h-2.5 rounded-full ${styleFor(cat).dot}`} aria-hidden="true" /> : null}
                  {cat === 'all' ? t('schedule.all') : t(`schedule.categories.${cat}`)}
                </button>
              );
            })}
          </div>
        ) : null}

        <h2 className="hidden print:block font-serif text-2xl mb-4">{t('schedule.tabWeek')}, EMLR Kicukiro</h2>

        {view === 'week' ? (
          loadingSchedule ? (
            <SkeletonCards count={3} className="h-40" />
          ) : (
            visible.length ? (
              <ProgrammeSummary items={visible} lang={lang} t={t} showPlace />
            ) : (
              <p className="text-[17px] text-[#596c70] bg-white p-8 border border-line">{t('schedule.emptyWeek')}</p>
            )
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
