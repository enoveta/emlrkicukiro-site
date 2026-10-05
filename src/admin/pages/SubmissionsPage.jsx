import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { StatusPill, Skeleton } from '../ui/StatusPill';
import { useToast } from '../ui/Toast';

export default function SubmissionsPage() {
  const { push } = useToast();
  const [prayers, setPrayers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('prayers');

  const load = async () => {
    setLoading(true);
    try {
      const [p, v] = await Promise.all([
        adminApi.get('/submissions/prayer-requests', { cache: false }),
        adminApi.get('/submissions/volunteers', { cache: false }),
      ]);
      setPrayers(p);
      setVolunteers(v);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (type, id, status) => {
    try {
      await adminApi.patch(`/submissions/${type}/${id}`, { status });
      push('Updated');
      await load();
    } catch (err) {
      push(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#001d3a]">Inbox</h1>
        <p className="text-slate-500 mt-1">Prayer requests and volunteer applications from the website</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('prayers')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === 'prayers' ? 'bg-[#001d3a] text-white' : 'bg-white border border-slate-200'}`}
        >
          Prayers ({prayers.filter((p) => p.status === 'NEW').length} new)
        </button>
        <button
          type="button"
          onClick={() => setTab('volunteers')}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${tab === 'volunteers' ? 'bg-[#001d3a] text-white' : 'bg-white border border-slate-200'}`}
        >
          Volunteers ({volunteers.filter((p) => p.status === 'NEW').length} new)
        </button>
      </div>

      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      {loading ? <Skeleton className="h-48" /> : null}

      {!loading && tab === 'prayers' ? (
        <div className="space-y-3">
          {prayers.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#001d3a]">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.email} · {new Date(item.createdAt).toLocaleString()}</div>
                </div>
                <StatusPill status={item.status} />
              </div>
              <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap">{item.request}</p>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => setStatus('prayer-requests', item.id, 'READ')} className="text-sm px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800">
                  Mark read
                </button>
                <button type="button" onClick={() => setStatus('prayer-requests', item.id, 'ARCHIVED')} className="text-sm px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  Archive
                </button>
              </div>
            </div>
          ))}
          {prayers.length === 0 ? <p className="text-slate-500 text-sm">No prayer requests yet.</p> : null}
        </div>
      ) : null}

      {!loading && tab === 'volunteers' ? (
        <div className="space-y-3">
          {volunteers.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#001d3a]">{item.name}</div>
                  <div className="text-xs text-slate-500">
                    {item.email} · {item.phone} · {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <StatusPill status={item.status} />
              </div>
              <p className="text-sm text-slate-700 mt-3">Interest: {item.areaOfInterest}</p>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => setStatus('volunteers', item.id, 'READ')} className="text-sm px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800">
                  Mark read
                </button>
                <button type="button" onClick={() => setStatus('volunteers', item.id, 'ARCHIVED')} className="text-sm px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  Archive
                </button>
              </div>
            </div>
          ))}
          {volunteers.length === 0 ? <p className="text-slate-500 text-sm">No volunteer applications yet.</p> : null}
        </div>
      ) : null}
    </div>
  );
}
