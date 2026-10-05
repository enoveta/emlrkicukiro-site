import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminApi, mediaUrl } from '../../api/client';
import { RESOURCE_CONFIG, fromInputValue, toInputValue } from '../resourceConfig';
import MediaPicker from '../ui/MediaPicker';
import { useToast } from '../ui/Toast';
import { StatusPill, Skeleton } from '../ui/StatusPill';

export default function ContentForm({ resourceKey }) {
  const cfg = RESOURCE_CONFIG[resourceKey];
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [existingStatus, setExistingStatus] = useState('DRAFT');
  const [pickerField, setPickerField] = useState(null);

  useEffect(() => {
    if (isNew) {
      const initial = {};
      cfg.fields.forEach((f) => {
        if (f.type === 'boolean') initial[f.key] = false;
        else if (f.type === 'number') initial[f.key] = 0;
        else if (f.type === 'datetime') initial[f.key] = new Date().toISOString().slice(0, 16);
        else if (f.type === 'select') initial[f.key] = f.options?.[0] || '';
        else initial[f.key] = '';
      });
      setForm(initial);
      setLoading(false);
      return;
    }

    setLoading(true);
    adminApi
      .get(`${cfg.path}/${id}`, { cache: false })
      .then((data) => {
        setExistingStatus(data.status);
        const next = {};
        cfg.fields.forEach((f) => {
          next[f.key] = toInputValue(f, data[f.key]);
        });
        setForm(next);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, resourceKey]);

  const onSave = async (e, publishAfter = false) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = {};
      cfg.fields.forEach((f) => {
        body[f.key] = fromInputValue(f, form[f.key]);
      });

      let saved;
      if (isNew) {
        saved = await adminApi.post(cfg.path, body);
      } else {
        saved = await adminApi.put(`${cfg.path}/${id}`, body);
      }

      if (publishAfter && saved?.id && saved.status !== 'PUBLISHED') {
        await adminApi.post(`${cfg.path}/${saved.id}/publish`, {});
      }

      push(publishAfter ? 'Saved & published' : 'Saved');
      navigate(`/admin/${resourceKey}`);
    } catch (err) {
      setError(err.message);
      push(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link to={`/admin/${resourceKey}`} className="text-sm text-[#5fb9e2] hover:underline">
          ← Back to {cfg.label}
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-3xl font-bold text-[#001d3a]">{isNew ? `New ${cfg.label}` : `Edit ${cfg.label}`}</h1>
          {!isNew ? <StatusPill status={existingStatus} /> : null}
        </div>
      </div>

      <form onSubmit={(e) => onSave(e, false)} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        {cfg.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                className="w-full border border-slate-200 rounded-xl p-3 min-h-[120px] text-sm"
                value={form[field.key] || ''}
                required={field.required}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              />
            ) : field.type === 'boolean' ? (
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form[field.key])}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                />
                Enabled
              </label>
            ) : field.type === 'select' ? (
              <select
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                value={form[field.key] || ''}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              >
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'image' ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPickerField(field.key)}
                    className="px-3 py-2 rounded-xl bg-[#e8f5fb] text-[#001d3a] text-sm font-medium hover:bg-[#5fb9e2] hover:text-white transition"
                  >
                    Choose from library
                  </button>
                  <input
                    className="flex-1 min-w-[180px] border border-slate-200 rounded-xl p-2 text-sm"
                    value={form[field.key] || ''}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder="Or paste media URL"
                  />
                </div>
                {form[field.key] ? (
                  <img src={mediaUrl(form[field.key])} alt="" className="h-28 rounded-xl object-cover border" />
                ) : null}
              </div>
            ) : (
              <input
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                type={field.type === 'datetime' ? 'datetime-local' : field.type === 'number' ? 'number' : 'text'}
                value={form[field.key] ?? ''}
                required={field.required}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              />
            )}
          </div>
        ))}

        {error ? <p className="text-red-600 text-sm">{error}</p> : null}

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={(e) => onSave(e, true)}
            className="px-5 py-2.5 rounded-xl bg-[#001d3a] text-white text-sm font-medium hover:bg-[#5fb9e2] disabled:opacity-50"
          >
            Save & publish
          </button>
        </div>
      </form>

      <MediaPicker
        open={Boolean(pickerField)}
        onClose={() => setPickerField(null)}
        onSelect={(url) => {
          setForm((prev) => ({ ...prev, [pickerField]: url }));
          setPickerField(null);
        }}
      />
    </div>
  );
}
