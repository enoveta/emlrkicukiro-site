import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/emlr/logo1.png';
import { useSettings } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';

const LinkList = ({ title, links }) => (
  <div>
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
  const email = settings.email || 'info@emlrkicukiro.rw';
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
    <footer className="bg-[#001d3a] text-white">
      <div className="w-full h-2 bg-gradient-to-r from-[#001d3a] via-[#5fb9e2] to-[#fae924]" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <img src={logo} alt="" width="48" height="48" loading="lazy" className="h-12 w-12 object-contain mr-3" />
              <span className="text-2xl font-bold text-white">{churchName}</span>
            </div>
            <p className="mb-6 text-gray-300 leading-relaxed">{t('footer.blurb')}</p>
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
            <h2 className="text-xl font-bold mb-6 pb-2 relative inline-block">
              {t('footer.contactUs')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fae924]" />
            </h2>
            <address className="not-italic space-y-4">
              <div className="flex items-start">
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
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm space-y-2 md:space-y-0">
          <span>
            &copy; {new Date().getFullYear()} EMLR Kicukiro. {t('footer.rights')}
          </span>
          <span className="hidden md:inline mx-2">|</span>
          <span className="block md:inline">
            <Link to="/privacy-policy" className="hover:text-[#fae924]">
              {t('footer.privacy')}
            </Link>
            <span className="mx-2">|</span>
            <Link to="/terms-of-service" className="hover:text-[#fae924]">
              {t('footer.terms')}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
