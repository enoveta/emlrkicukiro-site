import { useMemo, useState } from 'react';
import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';

function Give() {
  const { data: accounts } = usePublicData('/giving', []);
  const { t, lang } = useLanguage();
  const [activeMethod, setActiveMethod] = useState('mobile');
  const [donationPurpose, setDonationPurpose] = useState('offerings');
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const purposes = useMemo(
    () =>
      (accounts || []).map((a) => ({
        id: a.purposeKey,
        name: localized(a, 'purposeName', lang),
      })),
    [accounts, lang]
  );

  const selected = (accounts || []).find((a) => a.purposeKey === donationPurpose) || accounts?.[0];
  const presetAmounts = [5000, 10000, 20000, 50000];

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#001d3a] mb-3">{t('give.title')}</h1>
          <p className="text-gray-600">{t('give.subtitle')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-[#001d3a] mb-3">{t('give.purpose')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {purposes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDonationPurpose(p.id)}
                  className={`p-3 rounded-lg border text-left ${
                    donationPurpose === p.id
                      ? 'border-[#5fb9e2] bg-[#e8f5fb] text-[#001d3a]'
                      : 'border-gray-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#001d3a] mb-3">{t('give.method')}</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveMethod('mobile')}
                className={`px-4 py-2 rounded-lg border ${
                  activeMethod === 'mobile' ? 'border-[#001d3a] bg-[#001d3a] text-white' : 'border-gray-200'
                }`}
              >
                {t('give.mobileMoney')}
              </button>
              <button
                type="button"
                onClick={() => setActiveMethod('bank')}
                className={`px-4 py-2 rounded-lg border ${
                  activeMethod === 'bank' ? 'border-[#001d3a] bg-[#001d3a] text-white' : 'border-gray-200'
                }`}
              >
                {t('give.bankTransfer')}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#001d3a] mb-3">{t('give.amount')}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setDonationAmount(String(amount));
                    setCustomAmount('');
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    donationAmount === String(amount) ? 'bg-[#fae924] border-[#fae924]' : 'border-gray-200'
                  }`}
                >
                  {amount.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder={t('give.customAmount')}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setDonationAmount(e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {selected && (
            <div className="bg-[#f8f9fa] rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-[#001d3a] mb-3">{t('give.accountDetails')}</h3>
              {activeMethod === 'mobile' ? (
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>{t('give.name')}:</strong> {selected.mobileName}
                  </p>
                  <p>
                    <strong>MTN:</strong> {selected.mtnNumber}
                  </p>
                  <p>
                    <strong>Airtel:</strong> {selected.airtelNumber}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>{t('give.bank')}:</strong> {selected.bankName}
                  </p>
                  <p>
                    <strong>{t('give.accountName')}:</strong> {selected.accountName}
                  </p>
                  <p>
                    <strong>{t('give.accountNumber')}:</strong> {selected.accountNumber}
                  </p>
                  <p>
                    <strong>SWIFT:</strong> {selected.swift}
                  </p>
                </div>
              )}
              {donationAmount ? (
                <p className="mt-4 text-sm text-[#5fb9e2]">
                  {t('give.suggested', { amount: Number(donationAmount).toLocaleString() })}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Give;
