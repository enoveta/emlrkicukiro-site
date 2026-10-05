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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#001628]" />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #5fb9e2 0, transparent 35%), radial-gradient(circle at 80% 70%, #fae924 0, transparent 25%)' }} />
      <form onSubmit={onSubmit} className="relative bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-5 border border-white/40">
        <div className="text-center">
          <img src={logo} alt="" className="w-16 h-16 mx-auto object-contain" />
          <div className="text-sm font-semibold text-[#1a6f99] mt-3">EMLR Kicukiro</div>
          <h1 className="text-3xl font-bold text-[#001d3a] mt-1">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage the church website</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
          <input
            className="w-full border border-slate-200 rounded-xl p-3 text-sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
          <input
            className="w-full border border-slate-200 rounded-xl p-3 text-sm"
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
          className="w-full bg-[#001d3a] text-white py-3 rounded-xl hover:bg-[#5fb9e2] transition disabled:opacity-60 font-medium"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
