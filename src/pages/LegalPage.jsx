import { useLanguage } from '../i18n/LanguageContext';
import { useSettings } from '../api/usePublicData';
import usePageMeta from '../hooks/usePageMeta';

/** Shared layout for Privacy Policy and Terms. `content` = { en: [{h, p}], rw: [{h, p}] }. */
export default function LegalPage({ title, content, updated }) {
  const { lang } = useLanguage();
  const settings = useSettings();
  const email = settings.email || 'info@emlrkicukiroparish.org';
  usePageMeta(title);
  const sections = content[lang] || content.en;

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-3xl bg-white p-6 md:p-10 rounded-xl shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-[#001d3a] mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-8">{updated}</p>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-xl font-semibold mb-2 text-[#003366]">{s.h}</h2>
              <p>{s.p.replace('{email}', email)}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
