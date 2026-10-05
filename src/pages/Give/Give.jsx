import { useState } from 'react';
import { FaMobileAlt, FaUniversity, FaCopy, FaCheck } from 'react-icons/fa';
import { usePublicData, useSettings } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

function CopyRow({ label, value, t }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: the value is still selectable */
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
      <div>
        <dt className="text-sm text-gray-500">{label}</dt>
        <dd className="font-semibold text-[#001d3a] select-all">{value}</dd>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-[#1a6f99] hover:bg-[#e8f5fb]"
        aria-label={`${t('give.copy')} ${label}`}
      >
        {copied ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}
        {copied ? t('give.copied') : t('give.copy')}
      </button>
    </div>
  );
}

/** Donation purposes and their real accounts, managed in Dashboard → Giving accounts. */
function Give() {
  const { data: accounts } = usePublicData('/giving', []);
  const settings = useSettings();
  const { t, lang } = useLanguage();
  usePageMeta(t('give.title'), t('give.subtitle'));
  const list = accounts || [];
  const [purpose, setPurpose] = useState(null);
  const [method, setMethod] = useState('mobile');
  const selected = list.find((a) => a.purposeKey === purpose) || list[0];
  const phone = settings.phone || '+250 788 524 792';
  const hasMobile = Boolean(selected?.mtnNumber || selected?.airtelNumber);
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
                    <CopyRow label="MTN MoMo" value={selected.mtnNumber} t={t} />
                    <CopyRow label="Airtel Money" value={selected.airtelNumber} t={t} />
                    <CopyRow label={t('give.name')} value={selected.mobileName} t={t} />
                  </>
                ) : (
                  <>
                    <CopyRow label={t('give.bank')} value={selected.bankName} t={t} />
                    <CopyRow label={t('give.accountName')} value={selected.accountName} t={t} />
                    <CopyRow label={t('give.accountNumber')} value={selected.accountNumber} t={t} />
                    <CopyRow label="SWIFT" value={selected.swift} t={t} />
                  </>
                )}
              </dl>
            </section>
          </div>
        ) : null}

        <blockquote className="mt-10 text-center text-lg italic text-gray-700 max-w-2xl mx-auto">{t('give.verse')}</blockquote>
        <p className="mt-6 text-center text-gray-600">
          {t('give.questions', { phone })}
        </p>
      </div>
    </div>
  );
}

export default Give;
