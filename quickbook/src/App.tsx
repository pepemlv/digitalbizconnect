import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Bookings from './pages/Bookings';
import Clients from './pages/Clients';

type Page = 'dashboard' | 'invoices' | 'expenses' | 'bookings' | 'clients';

function AppContent() {
  const { session, loading } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <AuthPage />;

  const pages: Record<Page, JSX.Element> = {
    dashboard: <Dashboard />,
    invoices: <Invoices />,
    expenses: <Expenses />,
    bookings: <Bookings />,
    clients: <Clients />,
  };

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {pages[page]}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
