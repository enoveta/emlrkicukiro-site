import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="defer-render py-20 md:py-24 bg-[#003366]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white">{t('home.readyJoin')}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              to="/about/location"
              className="px-8 py-3.5 bg-[#fae924] text-[#001d3a] rounded-md font-semibold transition-colors hover:bg-white text-lg"
            >
              {t('home.visitUs')}
            </Link>
            <Link
              to="/about/location"
              className="px-8 py-3.5 border border-white text-white rounded-md font-semibold transition-colors hover:bg-white hover:text-[#001d3a] text-lg"
            >
              {t('home.contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
