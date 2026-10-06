import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheck, FiImage, FiSave, FiTrash2, FiUpload } from 'react-icons/fi';
import { adminApi, mediaUrl } from '../../api/client';
import { RESOURCE_CONFIG, fromInputValue, toInputValue } from '../resourceConfig';
import MediaPicker from '../ui/MediaPicker';
import { useToast } from '../ui/Toast';
import { StatusPill, Skeleton } from '../ui/StatusPill';
import { PageHeader, Card, ErrorNote, Toggle } from '../ui/kit';

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

  if (loading)
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Skeleton className="h-[480px]" />
        <Skeleton className="h-48" />
      </div>
    );

  const set = (key, v) => setForm((f) => ({ ...f, [key]: v }));
  const half = (f) => !f.rw && ['time', 'number', 'select', 'datetime'].includes(f.type);
  const langTag = (code) => (
    <span className="rounded bg-[#f1ede4] px-1.5 py-0.5 text-[10px] font-bold tracking-[0.06em] text-[#7a5a22]">{code}</span>
  );

  const renderControl = (field) => {
    if (field.rw) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <FieldInput field={field} value={form[field.key]} onChange={(v) => set(field.key, v)} placeholder="English" />
            <span className="pointer-events-none absolute right-2.5 top-2.5">{langTag('EN')}</span>
          </div>
          <div className="relative">
            <FieldInput field={{ ...field, required: false }} value={form[`${field.key}Rw`]} onChange={(v) => set(`${field.key}Rw`, v)} placeholder="Ikinyarwanda" lang="rw" />
            <span className="pointer-events-none absolute right-2.5 top-2.5">{langTag('RW')}</span>
          </div>
        </div>
      );
    }
    if (field.type === 'boolean') {
      return (
        <div className="rounded-lg border border-[#e3ded3] bg-[#fcfbf8] px-4 py-3">
          <Toggle checked={Boolean(form[field.key])} onChange={(v) => set(field.key, v)} label={field.label} />
        </div>
      );
    }
    if (field.type === 'days') return <DaysPicker value={form[field.key] || []} onChange={(v) => set(field.key, v)} />;
    if (field.type === 'select') {
      return (
        <select className="a-input" value={form[field.key] ?? ''} onChange={(e) => set(field.key, e.target.value)}>
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
      );
    }
    if (field.type === 'image') {
      const value = form[field.key];
      const isPdf = /\.pdf$/i.test(value || '');
      return (
        <div className="flex flex-col gap-4 rounded-lg border border-[#e3ded3] bg-[#fcfbf8] p-3 sm:flex-row sm:items-center">
          <div className="grid h-24 w-full flex-none place-items-center overflow-hidden rounded-lg border border-[#efebe3] bg-white sm:w-36">
            {value && !isPdf ? (
              <img src={mediaUrl(value)} alt="" className="h-full w-full object-cover" />
            ) : value && isPdf ? (
              <span className="text-lg font-bold text-[#b42318]">PDF</span>
            ) : (
              <FiImage className="text-2xl text-[#c3cbcb]" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setPickerField(field.key)} className="a-btn a-btn-secondary a-btn-sm">
                <FiUpload aria-hidden="true" /> {value ? 'Change' : 'Choose from library'}
              </button>
              {value ? (
                <button type="button" onClick={() => set(field.key, '')} className="a-btn a-btn-danger a-btn-sm">
                  <FiTrash2 aria-hidden="true" /> Remove
                </button>
              ) : null}
            </div>
            <input className="a-input py-2 text-[13px]" value={value || ''} onChange={(e) => set(field.key, e.target.value)} placeholder="Or paste a media URL" />
          </div>
        </div>
      );
    }
    return <FieldInput field={field} value={form[field.key]} onChange={(v) => set(field.key, v)} />;
  };

  const actions = (
    <>
      <button type="button" disabled={saving} onClick={(e) => onSave(e, true)} className="a-btn a-btn-primary w-full">
        <FiCheck aria-hidden="true" /> {saving ? 'Saving…' : 'Save & publish'}
      </button>
      <button type="submit" form="content-form" disabled={saving} className="a-btn a-btn-secondary w-full">
        <FiSave aria-hidden="true" /> Save as draft
      </button>
    </>
  );

  return (
    <div>
      <PageHeader
        back={{ to: `/admin/${resourceKey}`, label: cfg.label }}
        title={isNew ? `New ${cfg.label.toLowerCase()}` : form[cfg.titleField] || `Edit ${cfg.label.toLowerCase()}`}
        badge={!isNew ? <StatusPill status={existingStatus} /> : null}
      />

      <ErrorNote>{error}</ErrorNote>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <form id="content-form" onSubmit={(e) => onSave(e, false)} className="a-card a-card-pad">
          <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">
            {cfg.fields.map((field) => (
              <div key={field.key} className={half(field) ? '' : 'md:col-span-2'}>
                {field.type !== 'boolean' ? (
                  <span className="a-label">
                    <span>
                      {field.label}
                      {field.required ? <span className="text-[#b42318]"> *</span> : null}
                    </span>
                  </span>
                ) : null}
                {renderControl(field)}
              </div>
            ))}
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card title="Publish">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-[#66777a]">Status</span>
              <StatusPill status={isNew ? 'DRAFT' : existingStatus} />
            </div>
            <div className="space-y-2">{actions}</div>
          </Card>
          <div className="rounded-xl border border-[#efe6d2] bg-[#fbf7ee] p-4 text-[13px] leading-relaxed text-[#6a582f]">
            <p className="mb-1 font-bold">English & Kinyarwanda</p>
            Fields with <span className="font-semibold">EN</span> and <span className="font-semibold">RW</span> boxes are shown in each
            language. If the Kinyarwanda box is empty, the English text is used.
          </div>
        </aside>
      </div>

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
        className="a-input min-h-[130px] pr-12 leading-relaxed"
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
      className="a-input pr-12"
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
      className="a-chip a-chip-off h-7 text-xs"
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
            className={`w-[60px] rounded-lg border py-2 text-sm font-semibold transition-colors ${
              set.has(d) ? 'border-ink bg-ink text-white' : 'border-[#e3ded3] bg-white text-[#334c51] hover:border-gold'
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
      {!set.size ? <p className="text-xs text-[#b42318]">Choose at least one day.</p> : null}
    </div>
  );
}
