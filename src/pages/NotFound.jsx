import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import usePageMeta from '../hooks/usePageMeta';

export default function NotFound({ message }) {
  const { t } = useLanguage();
  usePageMeta(t('common.notFoundTitle'));
  return (
    <div className="relative overflow-hidden bg-paper min-h-[65vh] flex items-center">
      <span className="absolute top-0 right-0 hidden sm:block w-[34%] h-full bg-paper-tint" aria-hidden="true" />
      <div className="site-container relative py-20">
        <p className="eyebrow mb-4">404</p>
        <h1 className="h-display text-[2.6rem] md:text-[3.6rem] leading-[1.04] mb-4">{t('common.notFoundTitle')}</h1>
        <p className="max-w-[520px] text-[17px] text-[#435b60] mb-8">{message || t('common.notFoundText')}</p>
        <Link to="/" className="btn btn-primary">
          {t('common.backHome')}
          <span className="text-gold-light" aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>
    </div>
  );
}
