import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { NewsCard } from '../../components/News1';
import { PageShell } from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

function News() {
  const { data: newsItems, loading } = usePublicData('/announcements', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('news.title'), t('news.subtitle'));

  return (
    <PageShell badge={t('home.latestUpdates')} title={t('news.title')} subtitle={t('news.subtitle')} tone="paper">
      {loading ? <SkeletonCards count={3} /> : null}
      {!loading && !(newsItems || []).length ? <p className="text-[17px] text-[#596c70]">{t('news.empty')}</p> : null}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
        {(newsItems || []).map((item) => (
          <NewsCard key={item.id} item={item} lang={lang} t={t} heading="h2" />
        ))}
      </div>
    </PageShell>
  );
}

export default News;
