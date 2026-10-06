import { Link } from 'react-router-dom';
import { useSettings } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';
import { Brand, DEFAULT_PHONE, socialLinks } from './Header1';

const LinkColumn = ({ title, links }) => (
  <div className="flex flex-col items-start gap-2.5">
    <h2 className="mt-1 mb-2 text-[11px] md:text-xs font-bold uppercase tracking-[0.11em] text-white">{title}</h2>
    {links.map((link) => (
      <Link key={link.href} to={link.href} className="text-sm md:text-[15px] leading-[1.6] text-[#b7c3c1] hover:text-[#ecd8aa] transition-colors">
        {link.name}
      </Link>
    ))}
  </div>
);

const Footer = () => {
  const { t } = useLanguage();
  const settings = useSettings();
  const phone = settings.phone || DEFAULT_PHONE;
  const email = settings.email || 'info@emlrkicukiroparish.org';
  const address = settings.address || 'Kicukiro, Kigali, Rwanda';
  const churchName = settings.churchName || 'EMLR Kicukiro';

  const quickLinks = [
    { name: t('footer.aboutUs'), href: '/about' },
    { name: t('footer.ministries'), href: '/ministries' },
    { name: t('footer.events'), href: '/events' },
    { name: t('footer.notices'), href: '/amatangazo' },
    { name: t('footer.tv'), href: '/tv' },
    { name: t('footer.contact'), href: '/about/location' },
  ];

  const involved = [
    { name: t('footer.giving'), href: '/give' },
    { name: t('footer.prayer'), href: '/prayer-requests' },
    { name: t('footer.volunteer'), href: '/volunteer' },
  ];

  return (
    <footer className="defer-render bg-ink-footer text-[#d9e0df]">
      <div className="site-container grid grid-cols-2 gap-x-5 gap-y-8 pt-11 pb-8 md:grid-cols-3 md:gap-8 md:pt-14 md:pb-10 lg:grid-cols-[1.5fr_.9fr_.95fr_1.1fr] lg:gap-11 lg:pt-16">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Brand subtitle={t('parish')} dark />
          <p className="max-w-[340px] my-4 text-sm md:text-[15px] leading-[1.7] text-[#b7c3c1]">{t('footer.blurb')}</p>
          <div className="flex gap-2">
            {socialLinks(settings).map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={`EMLR Kicukiro on ${label}`}
                target="_blank"
                rel="noopener noreferrer"
                className="grid place-items-center w-9 h-9 rounded-full border border-white/20 text-[13px] text-[#dce4e3] hover:bg-gold-light hover:text-ink-deep transition-colors"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <LinkColumn title={t('footer.quickLinks')} links={quickLinks} />
        <LinkColumn title={t('footer.resources')} links={involved} />

        <div className="col-span-2 md:col-span-1 flex flex-col items-start gap-2.5">
          <h2 className="mt-1 mb-2 text-[11px] md:text-xs font-bold uppercase tracking-[0.11em] text-white">{t('footer.contactUs')}</h2>
          <address className="not-italic flex flex-col items-start gap-2.5 text-sm md:text-[15px] leading-[1.6] text-[#b7c3c1]">
            <span>
              {churchName}
              <br />
              {address}
            </span>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-[#ecd8aa]">
              {phone}
            </a>
            <a href={`mailto:${email}`} className="hover:text-[#ecd8aa] break-all">
              {email}
            </a>
          </address>
        </div>
      </div>

      <div className="site-container flex justify-start md:justify-end gap-5 pb-3.5 text-[13px] text-[#b7c3c1]">
        <Link to="/privacy-policy" className="hover:text-[#ecd8aa]">
          {t('footer.privacy')}
        </Link>
        <Link to="/terms-of-service" className="hover:text-[#ecd8aa]">
          {t('footer.terms')}
        </Link>
      </div>
      <div className="site-container flex flex-col gap-1.5 md:flex-row md:justify-between md:gap-5 pt-3.5 pb-5 border-t border-white/[.12] text-xs md:text-[13px] tracking-[0.025em] text-[#9eaeac]">
        <span>
          &copy; {new Date().getFullYear()} EMLR Kicukiro Parish. {t('footer.rights')}
        </span>
        <span>
          {t('footer.developedBy')}{' '}
          <a href="https://enoveta.com" target="_blank" rel="noopener noreferrer" className="font-bold text-[#ded0ac] hover:text-[#ecd8aa]">
            Enoveta
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
