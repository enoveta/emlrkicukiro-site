import { useLanguage } from '../../i18n/LanguageContext';
import { PageShell } from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

function MissionVision() {
  const { t } = useLanguage();
  usePageMeta(t('mission.title'), t('mission.missionText'));
  const objectives = [t('mission.obj1'), t('mission.obj2'), t('mission.obj3'), t('mission.obj4'), t('mission.obj5')];

  return (
    <PageShell badge={t('mission.badge')} title={t('mission.title')}>
      <div className="max-w-[860px] mb-14 md:mb-20">
        <p className="eyebrow mb-4">{t('mission.foundational')}</p>
        <p className="font-serif text-[1.5rem] md:text-[1.9rem] leading-[1.4] text-ink">{t('mission.foundationalText')}</p>
      </div>

      <div className="grid gap-3.5 md:grid-cols-2 md:gap-[18px] mb-14 md:mb-20">
        <div className="relative overflow-hidden bg-ink text-white p-8 md:p-10">
          <span className="absolute -top-8 -right-8 w-28 h-28 rounded-full border border-gold-light/50" aria-hidden="true" />
          <p className="eyebrow eyebrow-light mb-4">01</p>
          <h2 className="font-serif text-[2rem] md:text-[2.4rem] leading-tight mb-4">{t('mission.mission')}</h2>
          <p className="text-[17px] leading-[1.75] text-[#d4dddc]">{t('mission.missionText')}</p>
        </div>
        <div className="relative overflow-hidden bg-paper-featured border border-line p-8 md:p-10">
          <span className="absolute right-0 bottom-0 w-1/2 h-1/3 bg-gold-light/40" aria-hidden="true" />
          <p className="eyebrow mb-4 relative">02</p>
          <h2 className="relative font-serif text-[2rem] md:text-[2.4rem] leading-tight text-ink mb-4">{t('mission.vision')}</h2>
          <p className="relative text-[17px] leading-[1.75] text-[#435b60]">{t('mission.visionText')}</p>
        </div>
      </div>

      <p className="eyebrow mb-3">{t('mission.objectives')}</p>
      <h2 className="h-section mb-8">{t('mission.objectives')}</h2>
      <ol className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 md:gap-3">
        {objectives.map((objective, index) => (
          <li key={index} className="flex flex-col gap-3 min-h-[150px] p-6 border border-line bg-paper-card">
            <span className="font-serif text-[2rem] leading-none text-gold">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-[17px] font-semibold leading-snug text-ink">{objective}</span>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}

export default MissionVision;
