import { useEffect, useMemo, useState } from 'react';
import { FiUploadCloud, FiX, FiFileText } from 'react-icons/fi';
import { adminApi, mediaThumb, mediaUrl } from '../../api/client';
import { SearchInput, EmptyState } from './kit';

export default function MediaPicker({ open, onClose, onSelect, accept = 'all' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.listMedia();
      setItems(data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const filtered = useMemo(() => {
    return (items || []).filter((item) => {
      if (accept === 'image' && item.type !== 'image') return false;
      if (accept === 'video' && item.type !== 'video') return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q.toLowerCase());
    });
  }, [items, q, accept]);

  if (!open) return null;

  const onUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      if (files.length === 1) {
        const result = await adminApi.upload(files[0]);
        await load();
        onSelect(mediaUrl(result.url));
        onClose();
      } else {
        await adminApi.uploadMany(files);
        await load();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-ui fixed inset-0 z-[90] flex items-center justify-center bg-ink-deep/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Media library">
        <div className="flex items-center justify-between gap-3 border-b border-[#f0ede6] px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-ink">Choose media</h3>
            <p className="text-xs text-[#7b8a8c]">Pick a file from the library or upload a new one</p>
          </div>
          <button type="button" onClick={onClose} className="a-icon-btn" aria-label="Close">
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-[#f0ede6] bg-[#faf9f6] px-5 py-3">
          <SearchInput value={q} onChange={setQ} placeholder="Search media…" className="min-w-[200px] flex-1" />
          <label className={`a-btn a-btn-primary cursor-pointer ${uploading ? 'opacity-60' : ''}`}>
            <FiUploadCloud aria-hidden="true" />
            {uploading ? 'Uploading…' : 'Upload'}
            <input type="file" accept="image/*,video/*,application/pdf" multiple className="hidden" disabled={uploading} onChange={(e) => onUpload(e.target.files)} />
          </label>
        </div>

        <div className="overflow-y-auto p-5">
          {error ? <p className="mb-3 text-sm text-[#b42318]">{error}</p> : null}
          {loading ? <p className="text-sm text-[#7b8a8c]">Loading media…</p> : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((item) => (
              <button
                key={item.url}
                type="button"
                onClick={() => {
                  onSelect(mediaUrl(item.url));
                  onClose();
                }}
                className="group overflow-hidden rounded-lg border border-[#efebe3] bg-white text-left transition hover:border-gold hover:shadow-[0_8px_24px_rgba(20,54,66,.10)] focus-visible:border-gold"
              >
                <div className="relative aspect-square bg-[#f3f1ec]">
                  {item.type === 'video' ? (
                    <video src={mediaUrl(item.url)} className="h-full w-full object-cover" muted preload="metadata" />
                  ) : item.type === 'document' ? (
                    <div className="flex h-full w-full items-center justify-center text-3xl text-[#b42318]">
                      <FiFileText aria-hidden="true" />
                    </div>
                  ) : (
                    <img src={mediaThumb(item.url)} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-ink/75 px-2 py-0.5 text-[10px] font-semibold capitalize text-white">{item.type}</span>
                  <span className="absolute inset-0 bg-gold/0 transition-colors group-hover:bg-gold/10" aria-hidden="true" />
                </div>
                <p className="truncate px-2.5 py-2 text-xs font-medium text-[#334c51]">{item.name}</p>
              </button>
            ))}
          </div>
          {!loading && filtered.length === 0 ? <EmptyState title="No media found" text="Upload a file to get started." /> : null}
        </div>
      </div>
    </div>
  );
}
