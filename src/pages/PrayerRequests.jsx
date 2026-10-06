import { useState } from 'react';
import { publicApi } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import FormField, { Honeypot } from '../components/ui/FormField';
import { PageShell } from '../components/ui/PageHeader';
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
    <PageShell title={t('prayer.title')} subtitle={t('prayer.subtitle')} tone="paper">
      <div className="max-w-[760px]">
        <form className="relative bg-white border border-line p-6 md:p-10 space-y-6" onSubmit={onSubmit}>
          <FormField id="name" label={t('prayer.yourName')} required maxLength={120} value={form.name} onChange={set('name')} autoComplete="name" />
          <FormField id="email" label={t('prayer.email')} type="email" required maxLength={200} value={form.email} onChange={set('email')} autoComplete="email" />
          <FormField id="request" as="textarea" rows={5} label={t('prayer.request')} required maxLength={4000} value={form.request} onChange={set('request')} />
          <Honeypot value={form.website} onChange={set('website')} />
          <p className="text-sm text-muted">{t('prayer.privacy')}</p>
          <div aria-live="polite">
            {status.message ? <p className="text-[#2f6b4f] font-semibold">{status.message}</p> : null}
            {status.error ? <p className="text-[#9b2c2c]">{status.error}</p> : null}
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="btn btn-primary w-full sm:w-auto disabled:opacity-60"
          >
            {status.loading ? t('prayer.submitting') : t('prayer.submit')}
            <span className="text-gold-light" aria-hidden="true">
              ↗
            </span>
          </button>
        </form>
      </div>
    </PageShell>
  );
}

export default PrayerRequests;
