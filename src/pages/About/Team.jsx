import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';

function Team() {
  const { data: people, loading } = usePublicData('/people', []);
  const { t, lang } = useLanguage();
  const national = (people || []).filter((p) => p.team === 'NATIONAL');
  const parish = (people || []).filter((p) => p.team === 'PARISH');

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {loading && <p className="text-center text-gray-500">{t('team.loading')}</p>}

        <div className="mb-20">
          <div className="flex justify-center flex-wrap gap-10">
            {national.map((member) => (
              <div key={member.id} className="group text-center max-w-md">
                <div className="relative mb-6">
                  <div className="relative w-56 h-56 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <img
                      src={mediaUrl(member.imageUrl)}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001d3a]/30 to-transparent rounded-full" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#001d3a] mb-2">{member.name}</h3>
                <p className="text-[#5fb9e2] font-semibold text-lg mb-3">{localized(member, 'position', lang)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {parish.map((member) => (
              <div
                key={member.id}
                className="group flex flex-col items-center text-center bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative mb-6">
                  <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <img
                      src={mediaUrl(member.imageUrl)}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#5fb9e2]/30 to-transparent rounded-full" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#001d3a] mb-1">{member.name}</h3>
                {localized(member, 'position', lang) ? (
                  <p className="text-[#5fb9e2] font-medium">{localized(member, 'position', lang)}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;
