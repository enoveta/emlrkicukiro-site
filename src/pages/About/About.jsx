import { useLanguage } from '../../i18n/LanguageContext';

function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-2">
          <span className="inline-block px-4 py-1 text-sm font-semibold text-[#5fb9e2] bg-[#dff0f8] rounded-full mb-4">
            {t('about.badge')}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-[#001d3a] mb-8 text-center">{t('about.title')}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <p key={n} className="mb-6">
                {t(`about.p${n}`)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
