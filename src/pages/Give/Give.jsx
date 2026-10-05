import { useState } from 'react';
import { FaMobileAlt, FaUniversity } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="font-semibold text-[#001d3a] text-lg select-all">{value}</dd>
    </div>
  );
}

/** MTN MoMo Pay: the code plus a tap-to-dial shortcut on phones. */
function MomoPay({ code, t }) {
  if (!code) return null;
  const ussd = `*182*8*1*${code}#`;
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm text-gray-500">{t('give.momoCode')}</dt>
      <dd className="flex flex-wrap items-center justify-between gap-3 mt-1">
        <span className="text-2xl font-bold tracking-wider text-[#001d3a] select-all">{code}</span>
        <a
          href={`tel:${ussd.replace('#', '%23')}`}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#feed17] text-[#001d3a] font-semibold hover:bg-[#ffe600]"
        >
          {t('give.dial', { ussd })}
        </a>
      </dd>
    </div>
  );
}

/** Donation purposes and their real accounts, managed in Dashboard → Giving accounts. */
function Give() {
  const { data: accounts } = usePublicData('/giving', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('give.title'), t('give.subtitle'));
  const list = accounts || [];
  const [purpose, setPurpose] = useState(null);
  const [method, setMethod] = useState('mobile');
  const selected = list.find((a) => a.purposeKey === purpose) || list[0];
  const hasMobile = Boolean(selected?.momoCode || selected?.mtnNumber || selected?.airtelNumber);
  const hasBank = Boolean(selected?.accountNumber);
  const activeMethod = method === 'mobile' && !hasMobile ? 'bank' : method === 'bank' && !hasBank ? 'mobile' : method;

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <PageHeader title={t('give.title')} subtitle={t('give.subtitle')} />

        {selected ? (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-[#001d3a] mb-3">{t('give.purpose')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label={t('give.purpose')}>
                {list.map((a) => {
                  const active = a.purposeKey === selected.purposeKey;
                  return (
                    <button
                      key={a.purposeKey}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPurpose(a.purposeKey)}
                      className={`p-4 rounded-lg border-2 text-left font-medium transition-colors ${
                        active ? 'border-[#5fb9e2] bg-[#e8f5fb] text-[#001d3a]' : 'border-gray-200 text-gray-700 hover:border-[#5fb9e2]'
                      }`}
                    >
                      {localized(a, 'purposeName', lang)}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#001d3a] mb-3">{t('give.method')}</h2>
              <div className="flex flex-wrap gap-3" role="tablist">
                {hasMobile ? (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMethod === 'mobile'}
                    onClick={() => setMethod('mobile')}
                    className={`inline-flex items-center px-5 py-2.5 rounded-lg border font-medium ${
                      activeMethod === 'mobile' ? 'bg-[#001d3a] border-[#001d3a] text-white' : 'border-gray-300 text-[#001d3a]'
                    }`}
                  >
                    <FaMobileAlt className="mr-2" aria-hidden="true" />
                    {t('give.mobileMoney')}
                  </button>
                ) : null}
                {hasBank ? (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMethod === 'bank'}
                    onClick={() => setMethod('bank')}
                    className={`inline-flex items-center px-5 py-2.5 rounded-lg border font-medium ${
                      activeMethod === 'bank' ? 'bg-[#001d3a] border-[#001d3a] text-white' : 'border-gray-300 text-[#001d3a]'
                    }`}
                  >
                    <FaUniversity className="mr-2" aria-hidden="true" />
                    {t('give.bankTransfer')}
                  </button>
                ) : null}
              </div>
            </section>

            <section className="bg-[#f8fafc] rounded-lg border border-gray-200 p-5" role="tabpanel">
              <h2 className="font-semibold text-[#001d3a] mb-1">{t('give.accountDetails')}</h2>
              <p className="text-sm text-gray-500 mb-3">{localized(selected, 'purposeName', lang)}</p>
              <dl>
                {activeMethod === 'mobile' ? (
                  <>
                    <MomoPay code={selected.momoCode} t={t} />
                    <Row label="MTN MoMo" value={selected.mtnNumber} />
                    <Row label="Airtel Money" value={selected.airtelNumber} />
                    <Row label={t('give.name')} value={selected.mobileName} />
                  </>
                ) : (
                  <>
                    <Row label={t('give.bank')} value={selected.bankName} />
                    <Row label={t('give.accountName')} value={selected.accountName} />
                    <Row label={t('give.accountNumber')} value={selected.accountNumber} />
                    <Row label="SWIFT" value={selected.swift} />
                  </>
                )}
              </dl>
            </section>
          </div>
        ) : null}

        <blockquote className="mt-10 text-center text-lg italic text-gray-700 max-w-2xl mx-auto">{t('give.verse')}</blockquote>
      </div>
    </div>
  );
}

export default Give;
