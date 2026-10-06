import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { FiKey, FiUserPlus } from 'react-icons/fi';
import { useToast } from '../ui/Toast';
import { PageHeader, Card, Field } from '../ui/kit';

const input = 'a-input';

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
    <Card title="Change my password" description="Use at least 10 characters.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Current password">
          <input className={input} type="password" autoComplete="current-password" required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
        </Field>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="New password">
            <input className={input} type="password" autoComplete="new-password" required value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          </Field>
          <Field label="Repeat new password">
            <input className={input} type="password" autoComplete="new-password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </Field>
        </div>
        {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
        <button type="submit" disabled={saving} className="a-btn a-btn-primary">
          <FiKey aria-hidden="true" /> {saving ? 'Saving…' : 'Change password'}
        </button>
      </form>
    </Card>
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
    <Card title="Dashboard users" description="Content managers can write drafts; only admins can publish." padded={false}>
      <ul className="divide-y divide-[#f0ede6]">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-3 px-5 py-3 md:px-6">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#f3efe6] text-sm font-bold text-gold-dark">
              {(u.email || '?').slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{u.email}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                u.role === 'ADMIN' ? 'bg-ink text-white' : 'bg-[#f2f4f7] text-[#475467]'
              }`}
            >
              {u.role === 'ADMIN' ? 'Admin' : 'Content manager'}
            </span>
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="border-t border-[#f0ede6] bg-[#faf9f6] p-5 md:p-6">
        <p className="a-h2 mb-1">Add a user</p>
        <p className="mb-4 text-[13px] text-[#7b8a8c]">Share the temporary password privately and ask the person to change it after first login.</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,.9fr)_auto]">
          <input className={input} type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={input} type="text" placeholder="Temporary password" required minLength={10} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className={input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="CONTENT_MANAGER">Content manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="a-btn a-btn-primary h-[42px]">
            <FiUserPlus aria-hidden="true" /> Add
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
      </form>
    </Card>
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
    <div className="max-w-4xl">
      <PageHeader title="Account & users" description={`Signed in as ${user.email || ''}`} />
      <div className="space-y-6">
        <ChangePassword />
        {user.role === 'ADMIN' ? <Users /> : null}
      </div>
    </div>
  );
}
