import { useState } from 'react';
import { publicApi } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';
import FormField, { Honeypot } from '../components/ui/FormField';
import { PageShell } from '../components/ui/PageHeader';
import usePageMeta from '../hooks/usePageMeta';

const EMPTY = { name: '', email: '', phone: '', areaOfInterest: '', message: '', website: '' };
const AREAS = ['worship', 'children', 'youth', 'technical', 'hospitality', 'outreach', 'other'];

function Volunteer() {
  const { t } = useLanguage();
  usePageMeta(t('volunteer.title'), t('volunteer.subtitle'));
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      await publicApi.post('/volunteers', form);
      setForm(EMPTY);
      setStatus({ loading: false, message: t('volunteer.success'), error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message });
    }
  };

  return (
    <PageShell title={t('volunteer.title')} subtitle={t('volunteer.subtitle')} tone="paper">
      <div className="max-w-[760px]">
        <form className="relative bg-white border border-line p-6 md:p-10 space-y-6" onSubmit={onSubmit}>
          <FormField id="name" label={t('volunteer.fullName')} required maxLength={120} value={form.name} onChange={set('name')} autoComplete="name" />
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField id="email" label={t('volunteer.email')} type="email" required maxLength={200} value={form.email} onChange={set('email')} autoComplete="email" />
            <FormField id="phone" label={t('volunteer.phone')} type="tel" required maxLength={40} value={form.phone} onChange={set('phone')} autoComplete="tel" />
          </div>
          <FormField id="areaOfInterest" as="select" label={t('volunteer.interest')} required value={form.areaOfInterest} onChange={set('areaOfInterest')}>
            <option value="">{t('volunteer.pleaseSelect')}</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {t(`volunteer.${a}`)}
              </option>
            ))}
          </FormField>
          <FormField id="message" as="textarea" rows={3} label={t('volunteer.message')} maxLength={4000} value={form.message} onChange={set('message')} />
          <Honeypot value={form.website} onChange={set('website')} />
          <div aria-live="polite">
            {status.message ? <p className="text-[#2f6b4f] font-semibold">{status.message}</p> : null}
            {status.error ? <p className="text-[#9b2c2c]">{status.error}</p> : null}
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="btn btn-primary w-full sm:w-auto disabled:opacity-60"
          >
            {status.loading ? t('volunteer.submitting') : t('volunteer.submit')}
            <span className="text-gold-light" aria-hidden="true">
              ↗
            </span>
          </button>
        </form>
      </div>
    </PageShell>
  );
}

export default Volunteer;
