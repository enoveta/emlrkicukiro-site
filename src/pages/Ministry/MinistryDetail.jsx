import { Link, useParams } from 'react-router-dom';
import { FaYoutube } from 'react-icons/fa';
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

  if (loading) return <div className="min-h-[70vh] bg-paper" aria-busy="true" />;
  if (!ministry) return <NotFound message={t('ministries.notFound')} />;

  const { paragraphs, bullets } = parseBody(localized(ministry, 'body', lang));
  const scheduleLabel = localized(ministry, 'scheduleLabel', lang);
  const heroImage = ministry.heroImageUrl || ministry.aboutImageUrl;
  const designed = /\/media\/dept-/.test(heroImage || '');
  const photo = ministry.aboutImageUrl;
  const meetings = sortByTime((schedule || []).filter((i) => i.ministrySlug === ministry.slug));

  return (
    <div>
      {/* Split hero, like the home page: copy left, framed image right */}
      <section className="relative overflow-hidden bg-paper border-b border-line pt-8 pb-12 md:pt-14 md:pb-16">
        <span
          className="absolute bg-paper-tint left-0 right-0 bottom-0 h-[30%] md:left-auto md:top-0 md:h-full md:w-[43%]"
          aria-hidden="true"
        />
        <div className="site-container relative grid items-center gap-8 md:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] md:gap-10 lg:gap-16">
          <div>
            <Link to="/ministries" className="small-link mb-7">
              <span aria-hidden="true">←</span>
              <span>{t('ministries.back')}</span>
            </Link>
            <p className="eyebrow mb-4">{t('ministries.title')}</p>
            <h1 className="h-display text-[2.6rem] sm:text-[3.1rem] lg:text-[3.9rem] leading-[1.02] mb-4 md:mb-5">{name}</h1>
            {short ? <p className="max-w-[520px] text-base md:text-lg leading-[1.75] text-[#435b60]">{short}</p> : null}
            {ministry.youtubeUrl ? (
              <a href={ministry.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-7">
                <FaYoutube className="text-gold-light text-lg" aria-hidden="true" />
                {t('ministries.listenNow')}
                <span className="text-gold-light" aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : null}
          </div>
          <div className="relative min-w-0 pr-3 pb-3 md:pr-4 md:pb-4">
            <span className="absolute right-0 bottom-0 w-[56%] h-[46%] bg-gold-light" aria-hidden="true" />
            <div className="relative h-[clamp(240px,62vw,360px)] md:h-[400px] lg:h-[460px] overflow-hidden bg-[#d5d0c4] shadow-[0_18px_50px_rgba(20,54,66,.12)]">
              <img
                src={mediaUrl(heroImage)}
                alt=""
                // Designed backgrounds have their symbol at ~72% / 42%: keep it in view on narrow screens
                className={`absolute inset-0 w-full h-full object-cover ${designed ? 'object-[72%_38%]' : ''}`}
                fetchpriority="high"
                decoding="async"
              />
              <span className="absolute -top-8 -right-8 w-[123px] h-[123px] rounded-full border border-gold-light/80" aria-hidden="true" />
              <span className="absolute -top-2.5 -right-2.5 w-[81px] h-[81px] rounded-full border border-gold-light/80" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="eyebrow mb-3">{t('ministries.about')}</p>
            <h2 className="h-section mb-7">{name}</h2>
            {photo && photo !== heroImage ? (
              <div className="aspect-[16/10] overflow-hidden bg-[#d5d0c4] mb-8">
                <Img src={photo} alt={name} className="w-full h-full object-cover" />
              </div>
            ) : null}
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`mb-5 leading-[1.8] ${i === 0 ? 'font-serif text-[1.35rem] md:text-[1.5rem] leading-[1.5] text-ink' : 'text-[17px] text-[#435b60]'}`}
              >
                {p}
              </p>
            ))}
            {scheduleLabel ? (
              <p className="mt-4 bg-paper-featured px-5 py-4 text-[17px] font-semibold text-ink">{scheduleLabel}</p>
            ) : null}
          </div>

          <aside className="space-y-4 self-start">
            {bullets.length ? (
              <div className="bg-paper-card border border-line p-6 md:p-7">
                <p className="eyebrow mb-4">{t('ministries.whatWeDo')}</p>
                <ul className="border-t border-line">
                  {bullets.map((b, i) => (
                    <li key={b} className="flex items-start gap-3.5 py-3.5 border-b border-line text-[16px] leading-snug text-ink">
                      <span className="font-serif text-gold min-w-[1.6rem]">{String(i + 1).padStart(2, '0')}</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {meetings.length ? (
              <div className="bg-ink text-white p-6 md:p-7">
                <p className="eyebrow eyebrow-light mb-4">{t('ministries.when')}</p>
                <ul className="divide-y divide-white/[.12]">
                  {meetings.map((m) => (
                    <li key={m.id} className="py-3.5 first:pt-0 last:pb-0">
                      <p className="font-serif text-[1.2rem] leading-snug">{localized(m, 'title', lang)}</p>
                      <p className="text-sm text-[#c6d0cf] mt-1 tabular-nums">
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

      <section className="py-12 md:py-16 bg-ink-deep text-white">
        <div className="site-container flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <p className="eyebrow eyebrow-light mb-3">{name}</p>
            <h2 className="font-serif text-[2.2rem] md:text-[2.8rem] leading-[1.06] mb-2">{t('ministries.joinTitle')}</h2>
            <p className="max-w-xl text-[16px] text-[#c6d0cf]">{t('ministries.joinText')}</p>
          </div>
          <div className="flex flex-none flex-wrap gap-2.5">
            <Link to="/volunteer" className="btn btn-light">
              {t('ministries.serve')}
              <span aria-hidden="true">↗</span>
            </Link>
            {ministry.slug === 'prayer-ministry' ? (
              <Link to="/prayer-requests" className="btn btn-outline-light">
                {t('ministries.prayer')}
              </Link>
            ) : null}
            <Link to="/amatangazo" className="btn btn-outline-light">
              {t('ministries.programme')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MinistryDetail;
