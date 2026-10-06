import { useState } from 'react';
import logo from '../assets/emlr/logo1.png';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/client';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.login(email, password);
      localStorage.setItem('emlr_token', data.token);
      localStorage.setItem('emlr_user', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-ui grid min-h-screen bg-[#f6f5f1] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <span className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-gold-light/30" aria-hidden="true" />
        <span className="absolute -right-8 -top-8 h-52 w-52 rounded-full border border-gold-light/30" aria-hidden="true" />
        <span className="absolute bottom-0 right-0 h-1/3 w-1/2 bg-white/[.03]" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-white">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
          </span>
          <div>
            <div className="font-serif text-xl leading-none">EMLR Kicukiro</div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">Dashboard</div>
          </div>
        </div>
        <div className="relative mt-auto max-w-md">
          <p className="font-serif text-[2.8rem] leading-[1.05] tracking-[-0.02em]">
            Manage the website <em className="text-gold-light">with care.</em>
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#c6d0cf]">
            Announcements, weekly programme, events, news and ministries, all in one place, in English and Kinyarwanda.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-5 py-12">
        <form onSubmit={onSubmit} className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-lg border border-[#e9e5dc] bg-white">
              <img src={logo} alt="" className="h-9 w-9 object-contain" />
            </span>
            <div className="font-serif text-xl text-ink">EMLR Kicukiro</div>
          </div>
          <h1 className="text-[1.9rem] font-bold tracking-[-0.02em] text-ink">Sign in</h1>
          <p className="mt-1 text-[15px] text-[#66777a]">Welcome back. Sign in to manage the church website.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="a-label">
                Email
              </label>
              <input id="email" className="a-input h-11" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className="a-label">
                Password
              </label>
              <input
                id="password"
                className="a-input h-11"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? (
              <p className="rounded-lg border border-[#fecdca] bg-[#fef3f2] px-3.5 py-2.5 text-sm text-[#b42318]" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" disabled={loading} className="a-btn a-btn-primary h-11 w-full text-[15px]">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
          <a href="/" className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#66777a] hover:text-ink">
            <span aria-hidden="true">←</span> Back to the website
          </a>
        </form>
      </div>
    </div>
  );
}
