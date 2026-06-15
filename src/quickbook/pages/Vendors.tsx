import { useEffect, useState } from 'react';
import { Building2, Mail, Phone, Plus, Receipt, Search, Trash2 } from 'lucide-react';
import VendorForm from '../components/VendorForm';
import { supabase, type Vendor } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  onPayBill: () => void;
};

export default function Vendors({ onPayBill }: Props) {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Vendor | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('vendors').select('*').eq('user_id', user.id).order('title');
    setVendors(data as Vendor[] ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const openEdit = (vendor: Vendor) => {
    setSelected(vendor);
    setShowForm(true);
  };

  const deleteVendor = async (id: string) => {
    if (!confirm('Delete this vendor?')) return;
    await supabase.from('vendors').delete().eq('id', id);
    setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
  };

  const filtered = vendors.filter((vendor) => {
    const value = `${vendor.title ?? ''} ${vendor.vendor_name ?? ''} ${vendor.company_name ?? ''} ${vendor.email ?? ''}`.toLowerCase();
    return value.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendors</h2>
          <p className="text-gray-500 mt-1">Manage vendors, 1099 status, bills, payment details, and balances.</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      {showForm && (
        <section>
          <VendorForm
            vendor={selected}
            onSaved={() => {
              setShowForm(false);
              setSelected(null);
              load();
            }}
            onCancel={() => setShowForm(false)}
          />
        </section>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16 text-gray-400">
          <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No vendors found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((vendor) => {
            const name = vendor.vendor_name || vendor.title;
            const balance = vendor.balance ?? vendor.amount ?? 0;

            return (
              <div key={vendor.id} onClick={() => openEdit(vendor)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">{vendor.vendor_type ?? 'Vendor'}</p>
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    {vendor.company_name && <p className="text-xs text-gray-500 mt-0.5">{vendor.company_name}</p>}
                  </div>
                  <button onClick={(event) => { event.stopPropagation(); deleteVendor(vendor.id); }}
                    className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-gray-500">
                  {vendor.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{vendor.email}</p>}
                  {vendor.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{vendor.phone}</p>}
                  {vendor.form_1099 && <p className="font-semibold text-orange-700">1099 enabled</p>}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Balance</p>
                    <p className="text-lg font-bold text-gray-900">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <button onClick={(event) => { event.stopPropagation(); onPayBill(); }}
                    className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-3 py-2 text-xs font-semibold">
                    <Receipt className="w-3.5 h-3.5" />
                    Pay Bill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
