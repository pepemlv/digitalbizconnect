import { AuthProvider } from './contexts/AuthContext';
import AdminPage from './pages/AdminPage';
import RequestAdminPage from './pages/RequestAdminPage';

export default function AdminApp() {
  if (window.location.pathname === '/admin/account-approvals') {
    return (
      <AuthProvider>
        <AdminPage />
      </AuthProvider>
    );
  }

  return <RequestAdminPage />;
}
