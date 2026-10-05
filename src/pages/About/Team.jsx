import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

function Team() {
  const { data: people, loading } = usePublicData('/people', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('team.title'), t('team.subtitle'));
  const national = (people || []).filter((p) => p.team === 'NATIONAL');
  const others = (people || []).filter((p) => p.team !== 'NATIONAL');

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <PageHeader title={t('team.title')} subtitle={t('team.subtitle')} />
        {loading ? <SkeletonCards count={3} /> : null}

        {national.length ? (
          <div className="flex justify-center flex-wrap gap-10 mb-16">
            {national.map((member) => (
              <div key={member.id} className="text-center max-w-md">
                <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white mb-5">
                  <Img src={member.imageUrl} alt={member.name} thumb className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold text-[#001d3a] mb-1">{member.name}</h2>
                <p className="text-[#1f7fae] font-semibold text-lg">{localized(member, 'position', lang)}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map((member) => (
            <div key={member.id} className="flex flex-col items-center text-center bg-white rounded-xl shadow-md p-6">
              <div className="w-36 h-36 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white mb-5">
                <Img src={member.imageUrl} alt={member.name} thumb className="w-full h-full object-cover" />
              </div>
              <h2 className="text-lg font-bold text-[#001d3a] mb-1">{member.name}</h2>
              {localized(member, 'position', lang) ? (
                <p className="text-[#1f7fae] font-medium">{localized(member, 'position', lang)}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
