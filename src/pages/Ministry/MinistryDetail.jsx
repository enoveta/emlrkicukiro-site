import { useParams } from 'react-router-dom';
import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';

function MinistryDetail() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const { data: ministry, loading, error } = usePublicData(`/ministries/${slug}`, null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t('ministries.loadingOne')}</p>
      </div>
    );
  }

  if (error || !ministry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t('ministries.notFound')}</p>
      </div>
    );
  }

  const body = localized(ministry, 'body', lang);
  const paragraphs = (body || '').split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen -mt-24 md:-mt-[9.5rem]">
      <section
        className="relative h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url(${mediaUrl(ministry.heroImageUrl || ministry.aboutImageUrl)})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative mt-64 z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{localized(ministry, 'name', lang)}</h1>
          <p className="text-xl md:text-2xl mb-8">{localized(ministry, 'shortDescription', lang)}</p>
          {ministry.youtubeUrl ? (
            <a
              href={ministry.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-[#5fb9e2] hover:bg-[#4aa5d0] text-white font-semibold py-3 px-8 rounded-full transition duration-300"
            >
              {t('ministries.listenNow')}
            </a>
          ) : null}
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003366]">
            {t('ministries.about')}
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src={mediaUrl(ministry.aboutImageUrl || ministry.heroImageUrl)}
                  alt={localized(ministry, 'name', lang)}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-gray-700 mb-4 text-lg">
                  {p}
                </p>
              ))}
              {localized(ministry, 'scheduleLabel', lang) ? (
                <div className="bg-[#5fb9e2] bg-opacity-10 p-6 rounded-lg border-l-4 border-[#003366]">
                  <p className="text-[#003366] font-medium">{localized(ministry, 'scheduleLabel', lang)}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MinistryDetail;
