import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone, FaGlobe, FaBullhorn } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import logo from '../assets/emlr/logo1.png';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';
import { usePublicData, useSettings } from '../api/usePublicData';

const DEFAULT_PHONE = '+250 788 524 792';
const SOCIAL_DEFAULTS = {
  facebook: 'https://www.facebook.com/p/EMLR-Kicukiro-100083143130293/',
  instagram: 'https://www.instagram.com/emlrkicukiro/',
  youtube: 'https://www.youtube.com/@emlrparoissekicukiro',
};
const DEPARTMENTS = [
  { key: 'evangelism', label: 'nav.evangelismDept' },
  { key: 'social', label: 'nav.socialDept' },
  { key: 'development', label: 'nav.planningDept' },
  { key: 'education', label: 'nav.educationDept' },
];

const SocialIcon = ({ href, label, path }) => (
  <a href={href} className="hover:text-[#feed17]" target="_blank" rel="noopener noreferrer" aria-label={label}>
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  </a>
);

const Header = ({ scrolled }) => {
  const { lang, setLang, t } = useLanguage();
  const settings = useSettings();
  const { data: ministries } = usePublicData('/ministries', []);
  const phone = settings.phone || DEFAULT_PHONE;
  const social = {
    facebook: settings.facebook || SOCIAL_DEFAULTS.facebook,
    instagram: settings.instagram || SOCIAL_DEFAULTS.instagram,
    youtube: settings.youtube || SOCIAL_DEFAULTS.youtube,
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const openMenu = (key) => {
    cancelClose();
    setActiveMenu(key);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setActiveMenu(null), 200);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setLanguageOpen(false);
  }, [location.pathname]);

  // Escape closes any open menu; clicking outside closes too.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setLanguageOpen(false);
      }
    };
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMenu(null);
        setLanguageOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  const departmentColumns = DEPARTMENTS.map((dept) => ({
    title: t(dept.label),
    items: (ministries || [])
      .filter((m) => m.category === dept.key)
      .map((m) => ({ name: localized(m, 'name', lang), href: `/ministries/${m.slug}` })),
  })).filter((col) => col.items.length);

  // Order requested: About · Departments · News · Events · Donate
  const mainNavLinks = [
    {
      key: 'about',
      name: t('nav.aboutUs'),
      columns: [
        {
          title: t('nav.ourChurch'),
          items: [
            { name: t('nav.ourHistory'), href: '/about' },
            { name: t('nav.missionVision'), href: '/about/mission-vision' },
          ],
        },
        {
          title: t('nav.churchLeadership'),
          items: [
            { name: t('nav.orgStructure'), href: '/about/leadership' },
            { name: t('nav.pastoralTeam'), href: '/about/team' },
          ],
        },
        {
          title: t('nav.ourParish'),
          items: [{ name: t('nav.locationDirections'), href: '/about/location' }],
        },
      ],
    },
    { key: 'departments', name: t('nav.departments'), columns: departmentColumns },
    {
      key: 'media',
      name: t('nav.media'),
      items: [
        { name: t('nav.churchNews'), href: '/news' },
        { name: t('nav.notices'), href: '/amatangazo' },
        { name: t('nav.photoGallery'), href: '/gallery' },
        { name: t('nav.tv'), href: '/tv' },
      ],
    },
    { key: 'events', name: t('nav.events'), href: '/events' },
    { key: 'give', name: t('nav.give'), href: '/give', cta: true },
  ];

  const isActive = (link) => {
    const hrefs = link.href
      ? [link.href]
      : (link.columns ? link.columns.flatMap((c) => c.items) : link.items || []).map((i) => i.href);
    return hrefs.some((h) => location.pathname === h || location.pathname.startsWith(`${h}/`));
  };

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'rw', label: 'RW', name: 'Ikinyarwanda' },
  ];

  const LanguageMenu = ({ className = '' }) => (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setLanguageOpen(!languageOpen)}
        className="flex items-center hover:text-[#feed17] transition-colors"
        aria-label={t('nav.language')}
        aria-expanded={languageOpen}
        aria-haspopup="true"
      >
        <FaGlobe className="mr-1 text-[#feed17]" aria-hidden="true" />
        <span>{lang === 'rw' ? 'RW' : 'EN'}</span>
        <IoIosArrowDown className="ml-1 text-xs" aria-hidden="true" />
      </button>
      {languageOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-1 z-50">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              lang={item.code}
              onClick={() => {
                setLang(item.code);
                setLanguageOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                lang === item.code ? 'bg-[#003366] text-white' : 'text-[#003366] hover:bg-[#003366] hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const megaLink = mainNavLinks.find((l) => l.key === activeMenu && l.columns);

  return (
    <header ref={headerRef} className="fixed w-full z-50 top-0">
      <div
        className={`bg-gradient-to-r from-[#001a33] to-[#002244] text-white text-sm transition-all duration-300 hidden md:block ${
          scrolled ? 'h-0 overflow-hidden' : 'py-2'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          <div className="flex space-x-6">
            <Link to="/amatangazo" className="flex items-center hover:text-[#feed17] transition-colors py-1">
              <FaBullhorn className="mr-2 text-[#5fb8e1]" aria-hidden="true" />
              {t('nav.notices')}
            </Link>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center hover:text-[#feed17] transition-colors py-1">
              <FaPhone className="mr-2 text-[#5fb8e1]" aria-hidden="true" />
              {phone}
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-3 border-r border-white/20 pr-4">
              <SocialIcon
                href={social.facebook}
                label="Facebook"
                path="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              />
              <SocialIcon
                href={social.instagram}
                label="Instagram"
                path="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3a3 3 0 110-6zm4.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
              />
              <SocialIcon
                href={social.youtube}
                label="YouTube"
                path="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
              />
            </div>
            <LanguageMenu />
          </div>
        </div>
      </div>

      <div className="h-px bg-[#5ebadf]" />
      <div
        className={`relative transition-all duration-300 ${
          scrolled || !isHomePage ? 'py-2 bg-[#003366] shadow-lg' : 'py-3 bg-[#003366]/60 backdrop-blur-sm'
        }`}
        onMouseLeave={scheduleClose}
      >
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center" aria-label="EMLR Kicukiro — home">
            <img src={logo} alt="" width="64" height="64" className="h-14 w-14 md:h-16 md:w-16 object-contain" />
            <div className="ml-3">
              <span className="block text-xl font-bold text-white leading-tight">EMLR</span>
              <span className="block text-xs text-white/80">{t('parish')}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main">
            {mainNavLinks.map((link) => {
              const hasMenu = Boolean(link.columns || link.items);
              const isOpen = activeMenu === link.key;
              const active = isActive(link);
              const baseClass = `flex items-center py-3 px-3 font-medium transition-colors duration-200 ${
                isOpen || active ? 'text-[#feed17]' : 'text-white hover:text-[#feed17]'
              }`;
              if (link.cta) {
                return (
                  <Link
                    key={link.key}
                    to={link.href}
                    onMouseEnter={scheduleClose}
                    className="ml-3 bg-[#feed17] text-[#003366] rounded-lg px-7 py-3 font-semibold hover:bg-white transition-colors"
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <div
                  key={link.key}
                  className="relative px-1"
                  onMouseEnter={() => (hasMenu ? openMenu(link.key) : scheduleClose())}
                >
                  {hasMenu ? (
                    <button
                      type="button"
                      className={baseClass}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => (isOpen ? setActiveMenu(null) : openMenu(link.key))}
                    >
                      {link.name}
                      <IoIosArrowDown className={`ml-1 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                  ) : (
                    <Link to={link.href} className={baseClass} aria-current={active ? 'page' : undefined}>
                      {link.name}
                    </Link>
                  )}

                  {link.items && isOpen && (
                    <div className="absolute left-0 top-full z-40 pt-2" onMouseEnter={() => openMenu(link.key)}>
                      <ul className="w-56 bg-white shadow-lg rounded-md py-1 border border-gray-100">
                        {link.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              to={item.href}
                              className="block px-4 py-2.5 text-[#003366] hover:bg-[#003366] hover:text-white focus:bg-[#003366] focus:text-white text-sm"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4 lg:hidden">
            <LanguageMenu className="md:hidden text-white" />
            <button
              className="text-white text-2xl p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t('nav.menu')}
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {megaLink && (
          <div
            className="absolute left-0 right-0 top-full z-40 pt-2 -mt-2 hidden lg:block"
            onMouseEnter={() => openMenu(megaLink.key)}
            onMouseLeave={scheduleClose}
          >
            <div className="bg-white shadow-xl border-t border-gray-100 py-6 px-8">
              <div
                className={`container mx-auto grid gap-8 ${
                  megaLink.columns.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'
                }`}
              >
                {megaLink.columns.map((column) => (
                  <div key={column.title}>
                    <h3 className="text-lg font-bold text-[#003366] mb-3 pb-2 border-b border-gray-200">{column.title}</h3>
                    <ul className="space-y-1">
                      {column.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className="block text-gray-700 hover:text-[#003366] hover:bg-gray-50 focus:bg-gray-50 p-2 rounded"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <nav
          className="lg:hidden bg-[#003366] text-white border-t border-white/10 max-h-[calc(100vh-5rem)] overflow-y-auto"
          aria-label="Mobile"
        >
          <div className="px-4 py-3 space-y-1">
            {mainNavLinks.map((link) => (
              <div key={link.key}>
                {link.columns || link.items ? (
                  <>
                    <button
                      type="button"
                      className="w-full flex justify-between items-center py-3 text-left font-medium"
                      aria-expanded={mobileSubmenu === link.key}
                      onClick={() => setMobileSubmenu(mobileSubmenu === link.key ? null : link.key)}
                    >
                      <span>{link.name}</span>
                      <IoIosArrowDown className={`transition ${mobileSubmenu === link.key ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    {mobileSubmenu === link.key && (
                      <div className="pl-3 pb-2">
                        {link.columns
                          ? link.columns.map((column) => (
                              <div key={column.title} className="mb-2">
                                <p className="text-xs uppercase tracking-wide text-[#5fb8e1] mt-2 mb-1">{column.title}</p>
                                {column.items.map((item) => (
                                  <Link key={item.href} to={item.href} className="block py-2 text-white/90">
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            ))
                          : link.items.map((item) => (
                              <Link key={item.href} to={item.href} className="block py-2 text-white/90">
                                {item.name}
                              </Link>
                            ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className={`block py-3 font-medium ${link.cta ? 'mt-2 text-center rounded-lg bg-[#feed17] text-[#003366]' : ''}`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center py-3 text-white/90">
              <FaPhone className="mr-2 text-[#5fb8e1]" aria-hidden="true" />
              {phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
