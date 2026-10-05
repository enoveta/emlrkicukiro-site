import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';

const Stats = () => {
  const { data: stats } = usePublicData('/stats', []);
  const { lang } = useLanguage();
  if (!stats?.length) return null;

  return (
    <section id="home-content" className="py-16 md:py-20 bg-gradient-to-b from-[#f4f9fc] to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.id || stat.label} className="relative p-6 md:p-8 bg-white rounded-xl border border-gray-200 overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5fb9e2] to-[#fae924]" />
              <div className="text-4xl md:text-5xl font-bold text-[#001d3a] mb-2">{stat.number}</div>
              <div className="text-base md:text-lg font-medium text-gray-600">{localized(stat, 'label', lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
