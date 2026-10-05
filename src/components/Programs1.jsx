import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';
import Img from './ui/Img';

export const MinistryCard = ({ ministry, lang, t }) => (
  <Link
    to={`/ministries/${ministry.slug}`}
    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-[#001d3a]">
      <Img
        src={ministry.aboutImageUrl || ministry.heroImageUrl}
        alt={localized(ministry, 'name', lang)}
        thumb
        width="800"
        height="600"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001d3a]/45 via-transparent to-transparent" />
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-xl font-bold text-[#001d3a] leading-snug mb-2 group-hover:text-[#1a6f99] transition-colors">
        {localized(ministry, 'name', lang)}
      </h3>
      <p className="text-gray-600 leading-relaxed line-clamp-3 mb-5">{localized(ministry, 'shortDescription', lang)}</p>
      <span className="mt-auto inline-flex items-center text-sm font-semibold text-[#003366]">
        {t('home.learnMoreMinistry')}
        <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </div>
  </Link>
);

const Programs = () => {
  const { data: ministries } = usePublicData('/ministries', []);
  const { t, lang } = useLanguage();
  const featured = (ministries || [])
    .filter((m) => m.featuredOnHome)
    .sort((a, b) => a.homeOrder - b.homeOrder)
    .slice(0, 6);

  if (!featured.length) return null;

  return (
    <section className="defer-render py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-[#1a6f99] bg-[#e8f5fb] rounded-full mb-4">
            {t('home.churchMinistries')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#003366] mb-6">
            {t('home.growInFaith')} <span className="text-[#3a9bc4]">{t('home.faithService')}</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#fae924] mx-auto mb-6" />
          <p className="max-w-3xl mx-auto text-lg text-gray-600">{t('home.ministriesSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((ministry) => (
            <MinistryCard key={ministry.id || ministry.slug} ministry={ministry} lang={lang} t={t} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            to="/ministries"
            className="inline-flex items-center px-8 py-3 bg-[#003366] text-white font-medium rounded-full shadow-md hover:bg-[#001d3a] transition-colors"
          >
            {t('home.discoverAll')}
            <FaArrowRight className="ml-2" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Programs;
