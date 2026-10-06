import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  FiGrid,
  FiImage,
  FiFolder,
  FiBell,
  FiClock,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiUserCheck,
  FiCamera,
  FiMessageSquare,
  FiBarChart2,
  FiMic,
  FiHeart,
  FiInbox,
  FiSettings,
  FiUser,
  FiLogOut,
  FiExternalLink,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { ToastProvider } from './ui/Toast';
import { adminApi } from '../api/client';
import logo from '../assets/emlr/logo1.png';

const NAV = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
      { to: '/admin/hero', label: 'Home slides', icon: FiImage },
      { to: '/admin/media', label: 'Media library', icon: FiFolder },
    ],
  },
  {
    title: 'Website content',
    items: [
      { to: '/admin/notices', label: 'Amatangazo', icon: FiBell },
      { to: '/admin/schedule', label: 'Weekly programme', icon: FiClock },
      { to: '/admin/events', label: 'Events (Ibikorwa)', icon: FiCalendar },
      { to: '/admin/announcements', label: 'News (Amakuru)', icon: FiFileText },
      { to: '/admin/ministries', label: 'Ministries', icon: FiUsers },
      { to: '/admin/people', label: 'Leadership', icon: FiUserCheck },
      { to: '/admin/gallery', label: 'Gallery', icon: FiCamera },
      { to: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
      { to: '/admin/stats', label: 'Stats', icon: FiBarChart2 },
      { to: '/admin/services', label: 'Sermons', icon: FiMic },
      { to: '/admin/giving', label: 'Giving', icon: FiHeart },
    ],
  },
  {
    title: 'Operations',
    items: [
      { to: '/admin/submissions', label: 'Inbox', icon: FiInbox, badge: 'inbox' },
      { to: '/admin/settings', label: 'Site settings', icon: FiSettings },
      { to: '/admin/account', label: 'Account & users', icon: FiUser },
    ],
  },
];

const ALL_ITEMS = NAV.flatMap((g) => g.items);

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [inboxNew, setInboxNew] = useState(0);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('emlr_user') || '{}');
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // New prayer requests + volunteer applications, shown as a badge on Inbox.
  useEffect(() => {
    adminApi
      .get('/dashboard/summary', { cache: false })
      .then((res) => setInboxNew((res?.inbox?.prayerNew || 0) + (res?.inbox?.volunteerNew || 0)))
      .catch(() => {});
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('emlr_token');
    localStorage.removeItem('emlr_user');
    navigate('/admin/login');
  };

  const isActive = (item) => {
    if (item.end) return location.pathname === '/admin';
    return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  };
  const current = ALL_ITEMS.find((i) => isActive(i));
  const section = NAV.find((g) => g.items.includes(current))?.title;
  const initials = (user.email || 'A').slice(0, 1).toUpperCase();

  const NavBody = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-white">
          <img src={logo} alt="" className="h-8 w-8 object-contain" />
        </span>
        <div className="min-w-0">
          <div className="font-serif text-[1.15rem] leading-none text-white">EMLR Kicukiro</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-light">Dashboard</div>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Dashboard">
        {NAV.map((group) => (
          <div key={group.title}>
            <div className="mb-1.5 px-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/40">{group.title}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative flex h-9 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors ${
                      active ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/[.06] hover:text-white'
                    }`}
                  >
                    {active ? <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r bg-gold-light" aria-hidden="true" /> : null}
                    <Icon className={`flex-none text-[16px] ${active ? 'text-gold-light' : 'text-white/45 group-hover:text-white/80'}`} aria-hidden="true" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge === 'inbox' && inboxNew > 0 ? (
                      <span className="min-w-[20px] rounded-full bg-gold-light px-1.5 text-center text-[11px] font-bold leading-5 text-ink-deep">{inboxNew}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gold-light text-sm font-bold text-ink-deep">{initials}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-white">{user.email || 'Signed in'}</div>
            <div className="text-[11px] text-white/50">{user.role === 'ADMIN' ? 'Administrator' : 'Content manager'}</div>
          </div>
          <button type="button" onClick={logout} className="a-icon-btn !text-white/60 hover:!bg-white/10 hover:!text-white" aria-label="Sign out" title="Sign out">
            <FiLogOut aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="admin-ui flex min-h-screen bg-[#f6f5f1]">
        <aside className="sticky top-0 hidden h-screen w-[264px] flex-none bg-ink-deep lg:block">{NavBody}</aside>

        {open ? (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="h-full w-[280px] max-w-[85vw] bg-ink-deep shadow-2xl">{NavBody}</div>
            <button type="button" className="flex-1 bg-ink-deep/40 backdrop-blur-[1px]" onClick={() => setOpen(false)} aria-label="Close menu" />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[#e9e5dc] bg-white/85 px-4 backdrop-blur md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" className="a-icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
              </button>
              <div className="flex min-w-0 items-center gap-2 text-sm">
                {section ? <span className="hidden text-[#9aa6a7] sm:inline">{section}</span> : null}
                {section ? <span className="hidden text-[#cfd5d4] sm:inline">/</span> : null}
                <span className="truncate font-semibold text-ink">{current?.label || 'Dashboard'}</span>
              </div>
            </div>
            <a href="/" target="_blank" rel="noreferrer" className="a-btn a-btn-secondary a-btn-sm">
              <FiExternalLink aria-hidden="true" />
              <span className="hidden sm:inline">View website</span>
            </a>
          </header>
          <main className="flex-1">
            <div className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-8 md:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
