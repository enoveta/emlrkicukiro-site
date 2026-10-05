import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
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
    <article className="py-12 md:py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/news" className="inline-flex items-center text-sm text-[#1a6f99] hover:text-[#003366] mb-6">
          <FaArrowLeft className="mr-2" aria-hidden="true" />
          {t('news.back')}
        </Link>
        <time dateTime={item.date} className="block text-sm font-semibold text-gray-500 mb-2">
          {formatDate(item.date, lang)}
        </time>
        <h1 className="text-3xl md:text-4xl font-bold text-[#001d3a] mb-8 leading-tight">{title}</h1>
        {item.imageUrl ? (
          <div className="rounded-xl overflow-hidden shadow-lg mb-8 aspect-video">
            <Img src={item.imageUrl} alt={title} eager className="w-full h-full object-cover" />
          </div>
        ) : null}
        {content.split(/\n\s*\n/).map((p, i) => (
          <p key={i} className="text-lg text-gray-700 leading-relaxed mb-5 whitespace-pre-line">
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}

export default NewsDetail;
