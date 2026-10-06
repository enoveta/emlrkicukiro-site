import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import logo from '../assets/emlr/logo1.png';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../i18n/translations';
import { usePublicData, useSettings } from '../api/usePublicData';

export const DEFAULT_PHONE = '+250 788 524 792';
export const SOCIAL_DEFAULTS = {
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

export const socialLinks = (settings) => [
  { label: 'Facebook', href: settings.facebook || SOCIAL_DEFAULTS.facebook, Icon: FaFacebookF },
  { label: 'Instagram', href: settings.instagram || SOCIAL_DEFAULTS.instagram, Icon: FaInstagram },
  { label: 'YouTube', href: settings.youtube || SOCIAL_DEFAULTS.youtube, Icon: FaYoutube },
];

export const PhoneIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 20 20"
    className={`${className} fill-none stroke-current`}
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6.1 2.5 8.3 6l-1.5 1.4c.9 1.9 2.2 3.2 4.1 4.1l1.4-1.5 3.5 2.2-.7 3c-.2.7-.9 1.2-1.6 1.1C7.4 15.4 3.2 11.2 2.3 5.1c-.1-.7.4-1.4 1.1-1.6l2.7-1Z" />
  </svg>
);

/** Square brand mark + serif name, shared by header and footer. */
export const Brand = ({ subtitle, dark = false }) => (
  <Link to="/" className="inline-flex items-center gap-3 min-w-0" aria-label="EMLR Kicukiro Parish home">
    <span className="grid place-items-center w-11 h-11 md:w-12 md:h-12 flex-none bg-white overflow-hidden">
      <img src={logo} alt="" width="44" height="44" className="w-10 h-10 md:w-11 md:h-11 object-contain" />
    </span>
    <span className="flex flex-col min-w-0">
      <span className={`font-serif text-lg md:text-xl leading-none ${dark ? 'text-white' : 'text-ink'}`}>EMLR</span>
      <span
        className={`mt-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.075em] leading-tight ${
          dark ? 'text-[#b5c0be]' : 'text-[#69797b]'
        }`}
      >
        {subtitle}
      </span>
    </span>
  </Link>
);

const MobileLink = ({ href, active, sub = false, children }) => (
  <Link
    to={href}
    aria-current={active ? 'page' : undefined}
    className={`flex items-center justify-between gap-3 transition-colors ${
      sub ? 'pl-4 pr-3 py-2.5 text-[15px]' : 'px-3 py-3.5 text-[17px] font-semibold'
    } ${active ? 'bg-paper-featured text-ink font-semibold' : 'text-[#334c51] active:bg-paper'}`}
  >
    <span>{children}</span>
    {active ? <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" /> : null}
  </Link>
);

const Header = ({ scrolled }) => {
  const { lang, setLang, t } = useLanguage();
  const settings = useSettings();
  const { data: ministries } = usePublicData('/ministries', []);
  const phone = settings.phone || DEFAULT_PHONE;
  const social = socialLinks(settings);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);
  const location = useLocation();

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

  // Mobile menu is full height: stop the page behind it from scrolling.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
  }, [location.pathname]);

  // Escape closes any open menu; clicking outside closes too.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileMenuOpen(false);
      }
    };
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMenu(null);
        setMobileMenuOpen(false);
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

  // Order requested: About · Departments · TV · News · Events · Donate
  const mainNavLinks = [
    {
      key: 'about',
      name: t('nav.aboutUs'),
      feature: { title: t('home.noticesTitle'), text: t('schedule.pageSubtitle'), cta: t('home.allNotices'), href: '/amatangazo' },
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
          items: [
            { name: t('nav.locationDirections'), href: '/about/location' },
            { name: t('nav.notices'), href: '/amatangazo' },
          ],
        },
      ],
    },
    {
      key: 'departments',
      name: t('nav.departments'),
      columns: departmentColumns,
      feature: { title: t('ministries.title'), text: t('home.ministriesSubtitle'), cta: t('home.discoverAll'), href: '/ministries' },
    },
    { key: 'tv', name: t('nav.tv'), href: '/tv' },
    {
      key: 'media',
      name: t('nav.media'),
      items: [
        { name: t('nav.churchNews'), href: '/news' },
        { name: t('nav.notices'), href: '/amatangazo' },
        { name: t('nav.photoGallery'), href: '/gallery' },
      ],
    },
    { key: 'events', name: t('nav.events'), href: '/events' },
  ];

  const isActive = (link) => {
    const hrefs = link.href
      ? [link.href]
      : (link.columns ? link.columns.flatMap((c) => c.items) : link.items || []).map((i) => i.href);
    return hrefs.some((h) => location.pathname === h || location.pathname.startsWith(`${h}/`));
  };
  const isCurrent = (href) => location.pathname === href;
  const currentSection = mainNavLinks.find((l) => (l.columns || l.items) && isActive(l))?.key || '';
  const openSection = mobileSubmenu === null ? currentSection : mobileSubmenu;
  const megaLink = mainNavLinks.find((l) => l.key === activeMenu && l.columns);

  const languageSwitch = (
    <div className="inline-flex items-center gap-0.5 p-0.5 rounded-full border border-white/20" role="group" aria-label={t('nav.language')}>
      {['en', 'rw'].map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`min-w-[32px] md:min-w-[36px] px-1.5 md:px-2 py-[3px] rounded-full text-[11px] md:text-xs font-bold tracking-[0.05em] transition-colors ${
            lang === code ? 'bg-gold-light text-ink-deep' : 'text-[#bdc9c8] hover:text-white'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Utility bar */}
      <div className="bg-ink-deep text-[#e2e8e7]">
        <div className="site-container flex min-h-[38px] md:min-h-[42px] items-center justify-between gap-2 md:gap-6">
          <Link
            to="/amatangazo"
            className="inline-flex items-center gap-2 md:gap-2.5 text-xs md:text-[13px] font-semibold text-[#f4eee1] hover:text-gold-light transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-light shadow-[0_0_0_3px_rgba(221,197,143,.12)]" aria-hidden="true" />
            {t('nav.notices')}
            <span className="text-[#d8c39a] text-xs" aria-hidden="true">
              ↗
            </span>
          </Link>
          <div className="flex items-center gap-2.5 md:gap-5">
            <div className="hidden md:flex items-center gap-2" aria-label="Social media">
              {social.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`EMLR Kicukiro on ${label}`}
                  className="grid place-items-center w-6 h-6 rounded-full border border-white/[.17] text-[10px] text-[#dce4e3] hover:bg-gold-light hover:text-ink-deep transition-colors"
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 w-7 h-7 sm:w-auto sm:h-auto rounded-full border border-white/20 sm:border-0 text-[13px] text-[#d4dddc] hover:text-white"
              aria-label={phone}
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{phone}</span>
            </a>
            {languageSwitch}
          </div>
        </div>
      </div>

      {/* Main header (sticky) */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 bg-white/[.97] backdrop-blur border-b border-ink/[.07] transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_8px_24px_rgba(20,54,66,.08)]' : ''
        }`}
        onMouseLeave={scheduleClose}
      >
        <div className="site-container relative flex min-h-[70px] md:min-h-[78px] lg:min-h-[86px] items-center justify-between gap-6">
          <Brand subtitle={t('parish')} />

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-semibold text-[#334c51]" aria-label="Main">
            {mainNavLinks.map((link) => {
              const hasMenu = Boolean(link.columns || link.items);
              const isOpen = activeMenu === link.key;
              const active = isActive(link);
              const linkClass = `group relative inline-flex items-center gap-1.5 py-2.5 whitespace-nowrap transition-colors ${
                active || isOpen ? 'text-ink' : 'hover:text-ink'
              }`;
              const underline = (
                <span
                  className={`absolute left-0 right-0 bottom-0.5 h-px bg-gold origin-left transition-transform duration-200 ${
                    active || isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'
                  }`}
                  aria-hidden="true"
                />
              );
              return (
                <div key={link.key} className="relative" onMouseEnter={() => (hasMenu ? openMenu(link.key) : scheduleClose())}>
                  {hasMenu ? (
                    <button
                      type="button"
                      className={linkClass}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => (isOpen ? setActiveMenu(null) : openMenu(link.key))}
                    >
                      {link.name}
                      <IoIosArrowDown className={`text-[11px] text-gold transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                      {underline}
                    </button>
                  ) : (
                    <Link to={link.href} className={linkClass} aria-current={active ? 'page' : undefined}>
                      {link.name}
                      {underline}
                    </Link>
                  )}

                  {link.items && isOpen && (
                    <div className="absolute -left-5 top-full z-40 pt-4" onMouseEnter={() => openMenu(link.key)}>
                      <ul className="w-60 bg-white shadow-[0_22px_45px_rgba(20,54,66,.14)] ring-1 ring-ink/[.06] p-2">
                        {link.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              to={item.href}
                              className={`group/item flex items-center justify-between px-3.5 py-2.5 text-[15px] font-medium transition-colors ${
                                isCurrent(item.href) ? 'bg-paper-featured text-ink' : 'text-[#334c51] hover:bg-paper hover:text-ink'
                              }`}
                            >
                              {item.name}
                              <span
                                className={`text-gold text-xs transition-all ${
                                  isCurrent(item.href) ? 'opacity-100' : 'opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0'
                                }`}
                                aria-hidden="true"
                              >
                                →
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              to="/give"
              onMouseEnter={scheduleClose}
              className="inline-flex min-h-[46px] items-center gap-3 px-5 xl:px-6 bg-ink text-white text-sm font-bold whitespace-nowrap hover:bg-ink-soft hover:-translate-y-px transition-all"
            >
              {t('nav.give')}
              <span className="text-gold-light" aria-hidden="true">
                ↗
              </span>
            </Link>
          </nav>

          <button
            className="lg:hidden grid place-items-center w-10 h-10 md:w-11 md:h-11 flex-none rounded-full border border-line text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t('nav.menu')}
            aria-expanded={mobileMenuOpen}
            type="button"
          >
            <span className="relative block w-4 h-[9px]" aria-hidden="true">
              <span
                className={`absolute left-0 right-0 top-0 h-[1.5px] bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? 'translate-y-[3.75px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 right-0 bottom-0 h-[1.5px] bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? '-translate-y-[3.75px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mega menu */}
        {megaLink && (
          <div
            className="absolute left-0 right-0 top-full z-40 hidden lg:block"
            onMouseEnter={() => openMenu(megaLink.key)}
            onMouseLeave={scheduleClose}
          >
            <div className="bg-white border-t border-line shadow-[0_30px_50px_rgba(20,54,66,.12)]">
              <div className="site-container py-9 flex gap-10 xl:gap-14">
                <div className={`flex-1 grid gap-x-8 gap-y-6 ${megaLink.columns.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {megaLink.columns.map((column) => (
                    <div key={column.title}>
                      <p className="eyebrow mb-3 px-3">{column.title}</p>
                      <ul>
                        {column.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              to={item.href}
                              className={`group/item flex items-center justify-between gap-2 px-3 py-2 text-[15px] leading-snug transition-colors ${
                                isCurrent(item.href) ? 'bg-paper-featured text-ink font-semibold' : 'text-[#334c51] hover:bg-paper hover:text-ink'
                              }`}
                            >
                              <span>{item.name}</span>
                              <span
                                className={`text-gold text-xs transition-all ${
                                  isCurrent(item.href) ? 'opacity-100' : 'opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0'
                                }`}
                                aria-hidden="true"
                              >
                                →
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {megaLink.feature ? (
                  <Link to={megaLink.feature.href} className="group/feature w-[300px] flex-none bg-ink text-white p-7 flex flex-col relative overflow-hidden">
                    <span className="absolute -top-8 -right-8 w-28 h-28 rounded-full border border-gold-light/50" aria-hidden="true" />
                    <span className="absolute -top-3 -right-3 w-[4.5rem] h-[4.5rem] rounded-full border border-gold-light/50" aria-hidden="true" />
                    <span className="eyebrow eyebrow-light mb-4">EMLR Kicukiro</span>
                    <span className="font-serif text-[1.75rem] leading-tight mb-3">{megaLink.feature.title}</span>
                    <span className="text-[15px] text-[#c6d0cf] leading-relaxed mb-6">{megaLink.feature.text}</span>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-gold-light">
                      {megaLink.feature.cta}
                      <span className="transition-transform group-hover/feature:translate-x-1" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav
            className={`lg:hidden absolute left-0 right-0 top-full bg-white border-t border-line shadow-[0_24px_40px_rgba(20,54,66,.16)] overflow-y-auto overscroll-contain ${
              scrolled ? 'h-[calc(100dvh-70px)] md:h-[calc(100dvh-78px)]' : 'h-[calc(100dvh-108px)] md:h-[calc(100dvh-120px)]'
            }`}
            aria-label="Mobile"
          >
            <div className="site-container flex min-h-full flex-col pt-3 pb-6">
              <div className="space-y-0.5">
                {mainNavLinks.map((link) =>
                  link.columns || link.items ? (
                    <div key={link.key} className={openSection === link.key ? 'bg-paper pb-2' : ''}>
                      <button
                        type="button"
                        className={`w-full flex justify-between items-center px-3 py-3.5 text-left text-[17px] font-semibold ${
                          isActive(link) ? 'text-ink' : 'text-[#334c51]'
                        }`}
                        aria-expanded={openSection === link.key}
                        onClick={() => setMobileSubmenu(openSection === link.key ? '' : link.key)}
                      >
                        <span className="inline-flex items-center gap-2.5">
                          {link.name}
                          {isActive(link) ? <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" /> : null}
                        </span>
                        <span
                          className={`grid place-items-center w-8 h-8 rounded-full transition-colors ${
                            openSection === link.key ? 'bg-ink text-white' : 'bg-paper text-gold'
                          }`}
                          aria-hidden="true"
                        >
                          <IoIosArrowDown className={`text-sm transition-transform ${openSection === link.key ? 'rotate-180' : ''}`} />
                        </span>
                      </button>
                      {openSection === link.key && (
                        <div className="px-1">
                          {(link.columns || [{ title: '', items: link.items }]).map((column) => (
                            <div key={column.title || 'items'} className="mb-1.5">
                              {column.title ? <p className="eyebrow !text-[10px] pl-4 pt-2 pb-1">{column.title}</p> : null}
                              {column.items.map((item) => (
                                <MobileLink key={item.href} href={item.href} active={isCurrent(item.href)} sub>
                                  {item.name}
                                </MobileLink>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <MobileLink key={link.key} href={link.href} active={isCurrent(link.href)}>
                      {link.name}
                    </MobileLink>
                  )
                )}
              </div>

              <div className="mt-auto pt-6 space-y-3">
                <Link
                  to="/give"
                  className="flex min-h-[52px] items-center justify-center gap-3 bg-ink text-white text-[15px] font-bold active:bg-ink-soft"
                >
                  {t('nav.give')}
                  <span className="text-gold-light" aria-hidden="true">
                    ↗
                  </span>
                </Link>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex min-h-[48px] items-center justify-center gap-2 border border-line text-[15px] font-semibold text-ink"
                  >
                    <PhoneIcon className="w-4 h-4 text-gold" />
                    {phone}
                  </a>
                  <div className="flex gap-1.5">
                    {social.map(({ label, href, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`EMLR Kicukiro on ${label}`}
                        className="grid place-items-center w-11 h-11 rounded-full bg-paper text-sm text-ink"
                      >
                        <Icon aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
