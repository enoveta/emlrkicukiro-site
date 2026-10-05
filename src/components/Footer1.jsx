import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/emlr/logo1.png';
import { usePublicData } from '../api/usePublicData';
import { useLanguage } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const { data: settings } = usePublicData('/settings', {});
  const phone = settings?.phone || '+250 788 524 792';
  const email = settings?.email || 'info@emlrkicukiro.rw';
  const address = settings?.address || 'Kicukiro District, Kigali';
  const churchName = settings?.churchName || 'EMLR Kicukiro';

  const quickLinks = [
    { name: t('footer.aboutUs'), href: '/about' },
    { name: t('footer.ministries'), href: '/ministries' },
    { name: t('footer.sermons'), href: '/media' },
    { name: t('footer.events'), href: '/events' },
    { name: t('footer.contact'), href: '/about/location' },
  ];

  const resources = [
    { name: t('footer.bibleStudies'), href: '/ministries' },
    { name: t('footer.giving'), href: '/give' },
    { name: t('footer.newsUpdates'), href: '/media/news' },
  ];

  return (
    <footer className="bg-[#001d3a] text-white">
      <div className="w-full h-12 bg-gradient-to-r from-[#001d3a] via-[#5fb9e2] to-[#fae924]" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <img src={logo} alt="EMLR Kicukiro Logo" className="h-12 mr-3" />
              <h1 className="text-2xl font-bold text-white">{churchName}</h1>
            </div>
            <p className="mb-6 text-gray-300 leading-relaxed">{t('footer.blurb')}</p>
            <div className="flex space-x-3">
              {[
                { icon: <FaFacebookF />, link: settings?.facebook || 'https://www.facebook.com/p/EMLR-Kicukiro-100083143130293/' },
                { icon: <FaInstagram />, link: settings?.instagram || 'https://www.instagram.com/emlrkicukiro/' },
                { icon: <FaYoutube />, link: settings?.youtube || 'https://www.youtube.com/@emlrparoissekicukiro' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-[#001d3a]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 relative inline-block">
              {t('footer.quickLinks')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fae924]" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href + link.name}>
                  <a href={link.href} className="text-gray-300 flex items-center group hover:text-white">
                    <span className="w-2 h-2 rounded-full bg-[#30b0d3] mr-3 group-hover:bg-[#fae924]" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 relative inline-block">
              {t('footer.resources')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fae924]" />
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.href + link.name}>
                  <a href={link.href} className="text-gray-300 flex items-center group hover:text-white">
                    <span className="w-2 h-2 rounded-full bg-[#30b0d3] mr-3 group-hover:bg-[#fae924]" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 relative inline-block">
              {t('footer.contactUs')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fae924]" />
            </h3>
            <address className="not-italic space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-[#30b0d3] mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-300">
                  {churchName}
                  <br />
                  {address}
                </span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-[#30b0d3] mr-3" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-gray-300 hover:text-white">
                  {phone}
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-[#30b0d3] mr-3" />
                <a href={`mailto:${email}`} className="text-gray-300 hover:text-white">
                  {email}
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} EMRL Kicukiro. {t('footer.rights')}
            <span className="mx-2">|</span>
            <a href="/privacy-policy" className="hover:text-[#fae924]">
              {t('footer.privacy')}
            </a>
            <span className="mx-2">|</span>
            <a href="/terms-of-service" className="hover:text-[#fae924]">
              {t('footer.terms')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
