import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { PageShell } from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

function About() {
  const { t } = useLanguage();
  usePageMeta(t('about.title'), t('about.p1'));
  return (
    <PageShell badge={t('about.badge')} title={t('about.title')}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <div className="max-w-[760px]">
          {['p1', 'p2', 'p3'].map((key, i) => (
            <p
              key={key}
              className={`mb-6 last:mb-0 leading-[1.8] text-[#435b60] ${
                i === 0 ? 'font-serif text-[1.45rem] md:text-[1.65rem] leading-[1.45] text-ink' : 'text-[17px]'
              }`}
            >
              {t(`about.${key}`)}
            </p>
          ))}
        </div>
        <aside className="self-start border-t border-line lg:sticky lg:top-32">
          {[
            { href: '/about/mission-vision', label: t('nav.missionVision') },
            { href: '/about/leadership', label: t('nav.orgStructure') },
            { href: '/about/team', label: t('nav.pastoralTeam') },
            { href: '/about/location', label: t('nav.locationDirections') },
          ].map((l) => (
            <Link key={l.href} to={l.href} className="group flex items-center justify-between py-4 border-b border-line text-[17px] font-serif text-ink hover:text-gold">
              {l.label}
              <span className="text-gold text-sm transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </aside>
      </div>
    </PageShell>
  );
}

export default About;
