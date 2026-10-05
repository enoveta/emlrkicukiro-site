import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDate, localized } from '../i18n/translations';
import Img from './ui/Img';

export const NewsCard = ({ item, lang, t, heading: Heading = 'h3' }) => (
  <Link
    to={`/news/${item.id}`}
    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
  >
    <div className="h-52 overflow-hidden">
      <Img
        src={item.imageUrl}
        alt={localized(item, 'title', lang)}
        thumb
        width="800"
        height="420"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-6 flex flex-col flex-1">
      <time dateTime={item.date} className="self-start bg-[#fae924] text-[#001d3a] px-3 py-1 rounded-full text-xs font-semibold mb-3">
        {formatDate(item.date, lang)}
      </time>
      <Heading className="text-xl font-bold text-[#001d3a] mb-3 leading-tight">{localized(item, 'title', lang)}</Heading>
      <p className="text-gray-600 mb-5 line-clamp-3">{localized(item, 'content', lang)}</p>
      <span className="mt-auto text-[#001d3a] font-medium inline-flex items-center">
        {t('home.readMore')}
        <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </div>
  </Link>
);

const News = () => {
  const { data: newsItems } = usePublicData('/announcements', []);
  const { t, lang } = useLanguage();
  const display = (newsItems || []).slice(0, 3);
  if (!display.length) return null;

  return (
    <section className="defer-render py-20 md:py-28 bg-gradient-to-br from-[#4aa9d3] to-[#2f8fbf]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-sm font-semibold tracking-wider text-white/85 uppercase block mb-2">
              {t('home.latestUpdates')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">{t('news.title')}</h2>
          </div>
          <Link
            to="/news"
            className="self-start md:self-auto group px-6 py-3 bg-white text-[#001d3a] rounded-lg font-medium transition-colors hover:bg-[#fae924] inline-flex items-center gap-2 shadow-md"
          >
            {t('home.viewAllNews')}
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {display.map((item) => (
            <NewsCard key={item.id} item={item} lang={lang} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
