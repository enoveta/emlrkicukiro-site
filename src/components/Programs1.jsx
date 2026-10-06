import { Link } from 'react-router-dom';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';
import Img from './ui/Img';
import SectionHeading from './ui/SectionHeading';

export const MinistryCard = ({ ministry, lang, t, index }) => {
  const image = ministry.aboutImageUrl || ministry.heroImageUrl;
  const designed = /\/media\/dept-/.test(image || '');
  return (
    <Link
      to={`/ministries/${ministry.slug}`}
      className="group flex min-w-0 flex-col overflow-hidden bg-white text-ink border border-line transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_17px_35px_rgba(20,54,66,.16)]"
    >
      <span className="relative block h-[clamp(200px,60vw,270px)] sm:h-[210px] lg:h-[230px] overflow-hidden bg-[#c9c6bb]">
        <Img
          src={image}
          alt={localized(ministry, 'name', lang)}
          thumb
          width="800"
          height="520"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${designed ? 'object-[72%_40%]' : ''}`}
        />
        <span className="absolute inset-x-0 bottom-0 top-[45%] bg-gradient-to-b from-transparent to-[rgba(7,25,31,.28)] pointer-events-none" />
        {index !== undefined ? (
          <span className="absolute right-3.5 bottom-2.5 text-[11px] font-bold tracking-[0.08em] text-white/90">{String(index + 1).padStart(2, '0')}</span>
        ) : null}
      </span>
      <span className="flex flex-1 flex-col items-start px-5 pt-5 pb-[18px] md:px-[22px] min-h-[170px]">
        <span className="font-serif text-[1.45rem] md:text-[1.5rem] leading-[1.18] text-ink">{localized(ministry, 'name', lang)}</span>
        <span className="mt-2.5 text-[15px] leading-[1.6] text-[#53666a] line-clamp-3">{localized(ministry, 'shortDescription', lang)}</span>
        <span className="mt-auto pt-4 inline-flex items-center gap-2 text-[13px] font-bold text-gold-dark">
          {t('home.learnMoreMinistry')}
          <span className="text-gold transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
            ↗
          </span>
        </span>
      </span>
    </Link>
  );
};

const Programs = () => {
  const { data: ministries } = usePublicData('/ministries', []);
  const { t, lang } = useLanguage();
  const featured = (ministries || [])
    .filter((m) => m.featuredOnHome)
    .sort((a, b) => a.homeOrder - b.homeOrder)
    .slice(0, 6);

  if (!featured.length) return null;

  return (
    <section className="defer-render section-pad relative overflow-hidden bg-ink text-white" aria-labelledby="home-ministries">
      <span className="absolute top-0 right-0 w-[36%] h-full bg-white/[.025]" aria-hidden="true" />
      <div className="site-container relative">
        <SectionHeading
          light
          id="home-ministries"
          eyebrow={t('home.churchMinistries')}
          title={
            <>
              {t('home.growInFaith')} <em>{t('home.faithService')}</em>
            </>
          }
          aside={
            <>
              <p className="mb-3 text-[15px] leading-[1.75] text-[#c2cecb]">{t('home.ministriesSubtitle')}</p>
              <Link to="/ministries" className="text-link text-link-light">
                <span>{t('home.discoverAll')}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </>
          }
        />

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
          {featured.map((ministry, i) => (
            <MinistryCard key={ministry.id || ministry.slug} ministry={ministry} lang={lang} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
