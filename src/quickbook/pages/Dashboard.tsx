import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, FileText, Receipt, Calendar, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type Stats = {
  totalInvoiced: number;
  totalPaid: number;
  totalExpenses: number;
  totalProfit: number;
  pendingInvoices: number;
  upcomingBookings: number;
  overdueInvoices: number;
  upcomingBills: number;
  taxSummary: number;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalInvoiced: 0,
    totalPaid: 0,
    totalExpenses: 0,
    totalProfit: 0,
    pendingInvoices: 0,
    upcomingBookings: 0,
    overdueInvoices: 0,
    upcomingBills: 0,
    taxSummary: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<{ invoice_number: string; total: number; status: string; clients?: { name: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [invoicesRes, expensesRes, bookingsRes, vendorsRes, taxesRes] = await Promise.all([
        supabase.from('invoices').select('total, status, invoice_number, clients(name)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('expenses').select('amount').eq('user_id', user.id),
        supabase.from('bookings').select('id, status, start_time').eq('user_id', user.id).gte('start_time', new Date().toISOString()),
        supabase.from('vendors').select('*').eq('user_id', user.id),
        supabase.from('taxes').select('*').eq('user_id', user.id),
      ]);

      const invoices = invoicesRes.data ?? [];
      const expenses = expensesRes.data ?? [];
      const bookings = bookingsRes.data ?? [];
      const vendors = vendorsRes.data ?? [];
      const taxes = taxesRes.data ?? [];
      const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total ?? 0), 0);
      const totalExpenses = expenses.reduce((s, e) => s + (e.amount ?? 0), 0);

      setStats({
        totalInvoiced: invoices.reduce((s, i) => s + (i.total ?? 0), 0),
        totalPaid,
        totalExpenses,
        totalProfit: totalPaid - totalExpenses,
        pendingInvoices: invoices.filter(i => i.status === 'sent' || i.status === 'draft').length,
        upcomingBookings: bookings.filter(b => b.status !== 'cancelled').length,
        overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
        upcomingBills: vendors.filter(v => String(v.action ?? '').toLowerCase().includes('bill')).length,
        taxSummary: taxes.reduce((s, t) => s + (t.amount ?? 0), 0),
      });
      setRecentInvoices(invoices.slice(0, 5) as unknown as typeof recentInvoices);
      setLoading(false);
    };
    load();
  }, [user]);

  const statusColor: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    sent: 'bg-blue-100 text-blue-700',
    draft: 'bg-gray-100 text-gray-600',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  const statCards = [
    { label: 'Total Revenue', value: stats.totalPaid, icon: TrendingUp, color: 'bg-green-700', format: 'currency' },
    { label: 'Total Expenses', value: stats.totalExpenses, icon: Receipt, color: 'bg-amber-600', format: 'currency' },
    { label: 'Profit', value: stats.totalProfit, icon: DollarSign, color: 'bg-teal-600', format: 'currency' },
    { label: 'Outstanding Invoices', value: stats.pendingInvoices, icon: Clock, color: 'bg-blue-600', format: 'number' },
    { label: 'Upcoming Bills', value: stats.upcomingBills, icon: AlertCircle, color: 'bg-orange-600', format: 'number' },
    { label: 'Tax Summary', value: stats.taxSummary, icon: FileText, color: 'bg-violet-600', format: 'currency' },
    { label: 'Total Invoiced', value: stats.totalInvoiced, icon: CheckCircle, color: 'bg-green-600', format: 'currency' },
    { label: 'Overdue', value: stats.overdueInvoices, icon: AlertCircle, color: 'bg-red-600', format: 'number' },
    { label: 'Upcoming Bookings', value: stats.upcomingBookings, icon: Calendar, color: 'bg-slate-600', format: 'number' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good day!</h2>
        <p className="text-gray-500 mt-1">Here's an overview of your business finances.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, format }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
            <p className="text-gray-900 text-xl font-bold">
              {format === 'currency'
                ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Invoices</h3>
        </div>
        {recentInvoices.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No invoices yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentInvoices.map((inv, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{inv.invoice_number}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{inv.clients?.name ?? 'No client'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[inv.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    ${(inv.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
