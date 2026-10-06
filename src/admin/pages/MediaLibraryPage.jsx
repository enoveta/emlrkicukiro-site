import { useEffect, useMemo, useState } from 'react';
import { adminApi, mediaThumb, mediaUrl } from '../../api/client';
import { useToast } from '../ui/Toast';
import { FiCopy, FiTrash2, FiUploadCloud, FiFileText, FiPlay } from 'react-icons/fi';
import { Skeleton } from '../ui/StatusPill';
import { PageHeader, Segmented, SearchInput, EmptyState, ErrorNote } from '../ui/kit';

function formatBytes(n) {
  if (!n) return '-';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [dragOver, setDragOver] = useState(false);
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
    load();
  }, []);

  const filtered = useMemo(() => {
    return (items || []).filter((item) => {
      if (filter !== 'all' && item.type !== filter) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q.toLowerCase());
    });
  }, [items, q, filter]);

  const uploadFiles = async (fileList) => {
    const files = [...(fileList || [])];
    if (!files.length) return;
    setUploading(true);
    try {
      if (files.length === 1) await adminApi.upload(files[0]);
      else await adminApi.uploadMany(files);
      push(`${files.length} file(s) uploaded`);
      await load();
    } catch (err) {
      setError(err.message);
      push(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(mediaUrl(url));
      push('Media URL copied');
    } catch {
      push('Could not copy URL', 'error');
    }
  };

  const remove = async (url) => {
    if (!url.startsWith('/media/uploads/')) {
      push('Seed media cannot be deleted from here', 'info');
      return;
    }
    if (!window.confirm('Delete this uploaded file?')) return;
    try {
      await adminApi.deleteMedia(url);
      push('File deleted');
      await load();
    } catch (err) {
      push(err.message, 'error');
    }
  };

  const counts = {
    all: items.length,
    image: items.filter((i) => i.type === 'image').length,
    video: items.filter((i) => i.type === 'video').length,
  };

  return (
    <div>
      <PageHeader
        title="Media library"
        description="Upload once and reuse across slides, news, ministries and the gallery."
        actions={
          <label className={`a-btn a-btn-primary cursor-pointer ${uploading ? 'opacity-60' : ''}`}>
            <FiUploadCloud aria-hidden="true" />
            {uploading ? 'Uploading…' : 'Upload files'}
            <input
              type="file"
              accept="image/*,video/*,application/pdf"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </label>
        }
      />

      <ErrorNote>{error}</ErrorNote>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(e.dataTransfer.files);
        }}
        className={`mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragOver ? 'border-gold bg-[#fbf7ee]' : 'border-[#ddd7ca] bg-white'
        }`}
      >
        <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-[#f3efe6] text-lg text-gold">
          <FiUploadCloud aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-ink">{uploading ? 'Uploading…' : 'Drag and drop files here'}</p>
        <p className="mt-1 text-xs text-[#7b8a8c]">JPG, PNG, WEBP, GIF, MP4 or PDF · up to 40 MB each · images are optimised automatically</p>
      </div>

      <div className="a-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#f0ede6] p-4 md:flex-row md:items-center md:justify-between">
          <Segmented
            label="Type"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All', count: counts.all },
              { value: 'image', label: 'Images', count: counts.image },
              { value: 'video', label: 'Videos', count: counts.video },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Search files…" className="md:w-72" />
        </div>

        <div className="p-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No files found" text="Upload images or videos to use them anywhere on the website." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {filtered.map((item) => (
                <div key={item.url} className="group overflow-hidden rounded-lg border border-[#efebe3] bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(20,54,66,.10)]">
                  <div className="relative aspect-square bg-[#f3f1ec]">
                    {item.type === 'video' ? (
                      <>
                        <video src={mediaUrl(item.url)} className="h-full w-full object-cover" muted preload="metadata" />
                        <span className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-ink/75 text-[10px] text-white">
                          <FiPlay aria-hidden="true" />
                        </span>
                      </>
                    ) : item.type === 'document' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[#b42318]">
                        <FiFileText className="text-3xl" aria-hidden="true" />
                        <span className="text-xs font-bold">PDF</span>
                      </div>
                    ) : (
                      <img src={mediaThumb(item.url)} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-ink-deep/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <button type="button" onClick={() => copyUrl(item.url)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink shadow" aria-label="Copy link" title="Copy link">
                        <FiCopy aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => remove(item.url)} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#b42318] shadow" aria-label="Delete" title="Delete">
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="px-2.5 py-2">
                    <p className="truncate text-xs font-semibold text-ink" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[11px] capitalize text-[#9aa6a7]">
                      {item.type} · {formatBytes(item.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
