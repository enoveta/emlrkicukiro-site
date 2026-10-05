import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { EventCard, isUpcoming } from '../../components/Events1';
import PageHeader from '../../components/ui/PageHeader';
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
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <PageHeader title={t('events.title')} subtitle={t('events.subtitle')} />
        {loading ? <SkeletonCards count={3} className="h-48" /> : null}

        {!loading && (
          <>
            <h2 className="text-2xl font-bold text-[#003366] mb-6">{t('events.upcoming')}</h2>
            {upcoming.length ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} lang={lang} showDescription />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 bg-white rounded-xl p-6 border border-gray-200 mb-16">{t('events.none')}</p>
            )}

            {past.length ? (
              <>
                <h2 className="text-2xl font-bold text-[#003366] mb-6">{t('events.past')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} lang={lang} showDescription past />
                  ))}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default Events;
