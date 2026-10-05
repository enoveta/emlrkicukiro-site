import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { Skeleton, StatusPill } from '../ui/StatusPill';

const QUICK = [
  { to: '/admin/hero', title: 'Home slides', desc: 'Edit hero carousel media & CTAs', tone: 'from-[#001d3a] to-[#0a4a7a]' },
  { to: '/admin/media', title: 'Media library', desc: 'Upload images & videos once, reuse everywhere', tone: 'from-[#0d7377] to-[#14919b]' },
  { to: '/admin/schedule', title: 'Weekly programme', desc: 'Services, prayer, choir practice — days & hours', tone: 'from-[#0f766e] to-[#115e59]' },
  { to: '/admin/notices', title: 'Amatangazo', desc: 'Weekly / daily church announcements', tone: 'from-[#b45309] to-[#92400e]' },
  { to: '/admin/events', title: 'Events (Ibikorwa)', desc: 'Upcoming church events', tone: 'from-[#5fb9e2] to-[#3a9bc4]' },
  { to: '/admin/announcements', title: 'News (Amakuru)', desc: 'News stories with photos', tone: 'from-[#c9a227] to-[#a8871c]' },
  { to: '/admin/ministries', title: 'Ministries', desc: 'Pages & home featured cards', tone: 'from-[#1f4e79] to-[#2e6da4]' },
  { to: '/admin/submissions', title: 'Inbox', desc: 'Prayer & volunteer requests', tone: 'from-[#7c3aed] to-[#6d28d9]' },
];

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#001d3a] tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Live overview of website content and incoming requests.</p>
        </div>
        <Link
          to="/admin/hero"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#001d3a] text-white text-sm font-medium hover:bg-[#5fb9e2] transition"
        >
          Manage home slides
        </Link>
      </div>

      {error ? <p className="text-red-600 text-sm">{error}</p> : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <StatCard label="Published items" value={publishedTotal} hint="Live on website" />
            <StatCard label="Drafts" value={draftTotal} hint="Not published yet" />
            <StatCard label="New prayers" value={data?.inbox?.prayerNew || 0} hint={`${data?.inbox?.prayerTotal || 0} total`} />
            <StatCard label="New volunteers" value={data?.inbox?.volunteerNew || 0} hint={`${data?.inbox?.volunteerTotal || 0} total`} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {QUICK.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`rounded-2xl p-5 text-white bg-gradient-to-br ${item.tone} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition`}
          >
            <div className="text-lg font-semibold">{item.title}</div>
            <p className="text-sm text-white/80 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#001d3a]">Content health</h2>
          </div>
          {loading ? (
            <Skeleton className="h-40" />
          ) : (
            <div className="space-y-3">
              {Object.entries(data?.content || {}).map(([key, counts]) => (
                <div key={key} className="flex items-center justify-between gap-3 text-sm">
                  <span className="capitalize text-slate-700">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 text-xs">{counts.PUBLISHED} live</span>
                    <span className="text-slate-400 text-xs">{counts.DRAFT} draft</span>
                    <span className="text-amber-700 text-xs">{counts.IN_REVIEW} review</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#001d3a]">Recent inbox</h2>
            <Link to="/admin/submissions" className="text-sm text-[#5fb9e2] hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <Skeleton className="h-40" />
          ) : (
            <div className="space-y-3">
              {(data?.recent?.prayers || []).slice(0, 3).map((item) => (
                <div key={item.id} className="border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm text-[#001d3a]">{item.name}</div>
                    <StatusPill status={item.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.request}</p>
                </div>
              ))}
              {(data?.recent?.volunteers || []).slice(0, 2).map((item) => (
                <div key={item.id} className="border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm text-[#001d3a]">{item.name} · Volunteer</div>
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

function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-3xl font-bold text-[#001d3a] mt-2">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{hint}</div>
    </div>
  );
}
