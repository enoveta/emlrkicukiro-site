import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { MinistryCard } from '../../components/Programs1';
import { PageShell } from '../../components/ui/PageHeader';
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
    <PageShell badge={t('nav.departments')} title={t('ministries.title')} subtitle={t('home.ministriesSubtitle')} tone="paper">
      {loading ? <SkeletonCards count={6} /> : null}
      {groups.map((group, gi) => (
        <div key={group.title || 'other'} className="mb-14 md:mb-20 last:mb-0">
          {group.title ? (
            <div className="flex items-end justify-between gap-4 mb-6 pb-4 border-b border-line">
              <h2 className="h-display text-[2rem] md:text-[2.5rem] leading-tight">{group.title}</h2>
              <span className="text-xs font-bold tracking-[0.08em] text-[#7f8a89]">{String(gi + 1).padStart(2, '0')}</span>
            </div>
          ) : null}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
            {group.items.map((ministry, i) => (
              <MinistryCard key={ministry.id || ministry.slug} ministry={ministry} lang={lang} t={t} index={i} />
            ))}
          </div>
        </div>
      ))}
    </PageShell>
  );
};

export default Ministries;
