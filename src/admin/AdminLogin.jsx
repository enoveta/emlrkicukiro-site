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
    <div className="admin-ui min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink-deep" />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #214f5b 0, transparent 40%), radial-gradient(circle at 80% 75%, #a77c38 0, transparent 30%)' }} />
      <form onSubmit={onSubmit} className="relative bg-white/95 backdrop-blur rounded-lg shadow-2xl p-8 w-full max-w-md space-y-5 border border-white/40">
        <div className="text-center">
          <img src={logo} alt="" className="w-16 h-16 mx-auto object-contain" />
          <div className="text-sm font-semibold text-gold-text mt-3">EMLR Kicukiro</div>
          <h1 className="text-3xl font-bold text-ink mt-1">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage the church website</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
          <input
            className="w-full border border-slate-200 rounded-md p-3 text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
          <input
            className="w-full border border-slate-200 rounded-md p-3 text-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-white py-3 rounded-md hover:bg-ink-soft transition disabled:opacity-60 font-medium"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
