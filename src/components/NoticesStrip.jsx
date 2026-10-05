import { Link } from 'react-router-dom';
import { FaBullhorn, FaArrowRight, FaClock } from 'react-icons/fa';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDate, localized } from '../i18n/translations';
import { isExpired, sortNotices } from '../utils/notices';
import { DAY_NAMES, formatTime, occursOn, sameDay, sortByTime, styleFor } from '../utils/schedule';

/** The next few programme activities over the coming 7 days. */
const upcomingActivities = (items, count = 4) => {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const out = [];
  for (let offset = 0; offset < 7 && out.length < count; offset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    for (const item of sortByTime(items.filter((i) => occursOn(i, day)))) {
      const [h, m] = item.startTime.split(':').map(Number);
      if (offset === 0 && h * 60 + m < nowMin) continue;
      out.push({ item, day });
      if (out.length >= count) break;
    }
  }
  return out;
};

/** Home page: what is coming up this week + the most important current announcements. */
const NoticesStrip = () => {
  const { data: notices } = usePublicData('/notices', []);
  const { data: schedule } = usePublicData('/schedule', []);
  const { t, lang } = useLanguage();
  const current = sortNotices((notices || []).filter((n) => !isExpired(n))).slice(0, 2);
  const upcoming = upcomingActivities(schedule || []);
  if (!current.length && !upcoming.length) return null;
  const today = new Date();

  return (
    <section className="py-14 bg-[#001d3a]" aria-labelledby="home-notices">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <h2 id="home-notices" className="flex items-center text-2xl md:text-3xl font-bold text-white">
            <FaBullhorn className="mr-3 text-[#feed17]" aria-hidden="true" />
            {t('home.noticesTitle')}
          </h2>
          <Link to="/amatangazo" className="inline-flex items-center text-[#feed17] font-medium hover:text-white">
            {t('home.allNotices')}
            <FaArrowRight className="ml-2" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {upcoming.length ? (
            <ul className="lg:col-span-3 bg-white/5 border border-white/10 rounded-xl divide-y divide-white/10">
              {upcoming.map(({ item, day }) => (
                <li key={`${item.id}-${day.toDateString()}`} className="flex items-center gap-4 p-4">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${styleFor(item.category).dot} ring-2 ring-white/30`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white truncate">{localized(item, 'title', lang)}</p>
                    <p className="text-sm text-white/70">{t(`schedule.categories.${item.category}`)}</p>
                  </div>
                  <div className="text-right text-sm shrink-0">
                    <p className={`font-semibold ${sameDay(day, today) ? 'text-[#feed17]' : 'text-white'}`}>
                      {sameDay(day, today) ? t('schedule.today') : DAY_NAMES[lang][day.getDay()]}
                    </p>
                    <p className="text-white/70 inline-flex items-center">
                      <FaClock className="mr-1" aria-hidden="true" />
                      {formatTime(item.startTime, lang)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          <div className={`${upcoming.length ? 'lg:col-span-2' : 'lg:col-span-5 grid md:grid-cols-2 gap-6'} space-y-4 lg:space-y-6`}>
            {current.map((n) => (
              <Link
                key={n.id}
                to="/amatangazo?view=notices"
                className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="text-white/70">{formatDate(n.publishDate, lang)}</span>
                  {n.category === 'urgent' ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-semibold">{t('notices.urgent')}</span>
                  ) : null}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{localized(n, 'title', lang)}</h3>
                <p className="text-white/75 text-sm line-clamp-2">{localized(n, 'body', lang)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticesStrip;
