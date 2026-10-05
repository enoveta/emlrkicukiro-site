import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import usePageMeta from '../hooks/usePageMeta';

export default function NotFound({ message }) {
  const { t } = useLanguage();
  usePageMeta(t('common.notFoundTitle'));
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-6xl font-bold text-[#5fb9e2] mb-4">404</p>
      <h1 className="text-2xl md:text-3xl font-bold text-[#001d3a] mb-2">{t('common.notFoundTitle')}</h1>
      <p className="text-gray-600 mb-8">{message || t('common.notFoundText')}</p>
      <Link to="/" className="px-6 py-3 rounded-lg bg-[#001d3a] text-white font-medium hover:bg-[#003366]">
        {t('common.backHome')}
      </Link>
    </div>
  );
}
