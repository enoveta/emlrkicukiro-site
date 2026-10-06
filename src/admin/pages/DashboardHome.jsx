import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { FiEye, FiUsers, FiHeart, FiUserPlus, FiImage, FiFolder, FiClock, FiBell, FiCalendar, FiFileText, FiGrid, FiInbox, FiArrowRight } from 'react-icons/fi';
import { Skeleton, StatusPill } from '../ui/StatusPill';
import { PageHeader, Card, Segmented, ErrorNote, EmptyState } from '../ui/kit';
import { BarList, SERIES, ShareBar, StatTile, TrendChart } from '../charts/Charts';

const PERIODS = [7, 30, 90];

/** Friendly names for website paths in the "Top pages" list. */
const PAGE_NAMES = {
  '/': 'Home',
  '/amatangazo': 'Amatangazo & programme',
  '/events': 'Events (Ibikorwa)',
  '/news': 'News (Amakuru)',
  '/give': 'Donate',
  '/tv': 'EMLR TV',
  '/gallery': 'Photo gallery',
  '/ministries': 'Ministries',
  '/about': 'About us',
  '/about/location': 'Location & contacts',
  '/about/team': 'Pastoral team',
  '/about/leadership': 'Church structure',
  '/about/mission-vision': 'Mission & vision',
  '/prayer-requests': 'Prayer requests',
  '/volunteer': 'Join us (volunteer)',
};
const pageName = (path) =>
  PAGE_NAMES[path] ||
  (path.startsWith('/ministries/') ? `Ministry: ${path.split('/')[2].replace(/-/g, ' ')}` : path.startsWith('/news/') ? 'News article' : path);

const LANG_COLORS = { en: SERIES[0], rw: SERIES[1] };
const LANG_LABELS = { en: 'English', rw: 'Kinyarwanda' };
const DEVICE_COLORS = { mobile: SERIES[0], desktop: SERIES[1], tablet: SERIES[2] };
const DEVICE_LABELS = { mobile: 'Phone', desktop: 'Computer', tablet: 'Tablet' };

const QUICK = [
  { to: '/admin/notices', title: 'Amatangazo', desc: 'Church announcements', icon: FiBell },
  { to: '/admin/schedule', title: 'Weekly programme', desc: 'Days and hours', icon: FiClock },
  { to: '/admin/events', title: 'Events', desc: 'Ibikorwa', icon: FiCalendar },
  { to: '/admin/announcements', title: 'News', desc: 'Amakuru with photos', icon: FiFileText },
  { to: '/admin/hero', title: 'Home slides', desc: 'Hero images & text', icon: FiImage },
  { to: '/admin/ministries', title: 'Ministries', desc: 'Pages & home cards', icon: FiGrid },
  { to: '/admin/media', title: 'Media library', desc: 'Upload once, reuse', icon: FiFolder },
  { to: '/admin/submissions', title: 'Inbox', desc: 'Prayer & volunteers', icon: FiInbox },
];

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setStatsLoading(true);
    adminApi
      .get(`/analytics?days=${days}`, { cache: false })
      .then((res) => !cancelled && setStats(res))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setStatsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [days]);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .get('/dashboard/summary', { cache: false })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const publishedTotal = data
    ? Object.values(data.content).reduce((sum, item) => sum + (item.PUBLISHED || 0), 0)
    : 0;
  const draftTotal = data
    ? Object.values(data.content).reduce((sum, item) => sum + (item.DRAFT || 0), 0)
    : 0;

  const periodLabel = `${days} days`;
  const series = stats?.daily || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const recent = [
    ...(data?.recent?.prayers || []).slice(0, 4).map((i) => ({ ...i, kind: 'Prayer request', text: i.request })),
    ...(data?.recent?.volunteers || []).slice(0, 3).map((i) => ({ ...i, kind: 'Volunteer', text: i.areaOfInterest })),
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return (
    <div>
      <PageHeader
        title={greeting}
        description="Website visits, requests and content at a glance."
        actions={
          <Segmented
            label="Period"
            value={days}
            onChange={setDays}
            options={PERIODS.map((p) => ({ value: p, label: `${p} days` }))}
          />
        }
      />

      <ErrorNote>{error}</ErrorNote>

      <div className={`space-y-6 transition-opacity ${statsLoading && stats ? 'opacity-60' : ''}`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {!stats ? (
            [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[150px]" />)
          ) : (
            <>
              <StatTile icon={FiEye} label="Page views" value={stats.totals.views} previous={stats.previous.views} trend={series.map((d) => d.views)} periodLabel={periodLabel} />
              <StatTile icon={FiUsers} label="Visitors" value={stats.totals.visitors} previous={stats.previous.visitors} trend={series.map((d) => d.visitors)} periodLabel={periodLabel} />
              <StatTile icon={FiHeart} label="Prayer requests" value={stats.totals.prayers} previous={stats.previous.prayers} trend={series.map((d) => d.prayers)} periodLabel={periodLabel} />
              <StatTile icon={FiUserPlus} label="Volunteers" value={stats.totals.volunteers} previous={stats.previous.volunteers} trend={series.map((d) => d.volunteers)} periodLabel={periodLabel} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card title="Website visits" description={`Per day, last ${periodLabel}`} className="xl:col-span-2">
            {stats ? (
              <TrendChart
                data={series}
                series={[
                  { key: 'views', label: 'Page views', color: SERIES[0] },
                  { key: 'visitors', label: 'Visitors', color: SERIES[1] },
                ]}
              />
            ) : (
              <Skeleton className="h-64" />
            )}
          </Card>
          <Card title="Most visited pages" description="Page views in this period">
            {stats ? (
              <BarList items={(stats.topPages || []).slice(0, 8).map((p) => ({ key: p.key, label: pageName(p.key), count: p.count }))} empty="No visits recorded yet" />
            ) : (
              <Skeleton className="h-64" />
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card title="Language" description="Language visitors read in">
            {stats ? (
              <ShareBar items={(stats.languages || []).map((l) => ({ key: l.key, label: LANG_LABELS[l.key] || l.key, count: l.count }))} colors={LANG_COLORS} empty="No visits recorded yet" />
            ) : (
              <Skeleton className="h-28" />
            )}
          </Card>
          <Card title="Devices" description="What visitors use">
            {stats ? (
              <ShareBar items={(stats.devices || []).map((d) => ({ key: d.key, label: DEVICE_LABELS[d.key] || d.key, count: d.count }))} colors={DEVICE_COLORS} empty="No visits recorded yet" />
            ) : (
              <Skeleton className="h-28" />
            )}
          </Card>
          <Card title="Website content" description="Published and waiting">
            {loading ? (
              <Skeleton className="h-28" />
            ) : (
              <div className="grid grid-cols-3 divide-x divide-[#f0ede6] rounded-lg border border-[#f0ede6]">
                {[
                  ['Published', publishedTotal, 'text-[#067647]'],
                  ['Drafts', draftTotal, 'text-ink'],
                  ['New in inbox', (data?.inbox?.prayerNew || 0) + (data?.inbox?.volunteerNew || 0), 'text-gold-dark'],
                ].map(([label, n, cls]) => (
                  <div key={label} className="px-2 py-5 text-center">
                    <p className={`text-[1.7rem] font-bold leading-none tabular-nums ${cls}`}>{n}</p>
                    <p className="mt-2 text-xs font-medium text-[#7b8a8c]">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="Quick actions" description="Jump to what you update most" className="xl:col-span-2" padded={false}>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-b-xl bg-[#f0ede6] sm:grid-cols-2 lg:grid-cols-4">
            {QUICK.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex items-center gap-3 bg-white p-4 transition-colors hover:bg-[#faf9f6]"
                >
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-[#f3efe6] text-gold transition-colors group-hover:bg-ink group-hover:text-gold-light">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{item.title}</span>
                    <span className="block truncate text-xs text-[#7b8a8c]">{item.desc}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card
          title="Recent inbox"
          padded={false}
          action={
            <Link to="/admin/submissions" className="inline-flex items-center gap-1 text-[13px] font-semibold text-gold-dark hover:text-ink">
              View all <FiArrowRight aria-hidden="true" />
            </Link>
          }
        >
          {loading ? (
            <div className="p-5">
              <Skeleton className="h-40" />
            </div>
          ) : recent.length ? (
            <ul className="divide-y divide-[#f0ede6]">
              {recent.slice(0, 5).map((item) => (
                <li key={`${item.kind}-${item.id}`} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#f3efe6] text-xs font-bold text-gold-dark">
                    {(item.name || '?').slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                      <StatusPill status={item.status} />
                    </div>
                    <p className="text-xs text-[#9aa6a7]">{item.kind}</p>
                    <p className="mt-0.5 line-clamp-1 text-[13px] text-[#66777a]">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No submissions yet" text="Prayer requests and volunteer applications appear here." />
          )}
        </Card>
      </div>
    </div>
  );
}
