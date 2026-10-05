import { useLanguage } from '../../i18n/LanguageContext';

function MissionVision() {
  const { t } = useLanguage();
  const objectives = [t('mission.obj1'), t('mission.obj2'), t('mission.obj3'), t('mission.obj4'), t('mission.obj5')];

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 text-sm font-semibold text-[#5fb9e2] bg-[#e8f5fb] rounded-full mb-4">
            {t('mission.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#001d3a] mb-6">{t('mission.title')}</h1>
          <div className="w-24 h-1.5 bg-[#5fb9e2] mx-auto mb-6" />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-[#001d3a] mb-6 text-center">{t('mission.foundational')}</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">{t('mission.foundationalText')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-[#001d3a] to-[#0a2c52] rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t('mission.mission')}</h2>
            <p className="text-lg">{t('mission.missionText')}</p>
          </div>
          <div className="bg-gradient-to-br from-[#5fb9e2] to-[#7ac7eb] rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t('mission.vision')}</h2>
            <p className="text-lg">{t('mission.visionText')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-[#001d3a] mb-8 text-center">{t('mission.objectives')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((objective, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#5fb9e2]">
                <div className="w-10 h-10 bg-[#e8f5fb] rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold text-[#001d3a]">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-[#001d3a]">{objective}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MissionVision;
