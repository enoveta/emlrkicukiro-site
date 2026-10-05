import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaYoutube, FaCheckCircle, FaClock } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import { DAY_NAMES, WEEK_ORDER, daysOf, sortByTime } from '../../utils/schedule';
import Img from '../../components/ui/Img';
import usePageMeta from '../../hooks/usePageMeta';
import NotFound from '../NotFound';

/** Body text: paragraphs separated by a blank line; lines starting with "- " form the "What we do" list. */
const parseBody = (text = '') => {
  const lines = text.split('\n');
  const bullets = lines.filter((l) => /^\s*[-•]\s+/.test(l)).map((l) => l.replace(/^\s*[-•]\s+/, '').trim());
  const paragraphs = lines
    .filter((l) => !/^\s*[-•]\s+/.test(l))
    .join('\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { paragraphs, bullets };
};

const dayLabel = (days, lang) => {
  const set = [...days].sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
  if (set.length === 6 && !set.includes(0)) return `${DAY_NAMES[lang][1]} - ${DAY_NAMES[lang][6]}`;
  if (set.length === 7) return lang === 'rw' ? 'Buri munsi' : 'Every day';
  return set.map((d) => DAY_NAMES[lang][d]).join(', ');
};

function MinistryDetail() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  // Uses the shared lists (cached + bundled), so the page works even when the API is down.
  const { data: ministries, loading } = usePublicData('/ministries', []);
  const { data: schedule } = usePublicData('/schedule', []);
  const ministry = (ministries || []).find((m) => m.slug === slug);
  const name = localized(ministry, 'name', lang);
  const short = localized(ministry, 'shortDescription', lang);
  usePageMeta(name || t('ministries.title'), short, ministry?.heroImageUrl);

  if (loading) return <div className="min-h-[70vh] bg-[#001d3a] -mt-24 md:-mt-[9.5rem]" aria-busy="true" />;
  if (!ministry) return <NotFound message={t('ministries.notFound')} />;

  const { paragraphs, bullets } = parseBody(localized(ministry, 'body', lang));
  const scheduleLabel = localized(ministry, 'scheduleLabel', lang);
  const heroImage = ministry.heroImageUrl || ministry.aboutImageUrl;
  const photo = ministry.aboutImageUrl;
  const meetings = sortByTime((schedule || []).filter((i) => i.ministrySlug === ministry.slug));

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
        {/* Bottom overlay so the title and text stay readable on any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001d3a] via-[#001d3a]/55 to-transparent" />
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

      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#003366]">
              {t('ministries.about')} {name}
            </h2>
            {photo ? (
              <div className="rounded-xl overflow-hidden shadow-lg aspect-[16/10] mb-8">
                <Img src={photo} alt={name} className="w-full h-full object-cover" />
              </div>
            ) : null}
            {paragraphs.map((p, i) => (
              <p key={i} className="text-gray-700 mb-5 text-lg leading-relaxed">
                {p}
              </p>
            ))}
            {scheduleLabel ? (
              <p className="mt-2 bg-[#e8f5fb] p-4 rounded-lg text-[#003366] font-medium">{scheduleLabel}</p>
            ) : null}
          </div>

          <aside className="lg:col-span-2 space-y-6">
            {bullets.length ? (
              <div className="rounded-2xl bg-[#f4f8fb] border border-[#dbe7f0] p-6">
                <h3 className="text-xl font-bold text-[#003366] mb-4">{t('ministries.whatWeDo')}</h3>
                <ul className="space-y-3">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-gray-700">
                      <FaCheckCircle className="mt-1 text-[#1a6f99] shrink-0" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {meetings.length ? (
              <div className="rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-[#003366] mb-4">{t('ministries.when')}</h3>
                <ul className="divide-y divide-gray-100">
                  {meetings.map((m) => (
                    <li key={m.id} className="py-3 first:pt-0 last:pb-0">
                      <p className="font-semibold text-[#001d3a]">{localized(m, 'title', lang)}</p>
                      <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <FaClock className="text-gray-400" aria-hidden="true" />
                        {dayLabel(daysOf(m), lang)} · {m.startTime}
                        {m.endTime ? ` - ${m.endTime}` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="px-4 pb-16 bg-white">
        <div className="max-w-6xl mx-auto rounded-2xl bg-[#003366] text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('ministries.joinTitle')}</h2>
            <p className="text-white/80 max-w-xl">{t('ministries.joinText')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/volunteer" className="px-6 py-3 rounded-lg bg-[#feed17] text-[#001d3a] font-semibold hover:bg-white">
              {t('ministries.serve')}
            </Link>
            {ministry.slug === 'prayer-ministry' ? (
              <Link to="/prayer-requests" className="px-6 py-3 rounded-lg border border-white font-semibold hover:bg-white hover:text-[#001d3a]">
                {t('ministries.prayer')}
              </Link>
            ) : null}
            <Link to="/amatangazo" className="px-6 py-3 rounded-lg border border-white font-semibold hover:bg-white hover:text-[#001d3a]">
              {t('ministries.programme')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MinistryDetail;
