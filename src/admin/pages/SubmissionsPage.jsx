import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { StatusPill, Skeleton } from '../ui/StatusPill';
import { FiArchive, FiCheck, FiMail, FiPhone, FiHeart, FiUserPlus } from 'react-icons/fi';
import { useToast } from '../ui/Toast';
import { PageHeader, Segmented, EmptyState, ErrorNote } from '../ui/kit';

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

  const list = tab === 'prayers' ? prayers : volunteers;
  const type = tab === 'prayers' ? 'prayer-requests' : 'volunteers';
  const when = (d) =>
    new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <PageHeader
        title="Inbox"
        description="Prayer requests and volunteer applications sent from the website."
        actions={
          <Segmented
            label="Inbox"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'prayers', label: 'Prayer requests', count: prayers.filter((p) => p.status === 'NEW').length },
              { value: 'volunteers', label: 'Volunteers', count: volunteers.filter((p) => p.status === 'NEW').length },
            ]}
          />
        }
      />

      <ErrorNote>{error}</ErrorNote>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : list.length === 0 ? (
        <div className="a-card">
          <EmptyState
            icon={tab === 'prayers' ? FiHeart : FiUserPlus}
            title={tab === 'prayers' ? 'No prayer requests yet' : 'No volunteer applications yet'}
            text="New messages from the website will appear here."
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((item) => (
            <li key={item.id} className={`a-card p-5 ${item.status === 'NEW' ? 'border-l-[3px] border-l-gold' : ''}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#f3efe6] text-sm font-bold text-gold-dark">
                    {(item.name || '?').slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{item.name}</p>
                      <StatusPill status={item.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#7b8a8c]">
                      {item.email ? (
                        <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                          <FiMail aria-hidden="true" /> {item.email}
                        </a>
                      ) : null}
                      {item.phone ? (
                        <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                          <FiPhone aria-hidden="true" /> {item.phone}
                        </a>
                      ) : null}
                      <span>{when(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-none gap-1.5 sm:pl-4">
                  {item.status !== 'READ' ? (
                    <button type="button" onClick={() => setStatus(type, item.id, 'READ')} className="a-btn a-btn-secondary a-btn-sm">
                      <FiCheck aria-hidden="true" /> Mark read
                    </button>
                  ) : null}
                  {item.status !== 'ARCHIVED' ? (
                    <button type="button" onClick={() => setStatus(type, item.id, 'ARCHIVED')} className="a-btn a-btn-ghost a-btn-sm">
                      <FiArchive aria-hidden="true" /> Archive
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-[#faf9f6] px-4 py-3 text-sm leading-relaxed text-[#334c51] sm:ml-[52px]">
                {tab === 'prayers' ? (
                  <p className="whitespace-pre-wrap">{item.request}</p>
                ) : (
                  <>
                    <p>
                      <span className="font-semibold text-ink">Area of interest:</span> {item.areaOfInterest}
                    </p>
                    {item.message ? <p className="mt-1 whitespace-pre-wrap">{item.message}</p> : null}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
