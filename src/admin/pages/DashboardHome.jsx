import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { Skeleton, StatusPill } from '../ui/StatusPill';
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

const Card = ({ title, subtitle, children, className = '' }) => (
  <section className={`bg-white rounded-lg border border-slate-200 p-5 md:p-6 ${className}`}>
    <h2 className="font-semibold text-ink">{title}</h2>
    {subtitle ? <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p> : null}
    <div className="mt-5">{children}</div>
  </section>
);

const QUICK = [
  { to: '/admin/hero', title: 'Home slides', desc: 'Edit hero carousel media & CTAs', tone: 'from-ink to-ink-soft' },
  { to: '/admin/media', title: 'Media library', desc: 'Upload images & videos once, reuse everywhere', tone: 'from-ink-deep to-ink' },
  { to: '/admin/schedule', title: 'Weekly programme', desc: 'Services, prayer, choir practice: days & hours', tone: 'from-[#725322] to-gold' },
  { to: '/admin/notices', title: 'Amatangazo', desc: 'Weekly / daily church announcements', tone: 'from-ink to-ink-soft' },
  { to: '/admin/events', title: 'Events (Ibikorwa)', desc: 'Upcoming church events', tone: 'from-ink-deep to-ink' },
  { to: '/admin/announcements', title: 'News (Amakuru)', desc: 'News stories with photos', tone: 'from-[#725322] to-gold' },
  { to: '/admin/ministries', title: 'Ministries', desc: 'Pages & home featured cards', tone: 'from-ink to-ink-soft' },
  { to: '/admin/submissions', title: 'Inbox', desc: 'Prayer & volunteer requests', tone: 'from-ink-deep to-ink' },
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Website visits, requests and content at a glance.</p>
        </div>
        <div className="inline-flex bg-white border border-slate-200 rounded-md p-1 self-start" role="tablist" aria-label="Period">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={days === p}
              onClick={() => setDays(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                days === p ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Last {p} days
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="text-red-600 text-sm">{error}</p> : null}

      <div className={`space-y-6 transition-opacity ${statsLoading && stats ? 'opacity-60' : ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {!stats ? (
            [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36" />)
          ) : (
            <>
              <StatTile label="Page views" value={stats.totals.views} previous={stats.previous.views} trend={series.map((d) => d.views)} periodLabel={periodLabel} />
              <StatTile label="Visitors" value={stats.totals.visitors} previous={stats.previous.visitors} trend={series.map((d) => d.visitors)} periodLabel={periodLabel} />
              <StatTile label="Prayer requests" value={stats.totals.prayers} previous={stats.previous.prayers} trend={series.map((d) => d.prayers)} periodLabel={periodLabel} />
              <StatTile label="Volunteer applications" value={stats.totals.volunteers} previous={stats.previous.volunteers} trend={series.map((d) => d.volunteers)} periodLabel={periodLabel} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card title="Website visits" subtitle={`Per day, last ${periodLabel}`} className="xl:col-span-2">
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
          <Card title="Most visited pages" subtitle="Page views in this period">
            {stats ? (
              <BarList items={(stats.topPages || []).map((p) => ({ key: p.key, label: pageName(p.key), count: p.count }))} empty="No visits recorded yet" />
            ) : (
              <Skeleton className="h-64" />
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="Language" subtitle="Language visitors read in">
            {stats ? (
              <ShareBar items={(stats.languages || []).map((l) => ({ key: l.key, label: LANG_LABELS[l.key] || l.key, count: l.count }))} colors={LANG_COLORS} empty="No visits recorded yet" />
            ) : (
              <Skeleton className="h-28" />
            )}
          </Card>
          <Card title="Devices" subtitle="What visitors use">
            {stats ? (
              <ShareBar items={(stats.devices || []).map((d) => ({ key: d.key, label: DEVICE_LABELS[d.key] || d.key, count: d.count }))} colors={DEVICE_COLORS} empty="No visits recorded yet" />
            ) : (
              <Skeleton className="h-28" />
            )}
          </Card>
          <Card title="Website content" subtitle="Published and waiting">
            {loading ? (
              <Skeleton className="h-28" />
            ) : (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md bg-slate-50 py-4">
                  <p className="text-2xl font-semibold text-ink">{publishedTotal}</p>
                  <p className="text-xs text-slate-500 mt-1">Published</p>
                </div>
                <div className="rounded-md bg-slate-50 py-4">
                  <p className="text-2xl font-semibold text-ink">{draftTotal}</p>
                  <p className="text-xs text-slate-500 mt-1">Drafts</p>
                </div>
                <div className="rounded-md bg-slate-50 py-4">
                  <p className="text-2xl font-semibold text-ink">{(data?.inbox?.prayerNew || 0) + (data?.inbox?.volunteerNew || 0)}</p>
                  <p className="text-xs text-slate-500 mt-1">New in inbox</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {QUICK.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`rounded-lg p-5 text-white bg-gradient-to-br ${item.tone} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition`}
          >
            <div className="text-lg font-semibold">{item.title}</div>
            <p className="text-sm text-white/80 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Recent inbox</h2>
            <Link to="/admin/submissions" className="text-sm text-gold hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <Skeleton className="h-40" />
          ) : (
            <div className="space-y-3">
              {(data?.recent?.prayers || []).slice(0, 3).map((item) => (
                <div key={item.id} className="border border-slate-100 rounded-md p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm text-ink">{item.name}</div>
                    <StatusPill status={item.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.request}</p>
                </div>
              ))}
              {(data?.recent?.volunteers || []).slice(0, 2).map((item) => (
                <div key={item.id} className="border border-slate-100 rounded-md p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm text-ink">{item.name} · Volunteer</div>
                    <StatusPill status={item.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.areaOfInterest}</p>
                </div>
              ))}
              {!data?.recent?.prayers?.length && !data?.recent?.volunteers?.length ? (
                <p className="text-sm text-slate-500">No submissions yet.</p>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
