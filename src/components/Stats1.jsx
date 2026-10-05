import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';

const Stats = () => {
  const { data: stats } = usePublicData('/stats', []);
  const { lang } = useLanguage();

  return (
    <section
      className="py-20"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/blu-stripes.png")',
      }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(stats || []).map((stat) => (
            <div key={stat.id} className="relative p-8 bg-gray-50 rounded-xl group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5fb9e2] to-[#fae924]" />
              <div className="text-center">
                <div className="text-5xl font-bold text-[#001d3a] mb-3 group-hover:text-[#5fb9e2] transition-colors">
                  {stat.number}
                </div>
                <div className="text-lg font-medium text-gray-600">{localized(stat, 'label', lang)}</div>
              </div>
              <div className="absolute inset-0 border border-gray-200 rounded-xl pointer-events-none group-hover:border-[#5fb9e2]/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
