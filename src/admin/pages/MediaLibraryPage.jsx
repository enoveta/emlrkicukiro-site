import { useEffect, useMemo, useState } from 'react';
import { adminApi, mediaThumb, mediaUrl } from '../../api/client';
import { useToast } from '../ui/Toast';
import { Skeleton } from '../ui/StatusPill';

function formatBytes(n) {
  if (!n) return '—';
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001d3a]">Media library</h1>
          <p className="text-slate-500 mt-1">Upload once and reuse across slides, news, ministries, and gallery.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center px-4 py-2.5 rounded-xl bg-[#001d3a] text-white text-sm font-medium hover:bg-[#5fb9e2] transition">
          {uploading ? 'Uploading...' : 'Upload media'}
          <input
            type="file"
            accept="image/*,video/*,application/pdf"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => uploadFiles(e.target.files)}
          />
        </label>
      </div>

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
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragOver ? 'border-[#5fb9e2] bg-[#e8f5fb]' : 'border-slate-300 bg-white'
        }`}
      >
        <p className="text-[#001d3a] font-medium">Drag & drop images or videos here</p>
        <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG, WEBP, GIF, MP4 · up to 40MB each</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search files..."
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white min-w-[220px]"
        />
        {['all', 'image', 'video'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
              filter === f ? 'bg-[#001d3a] text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-auto">{filtered.length} files</span>
      </div>

      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <div key={item.url} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group">
              <div className="aspect-square bg-slate-100 relative">
                {item.type === 'video' ? (
                  <video src={mediaUrl(item.url)} className="w-full h-full object-cover" muted preload="metadata" />
                ) : item.type === 'document' ? (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-red-600">PDF</div>
                ) : (
                  <img src={mediaThumb(item.url)} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition flex items-end justify-center opacity-0 group-hover:opacity-100 p-2 gap-1">
                  <button type="button" onClick={() => copyUrl(item.url)} className="text-[11px] bg-white rounded-lg px-2 py-1">
                    Copy
                  </button>
                  <button type="button" onClick={() => remove(item.url)} className="text-[11px] bg-white text-red-600 rounded-lg px-2 py-1">
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs truncate font-medium text-slate-700">{item.name}</p>
                <p className="text-[10px] text-slate-400">
                  {item.type} · {formatBytes(item.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
