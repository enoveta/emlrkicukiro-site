import { FaArrowRight } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { formatNewsDate, mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';

function News() {
  const { data: newsItems, loading } = usePublicData('/announcements', []);
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#001d3a] mb-4">{t('news.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('news.subtitle')}</p>
        </div>

        {loading && <p className="text-center text-gray-500">{t('news.loading')}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(newsItems || []).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
            >
              <div className="h-52 overflow-hidden relative">
                <img
                  src={mediaUrl(item.imageUrl)}
                  alt={localized(item, 'title', lang)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="inline-block bg-[#fae924] text-[#001d3a] px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  {formatNewsDate(item.date)}
                </span>
                <h3 className="text-xl font-bold text-[#001d3a] mb-3 leading-tight">
                  {localized(item, 'title', lang)}
                </h3>
                <p className="text-gray-600 mb-5">{localized(item, 'content', lang)}</p>
                <span className="text-[#001d3a] font-medium flex items-center">
                  {t('home.readMore')}
                  <FaArrowRight className="ml-2" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
