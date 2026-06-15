import { useEffect, useState } from 'react';
import { supabase, type Client } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  client?: Client | null;
  compact?: boolean;
  onSaved: (client: Client) => void;
  onCancel?: () => void;
};

export default function ClientForm({ client, compact = false, onSaved, onCancel }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(client?.name ?? '');
    setCompany(client?.company ?? '');
    setPhone(client?.phone ?? '');
    setEmail(client?.email ?? '');
    setAddress(client?.address ?? '');
    setBalance(String(client?.balance ?? ''));
    setNotes(client?.notes ?? '');
  }, [client]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        name,
        company,
        phone,
        email,
        address,
        balance: parseFloat(balance) || 0,
        notes,
      };

      let saved: Client | null = null;
      if (client) {
        await supabase.from('clients').update(payload).eq('id', client.id);
        saved = { ...client, ...payload };
      } else {
        const result = await supabase.from('clients').insert(payload).select().single() as { data: Client | null };
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
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Customer Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company Name</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)}
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
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Opening Balance</label>
          <input type="number" min="0" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={compact ? 2 : 3}
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
          {saving ? 'Saving...' : client ? 'Update Customer' : 'Create Customer'}
        </button>
      </div>
    </form>
  );
}
