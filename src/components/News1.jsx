import { FaArrowRight } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { formatNewsDate, mediaUrl } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';

const News = () => {
  const { data: newsItems } = usePublicData('/announcements', []);
  const { t, lang } = useLanguage();
  const display = (newsItems || []).slice(0, 3);

  return (
    <section
      className="py-48 md:h-screen relative"
      style={{
        backgroundColor: '#5fb9dd',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/binding-dark.png")',
      }}
    >
      <div className="absolute inset-0 bg-white/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0">
            <span className="text-sm font-semibold tracking-wider text-white/80 uppercase block mb-2">
              {t('home.latestUpdates')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {lang === 'rw' ? (
                <>
                  Amakuru y’<span className="text-[#fae924]">Itorero</span>
                </>
              ) : (
                <>
                  Church <span className="text-[#fae924]">News</span>
                </>
              )}
            </h2>
          </div>
          <a
            href="/media/news"
            className="group px-6 py-3 bg-white text-[#001d3a] rounded-lg font-medium transition-all duration-300 hover:bg-[#fae924] flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {t('home.viewAllNews')}
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {display.map((item) => (
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
                <a
                  href="/media/news"
                  className="text-[#001d3a] font-medium flex items-center transition-colors duration-300"
                >
                  {t('home.readMore')}
                  <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
