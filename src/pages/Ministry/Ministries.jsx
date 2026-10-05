import { FaArrowRight } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';

const Ministries = () => {
  const { data: ministries, loading } = usePublicData('/ministries', []);
  const { t, lang } = useLanguage();
  const list = ministries || [];

  const Card = ({ ministry }) => (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100">
      <div className="relative h-64 overflow-hidden">
        <img
          src={mediaUrl(ministry.aboutImageUrl || ministry.heroImageUrl)}
          alt={localized(ministry, 'name', lang)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-[#001d3a] mb-3">{localized(ministry, 'name', lang)}</h3>
        <p className="text-gray-600 mb-6">{localized(ministry, 'shortDescription', lang)}</p>
        <a
          href={`/ministries/${ministry.slug}`}
          className="inline-flex items-center font-medium text-[#5fb9e2] group-hover:text-[#003366] transition-colors"
        >
          {t('home.learnMoreMinistry')}
          <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#fae924] to-[#5fb9e2]" />
    </div>
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-[#5fb9e2] bg-[#e8f5fb] rounded-full mb-4">
            {t('home.churchMinistries')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6">
            {t('home.growInFaith')} <span className="text-[#5fb9e2]">{t('home.faithService')}</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#fae924] mx-auto mb-6" />
          <p className="max-w-3xl mx-auto text-lg text-gray-600">{t('home.ministriesSubtitle')}</p>
        </div>

        {loading && <p className="text-center text-gray-500 mb-8">{t('ministries.loading')}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((ministry) => (
            <Card key={ministry.id} ministry={ministry} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ministries;
