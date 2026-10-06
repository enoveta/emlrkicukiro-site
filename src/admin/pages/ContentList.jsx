import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, mediaUrl } from '../../api/client';
import { RESOURCE_CONFIG } from '../resourceConfig';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiSend, FiImage } from 'react-icons/fi';
import { StatusPill, Skeleton } from '../ui/StatusPill';
import { PageHeader, Segmented, SearchInput, EmptyState, ErrorNote } from '../ui/kit';
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

  const counts = useMemo(() => {
    const c = { ALL: items.length, PUBLISHED: 0, DRAFT: 0, IN_REVIEW: 0 };
    items.forEach((i) => {
      if (c[i.status] !== undefined) c[i.status] += 1;
    });
    return c;
  }, [items]);

  const updated = (value) =>
    value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  return (
    <div>
      <PageHeader
        title={cfg.label}
        description={cfg.description || 'Manage and publish content'}
        actions={
          <Link to={`/admin/${resourceKey}/new`} className="a-btn a-btn-primary">
            <FiPlus aria-hidden="true" /> Add new
          </Link>
        }
      />

      <ErrorNote>{error}</ErrorNote>

      <div className="a-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#f0ede6] p-4 md:flex-row md:items-center md:justify-between">
          <Segmented
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'ALL', label: 'All', count: counts.ALL },
              { value: 'PUBLISHED', label: 'Published', count: counts.PUBLISHED },
              { value: 'DRAFT', label: 'Drafts', count: counts.DRAFT },
              { value: 'IN_REVIEW', label: 'In review', count: counts.IN_REVIEW },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder={`Search ${cfg.label.toLowerCase()}…`} className="md:w-72" />
        </div>

        {loading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={q || status !== 'ALL' ? 'Nothing matches' : `No ${cfg.label.toLowerCase()} yet`}
            text={q || status !== 'ALL' ? 'Try another search or filter.' : 'Create the first one; it stays a draft until you publish it.'}
            action={
              <Link to={`/admin/${resourceKey}/new`} className="a-btn a-btn-primary">
                <FiPlus aria-hidden="true" /> Add new
              </Link>
            }
          />
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(0,1fr)_130px_130px_200px] gap-4 border-b border-[#f0ede6] bg-[#faf9f6] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a979a] md:grid">
              <span>Item</span>
              <span>Status</span>
              <span>Updated</span>
              <span className="text-right">Actions</span>
            </div>
            <ul className="divide-y divide-[#f0ede6]">
              {filtered.map((item) => {
                const title = item[cfg.titleField] || item.id;
                const image = item.imageUrl || item.heroImageUrl || item.aboutImageUrl || null;
                return (
                  <li
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 px-4 py-3.5 transition-colors hover:bg-[#fcfbf8] md:grid-cols-[minmax(0,1fr)_130px_130px_200px] md:gap-4 md:px-5"
                  >
                    <Link to={`/admin/${resourceKey}/${item.id}`} className="col-span-2 flex min-w-0 items-center gap-3.5 md:col-span-1">
                      {cfg.noMedia ? null : image ? (
                        <img src={mediaUrl(image)} alt="" className="h-12 w-16 flex-none rounded-lg border border-[#efebe3] bg-[#f3f1ec] object-cover" />
                      ) : (
                        <span className="grid h-12 w-16 flex-none place-items-center rounded-lg bg-[#f3f1ec] text-[#b6bfbf]">
                          <FiImage aria-hidden="true" />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold text-ink hover:text-gold-dark">{title}</span>
                        {cfg.subtitle ? <span className="mt-0.5 block truncate text-[13px] text-[#7b8a8c]">{cfg.subtitle(item)}</span> : null}
                      </span>
                    </Link>
                    <div className="flex items-center gap-3 md:block">
                      <StatusPill status={item.status} />
                      <span className="hidden text-xs text-[#9aa6a7] sm:inline md:hidden">Updated {updated(item.updatedAt)}</span>
                    </div>
                    <span className="hidden text-[13px] text-[#66777a] md:block">{updated(item.updatedAt)}</span>
                    <div className="flex items-center gap-1 md:justify-end">
                      {item.status === 'DRAFT' ? (
                        <button type="button" onClick={() => runAction(item.id, 'request-review')} className="a-btn a-btn-ghost a-btn-sm" title="Send for review">
                          <FiSend aria-hidden="true" /> Review
                        </button>
                      ) : null}
                      {item.status !== 'PUBLISHED' ? (
                        <button type="button" onClick={() => runAction(item.id, 'publish')} className="a-btn a-btn-sm bg-[#ecfdf3] text-[#067647] hover:bg-[#dcfae6]">
                          <FiCheck aria-hidden="true" /> Publish
                        </button>
                      ) : null}
                      <Link to={`/admin/${resourceKey}/${item.id}`} className="a-icon-btn" aria-label="Edit" title="Edit">
                        <FiEdit2 aria-hidden="true" />
                      </Link>
                      <button type="button" onClick={() => runAction(item.id, 'delete')} className="a-icon-btn hover:!bg-[#fef3f2] hover:!text-[#b42318]" aria-label="Delete" title="Delete">
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-[#f0ede6] px-5 py-3 text-xs text-[#8a979a]">
              Showing {filtered.length} of {items.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
