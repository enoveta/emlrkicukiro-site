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
  const [remoteOptions, setRemoteOptions] = useState({});

  // Selects whose options come from another resource (e.g. ministries).
  useEffect(() => {
    cfg.fields
      .filter((f) => f.optionsFrom)
      .forEach((f) => {
        adminApi
          .get(f.optionsFrom)
          .then((rows) =>
            setRemoteOptions((prev) => ({
              ...prev,
              [f.key]: (rows || []).map((r) => ({ value: r.slug || r.id, label: r.nameRw ? `${r.name} / ${r.nameRw}` : r.name || r.title })),
            }))
          )
          .catch(() => {});
      });
  }, [resourceKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isNew) {
      const initial = {};
      cfg.fields.forEach((f) => {
        if (f.type === 'boolean') initial[f.key] = false;
        else if (f.type === 'number') initial[f.key] = 0;
        else if (f.type === 'datetime') initial[f.key] = new Date().toISOString().slice(0, 16);
        else if (f.type === 'days') initial[f.key] = [];
        else if (f.type === 'select') initial[f.key] = f.optionsFrom ? '' : f.options?.[0] || '';
        else initial[f.key] = '';
        if (f.rw) initial[`${f.key}Rw`] = '';
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
          if (f.rw) next[`${f.key}Rw`] = data[`${f.key}Rw`] ?? '';
        });
        setForm(next);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, resourceKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSave = async (e, publishAfter = false) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = {};
      cfg.fields.forEach((f) => {
        body[f.key] = fromInputValue(f, form[f.key]);
        if (f.rw) body[`${f.key}Rw`] = (form[`${f.key}Rw`] || '').trim() || null;
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
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
          Fields marked <span className="font-semibold">EN / RW</span> have an English and a Kinyarwanda box. If the
          Kinyarwanda box is empty, the English text is shown to Kinyarwanda readers.
        </p>
        {cfg.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.required ? <span className="text-red-500"> *</span> : null}
              {field.rw ? <span className="ml-2 text-xs font-semibold text-[#5fb9e2]">EN / RW</span> : null}
            </label>
            {field.rw ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldInput field={field} value={form[field.key]} onChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))} placeholder="English" />
                <FieldInput
                  field={{ ...field, required: false }}
                  value={form[`${field.key}Rw`]}
                  onChange={(v) => setForm((f) => ({ ...f, [`${field.key}Rw`]: v }))}
                  placeholder="Ikinyarwanda"
                  lang="rw"
                />
              </div>
            ) : field.type === 'boolean' ? (
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form[field.key])}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                />
                Enabled
              </label>
            ) : field.type === 'days' ? (
              <DaysPicker value={form[field.key] || []} onChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))} />
            ) : field.type === 'select' ? (
              <select
                className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                value={form[field.key] ?? ''}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              >
                {field.optionsFrom ? (
                  <>
                    <option value="">None</option>
                    {(remoteOptions[field.key] || []).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </>
                ) : (
                  (field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {field.optionLabels?.[opt] || opt}
                    </option>
                  ))
                )}
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
                  {form[field.key] ? (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, [field.key]: '' })}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-red-600"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                {form[field.key] && !/\.pdf$/i.test(form[field.key]) ? (
                  <img src={mediaUrl(form[field.key])} alt="" className="h-28 rounded-xl object-cover border" />
                ) : null}
              </div>
            ) : (
              <FieldInput field={field} value={form[field.key]} onChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))} />
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

function FieldInput({ field, value, onChange, placeholder, lang }) {
  if (field.type === 'textarea') {
    return (
      <textarea
        className="w-full border border-slate-200 rounded-xl p-3 min-h-[120px] text-sm"
        value={value || ''}
        required={field.required}
        placeholder={placeholder}
        lang={lang}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      className="w-full border border-slate-200 rounded-xl p-3 text-sm"
      type={
        field.type === 'datetime' ? 'datetime-local' : field.type === 'number' ? 'number' : field.type === 'time' ? 'time' : 'text'
      }
      value={value ?? ''}
      required={field.required}
      placeholder={placeholder}
      lang={lang}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

const WEEK = [
  [1, 'Mon', 'Mbe'],
  [2, 'Tue', 'Kab'],
  [3, 'Wed', 'Gat'],
  [4, 'Thu', 'Kan'],
  [5, 'Fri', 'Gtn'],
  [6, 'Sat', 'Gtd'],
  [0, 'Sun', 'Cyu'],
];

function DaysPicker({ value, onChange }) {
  const set = new Set(value.map(Number));
  const toggle = (d) => {
    const next = new Set(set);
    if (next.has(d)) next.delete(d);
    else next.add(d);
    onChange([...next].sort((a, b) => a - b));
  };
  const quick = (label, days) => (
    <button
      type="button"
      onClick={() => onChange(days)}
      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
    >
      {label}
    </button>
  );
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {WEEK.map(([d, en, rw]) => (
          <button
            key={d}
            type="button"
            aria-pressed={set.has(d)}
            onClick={() => toggle(d)}
            className={`w-16 py-2 rounded-xl border text-sm font-semibold ${
              set.has(d) ? 'bg-[#001d3a] border-[#001d3a] text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-[#5fb9e2]'
            }`}
          >
            {en}
            <span className="block text-[10px] font-normal opacity-75">{rw}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {quick('Mon to Sat', [1, 2, 3, 4, 5, 6])}
        {quick('Every day', [0, 1, 2, 3, 4, 5, 6])}
        {quick('Clear', [])}
      </div>
      {!set.size ? <p className="text-xs text-red-600">Choose at least one day.</p> : null}
    </div>
  );
}
