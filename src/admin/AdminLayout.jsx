import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ToastProvider } from './ui/Toast';
import logo from '../assets/emlr/logo1.png';

const NAV = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: '◈', end: true },
      { to: '/admin/hero', label: 'Home slides', icon: '▣' },
      { to: '/admin/media', label: 'Media library', icon: '▦' },
    ],
  },
  {
    title: 'Website content',
    items: [
      { to: '/admin/notices', label: 'Amatangazo', icon: '✦' },
      { to: '/admin/schedule', label: 'Weekly programme', icon: '◷' },
      { to: '/admin/events', label: 'Events (Ibikorwa)', icon: '◉' },
      { to: '/admin/announcements', label: 'News (Amakuru)', icon: '☰' },
      { to: '/admin/ministries', label: 'Ministries', icon: '◎' },
      { to: '/admin/people', label: 'Leadership', icon: '☺' },
      { to: '/admin/gallery', label: 'Gallery', icon: '▥' },
      { to: '/admin/testimonials', label: 'Testimonials', icon: '❝' },
      { to: '/admin/stats', label: 'Stats', icon: '▦' },
      { to: '/admin/services', label: 'Sermons', icon: '♪' },
      { to: '/admin/giving', label: 'Giving', icon: '₪' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { to: '/admin/submissions', label: 'Inbox', icon: '✉' },
      { to: '/admin/settings', label: 'Site settings', icon: '⚙' },
      { to: '/admin/account', label: 'Account & users', icon: '☼' },
    ],
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = useMemo(() => JSON.parse(localStorage.getItem('emlr_user') || '{}'), []);

  const logout = () => {
    localStorage.removeItem('emlr_token');
    localStorage.removeItem('emlr_user');
    navigate('/admin/login');
  };

  const isActive = (item) => {
    if (item.end) return location.pathname === '/admin';
    return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  };

  const NavBody = (
    <>
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <span className="w-11 h-11 bg-white flex items-center justify-center shrink-0">
          <img src={logo} alt="" className="w-8 h-8 object-contain" />
        </span>
        <div>
          <div className="font-serif text-xl leading-tight">EMLR Kicukiro</div>
          <div className="text-xs text-gold-light text-[11px] uppercase tracking-[0.12em] font-bold">Dashboard</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2 text-[11px] uppercase tracking-wider text-white/40">{group.title}</div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition ${
                    isActive(item)
                      ? 'bg-gold-light text-ink-deep font-semibold shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="opacity-70 w-4 text-center">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center text-sm bg-white/10 hover:bg-gold-light hover:text-ink-deep rounded-md py-2.5 transition"
        >
          Open website ↗
        </a>
        <button
          type="button"
          onClick={logout}
          className="w-full text-sm text-white/60 hover:text-white py-2"
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <ToastProvider>
      <div className="admin-ui min-h-screen bg-paper flex">
        <aside className="hidden lg:flex w-72 bg-ink-deep text-white flex-col shrink-0 sticky top-0 h-screen">
          {NavBody}
        </aside>

        {open ? (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-72 bg-ink-deep text-white flex flex-col h-full">{NavBody}</div>
            <button type="button" className="flex-1 bg-black/40" onClick={() => setOpen(false)} aria-label="Close menu" />
          </div>
        ) : null}

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden px-3 py-2 rounded-lg border border-slate-200 text-sm"
                onClick={() => setOpen(true)}
              >
                Menu
              </button>
              <div className="text-base font-semibold text-ink">Dashboard</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs px-2.5 py-1 rounded-full bg-paper-featured text-ink font-medium">
                {user.role || 'ADMIN'}
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
