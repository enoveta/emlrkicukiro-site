import { Component } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

function Fallback() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold text-[#001d3a] mb-2">{t('common.errorTitle')}</h1>
      <p className="text-gray-600 mb-6">{t('common.errorText')}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-lg bg-[#001d3a] text-white font-medium hover:bg-[#003366]"
      >
        {t('common.reload')}
      </button>
    </div>
  );
}

/** Keeps one broken section from blanking the whole site. Resets on route change via `resetKey`. */
export default class ErrorBoundary extends Component {
  state = { error: null, key: this.props.resetKey };

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.key) return { error: null, key: props.resetKey };
    return null;
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Page error', error, info?.componentStack);
  }

  render() {
    if (this.state.error) return this.props.fallback ?? <Fallback />;
    return this.props.children;
  }
}
