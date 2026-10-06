import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="defer-render py-12 md:py-16 bg-ink-deep text-white" aria-labelledby="welcome-title">
      <div className="site-container flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
        <div>
          <p className="eyebrow eyebrow-light mb-3">{t('home.welcome')}</p>
          <h2 id="welcome-title" className="h-display !text-white max-w-[720px] text-[2.5rem] md:text-[3.1rem] lg:text-[3.4rem] leading-[1.06]">
            {t('home.readyJoin')}
          </h2>
        </div>
        <div className="flex flex-none flex-wrap gap-2.5">
          <Link to="/about/location" className="btn btn-light">
            {t('home.visitUs')}
            <span aria-hidden="true">↗</span>
          </Link>
          <Link to="/about/location" className="btn btn-outline-light">
            {t('home.contactUs')}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
