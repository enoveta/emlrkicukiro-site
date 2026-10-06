import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMobileAlt, FaUniversity } from 'react-icons/fa';
import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import { PageShell } from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3.5 border-b border-white/[.12] last:border-0">
      <dt className="text-[11px] md:text-xs font-bold uppercase tracking-[0.1em] text-[#b7c3c1]">{label}</dt>
      <dd className="font-semibold text-white text-lg select-all">{value}</dd>
    </div>
  );
}

/** MTN MoMo Pay: the code plus a tap-to-dial shortcut on phones. */
function MomoPay({ code, t }) {
  if (!code) return null;
  const ussd = `*182*8*1*${code}#`;
  return (
    <div className="pb-5 mb-1 border-b border-white/[.12]">
      <dt className="text-[11px] md:text-xs font-bold uppercase tracking-[0.1em] text-[#b7c3c1]">{t('give.momoCode')}</dt>
      <dd className="flex flex-wrap items-center justify-between gap-3 mt-1.5">
        <span className="font-serif text-[2.6rem] leading-none tracking-[0.04em] text-gold-light select-all">{code}</span>
        <a href={`tel:${ussd.replace('#', '%23')}`} className="btn btn-light !min-h-[44px] !px-4">
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
  const [params] = useSearchParams();
  const [purpose, setPurpose] = useState(params.get('purpose'));
  const [method, setMethod] = useState('mobile');
  const selected = list.find((a) => a.purposeKey === purpose) || list[0];
  const hasMobile = Boolean(selected?.momoCode || selected?.mtnNumber || selected?.airtelNumber);
  const hasBank = Boolean(selected?.accountNumber);
  const activeMethod = method === 'mobile' && !hasMobile ? 'bank' : method === 'bank' && !hasBank ? 'mobile' : method;

  const chip = (active) =>
    `px-4 py-2.5 border text-[15px] font-semibold transition-colors ${
      active ? 'bg-ink border-ink text-white' : 'bg-white border-line text-[#334c51] hover:border-ink/40'
    }`;

  return (
    <PageShell title={t('give.title')} subtitle={t('give.subtitle')} tone="paper">
      {selected ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[18px]">
          <div className="bg-white border border-line p-6 md:p-9 space-y-8">
            <section>
              <p className="eyebrow mb-4">{t('give.purpose')}</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('give.purpose')}>
                {list.map((a) => {
                  const active = a.purposeKey === selected.purposeKey;
                  return (
                    <button
                      key={a.purposeKey}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPurpose(a.purposeKey)}
                      className={chip(active)}
                    >
                      {localized(a, 'purposeName', lang)}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <p className="eyebrow mb-4">{t('give.method')}</p>
              <div className="flex flex-wrap gap-2" role="tablist">
                {hasMobile ? (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMethod === 'mobile'}
                    onClick={() => setMethod('mobile')}
                    className={`inline-flex items-center gap-2 ${chip(activeMethod === 'mobile')}`}
                  >
                    <FaMobileAlt className="text-gold" aria-hidden="true" />
                    {t('give.mobileMoney')}
                  </button>
                ) : null}
                {hasBank ? (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeMethod === 'bank'}
                    onClick={() => setMethod('bank')}
                    className={`inline-flex items-center gap-2 ${chip(activeMethod === 'bank')}`}
                  >
                    <FaUniversity className="text-gold" aria-hidden="true" />
                    {t('give.bankTransfer')}
                  </button>
                ) : null}
              </div>
            </section>
          </div>

          <section className="relative overflow-hidden bg-ink text-white p-6 md:p-9" role="tabpanel">
            <span className="absolute -top-8 -right-8 w-28 h-28 rounded-full border border-gold-light/40" aria-hidden="true" />
            <span className="absolute -top-2.5 -right-2.5 w-20 h-20 rounded-full border border-gold-light/40" aria-hidden="true" />
            <p className="eyebrow eyebrow-light mb-3">{t('give.accountDetails')}</p>
            <h2 className="font-serif text-[1.8rem] md:text-[2.1rem] leading-tight mb-6 pr-16">{localized(selected, 'purposeName', lang)}</h2>
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

      <blockquote className="mt-12 md:mt-16 max-w-[820px] border-l border-gold pl-6 md:pl-8 font-serif text-[1.35rem] md:text-[1.65rem] leading-[1.45] text-ink">
        {t('give.verse')}
      </blockquote>
    </PageShell>
  );
}

export default Give;
