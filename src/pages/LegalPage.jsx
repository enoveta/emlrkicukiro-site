import { useLanguage } from '../i18n/LanguageContext';
import { useSettings } from '../api/usePublicData';
import { PageShell } from '../components/ui/PageHeader';
import usePageMeta from '../hooks/usePageMeta';

/** Shared layout for Privacy Policy and Terms. `content` = { en: [{h, p}], rw: [{h, p}] }. */
export default function LegalPage({ title, content, updated }) {
  const { lang } = useLanguage();
  const settings = useSettings();
  const email = settings.email || 'info@emlrkicukiroparish.org';
  usePageMeta(title);
  const sections = content[lang] || content.en;

  return (
    <PageShell badge="EMLR Kicukiro Parish" title={title} subtitle={updated} narrow>
      <div className="border-t border-line">
        {sections.map((s, i) => (
          <section key={s.h} className="grid gap-2 md:grid-cols-[56px_minmax(0,1fr)] py-7 border-b border-line">
            <span className="font-serif text-xl text-gold">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="font-serif text-[1.45rem] leading-tight text-ink mb-2.5">{s.h}</h2>
              <p className="text-[17px] leading-[1.8] text-[#435b60]">{s.p.replace('{email}', email)}</p>
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
