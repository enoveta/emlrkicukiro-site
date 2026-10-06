import { Link } from 'react-router-dom';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDate, localized } from '../i18n/translations';
import { isExpired, sortNotices } from '../utils/notices';
import ProgrammeSummary from './ProgrammeSummary';
import SectionHeading from './ui/SectionHeading';

/** Home page: the weekly programme in short, plus current announcements when there are any. */
const NoticesStrip = () => {
  const { data: notices } = usePublicData('/notices', []);
  const { data: schedule } = usePublicData('/schedule', []);
  const { t, lang } = useLanguage();
  const current = sortNotices((notices || []).filter((n) => !isExpired(n))).slice(0, 3);
  const items = schedule || [];
  if (!current.length && !items.length) return null;

  return (
    <section className="section-pad bg-white" id="programme" aria-labelledby="home-notices">
      <div className="site-container">
        <SectionHeading
          id="home-notices"
          eyebrow={t('home.noticesTitle')}
          title={t('home.noticesTitle')}
          aside={
            <Link to="/amatangazo" className="text-link">
              <span>{t('home.allNotices')}</span>
              <span aria-hidden="true">→</span>
            </Link>
          }
        />

        {items.length ? <ProgrammeSummary items={items} lang={lang} t={t} linkTo="/amatangazo" /> : null}

        {current.length ? (
          <div className="mt-10 md:mt-12">
            <p className="eyebrow mb-4">{t('notices.title')}</p>
            <ul className="border-t border-line">
              {current.map((n) => (
                <li key={n.id} className="border-b border-line">
                  <Link
                    to="/amatangazo?view=notices"
                    className="group grid grid-cols-[minmax(0,1fr)_14px] md:grid-cols-[150px_minmax(0,1fr)_14px] gap-x-4 gap-y-1 py-4 md:py-5 transition-all hover:px-1.5"
                  >
                    <span className="flex items-center gap-2 text-xs font-bold text-[#596c70] md:pt-1">
                      {formatDate(n.publishDate, lang)}
                      {n.category === 'urgent' ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#9b2c2c] text-white text-[10px] uppercase tracking-[0.08em]">
                          {t('notices.urgent')}
                        </span>
                      ) : null}
                    </span>
                    <span className="row-start-2 md:row-start-auto flex flex-col gap-1 min-w-0">
                      <strong className="font-serif font-normal text-xl leading-tight text-ink">{localized(n, 'title', lang)}</strong>
                      <span className="text-[15px] text-[#596c70] line-clamp-2">{localized(n, 'body', lang)}</span>
                    </span>
                    <span className="row-span-2 md:row-span-1 text-gold-dark text-sm pt-0.5" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default NoticesStrip;
