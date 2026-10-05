import { Link } from 'react-router-dom';
import { useSettings } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';

/** Service times in the visitor's language (Kinyarwanda uses its own clock, e.g. "saa mbiri"). */
export function useServiceTimes() {
  const settings = useSettings();
  const { isRw } = useLanguage();
  const pick = (key, fallback) => (isRw && settings[`${key}Rw`]) || settings[key] || fallback;
  return {
    s1: pick('sundayService1', '8:00 AM'),
    s2: pick('sundayService2', '10:30 AM'),
    wed: pick('wednesdayService', '6:00 PM'),
  };
}

const CTA = () => {
  const { t } = useLanguage();
  const times = useServiceTimes();

  return (
    <section className="defer-render py-20 md:py-24 bg-[#003366]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white">{t('home.readyJoin')}</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{t('home.readyJoinSub')}</p>
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
          <p className="text-white/85 pt-2">{t('home.serviceTimes', times)}</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
