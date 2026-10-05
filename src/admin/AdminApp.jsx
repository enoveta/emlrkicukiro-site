import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import DashboardHome from './pages/DashboardHome';
import ContentList from './pages/ContentList';
import ContentForm from './pages/ContentForm';
import SubmissionsPage from './pages/SubmissionsPage';
import SettingsPage from './pages/SettingsPage';
import AccountPage from './pages/AccountPage';
import HeroSlidesPage from './pages/HeroSlidesPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import { RESOURCE_CONFIG } from './resourceConfig';

function RequireAuth({ children }) {
  const token = localStorage.getItem('emlr_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="hero" element={<HeroSlidesPage />} />
        <Route path="media" element={<MediaLibraryPage />} />
        <Route path="banners" element={<Navigate to="/admin/hero" replace />} />
        <Route path="submissions" element={<SubmissionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="account" element={<AccountPage />} />
        {Object.keys(RESOURCE_CONFIG).map((key) => (
          <Route key={key} path={key} element={<ContentList resourceKey={key} />} />
        ))}
        {Object.keys(RESOURCE_CONFIG).map((key) => (
          <Route key={`${key}-new`} path={`${key}/new`} element={<ContentForm resourceKey={key} />} />
        ))}
        {Object.keys(RESOURCE_CONFIG).map((key) => (
          <Route key={`${key}-edit`} path={`${key}/:id`} element={<ContentForm resourceKey={key} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
