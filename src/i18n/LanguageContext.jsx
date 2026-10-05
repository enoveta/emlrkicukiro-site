import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { interpolate, translations } from './translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'emlr_lang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'rw' || saved === 'en' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (next) => {
    const value = next === 'rw' ? 'rw' : 'en';
    setLangState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'rw' ? 'rw' : 'en';
  }, [lang]);

  const value = useMemo(() => {
    const dict = translations[lang] || translations.en;
    const lookup = (root, path) =>
      path.split('.').reduce((cur, part) => (cur && typeof cur === 'object' ? cur[part] : undefined), root);
    /** Raw value (arrays/objects), falling back to English. */
    const get = (path) => lookup(dict, path) ?? lookup(translations.en, path);
    const t = (path, vars) => {
      const parts = path.split('.');
      let cur = dict;
      for (const part of parts) {
        if (cur && typeof cur === 'object' && part in cur) cur = cur[part];
        else {
          // fallback to English
          let en = translations.en;
          for (const p of parts) {
            if (en && typeof en === 'object' && p in en) en = en[p];
            else return path;
          }
          return typeof en === 'string' ? interpolate(en, vars) : path;
        }
      }
      return typeof cur === 'string' ? interpolate(cur, vars) : path;
    };
    return { lang, setLang, t, get, isRw: lang === 'rw' };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: 'en',
      setLang: () => {},
      t: (path) => path,
      get: () => undefined,
      isRw: false,
    };
  }
  return ctx;
}
