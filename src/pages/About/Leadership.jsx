import { useLanguage } from '../../i18n/LanguageContext';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

const Card = ({ title, text, items, tone }) => (
  <div className={`${tone} text-white p-6 rounded-xl shadow-lg`}>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    {text ? <p className="text-white/85">{text}</p> : null}
    {items ? (
      <ul className="space-y-2 mt-4">
        {items.map((item) => (
          <li key={item} className="bg-white/10 p-3 rounded-lg font-medium">
            {item}
          </li>
        ))}
      </ul>
    ) : null}
  </div>
);

function Leadership() {
  const { t } = useLanguage();
  usePageMeta(t('structure.title'));
  const s = (key) => t(`structure.${key}`);
  const navy = 'bg-gradient-to-br from-[#001d3a] to-[#0a2c52]';
  const blue = 'bg-gradient-to-br from-[#1f7fae] to-[#3a9bc4]';

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl space-y-16">
        <PageHeader badge={s('badge')} title={s('title')} />
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#001d3a] mb-8">{s('national')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card tone={navy} title={s('nationalAudit')} text={s('nationalAuditText')} />
            <Card tone={navy} title={s('generalConference')} items={[s('gcCouncil'), s('gcBishop')]} />
            <Card tone={navy} title={s('nationalConflict')} text={s('nationalConflictText')} />
          </div>
        </section>
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#001d3a] mb-8">{s('conference')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card tone={blue} title={s('confAudit')} text={s('confAuditText')} />
            <Card
              tone={blue}
              title={s('annualConference')}
              items={[s('acExecutive'), s('acSuperintendent'), s('acParishes'), s('acSchool'), s('acEvangelism')]}
            />
            <Card tone={blue} title={s('confConflict')} text={s('confConflictText')} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Leadership;
