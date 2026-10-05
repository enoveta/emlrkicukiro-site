import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDate, localized } from '../i18n/translations';
import Img from './ui/Img';

export const NewsCard = ({ item, lang, t, heading: Heading = 'h3' }) => (
  <Link
    to={`/news/${item.id}`}
    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
      <Img
        src={item.imageUrl}
        alt={localized(item, 'title', lang)}
        thumb
        width="800"
        height="500"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <time
        dateTime={item.date}
        className="absolute top-4 left-4 bg-white/95 text-[#001d3a] rounded-lg px-3 py-1.5 text-xs font-bold shadow"
      >
        {formatDate(item.date, lang)}
      </time>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <Heading className="text-lg md:text-xl font-bold text-[#001d3a] leading-snug mb-2 group-hover:text-[#1a6f99] transition-colors">
        {localized(item, 'title', lang)}
      </Heading>
      <p className="text-gray-600 leading-relaxed line-clamp-2 mb-5">{localized(item, 'content', lang)}</p>
      <span className="mt-auto inline-flex items-center text-sm font-semibold text-[#003366]">
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
