import { useMemo, useState } from 'react';
import { FaThumbtack, FaFileDownload, FaWhatsapp } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate, localized } from '../../i18n/translations';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';
import { isExpired, noticePeriod, sortNotices } from '../../utils/notices';

const TABS = ['today', 'week', 'month', 'earlier'];

const CATEGORY_STYLE = {
  urgent: 'bg-red-100 text-red-700',
  daily: 'bg-amber-100 text-amber-800',
  weekly: 'bg-[#e8f5fb] text-[#1f6f96]',
  monthly: 'bg-purple-100 text-purple-700',
};

function NoticeCard({ notice, lang, t }) {
  const title = localized(notice, 'title', lang);
  const body = localized(notice, 'body', lang);
  const expired = isExpired(notice);
  const shareText = encodeURIComponent(`${title}\n\n${body}\n\n${window.location.origin}/amatangazo`);

  return (
    <article
      className={`bg-white rounded-xl border p-6 shadow-sm ${
        notice.pinned ? 'border-[#feed17] ring-1 ring-[#feed17]' : 'border-gray-200'
      } ${expired ? 'opacity-75' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-semibold">
        <time dateTime={notice.publishDate} className="text-gray-500">
          {formatDate(notice.publishDate, lang)}
        </time>
        <span className={`px-2 py-0.5 rounded-full ${CATEGORY_STYLE[notice.category] || CATEGORY_STYLE.weekly}`}>
          {t(`notices.${notice.category}`)}
        </span>
        {notice.pinned ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#fff8c2] text-[#6b5d00]">
            <FaThumbtack className="mr-1" aria-hidden="true" />
            {t('notices.pinned')}
          </span>
        ) : null}
        {expired ? <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('notices.expired')}</span> : null}
      </div>
      <h2 className="text-xl font-bold text-[#001d3a] mb-2">{title}</h2>
      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{body}</p>
      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
        {notice.expiresAt && !expired ? (
          <span className="text-gray-500">{t('notices.validUntil', { date: formatDate(notice.expiresAt, lang) })}</span>
        ) : null}
        {notice.attachmentUrl ? (
          <a
            href={mediaUrl(notice.attachmentUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-medium text-[#1a6f99] hover:text-[#003366]"
          >
            <FaFileDownload className="mr-1" aria-hidden="true" />
            {t('notices.download')}
          </a>
        ) : null}
        {!expired ? (
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-medium text-green-700 hover:text-green-900"
          >
            <FaWhatsapp className="mr-1" aria-hidden="true" />
            {t('notices.share')}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function Notices() {
  const { data, loading } = usePublicData('/notices', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('notices.title'), t('notices.subtitle'));

  const grouped = useMemo(() => {
    const now = new Date();
    const out = { today: [], week: [], month: [], earlier: [] };
    for (const n of data || []) out[noticePeriod(n, now)].push(n);
    // "This week" also shows today's notices; "This month" shows the whole month.
    return {
      today: sortNotices(out.today),
      week: sortNotices([...out.today, ...out.week]),
      month: sortNotices([...out.today, ...out.week, ...out.month]),
      earlier: [...out.earlier].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)),
    };
  }, [data]);

  const firstWithContent = TABS.find((k) => grouped[k].length) || 'week';
  const [tab, setTab] = useState(null);
  const activeTab = tab || firstWithContent;
  const list = grouped[activeTab];

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <PageHeader title={t('notices.title')} subtitle={t('notices.subtitle')} />

        <div role="tablist" aria-label={t('notices.title')} className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeTab === key
                  ? 'bg-[#003366] border-[#003366] text-white'
                  : 'bg-white border-gray-300 text-[#003366] hover:border-[#003366]'
              }`}
            >
              {t(`notices.${key}`)}
              <span className="ml-1.5 opacity-70">({grouped[key].length})</span>
            </button>
          ))}
        </div>

        {loading ? <SkeletonCards count={2} className="h-40" /> : null}
        {!loading && !list.length ? (
          <p className="text-center text-gray-600 bg-white rounded-xl p-8 border border-gray-200">{t('notices.empty')}</p>
        ) : null}
        <div className="space-y-5" role="tabpanel">
          {list.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} lang={lang} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notices;
