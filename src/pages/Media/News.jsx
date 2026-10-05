import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { NewsCard } from '../../components/News1';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

function News() {
  const { data: newsItems, loading } = usePublicData('/announcements', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('news.title'), t('news.subtitle'));

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <PageHeader title={t('news.title')} subtitle={t('news.subtitle')} />
        {loading ? <SkeletonCards count={3} /> : null}
        {!loading && !(newsItems || []).length ? <p className="text-center text-gray-600">{t('news.empty')}</p> : null}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(newsItems || []).map((item) => (
            <NewsCard key={item.id} item={item} lang={lang} t={t} heading="h2" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
