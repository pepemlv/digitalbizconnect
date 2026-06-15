import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Expense, EXPENSE_CATEGORIES } from '../lib/supabase';
import { Plus, Search, X, Trash2, ChevronDown, TrendingDown } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  'Office Supplies': 'bg-blue-100 text-blue-700',
  'Travel': 'bg-purple-100 text-purple-700',
  'Meals & Entertainment': 'bg-orange-100 text-orange-700',
  'Software & Subscriptions': 'bg-cyan-100 text-cyan-700',
  'Marketing': 'bg-pink-100 text-pink-700',
  'Utilities': 'bg-yellow-100 text-yellow-700',
  'Rent': 'bg-teal-100 text-teal-700',
  'Equipment': 'bg-indigo-100 text-indigo-600',
  'Professional Services': 'bg-emerald-100 text-emerald-700',
  'Insurance': 'bg-sky-100 text-sky-700',
  'Other': 'bg-gray-100 text-gray-600',
};

export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Expense | null>(null);

  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false });
    setExpenses(data as Expense[] ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openCreate = () => {
    setSelected(null);
    setCategory(EXPENSE_CATEGORIES[0]);
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setShowForm(true);
  };

  const openEdit = (exp: Expense) => {
    setSelected(exp);
    setCategory(exp.category);
    setDescription(exp.description);
    setAmount(String(exp.amount));
    setDate(exp.date);
    setNotes(exp.notes);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        category,
        description,
        amount: parseFloat(amount),
        date,
        notes,
      };
      if (selected) {
        await supabase.from('expenses').update(payload).eq('id', selected.id);
      } else {
        await supabase.from('expenses').insert(payload);
      }
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await supabase.from('expenses').delete().eq('id', id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const filtered = expenses.filter(exp =>
    (exp.description.toLowerCase().includes(search.toLowerCase()) || exp.category.toLowerCase().includes(search.toLowerCase())) &&
    (filterCategory === '' || exp.category === filterCategory)
  );

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);
  const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mb-3">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-500 text-xs font-medium mb-1">Total Expenses</p>
          <p className="text-gray-900 text-xl font-bold">${expenses.reduce((s, e) => s + e.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        {categoryTotals.slice(0, 3).map(({ cat, total }) => (
          <div key={cat} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-2 ${CATEGORY_COLORS[cat] ?? 'bg-gray-100 text-gray-600'}`}>{cat}</span>
            <p className="text-gray-900 text-lg font-bold">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-48" />
          </div>
          <div className="relative">
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-8">
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No expenses found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(exp => (
                    <tr key={exp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEdit(exp)}>
                      <td className="px-6 py-4 text-gray-500">{exp.date}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{exp.description}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[exp.category] ?? 'bg-gray-100 text-gray-600'}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800">
                        ${exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={e => { e.stopPropagation(); deleteExpense(exp.id); }}
                          className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <span className="text-sm font-semibold text-gray-700">
                Showing total: ${totalFiltered.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{selected ? 'Edit Expense' : 'Add Expense'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Amount ($)</label>
                  <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <div className="relative">
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input value={description} onChange={e => setDescription(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {saving ? 'Saving...' : selected ? 'Update' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
