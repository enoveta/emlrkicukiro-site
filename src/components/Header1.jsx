import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaPhone,
  FaChurch,
  FaGlobe,
  FaUsers,
  FaCalendarAlt,
  FaNewspaper,
  FaTv,
} from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import logo from '../assets/emlr/logo1.png';
import { useLanguage } from '../i18n/LanguageContext';
import { usePublicData } from '../api/usePublicData';

const Header = ({ scrolled }) => {
  const { lang, setLang, t } = useLanguage();
  const { data: settings } = usePublicData('/settings', {});
  const phone = settings?.phone || '+250 788 524 792';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const showStickyHeader = !isHomePage;

  const cancelCloseMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = (key) => {
    cancelCloseMenu();
    setActiveMegaMenu(key);
  };

  const scheduleCloseMenu = () => {
    cancelCloseMenu();
    closeTimer.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 220);
  };

  useEffect(() => () => cancelCloseMenu(), []);

  // Close menus on route change
  useEffect(() => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    setLanguageOpen(false);
  }, [location.pathname]);

  const topNavLinks = [
    {
      name: t('nav.announcements'),
      href: '/events',
      icon: <FaCalendarAlt className="mr-2 text-[#5fb8e1]" />,
    },
    {
      name: phone,
      href: `tel:${phone.replace(/\s/g, '')}`,
      icon: <FaPhone className="mr-2 text-[#5fb8e1]" />,
    },
  ];

  const mainNavLinks = [
    {
      key: 'about',
      name: t('nav.aboutUs'),
      href: '/about',
      icon: <FaChurch className="mr-1" />,
      megaMenu: true,
      columns: [
        {
          title: t('nav.ourChurch'),
          items: [
            { name: t('nav.aboutUs'), href: '/about' },
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
    {
      key: 'events',
      name: t('nav.events'),
      href: '/events',
      icon: <FaCalendarAlt className="mr-1" />,
    },
    {
      key: 'departments',
      name: t('nav.departments'),
      href: '#',
      icon: <FaUsers className="mr-1" />,
      megaMenu: true,
      columns: [
        {
          title: t('nav.evangelismDept'),
          items: [
            { name: 'Ibyiringiro Choir', href: '/ministries/ibyiringiro-choir' },
            { name: 'Narada Choir', href: '/ministries/narada-choir' },
            { name: 'Reverence Worship Team', href: '/ministries/reverence-worship-team' },
            { name: 'Fruta Melody', href: '/ministries/fruta-melody' },
            { name: 'Maranata Choir', href: '/ministries/maranata-choir' },
          ],
        },
        {
          title: t('nav.socialDept'),
          items: [
            { name: t('nav.menFellowship'), href: '/ministries/men-fellowship' },
            { name: t('nav.womenFellowship'), href: '/ministries/women-fellowship' },
            { name: t('nav.familyCommission'), href: '/ministries/family-commission' },
            { name: t('nav.cellGroup'), href: '/ministries/evangelism-team' },
          ],
        },
        {
          title: t('nav.planningDept'),
          items: [
            { name: t('nav.ictTeam'), href: '/ministries/ict-technical-team' },
            { name: t('nav.protocolTeam'), href: '/ministries/protocol-team' },
            { name: t('nav.prayerMinistry'), href: '/ministries/prayer-ministry' },
            { name: t('nav.churchAdvisors'), href: '/ministries/church-advisors' },
          ],
        },
        {
          title: t('nav.educationDept'),
          items: [
            { name: t('nav.youthMinistry'), href: '/ministries/youth-ministry' },
            { name: t('nav.sundaySchool'), href: '/ministries/children-ministry' },
          ],
        },
      ],
    },
    {
      key: 'media',
      name: t('nav.media'),
      href: '#',
      icon: <FaNewspaper className="mr-1" />,
      items: [
        { name: t('nav.churchNews'), href: '/media/news' },
        { name: t('nav.photoGallery'), href: '/media/gallery' },
      ],
    },
    {
      key: 'tv',
      name: t('nav.tv'),
      href: '/media/tv',
      icon: <FaTv className="mr-1" />,
    },
    {
      key: 'give',
      name: t('nav.give'),
      href: '/give',
      cta: true,
    },
  ];

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
        aria-label="Language"
      >
        <FaGlobe className="mr-1 text-[#feed17]" />
        <span>{lang === 'rw' ? 'RW' : 'EN'}</span>
        <IoIosArrowDown className="ml-1 text-xs" />
      </button>
      {languageOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-1 z-30">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLang(item.code);
                setLanguageOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                lang === item.code
                  ? 'bg-[#003366] text-white'
                  : 'text-[#003366] hover:bg-[#003366] hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="fixed w-full z-50">
      <div
        className={`bg-gradient-to-r from-[#001a33] to-[#002244] text-white text-sm transition-all duration-300 ${
          scrolled ? 'h-0 overflow-hidden' : 'py-2'
        } hidden md:block`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              {topNavLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.href.startsWith('tel') ? (
                    <a href={link.href} className="flex items-center hover:text-[#feed17] transition-colors duration-200 py-1">
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <Link to={link.href} className="flex items-center hover:text-[#feed17] transition-colors duration-200 py-1">
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-3 border-r border-white/20 pr-4">
                <a href={settings?.facebook || 'https://www.facebook.com/p/EMLR-Kicukiro-100083143130293/'} className="hover:text-[#feed17]" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href={settings?.instagram || 'https://www.instagram.com/emlrkicukiro/'} className="hover:text-[#feed17]" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3a3 3 0 110-6zm4.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                </a>
                <a href={settings?.youtube || 'https://www.youtube.com/@emlrparoissekicukiro'} className="hover:text-[#feed17]" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
              <LanguageMenu />
            </div>
          </div>
        </div>
      </div>

      <hr className="bg-[#5ebadf] h-[1px] border-0" />
      <div
        className={`relative transition-all py-5 duration-300 ${
          scrolled || showStickyHeader ? 'py-2 bg-[#003366] shadow-lg' : 'py-3 bg-[#003366]/60 backdrop-blur-sm'
        }`}
        onMouseLeave={scheduleCloseMenu}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="EMLR Kicukiro Logo" className="h-16 transition-all duration-300" />
              <div className="ml-3">
                <h1 className="text-xl mt-2 font-bold text-white">EMLR</h1>
                <p className="text-xs text-white/80">{lang === 'rw' ? 'Paruwasi ya Kicukiro' : 'Kicukiro Parish'}</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavLinks.map((link) => {
                const hasMenu = Boolean(link.columns || link.items);
                const isOpen = activeMegaMenu === link.key;
                return (
                  <div
                    key={link.key}
                    className={`relative group ${link.cta ? 'ml-2' : 'px-2'}`}
                    onMouseEnter={() => {
                      if (hasMenu) openMenu(link.key);
                      else scheduleCloseMenu();
                    }}
                  >
                    <Link
                      to={link.href === '#' ? '#' : link.href}
                      onClick={(e) => {
                        if (link.href === '#') e.preventDefault();
                      }}
                      className={`flex items-center py-3 px-3 font-medium transition-colors duration-300 ${
                        link.cta
                          ? 'bg-[#feed17] text-[#003366] rounded-lg px-8 hover:shadow-md'
                          : isOpen
                            ? 'text-[#feed17]'
                            : 'text-white hover:text-[#feed17]'
                      }`}
                    >
                      {link.icon && <span className="mr-1">{link.icon}</span>}
                      {link.name}
                      {hasMenu && !link.cta && (
                        <IoIosArrowDown className="ml-1 text-xs opacity-70" />
                      )}
                    </Link>

                    {/* Small dropdowns (e.g. Media) — bridge so mouse can reach items */}
                    {link.items && !link.megaMenu && isOpen && (
                      <div
                        className="absolute left-0 top-full z-30 pt-2"
                        onMouseEnter={() => openMenu(link.key)}
                      >
                        <div className="w-48 bg-white shadow-lg rounded-md py-1 border border-gray-100">
                          {link.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="block px-4 py-2 text-[#003366] hover:bg-[#003366] hover:text-white text-sm"
                              onClick={() => setActiveMegaMenu(null)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center space-x-3">
              <LanguageMenu className="md:hidden text-white" />
              <button
                className="lg:hidden text-white text-2xl focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                type="button"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Full-width mega menu — flush under nav, with hover bridge */}
        {activeMegaMenu &&
          (() => {
            const activeLink = mainNavLinks.find((link) => link.key === activeMegaMenu);
            if (!activeLink?.columns) return null;
            return (
              <div
                className="absolute left-0 right-0 top-full z-40 pt-2 -mt-2"
                onMouseEnter={() => openMenu(activeLink.key)}
                onMouseLeave={scheduleCloseMenu}
              >
                <div className="bg-white shadow-xl border-t border-gray-100 py-6 px-8">
                  <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {activeLink.columns.map((column, colIndex) => (
                        <div key={colIndex}>
                          <h3 className="text-lg font-bold text-[#003366] mb-4 pb-2 border-b border-gray-200">
                            {column.title}
                          </h3>
                          <ul className="space-y-2">
                            {column.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  to={item.href}
                                  className="flex items-center text-gray-700 hover:text-[#003366] hover:bg-gray-50 p-2 rounded"
                                  onClick={() => setActiveMegaMenu(null)}
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
              </div>
            );
          })()}
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#003366] text-white border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-2">
            {mainNavLinks.map((link) => (
              <div key={link.key}>
                {link.columns || link.items ? (
                  <>
                    <button
                      type="button"
                      className="w-full flex justify-between items-center py-3 text-left font-medium"
                      onClick={() => setMobileSubmenu(mobileSubmenu === link.key ? null : link.key)}
                    >
                      <span>{link.name}</span>
                      <IoIosArrowDown className={`transition ${mobileSubmenu === link.key ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSubmenu === link.key && (
                      <div className="pl-3 pb-2 space-y-1">
                        {(link.columns
                          ? link.columns.flatMap((c) => c.items)
                          : link.items || []
                        ).map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="block py-2 text-white/90"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className={`block py-3 font-medium ${link.cta ? 'text-[#feed17]' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-white/20 flex gap-2">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`flex-1 py-2 rounded-lg text-sm ${
                    lang === item.code ? 'bg-[#feed17] text-[#003366]' : 'bg-white/10'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
