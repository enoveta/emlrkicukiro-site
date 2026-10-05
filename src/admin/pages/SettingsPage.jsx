import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from '../ui/Toast';
import { Skeleton } from '../ui/StatusPill';

const SECTIONS = [
  {
    title: 'Contact',
    fields: [
      { key: 'churchName', label: 'Church name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'address', label: 'Address' },
    ],
  },
  {
    title: 'Service times',
    hint: 'Kinyarwanda uses its own clock: 8:00 AM = “saa mbiri”, 10:30 AM = “saa yine n’igice”, 6:00 PM = “saa kumi n’ebyiri z’umugoroba”.',
    pairs: [
      { key: 'sundayService1', label: 'Sunday service 1', en: '8:00 AM', rw: 'saa mbiri' },
      { key: 'sundayService2', label: 'Sunday service 2', en: '10:30 AM', rw: 'saa yine n’igice za mu gitondo' },
      { key: 'wednesdayService', label: 'Wednesday service', en: '6:00 PM', rw: 'saa kumi n’ebyiri z’umugoroba' },
    ],
  },
  {
    title: 'Social media',
    fields: [
      { key: 'facebook', label: 'Facebook URL' },
      { key: 'instagram', label: 'Instagram URL' },
      { key: 'youtube', label: 'YouTube channel URL' },
    ],
  },
];

const ALL_KEYS = [
  ...SECTIONS.flatMap((s) => [
    ...(s.fields || []).map((f) => f.key),
    ...(s.pairs || []).flatMap((p) => [p.key, `${p.key}Rw`]),
  ]),
  'showTestimonials',
];

export default function SettingsPage() {
  const { push } = useToast();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .get('/settings', { cache: false })
      .then((items) => {
        const map = {};
        (items || []).forEach((item) => {
          map[item.key] = item.value;
        });
        setForm(map);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.put('/settings/bulk', {
        settings: ALL_KEYS.map((key) => ({ key, value: form[key] || '' })),
      });
      push('Settings saved');
      setError('');
    } catch (err) {
      setError(err.message);
      push(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-96" />;

  const input = 'w-full border border-slate-200 rounded-xl p-3 text-sm';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#001d3a]">Site settings</h1>
        <p className="text-slate-500 mt-1">Contact details, service times and home page options</p>
      </div>
      <form onSubmit={onSave} className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-[#001d3a]">{section.title}</h2>
            {section.hint ? <p className="text-xs text-slate-500">{section.hint}</p> : null}
            {(section.fields || []).map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label}
                </label>
                <input id={field.key} className={input} value={form[field.key] || ''} onChange={set(field.key)} />
              </div>
            ))}
            {(section.pairs || []).map((pair) => (
              <div key={pair.key}>
                <span className="block text-sm font-medium text-slate-700 mb-1">{pair.label}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input aria-label={`${pair.label} (English)`} className={input} placeholder={pair.en} value={form[pair.key] || ''} onChange={set(pair.key)} />
                  <input aria-label={`${pair.label} (Kinyarwanda)`} className={input} placeholder={pair.rw} value={form[`${pair.key}Rw`] || ''} onChange={set(`${pair.key}Rw`)} lang="rw" />
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-[#001d3a] mb-3">Home page</h2>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.showTestimonials === 'true'}
              onChange={(e) => setForm({ ...form, showTestimonials: e.target.checked ? 'true' : 'false' })}
            />
            <span>
              <span className="font-medium text-slate-800">Show testimonials section</span>
              <span className="block text-slate-500">
                Turn on only when real, published testimonials exist (Website content → Testimonials).
              </span>
            </span>
          </label>
        </div>

        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#001d3a] text-white px-5 py-2.5 rounded-xl hover:bg-[#5fb9e2] disabled:opacity-50 text-sm font-medium"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
