import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

function About() {
  const { t } = useLanguage();
  usePageMeta(t('about.title'), t('about.p1'));
  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <PageHeader badge={t('about.badge')} title={t('about.title')} />
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-12">
          {['p1', 'p2', 'p3'].map((key) => (
            <p key={key} className="text-lg text-gray-700 leading-relaxed mb-6 last:mb-0">
              {t(`about.${key}`)}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link to="/about/mission-vision" className="px-6 py-3 rounded-lg bg-[#001d3a] text-white font-medium hover:bg-[#003366]">
            {t('nav.missionVision')}
          </Link>
          <Link to="/about/team" className="px-6 py-3 rounded-lg border border-[#001d3a] text-[#001d3a] font-medium hover:bg-[#001d3a] hover:text-white">
            {t('nav.pastoralTeam')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
