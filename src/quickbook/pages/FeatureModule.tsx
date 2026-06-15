import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type FeatureRecord = {
  id: string;
  user_id: string;
  action: string;
  title: string;
  amount: number;
  notes: string;
  created_at: string;
};

type Props = {
  table: 'sales' | 'vendors' | 'banking' | 'payroll' | 'taxes' | 'products' | 'reports' | 'documents';
  title: string;
  description: string;
  actions: readonly string[];
  amountLabel?: string;
};

export default function FeatureModule({ table, title, description, actions, amountLabel = 'Amount' }: Props) {
  const { user } = useAuth();
  const [records, setRecords] = useState<FeatureRecord[]>([]);
  const [action, setAction] = useState(actions[0]);
  const [recordTitle, setRecordTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from(table).select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setRecords(data as FeatureRecord[] ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user, table]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    await supabase.from(table).insert({
      user_id: user.id,
      action,
      title: recordTitle,
      amount: parseFloat(amount) || 0,
      notes,
    });
    setRecordTitle('');
    setAmount('');
    setNotes('');
    setSaving(false);
    load();
  };

  const deleteRecord = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await supabase.from(table).delete().eq('id', id);
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>

      <div className="grid lg:grid-cols-[380px_minmax(0,1fr)] gap-6 items-start">
        <form onSubmit={save} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {actions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title / Name</label>
            <input
              value={recordTitle}
              onChange={(e) => setRecordTitle(e.target.value)}
              placeholder="Enter details"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{amountLabel}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Record'}
          </button>
        </form>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Saved Records</h3>
          </div>
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : records.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-gray-400">No records yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {records.map((record) => (
                <div key={record.id} className="px-5 py-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">{record.action}</p>
                    <p className="font-medium text-gray-900">{record.title}</p>
                    {record.notes && <p className="text-sm text-gray-500 mt-1">{record.notes}</p>}
                    <p className="text-xs text-gray-400 mt-2">{new Date(record.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {record.amount > 0 && <span className="text-sm font-bold text-gray-900">${record.amount.toLocaleString()}</span>}
                    <button onClick={() => deleteRecord(record.id)} className="text-gray-300 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
