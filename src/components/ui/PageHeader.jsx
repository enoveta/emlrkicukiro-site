import { useLanguage } from '../../i18n/LanguageContext';

/** Editorial title band for inner pages: paper background, tint panel, gold eyebrow, serif title. */
export default function PageHeader({ badge, title, subtitle, children }) {
  const { t } = useLanguage();
  return (
    <header className="relative overflow-hidden bg-paper border-b border-line">
      <span className="absolute top-0 right-0 hidden sm:block w-[34%] h-full bg-paper-tint" aria-hidden="true" />
      <span className="absolute -top-10 right-[8%] hidden sm:block w-36 h-36 rounded-full border border-gold-light/70" aria-hidden="true" />
      <span className="absolute -top-3 right-[calc(8%+28px)] hidden sm:block w-20 h-20 rounded-full border border-gold-light/70" aria-hidden="true" />
      <div className="site-container relative py-10 md:py-16 lg:py-[4.5rem]">
        <p className="eyebrow mb-4">{badge || t('home.heroKicker')}</p>
        <h1 className="h-display max-w-[820px] text-[2.6rem] sm:text-[3.1rem] lg:text-[3.9rem] leading-[1.02]">{title}</h1>
        {subtitle ? <p className="mt-4 md:mt-5 max-w-[620px] text-base md:text-lg leading-[1.75] text-[#435b60]">{subtitle}</p> : null}
        {children}
      </div>
    </header>
  );
}

/** Inner page: title band + content area. `tone` sets the content background. */
export function PageShell({ badge, title, subtitle, headerExtra, tone = 'white', narrow = false, children }) {
  return (
    <div className="min-h-screen">
      <PageHeader badge={badge} title={title} subtitle={subtitle}>
        {headerExtra}
      </PageHeader>
      <div className={tone === 'paper' ? 'bg-paper' : 'bg-white'}>
        <div className="site-container py-12 md:py-20">{narrow ? <div className="max-w-[900px]">{children}</div> : children}</div>
      </div>
    </div>
  );
}
