import { FaMobileAlt, FaUniversity } from 'react-icons/fa';
import { usePublicData, useSettings } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

const Row = ({ label, value }) =>
  value ? (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-3 border-b border-gray-100 last:border-0">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-semibold text-[#001d3a] select-all">{value}</dd>
    </div>
  ) : null;

/** Static payment details — taken from the first published giving account in the dashboard. */
function Give() {
  const { data: accounts } = usePublicData('/giving', []);
  const settings = useSettings();
  const { t } = useLanguage();
  usePageMeta(t('give.title'), t('give.subtitle'));
  const account = (accounts || [])[0];
  const phone = settings.phone || '+250 788 524 792';

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <PageHeader title={t('give.title')} subtitle={t('give.subtitle')} />

        {account ? (
          <div className="grid md:grid-cols-2 gap-6">
            {account.mtnNumber || account.airtelNumber ? (
              <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="flex items-center text-xl font-bold text-[#001d3a] mb-4">
                  <FaMobileAlt className="mr-3 text-[#1f7fae]" aria-hidden="true" />
                  {t('give.mobileMoney')}
                </h2>
                <dl>
                  <Row label="MTN MoMo" value={account.mtnNumber} />
                  <Row label="Airtel Money" value={account.airtelNumber} />
                  <Row label={t('give.name')} value={account.mobileName} />
                </dl>
              </section>
            ) : null}
            {account.accountNumber ? (
              <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="flex items-center text-xl font-bold text-[#001d3a] mb-4">
                  <FaUniversity className="mr-3 text-[#1f7fae]" aria-hidden="true" />
                  {t('give.bankTransfer')}
                </h2>
                <dl>
                  <Row label={t('give.bank')} value={account.bankName} />
                  <Row label={t('give.accountName')} value={account.accountName} />
                  <Row label={t('give.accountNumber')} value={account.accountNumber} />
                  <Row label="SWIFT" value={account.swift} />
                </dl>
              </section>
            ) : null}
          </div>
        ) : null}

        <blockquote className="mt-10 text-center text-lg italic text-gray-700 max-w-2xl mx-auto">{t('give.verse')}</blockquote>
        <p className="mt-6 text-center text-gray-600">
          {t('give.questions', { phone })}{' '}
        </p>
      </div>
    </div>
  );
}

export default Give;
