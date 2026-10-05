import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';

const CTA = () => {
  const { data: settings } = usePublicData('/settings', {});
  const { t } = useLanguage();
  const s1 = settings?.sundayService1 || '8:00 AM';
  const s2 = settings?.sundayService2 || '10:30 AM';
  const wed = settings?.wednesdayService || '6:00 PM';

  return (
    <section className="py-24 bg-[#001d3a]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">{t('home.readyJoin')}</h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">{t('home.readyJoinSub')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a
              href="/about/location"
              className="px-8 py-3.5 bg-[#fae924] text-[#001d3a] rounded-md font-semibold transition-all duration-200 hover:bg-white text-lg"
            >
              {t('home.visitUs')}
            </a>
            <a
              href="/about/location"
              className="px-8 py-3.5 bg-transparent border border-white text-white rounded-md font-semibold transition-all duration-200 hover:bg-white hover:text-[#001d3a] text-lg"
            >
              {t('home.contactUs')}
            </a>
          </div>
          <p className="text-sm text-gray-200 pt-4">{t('home.serviceTimes', { s1, s2, wed })}</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
