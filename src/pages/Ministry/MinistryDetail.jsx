import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaYoutube } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import usePageMeta from '../../hooks/usePageMeta';
import NotFound from '../NotFound';

function MinistryDetail() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  // Uses the shared ministries list (cached + bundled), so the page works even when the API is down.
  const { data: ministries, loading } = usePublicData('/ministries', []);
  const ministry = (ministries || []).find((m) => m.slug === slug);
  const name = localized(ministry, 'name', lang);
  const short = localized(ministry, 'shortDescription', lang);
  usePageMeta(name || t('ministries.title'), short, ministry?.heroImageUrl);

  if (loading) return <div className="min-h-[70vh] bg-[#001d3a] -mt-24 md:-mt-[9.5rem]" aria-busy="true" />;
  if (!ministry) return <NotFound message={t('ministries.notFound')} />;

  const paragraphs = (localized(ministry, 'body', lang) || '').split(/\n\s*\n/).filter(Boolean);
  const schedule = localized(ministry, 'scheduleLabel', lang);
  const heroImage = ministry.heroImageUrl || ministry.aboutImageUrl;

  return (
    <div className="-mt-24 md:-mt-[9.5rem]">
      <section className="relative h-[70vh] min-h-[460px] flex items-end overflow-hidden bg-[#001d3a]">
        <img
          src={mediaUrl(heroImage)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
        {/* Bottom overlay so the title and text stay readable on any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001d3a] via-[#001d3a]/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pb-12 md:pb-16 text-white">
          <Link to="/ministries" className="inline-flex items-center text-sm text-white/80 hover:text-[#feed17] mb-4">
            <FaArrowLeft className="mr-2" aria-hidden="true" />
            {t('ministries.back')}
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl">{name}</h1>
          {short ? <p className="text-lg md:text-2xl text-white/90 max-w-3xl">{short}</p> : null}
          {ministry.youtubeUrl ? (
            <a
              href={ministry.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-6 bg-[#feed17] hover:bg-white text-[#001d3a] font-semibold py-3 px-7 rounded-full transition-colors"
            >
              <FaYoutube className="mr-2" aria-hidden="true" />
              {t('ministries.listenNow')}
            </a>
          ) : null}
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 w-full">
            <div className="rounded-xl overflow-hidden shadow-lg aspect-[4/3]">
              <Img src={ministry.aboutImageUrl || heroImage} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-[#003366]">
              {t('ministries.about')} {name}
            </h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="text-gray-700 mb-4 text-lg leading-relaxed">
                {p}
              </p>
            ))}
            {schedule ? (
              <div className="mt-6 bg-[#e8f5fb] p-5 rounded-lg border-l-4 border-[#003366]">
                <p className="text-[#003366] font-medium">{schedule}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MinistryDetail;
