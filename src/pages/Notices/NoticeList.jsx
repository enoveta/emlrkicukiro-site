import { useMemo, useState } from 'react';
import { FaThumbtack, FaFileDownload, FaWhatsapp } from 'react-icons/fa';
import { mediaUrl } from '../../api/client';
import { formatDate, localized } from '../../i18n/translations';
import { SkeletonCards } from '../../components/ui/Skeleton';
import { isExpired, noticePeriod, sortNotices } from '../../utils/notices';

const TABS = ['today', 'week', 'month', 'earlier'];

const CATEGORY_STYLE = {
  urgent: 'bg-[#9b2c2c] text-white',
  daily: 'bg-amber-100 text-amber-800',
  weekly: 'bg-paper-featured text-gold-text',
  monthly: 'bg-purple-100 text-purple-700',
};

function NoticeCard({ notice, lang, t }) {
  const title = localized(notice, 'title', lang);
  const body = localized(notice, 'body', lang);
  const expired = isExpired(notice);
  const shareText = encodeURIComponent(`${title}\n\n${body}\n\n${window.location.origin}/amatangazo`);

  return (
    <article
      className={`relative bg-white border p-6 md:p-8 ${notice.pinned ? 'border-[#c8b98e]' : 'border-line'} ${expired ? 'opacity-75' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-[0.08em]">
        <time dateTime={notice.publishDate} className="text-[#596c70] mr-1">
          {formatDate(notice.publishDate, lang)}
        </time>
        <span className={`px-2 py-0.5 rounded-full ${CATEGORY_STYLE[notice.category] || CATEGORY_STYLE.weekly}`}>
          {t(`notices.${notice.category}`)}
        </span>
        {notice.pinned ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gold-light text-ink-deep">
            <FaThumbtack className="mr-1" aria-hidden="true" />
            {t('notices.pinned')}
          </span>
        ) : null}
        {expired ? <span className="px-2 py-0.5 rounded-full bg-paper text-muted">{t('notices.expired')}</span> : null}
      </div>
      <h2 className="font-serif text-[1.55rem] md:text-[1.75rem] leading-tight text-ink mb-3">{title}</h2>
      <p className="text-[17px] text-[#435b60] whitespace-pre-line leading-[1.75]">{body}</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-5 pt-4 border-t border-line text-sm">
        {notice.expiresAt && !expired ? (
          <span className="text-muted">{t('notices.validUntil', { date: formatDate(notice.expiresAt, lang) })}</span>
        ) : null}
        {notice.attachmentUrl ? (
          <a
            href={mediaUrl(notice.attachmentUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="small-link"
          >
            <FaFileDownload className="text-gold" aria-hidden="true" />
            {t('notices.download')}
          </a>
        ) : null}
        {!expired ? (
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="small-link"
          >
            <FaWhatsapp className="text-[#2f6b4f]" aria-hidden="true" />
            {t('notices.share')}
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function NoticeList({ data, loading, lang, t }) {
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
    <div className="max-w-[920px]">
      <div role="tablist" aria-label={t('notices.title')} className="flex flex-wrap gap-2 mb-8">
        {TABS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-semibold border transition-colors ${
              activeTab === key ? 'bg-ink border-ink text-white' : 'bg-white border-line text-[#334c51] hover:border-ink/40'
            }`}
          >
            {t(`notices.${key}`)}
            <span className="ml-1.5 opacity-70">({grouped[key].length})</span>
          </button>
        ))}
      </div>

      {loading ? <SkeletonCards count={2} className="h-40" /> : null}
      {!loading && !list.length ? (
        <p className="text-[17px] text-[#596c70] bg-white p-8 border border-line">{t('notices.empty')}</p>
      ) : null}
      <div className="space-y-3.5" role="tabpanel">
        {list.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} lang={lang} t={t} />
        ))}
      </div>
    </div>
  );
}
