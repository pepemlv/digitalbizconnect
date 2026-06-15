import { useEffect, useState } from 'react';
import { supabase, type Vendor } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  vendor?: Vendor | null;
  compact?: boolean;
  onSaved: (vendor: Vendor) => void;
  onCancel?: () => void;
};

const vendorTypes = ['Contractor', '1099', 'Supplier', 'Other'] as const;

export default function VendorForm({ vendor, compact = false, onSaved, onCancel }: Props) {
  const { user } = useAuth();
  const [vendorName, setVendorName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vendorType, setVendorType] = useState<(typeof vendorTypes)[number]>('Supplier');
  const [form1099, setForm1099] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setVendorName(vendor?.vendor_name ?? vendor?.title ?? '');
    setCompanyName(vendor?.company_name ?? '');
    setPhone(vendor?.phone ?? '');
    setEmail(vendor?.email ?? '');
    setVendorType(vendor?.vendor_type ?? 'Supplier');
    setForm1099(Boolean(vendor?.form_1099));
    setPaymentInfo(vendor?.payment_info ?? '');
    setBillAmount(String(vendor?.bill_amount ?? ''));
    setBalance(String(vendor?.balance ?? ''));
    setNotes(vendor?.notes ?? '');
  }, [vendor]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        action: 'Add Vendor',
        title: vendorName || companyName,
        vendor_name: vendorName,
        company_name: companyName,
        phone,
        email,
        vendor_type: vendorType,
        form_1099: form1099,
        payment_info: paymentInfo,
        bill_amount: parseFloat(billAmount) || 0,
        balance: parseFloat(balance) || 0,
        amount: parseFloat(balance) || parseFloat(billAmount) || 0,
        notes,
      };

      let saved: Vendor | null = null;
      if (vendor) {
        await supabase.from('vendors').update(payload).eq('id', vendor.id);
        saved = { ...vendor, ...payload };
      } else {
        const result = await supabase.from('vendors').insert(payload).select().single() as { data: Vendor | null };
        saved = result.data;
      }

      if (saved) onSaved(saved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className={`${compact ? 'space-y-3' : 'bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4'}`}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vendor Name</label>
          <input value={vendorName} onChange={(e) => setVendorName(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company Name</label>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type of Vendor</label>
          <select value={vendorType} onChange={(e) => setVendorType(e.target.value as (typeof vendorTypes)[number])}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {vendorTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 pt-6">
          <input type="checkbox" checked={form1099} onChange={(e) => setForm1099(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-500" />
          1099 vendor
        </label>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Record Bill</label>
          <input type="number" min="0" step="0.01" value={billAmount} onChange={(e) => setBillAmount(e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Balance</label>
          <input type="number" min="0" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Info</label>
        <textarea value={paymentInfo} onChange={(e) => setPaymentInfo(e.target.value)} rows={compact ? 2 : 3}
          placeholder="ACH, check mailing details, card, or preferred payment notes"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={compact ? 2 : 3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="sm:ml-auto border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving}
          className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          {saving ? 'Saving...' : vendor ? 'Update Vendor' : 'Create Vendor'}
        </button>
      </div>
    </form>
  );
}
