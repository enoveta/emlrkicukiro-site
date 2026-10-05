import { useState } from 'react';
import { publicApi } from '../api/client';
import { useLanguage } from '../i18n/LanguageContext';

function Volunteer() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    areaOfInterest: '',
  });
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      await publicApi.post('/volunteers', form);
      setForm({ name: '', email: '', phone: '', areaOfInterest: '' });
      setStatus({ loading: false, message: t('volunteer.success'), error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Submission failed' });
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-r from-[#001d3a] to-[#5fb9e2] text-white p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('volunteer.title')}</h1>
          <p className="text-xl">{t('volunteer.subtitle')}</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-[#001d3a]">{t('volunteer.formTitle')}</h2>
          <p className="text-gray-700 mb-6">{t('volunteer.formIntro')}</p>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.fullName')}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#5fb9e2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.email')}</label>
              <input
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#5fb9e2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.phone')}</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                type="tel"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#5fb9e2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('volunteer.interest')}</label>
              <select
                required
                value={form.areaOfInterest}
                onChange={(e) => setForm({ ...form, areaOfInterest: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#5fb9e2]"
              >
                <option value="">{t('volunteer.pleaseSelect')}</option>
                <option value="worship">{t('volunteer.worship')}</option>
                <option value="children">{t('volunteer.children')}</option>
                <option value="youth">{t('volunteer.youth')}</option>
                <option value="technical">{t('volunteer.technical')}</option>
                <option value="hospitality">{t('volunteer.hospitality')}</option>
                <option value="outreach">{t('volunteer.outreach')}</option>
                <option value="other">{t('volunteer.other')}</option>
              </select>
            </div>
            {status.message ? <p className="text-green-700">{status.message}</p> : null}
            {status.error ? <p className="text-red-600">{status.error}</p> : null}
            <button
              type="submit"
              disabled={status.loading}
              className="bg-[#001d3a] text-white px-6 py-3 rounded-lg hover:bg-[#5fb9e2] transition-colors disabled:opacity-60"
            >
              {status.loading ? t('volunteer.submitting') : t('volunteer.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Volunteer;
