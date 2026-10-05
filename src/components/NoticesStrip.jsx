import { Link } from 'react-router-dom';
import { FaBullhorn, FaArrowRight } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDate, localized } from '../i18n/translations';
import { isExpired, sortNotices } from '../utils/notices';

/** Home page: the three most important current announcements. */
const NoticesStrip = () => {
  const { data } = usePublicData('/notices', []);
  const { t, lang } = useLanguage();
  const current = sortNotices((data || []).filter((n) => !isExpired(n))).slice(0, 3);
  if (!current.length) return null;

  return (
    <section className="py-14 bg-[#001d3a]" aria-labelledby="home-notices">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <h2 id="home-notices" className="flex items-center text-2xl md:text-3xl font-bold text-white">
            <FaBullhorn className="mr-3 text-[#feed17]" aria-hidden="true" />
            {t('home.noticesTitle')}
          </h2>
          <Link to="/amatangazo" className="inline-flex items-center text-[#feed17] font-medium hover:text-white">
            {t('home.allNotices')}
            <FaArrowRight className="ml-2" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {current.map((n) => (
            <Link
              key={n.id}
              to="/amatangazo"
              className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="text-white/70">{formatDate(n.publishDate, lang)}</span>
                {n.category === 'urgent' ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-semibold">{t('notices.urgent')}</span>
                ) : null}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{localized(n, 'title', lang)}</h3>
              <p className="text-white/75 text-sm line-clamp-2">{localized(n, 'body', lang)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NoticesStrip;
