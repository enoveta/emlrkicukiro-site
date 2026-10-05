import { useState } from 'react';
import { publicApi } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';

function PrayerRequests() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', request: '' });
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      await publicApi.post('/prayer-requests', form);
      setForm({ name: '', email: '', request: '' });
      setStatus({ loading: false, message: t('prayer.success'), error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Submission failed' });
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-r from-[#001d3a] to-[#5fb9e2] text-white p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('prayer.title')}</h1>
          <p className="text-xl">{t('prayer.subtitle')}</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-[#001d3a]">{t('prayer.formTitle')}</h2>
          <p className="text-gray-700 mb-6">{t('prayer.formIntro')}</p>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('prayer.yourName')}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#5fb9e2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('prayer.email')}</label>
              <input
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#5fb9e2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('prayer.request')}</label>
              <textarea
                required
                value={form.request}
                onChange={(e) => setForm({ ...form, request: e.target.value })}
                rows="5"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#5fb9e2]"
              />
            </div>
            {status.message ? <p className="text-green-700">{status.message}</p> : null}
            {status.error ? <p className="text-red-600">{status.error}</p> : null}
            <button
              type="submit"
              disabled={status.loading}
              className="bg-[#001d3a] text-white px-6 py-3 rounded-lg hover:bg-[#5fb9e2] transition-colors disabled:opacity-60"
            >
              {status.loading ? t('prayer.submitting') : t('prayer.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PrayerRequests;
