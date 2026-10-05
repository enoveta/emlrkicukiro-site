import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { MinistryCard } from '../../components/Programs1';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

const DEPARTMENTS = [
  { key: 'evangelism', label: 'nav.evangelismDept' },
  { key: 'social', label: 'nav.socialDept' },
  { key: 'development', label: 'nav.planningDept' },
  { key: 'education', label: 'nav.educationDept' },
];

const Ministries = () => {
  const { data: ministries, loading } = usePublicData('/ministries', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('ministries.title'), t('home.ministriesSubtitle'));
  const list = ministries || [];
  const known = new Set(DEPARTMENTS.map((d) => d.key));
  const groups = [
    ...DEPARTMENTS.map((d) => ({ title: t(d.label), items: list.filter((m) => m.category === d.key) })),
    { title: '', items: list.filter((m) => !known.has(m.category)) },
  ].filter((g) => g.items.length);

  return (
    <section className="py-12 md:py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <PageHeader badge={t('nav.departments')} title={t('ministries.title')} subtitle={t('home.ministriesSubtitle')} />
        {loading ? <SkeletonCards count={6} /> : null}
        {groups.map((group) => (
          <div key={group.title || 'other'} className="mb-14">
            {group.title ? (
              <h2 className="text-2xl font-bold text-[#003366] mb-6 pb-2 border-b border-gray-200">{group.title}</h2>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.items.map((ministry) => (
                <MinistryCard key={ministry.id || ministry.slug} ministry={ministry} lang={lang} t={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Ministries;
