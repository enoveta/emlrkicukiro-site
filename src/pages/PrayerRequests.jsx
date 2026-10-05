import { useState } from 'react';
import { publicApi } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import FormField, { Honeypot } from '../components/ui/FormField';
import PageHeader from '../components/ui/PageHeader';
import usePageMeta from '../hooks/usePageMeta';

const EMPTY = { name: '', email: '', request: '', website: '' };

function PrayerRequests() {
  const { t } = useLanguage();
  usePageMeta(t('prayer.title'), t('prayer.subtitle'));
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      await publicApi.post('/prayer-requests', form);
      setForm(EMPTY);
      setStatus({ loading: false, message: t('prayer.success'), error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message });
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-2xl">
        <PageHeader title={t('prayer.title')} subtitle={t('prayer.subtitle')} />
        <form className="relative bg-white p-6 md:p-8 rounded-xl shadow-md space-y-5" onSubmit={onSubmit}>
          <FormField id="name" label={t('prayer.yourName')} required maxLength={120} value={form.name} onChange={set('name')} autoComplete="name" />
          <FormField id="email" label={t('prayer.email')} type="email" required maxLength={200} value={form.email} onChange={set('email')} autoComplete="email" />
          <FormField id="request" as="textarea" rows={5} label={t('prayer.request')} required maxLength={4000} value={form.request} onChange={set('request')} />
          <Honeypot value={form.website} onChange={set('website')} />
          <p className="text-sm text-gray-500">{t('prayer.privacy')}</p>
          <div aria-live="polite">
            {status.message ? <p className="text-green-700 font-medium">{status.message}</p> : null}
            {status.error ? <p className="text-red-600">{status.error}</p> : null}
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="w-full sm:w-auto bg-[#001d3a] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#003366] transition-colors disabled:opacity-60"
          >
            {status.loading ? t('prayer.submitting') : t('prayer.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PrayerRequests;
