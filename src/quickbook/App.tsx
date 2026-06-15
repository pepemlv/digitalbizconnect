import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Bookings from './pages/Bookings';
import Clients from './pages/Clients';
import Vendors from './pages/Vendors';
import PendingApproval from './pages/PendingApproval';
import FeatureModule from './pages/FeatureModule';
import { modules, type ModulePage } from './pages/modules';

type Page = 'dashboard' | 'invoices' | 'expenses' | 'bookings' | 'clients' | ModulePage;

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <AuthPage />;
  if (profile?.approval_status !== 'approved') return <PendingApproval />;

  const pages: Record<Page, JSX.Element> = {
    dashboard: <Dashboard />,
    invoices: <Invoices />,
    expenses: <Expenses />,
    bookings: <Bookings />,
    clients: <Clients />,
    sales: <FeatureModule table="sales" {...modules.sales} />,
    vendors: <Vendors onPayBill={() => setPage('expenses')} />,
    banking: <FeatureModule table="banking" {...modules.banking} />,
    payroll: <FeatureModule table="payroll" {...modules.payroll} />,
    taxes: <FeatureModule table="taxes" {...modules.taxes} />,
    products: <FeatureModule table="products" {...modules.products} />,
    reports: <FeatureModule table="reports" {...modules.reports} />,
    documents: <FeatureModule table="documents" {...modules.documents} />,
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
