import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

function PastorCard({ member, lang, featured = false }) {
  const position = localized(member, 'position', lang);
  return (
    <article
      className={`group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-center transition-shadow hover:shadow-lg ${
        featured ? 'max-w-md mx-auto w-full' : ''
      }`}
    >
      <div className={`bg-gradient-to-br from-[#003366] to-[#1a6f99] ${featured ? 'h-24 md:h-28' : 'h-14 md:h-20'}`} />
      <div className={`${featured ? '-mt-16 md:-mt-20 px-6 pb-7' : '-mt-10 md:-mt-14 px-3 md:px-5 pb-5'}`}>
        <div
          className={`mx-auto rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-md ${
            featured ? 'w-32 h-32 md:w-40 md:h-40' : 'w-20 h-20 md:w-28 md:h-28'
          }`}
        >
          <Img src={member.imageUrl} alt={member.name} thumb className="w-full h-full object-cover object-top" />
        </div>
        <h2 className={`font-bold text-[#0b2540] leading-snug ${featured ? 'text-xl md:text-2xl mt-4' : 'text-sm md:text-lg mt-3'}`}>
          {member.name}
        </h2>
        {position ? (
          <p
            className={`inline-block mt-2 rounded-full bg-[#e8f5fb] text-[#1a6f99] font-semibold ${
              featured ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-0.5'
            }`}
          >
            {position}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function Team() {
  const { data: people, loading } = usePublicData('/people', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('team.title'), t('team.subtitle'));
  const national = (people || []).filter((p) => p.team === 'NATIONAL');
  const others = (people || []).filter((p) => p.team !== 'NATIONAL');

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <PageHeader title={t('team.title')} subtitle={t('team.subtitle')} />
        {loading ? <SkeletonCards count={3} /> : null}

        {national.length ? (
          <div className="grid gap-6 mb-8 md:mb-12">
            {national.map((member) => (
              <PastorCard key={member.id} member={member} lang={lang} featured />
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {others.map((member) => (
            <PastorCard key={member.id} member={member} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
