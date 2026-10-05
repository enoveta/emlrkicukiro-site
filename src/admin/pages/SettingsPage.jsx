import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from '../ui/Toast';
import { Skeleton } from '../ui/StatusPill';

const FIELDS = [
  { key: 'churchName', label: 'Church name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'sundayService1', label: 'Sunday service 1' },
  { key: 'sundayService2', label: 'Sunday service 2' },
  { key: 'wednesdayService', label: 'Wednesday service' },
  { key: 'facebook', label: 'Facebook URL' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'youtube', label: 'YouTube URL' },
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

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.put('/settings/bulk', {
        settings: FIELDS.map(({ key }) => ({ key, value: form[key] || '' })),
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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#001d3a]">Site settings</h1>
        <p className="text-slate-500 mt-1">Contact details and service times shown across the website</p>
      </div>
      <form onSubmit={onSave} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
            <input
              className="w-full border border-slate-200 rounded-xl p-3 text-sm"
              value={form[field.key] || ''}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          </div>
        ))}
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
