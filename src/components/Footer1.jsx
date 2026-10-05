import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/emlr/logo1.png';
import { useSettings } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';

const LinkList = ({ title, links }) => (
  <div className="hidden md:block">
    <h2 className="text-xl font-bold mb-6 pb-2 relative inline-block">
      {title}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fae924]" />
    </h2>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link to={link.href} className="text-gray-300 flex items-center group hover:text-white">
            <span className="w-2 h-2 rounded-full bg-[#30b0d3] mr-3 group-hover:bg-[#fae924]" aria-hidden="true" />
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const { t } = useLanguage();
  const settings = useSettings();
  const phone = settings.phone || '+250 788 524 792';
  const email = settings.email || 'info@emlrkicukiroparish.org';
  const address = settings.address || 'Kicukiro, Kigali, Rwanda';
  const churchName = settings.churchName || 'EMLR Kicukiro';

  const socials = [
    { icon: <FaFacebookF />, label: 'Facebook', link: settings.facebook || 'https://www.facebook.com/p/EMLR-Kicukiro-100083143130293/' },
    { icon: <FaInstagram />, label: 'Instagram', link: settings.instagram || 'https://www.instagram.com/emlrkicukiro/' },
    { icon: <FaYoutube />, label: 'YouTube', link: settings.youtube || 'https://www.youtube.com/@emlrparoissekicukiro' },
  ];

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
    <footer className="defer-render bg-[#001d3a] text-white">
      <div className="w-full h-2 bg-gradient-to-r from-[#001d3a] via-[#5fb9e2] to-[#fae924]" />
      <div className="container mx-auto px-5 md:px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div>
            <div className="flex items-center mb-4 md:mb-6">
              <img src={logo} alt="" width="48" height="48" loading="lazy" className="h-12 w-12 object-contain mr-3" />
              <span className="text-2xl font-bold text-white">{churchName}</span>
            </div>
            <p className="hidden md:block mb-6 text-gray-300 leading-relaxed">{t('footer.blurb')}</p>
            <div className="flex space-x-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.link}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-white hover:text-[#001d3a]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <LinkList title={t('footer.quickLinks')} links={quickLinks} />
          <LinkList title={t('footer.resources')} links={involved} />

          <div>
            <h2 className="hidden md:inline-block text-xl font-bold mb-6 pb-2 relative">
              {t('footer.contactUs')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fae924]" />
            </h2>
            <address className="not-italic space-y-3 md:space-y-4">
              <div className="hidden md:flex items-start">
                <FaMapMarkerAlt className="text-[#30b0d3] mt-1 mr-3 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-300">
                  {churchName}
                  <br />
                  {address}
                </span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-[#30b0d3] mr-3" aria-hidden="true" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-gray-300 hover:text-white">
                  {phone}
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-[#30b0d3] mr-3" aria-hidden="true" />
                <a href={`mailto:${email}`} className="text-gray-300 hover:text-white break-all">
                  {email}
                </a>
              </div>
            </address>
            <nav className="md:hidden mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Footer">
              {[
                { name: t('footer.notices'), href: '/amatangazo' },
                { name: t('footer.giving'), href: '/give' },
                { name: t('footer.contact'), href: '/about/location' },
              ].map((l) => (
                <Link key={l.href} to={l.href} className="text-gray-300 underline-offset-4 hover:text-white hover:underline">
                  {l.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 text-xs md:text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} EMLR Kicukiro. {t('footer.rights')}
            <span className="mx-2">|</span>
            <Link to="/privacy-policy" className="hover:text-[#fae924]">
              {t('footer.privacy')}
            </Link>
            <span className="mx-2">|</span>
            <Link to="/terms-of-service" className="hover:text-[#fae924]">
              {t('footer.terms')}
            </Link>
          </p>
          <p>
            {t('footer.developedBy')}{' '}
            <a
              href="https://enoveta.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-300 hover:text-[#fae924] hover:underline underline-offset-2"
            >
              Enoveta
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
