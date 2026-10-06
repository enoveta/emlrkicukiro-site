import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';

/** "1345+" -> serif number with a gold "+" */
const StatNumber = ({ value }) => {
  const match = String(value ?? '').match(/^(.*?)(\+?)$/);
  return (
    <strong className="font-serif font-normal text-[2.1rem] md:text-[2.6rem] leading-none text-ink">
      {match?.[1]}
      {match?.[2] ? <span className="font-body text-xl md:text-[1.35rem] text-gold align-top ml-0.5">+</span> : null}
    </strong>
  );
};

const Stats = () => {
  const { data: stats } = usePublicData('/stats', []);
  const { lang } = useLanguage();
  if (!stats?.length) return null;

  return (
    <section id="home-content" className="relative z-[3] bg-white border-y border-line" aria-label="EMLR Kicukiro">
      <div className="site-container grid grid-cols-2 lg:grid-cols-4 py-2.5 lg:py-6">
        {stats.map((stat, i) => (
          <div
            key={stat.id || stat.label}
            className={`flex min-h-[80px] lg:min-h-[84px] flex-col items-center justify-center gap-1.5 text-center border-line ${
              i % 2 === 0 ? 'border-r' : ''
            } ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''} ${i === stats.length - 1 ? '!border-r-0' : ''}`}
          >
            <StatNumber value={stat.number} />
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.08em] text-[#627276]">
              {localized(stat, 'label', lang)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
