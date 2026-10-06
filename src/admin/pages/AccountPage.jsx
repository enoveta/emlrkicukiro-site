import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from '../ui/Toast';

const input = 'w-full border border-slate-200 rounded-md p-3 text-sm';

function ChangePassword() {
  const { push } = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.newPassword.length < 10) return setError('New password must be at least 10 characters.');
    if (form.newPassword !== form.confirm) return setError('Passwords do not match.');
    setSaving(true);
    try {
      await adminApi.post('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      push('Password changed');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
      <h2 className="font-semibold text-ink">Change my password</h2>
      <input className={input} type="password" autoComplete="current-password" placeholder="Current password" required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
      <input className={input} type="password" autoComplete="new-password" placeholder="New password (min. 10 characters)" required value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
      <input className={input} type="password" autoComplete="new-password" placeholder="Repeat new password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      <button type="submit" disabled={saving} className="bg-ink text-white px-5 py-2.5 rounded-md hover:bg-ink-soft disabled:opacity-50 text-sm font-medium">
        {saving ? 'Saving...' : 'Change password'}
      </button>
    </form>
  );
}

function Users() {
  const { push } = useToast();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', role: 'CONTENT_MANAGER' });
  const [error, setError] = useState('');

  const load = () => adminApi.get('/users', { cache: false }).then(setUsers).catch((err) => setError(err.message));
  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminApi.post('/users', form);
      setForm({ email: '', password: '', role: 'CONTENT_MANAGER' });
      push('User created');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
      <h2 className="font-semibold text-ink">Dashboard users</h2>
      <p className="text-xs text-slate-500">
        Content managers can write drafts; only admins can publish. Share the password privately and ask the person to
        change it after first login.
      </p>
      <ul className="divide-y divide-slate-100 text-sm">
        {users.map((u) => (
          <li key={u.id} className="py-2 flex justify-between">
            <span>{u.email}</span>
            <span className="text-slate-500">{u.role === 'ADMIN' ? 'Admin' : 'Content manager'}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
        <input className={`${input} md:col-span-2`} type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className={input} type="text" placeholder="Temporary password" required minLength={10} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className={input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="CONTENT_MANAGER">Content manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" className="md:col-span-4 justify-self-start bg-ink text-white px-5 py-2.5 rounded-md hover:bg-ink-soft text-sm font-medium">
          Add user
        </button>
      </form>
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
    </div>
  );
}

export default function AccountPage() {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('emlr_user') || '{}');
  } catch {
    /* ignore */
  }
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Account & users</h1>
        <p className="text-slate-500 mt-1">Signed in as {user.email}</p>
      </div>
      <ChangePassword />
      {user.role === 'ADMIN' ? <Users /> : null}
    </div>
  );
}
