import { Link } from 'react-router-dom';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { formatDate, localized } from '../i18n/translations';
import Img from './ui/Img';

/** News card with image (News page and related lists). */
export const NewsCard = ({ item, lang, t, heading: Heading = 'h3' }) => (
  <Link
    to={`/news/${item.id}`}
    className="group flex flex-col bg-white border border-line overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_17px_35px_rgba(20,54,66,.12)]"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-[#d5d0c4]">
      <Img
        src={item.imageUrl}
        alt={localized(item, 'title', lang)}
        thumb
        width="800"
        height="500"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </div>
    <div className="px-5 pt-5 pb-[18px] md:px-6 flex flex-col flex-1">
      <time dateTime={item.date} className="text-[11px] md:text-xs font-bold uppercase tracking-[0.1em] text-gold-text">
        {formatDate(item.date, lang)}
      </time>
      <Heading className="mt-2 font-serif font-normal text-[1.4rem] md:text-[1.5rem] leading-[1.2] text-ink">
        {localized(item, 'title', lang)}
      </Heading>
      <p className="mt-2.5 text-[15px] leading-[1.6] text-[#53666a] line-clamp-3">{localized(item, 'content', lang)}</p>
      <span className="mt-auto pt-4 inline-flex items-center gap-2 text-[13px] font-bold text-gold-dark">
        {t('home.readMore')}
        <span className="text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
          ↗
        </span>
      </span>
    </div>
  </Link>
);

/** Compact news row: date, serif title, excerpt, arrow. */
export const NewsRow = ({ item, lang }) => (
  <Link
    to={`/news/${item.id}`}
    className="group grid grid-cols-[72px_minmax(0,1fr)_12px] md:grid-cols-[92px_minmax(0,1fr)_14px] items-start gap-2.5 md:gap-3.5 py-4 border-b border-line transition-all duration-200 hover:px-1.5"
  >
    <time dateTime={item.date} className="pt-1 text-[11px] md:text-xs font-bold leading-[1.5] text-[#596c70]">
      {formatDate(item.date, lang)}
    </time>
    <span className="flex min-w-0 flex-col gap-1">
      <strong className="font-serif font-normal text-[1.15rem] md:text-[1.3rem] leading-[1.25] text-ink">{localized(item, 'title', lang)}</strong>
      <span className="text-[13px] md:text-sm leading-[1.55] text-[#596c70] line-clamp-2">{localized(item, 'content', lang)}</span>
    </span>
    <span className="pt-0.5 text-gold-dark text-sm" aria-hidden="true">
      ↗
    </span>
  </Link>
);

/** Home page: news column of the "updates" section. */
export const NewsColumn = () => {
  const { data: newsItems } = usePublicData('/announcements', []);
  const { t, lang } = useLanguage();
  const display = (newsItems || []).slice(0, 3);
  if (!display.length) return null;

  return (
    <div className="min-w-0" id="news">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <p className="eyebrow mb-3.5">{t('home.latestUpdates')}</p>
        <Link to="/news" className="small-link">
          <span>{t('home.viewAllNews')}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <h2 className="h-display text-[2.3rem] md:text-[2.75rem] leading-[1.06] mb-2">{t('news.title')}</h2>
      <div className="mt-4 border-t border-line">
        {display.map((item) => (
          <NewsRow key={item.id} item={item} lang={lang} />
        ))}
      </div>
    </div>
  );
};

export default NewsColumn;
