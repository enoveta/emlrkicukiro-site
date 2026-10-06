import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { EventCard, isUpcoming } from '../../components/Events1';
import { PageShell } from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

function Events() {
  const { data: events, loading } = usePublicData('/events', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('events.title'), t('events.subtitle'));

  const all = events || [];
  const upcoming = all.filter((e) => isUpcoming(e)).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = all.filter((e) => !isUpcoming(e)).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <PageShell title={t('events.title')} subtitle={t('events.subtitle')}>
      {loading ? <SkeletonCards count={3} className="h-28" /> : null}

      {!loading && (
        <div className="max-w-[920px]">
          <p className="eyebrow mb-4">{t('events.upcoming')}</p>
          {upcoming.length ? (
            <div className="border-t border-line mb-16">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} lang={lang} showDescription as="h2" />
              ))}
            </div>
          ) : (
            <p className="text-[17px] text-[#596c70] border-y border-line py-6 mb-16">{t('events.none')}</p>
          )}

          {past.length ? (
            <>
              <p className="eyebrow mb-4">{t('events.past')}</p>
              <div className="border-t border-line opacity-90">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} lang={lang} showDescription past as="h2" />
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
    </PageShell>
  );
}

export default Events;
