import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from '../ui/Toast';
import { FiSave } from 'react-icons/fi';
import { Skeleton } from '../ui/StatusPill';
import { PageHeader, Card, Field, Toggle, ErrorNote } from '../ui/kit';

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
    hint: 'Shown on the home page. Kinyarwanda uses its own clock: 8:00 AM = “saa mbiri za mu gitondo”, 11:30 AM = “saa tanu n’igice”, 6:00 PM = “saa kumi n’ebyiri z’umugoroba”. The full programme is managed in Weekly programme.',
    pairs: [
      { key: 'sundayService1', label: 'Sunday service 1', en: '8:00 AM', rw: 'saa mbiri za mu gitondo' },
      { key: 'sundayService2', label: 'Sunday service 2', en: '11:30 AM', rw: 'saa tanu n’igice' },
      { key: 'wednesdayService', label: 'Thursday general service', en: '6:00 PM', rw: 'saa kumi n’ebyiri z’umugoroba' },
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

  const tag = (code) => <span className="rounded bg-[#f1ede4] px-1.5 py-0.5 text-[10px] font-bold text-[#7a5a22]">{code}</span>;

  return (
    <form onSubmit={onSave}>
      <PageHeader
        title="Site settings"
        description="Contact details, service times, social links and home page options."
        actions={
          <button type="submit" disabled={saving} className="a-btn a-btn-primary">
            <FiSave aria-hidden="true" /> {saving ? 'Saving…' : 'Save settings'}
          </button>
        }
      />
      <ErrorNote>{error}</ErrorNote>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <Card key={section.title} title={section.title} description={section.hint}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {(section.fields || []).map((field) => (
                  <Field key={field.key} label={field.label} htmlFor={field.key}>
                    <input id={field.key} className="a-input" value={form[field.key] || ''} onChange={set(field.key)} />
                  </Field>
                ))}
                {(section.pairs || []).map((pair) => (
                  <Field key={pair.key} label={pair.label} className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="relative">
                        <input aria-label={`${pair.label} (English)`} className="a-input pr-12" placeholder={pair.en} value={form[pair.key] || ''} onChange={set(pair.key)} />
                        <span className="pointer-events-none absolute right-2.5 top-2.5">{tag('EN')}</span>
                      </div>
                      <div className="relative">
                        <input aria-label={`${pair.label} (Kinyarwanda)`} className="a-input pr-12" placeholder={pair.rw} value={form[`${pair.key}Rw`] || ''} onChange={set(`${pair.key}Rw`)} lang="rw" />
                        <span className="pointer-events-none absolute right-2.5 top-2.5">{tag('RW')}</span>
                      </div>
                    </div>
                  </Field>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6 xl:sticky xl:top-24">
          <Card title="Home page">
            <Toggle
              checked={form.showTestimonials === 'true'}
              onChange={(v) => setForm({ ...form, showTestimonials: v ? 'true' : 'false' })}
              label="Show testimonials"
              description="Turn on only when real, published testimonials exist (Website content → Testimonials)."
            />
          </Card>
          <button type="submit" disabled={saving} className="a-btn a-btn-primary w-full">
            <FiSave aria-hidden="true" /> {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>
    </form>
  );
}
