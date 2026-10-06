import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, mediaUrl } from '../../api/client';
import { RESOURCE_CONFIG } from '../resourceConfig';
import { StatusPill, Skeleton } from '../ui/StatusPill';
import { useToast } from '../ui/Toast';

export default function ContentList({ resourceKey }) {
  const cfg = RESOURCE_CONFIG[resourceKey];
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('ALL');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.get(cfg.path, { cache: false });
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [resourceKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (status !== 'ALL' && item.status !== status) return false;
      if (!q) return true;
      const title = String(item[cfg.titleField] || item.id).toLowerCase();
      return title.includes(q.toLowerCase());
    });
  }, [items, q, status, cfg.titleField]);

  const runAction = async (id, action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm('Delete this item?')) return;
        await adminApi.delete(`${cfg.path}/${id}`);
        push('Deleted');
      } else {
        await adminApi.post(`${cfg.path}/${id}/${action}`, {});
        push(action === 'publish' ? 'Published to website' : 'Status updated');
      }
      await load();
    } catch (err) {
      push(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">{cfg.label}</h1>
          <p className="text-slate-500 mt-1">{cfg.description || 'Manage and publish content'}</p>
        </div>
        <Link
          to={`/admin/${resourceKey}/new`}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-md bg-ink text-white text-sm font-medium hover:bg-ink-soft transition"
        >
          + Add new
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${cfg.label.toLowerCase()}...`}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white min-w-[220px]"
        />
        {['ALL', 'PUBLISHED', 'DRAFT', 'IN_REVIEW'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              status === s ? 'bg-ink text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-auto">{filtered.length} items</span>
      </div>

      {error ? <p className="text-red-600 text-sm">{error}</p> : null}

      {loading ? (
        <div className="grid gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => {
            const title = item[cfg.titleField] || item.id;
            const image =
              item.imageUrl || item.heroImageUrl || item.aboutImageUrl || null;
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-sm transition"
              >
                {cfg.noMedia ? null : image ? (
                  <img src={mediaUrl(image)} alt="" className="w-full md:w-24 h-24 rounded-md object-cover bg-slate-100" />
                ) : (
                  <div className="w-full md:w-24 h-24 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    No media
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink truncate">{title}</h3>
                    <StatusPill status={item.status} />
                  </div>
                  {cfg.subtitle ? <p className="text-sm text-slate-600 mt-1">{cfg.subtitle(item)}</p> : null}
                  <p className="text-xs text-slate-500 mt-1">
                    Updated {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/${resourceKey}/${item.id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  {item.status === 'DRAFT' ? (
                    <button type="button" onClick={() => runAction(item.id, 'request-review')} className="px-3 py-1.5 rounded-lg text-sm bg-amber-50 text-amber-800">
                      Review
                    </button>
                  ) : null}
                  {item.status !== 'PUBLISHED' ? (
                    <button type="button" onClick={() => runAction(item.id, 'publish')} className="px-3 py-1.5 rounded-lg text-sm bg-emerald-50 text-emerald-800">
                      Publish
                    </button>
                  ) : null}
                  <button type="button" onClick={() => runAction(item.id, 'delete')} className="px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No items found. Create your first {cfg.label.toLowerCase().slice(0, -1) || 'item'}.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
