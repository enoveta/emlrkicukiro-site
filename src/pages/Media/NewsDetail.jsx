import { Link, useParams } from 'react-router-dom';
import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate, localized } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import usePageMeta from '../../hooks/usePageMeta';
import NotFound from '../NotFound';

function NewsDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { data: newsItems, loading } = usePublicData('/announcements', []);
  const item = (newsItems || []).find((n) => n.id === id);
  const title = localized(item, 'title', lang);
  const content = localized(item, 'content', lang);
  usePageMeta(title || t('news.title'), content, item?.imageUrl);

  if (loading) return <div className="min-h-[60vh]" aria-busy="true" />;
  if (!item) return <NotFound message={t('news.notFound')} />;

  return (
    <article>
      <header className="relative overflow-hidden bg-paper border-b border-line">
        <span className="absolute top-0 right-0 hidden sm:block w-[34%] h-full bg-paper-tint" aria-hidden="true" />
        <div className="site-container relative pt-10 pb-10 md:pt-14 md:pb-14">
          <Link to="/news" className="small-link mb-7">
            <span aria-hidden="true">←</span>
            <span>{t('news.back')}</span>
          </Link>
          <time dateTime={item.date} className="eyebrow mb-4">
            {formatDate(item.date, lang)}
          </time>
          <h1 className="h-display max-w-[900px] text-[2.3rem] sm:text-[2.9rem] lg:text-[3.5rem] leading-[1.06]">{title}</h1>
        </div>
      </header>
      <div className="bg-white">
        <div className="site-container py-10 md:py-16">
          <div className="max-w-[820px]">
            {item.imageUrl ? (
              <div className="relative mb-10 pr-3 pb-3 md:pr-4 md:pb-4">
                <span className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gold-light" aria-hidden="true" />
                <div className="relative aspect-video overflow-hidden bg-[#d5d0c4] shadow-[0_18px_50px_rgba(20,54,66,.12)]">
                  <Img src={item.imageUrl} alt={title} eager className="w-full h-full object-cover" />
                </div>
              </div>
            ) : null}
            {content.split(/\n\s*\n/).map((p, i) => (
              <p
                key={i}
                className={`mb-6 whitespace-pre-line leading-[1.85] ${i === 0 ? 'font-serif text-[1.35rem] md:text-[1.5rem] leading-[1.5] text-ink' : 'text-[17px] text-[#435b60]'}`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default NewsDetail;
