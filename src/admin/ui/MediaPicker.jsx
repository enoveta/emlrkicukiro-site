import { useEffect, useMemo, useState } from 'react';
import { adminApi, mediaThumb, mediaUrl } from '../../api/client';

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
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-5 py-4 border-b flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-ink text-lg">Media library</h3>
            <p className="text-xs text-gray-500">Pick existing media or upload new files</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-ink px-2 py-1">
            Close
          </button>
        </div>

        <div className="p-4 border-b flex flex-wrap gap-3 items-center bg-paper-card">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search media..."
            className="flex-1 min-w-[180px] border rounded-md px-3 py-2 text-sm"
          />
          <label className="cursor-pointer bg-ink text-white px-4 py-2 rounded-md text-sm hover:bg-ink-soft transition">
            {uploading ? 'Uploading...' : 'Upload files'}
            <input
              type="file"
              accept="image/*,video/*,application/pdf"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => onUpload(e.target.files)}
            />
          </label>
        </div>

        <div className="p-4 overflow-y-auto">
          {error ? <p className="text-red-600 text-sm mb-3">{error}</p> : null}
          {loading ? <p className="text-gray-500 text-sm">Loading media...</p> : null}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((item) => (
              <button
                key={item.url}
                type="button"
                onClick={() => {
                  onSelect(mediaUrl(item.url));
                  onClose();
                }}
                className="group text-left border rounded-md overflow-hidden hover:border-gold hover:shadow-md transition bg-white"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {item.type === 'video' ? (
                    <video src={mediaUrl(item.url)} className="w-full h-full object-cover" muted preload="metadata" />
                  ) : item.type === 'document' ? (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-red-600">PDF</div>
                  ) : (
                    <img src={mediaThumb(item.url)} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  )}
                  <span className="absolute top-2 left-2 text-[10px] uppercase bg-black/60 text-white px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
                <div className="p-2">
                  <p className="text-xs truncate text-gray-700">{item.name}</p>
                </div>
              </button>
            ))}
          </div>
          {!loading && filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-10 text-sm">No media found. Upload to get started.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
