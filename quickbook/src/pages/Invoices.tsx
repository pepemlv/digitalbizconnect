import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Invoice, Client, InvoiceItem } from '../lib/supabase';
import { Plus, Search, X, Trash2, ChevronDown } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-400',
};

type FormItem = { id?: string; description: string; quantity: string; unit_price: string };

const STATUSES = ['draft', 'sent', 'paid', 'overdue', 'cancelled'] as const;

export default function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);

  // Form state
  const [clientId, setClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [status, setStatus] = useState<Invoice['status']>('draft');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState('0');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FormItem[]>([{ description: '', quantity: '1', unit_price: '0' }]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    const [invRes, cliRes] = await Promise.all([
      supabase.from('invoices').select('*, clients(name, email), invoice_items(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('clients').select('*').eq('user_id', user.id).order('name'),
    ]);
    setInvoices(invRes.data as Invoice[] ?? []);
    setClients(cliRes.data as Client[] ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const generateInvoiceNumber = () => {
    const num = `INV-${Date.now().toString().slice(-6)}`;
    setInvoiceNumber(num);
  };

  const openCreate = () => {
    setSelected(null);
    setClientId('');
    generateInvoiceNumber();
    setStatus('draft');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setTaxRate('0');
    setNotes('');
    setItems([{ description: '', quantity: '1', unit_price: '0' }]);
    setShowForm(true);
  };

  const openEdit = (inv: Invoice) => {
    setSelected(inv);
    setClientId(inv.client_id ?? '');
    setInvoiceNumber(inv.invoice_number);
    setStatus(inv.status);
    setIssueDate(inv.issue_date);
    setDueDate(inv.due_date ?? '');
    setTaxRate(String(inv.tax_rate));
    setNotes(inv.notes);
    setItems(
      inv.invoice_items?.map(it => ({
        id: it.id,
        description: it.description,
        quantity: String(it.quantity),
        unit_price: String(it.unit_price),
      })) ?? [{ description: '', quantity: '1', unit_price: '0' }]
    );
    setShowForm(true);
  };

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0), 0);
  const taxAmount = subtotal * (parseFloat(taxRate) || 0) / 100;
  const total = subtotal + taxAmount;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        client_id: clientId || null,
        invoice_number: invoiceNumber,
        status,
        issue_date: issueDate,
        due_date: dueDate || null,
        subtotal,
        tax_rate: parseFloat(taxRate) || 0,
        tax_amount: taxAmount,
        total,
        notes,
      };

      let invoiceId: string;
      if (selected) {
        await supabase.from('invoices').update(payload).eq('id', selected.id);
        invoiceId = selected.id;
        await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId);
      } else {
        const { data } = await supabase.from('invoices').insert(payload).select().single();
        invoiceId = data.id;
      }

      const lineItems = items
        .filter(it => it.description.trim())
        .map(it => ({
          invoice_id: invoiceId,
          description: it.description,
          quantity: parseFloat(it.quantity) || 1,
          unit_price: parseFloat(it.unit_price) || 0,
          amount: (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0),
        }));
      if (lineItems.length > 0) {
        await supabase.from('invoice_items').insert(lineItems);
      }

      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    await supabase.from('invoices').delete().eq('id', id);
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  const filtered = invoices.filter(inv =>
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    (inv.clients as Client | undefined)?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice #</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Due</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEdit(inv)}>
                    <td className="px-6 py-4 font-medium text-green-700">{inv.invoice_number}</td>
                    <td className="px-6 py-4 text-gray-700">{(inv.clients as Client | undefined)?.name ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{inv.issue_date}</td>
                    <td className="px-6 py-4 text-gray-500">{inv.due_date ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status]}`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      ${(inv.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); deleteInvoice(inv.id); }}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{selected ? 'Edit Invoice' : 'New Invoice'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={save} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number</label>
                  <input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <div className="relative">
                    <select value={status} onChange={e => setStatus(e.target.value as Invoice['status'])}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                      {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Client</label>
                  <div className="relative">
                    <select value={clientId} onChange={e => setClientId(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                      <option value="">— No client —</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tax Rate (%)</label>
                  <input type="number" min="0" max="100" step="0.01" value={taxRate} onChange={e => setTaxRate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Issue Date</label>
                  <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              {/* Line items */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Line Items</label>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium px-1">
                    <span className="col-span-6">Description</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-3 text-right">Unit Price</span>
                    <span className="col-span-1" />
                  </div>
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input value={item.description} onChange={e => setItems(prev => prev.map((it, i) => i === idx ? { ...it, description: e.target.value } : it))}
                        placeholder="Description" className="col-span-6 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                      <input type="number" min="0" step="0.01" value={item.quantity} onChange={e => setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: e.target.value } : it))}
                        className="col-span-2 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500" />
                      <input type="number" min="0" step="0.01" value={item.unit_price} onChange={e => setItems(prev => prev.map((it, i) => i === idx ? { ...it, unit_price: e.target.value } : it))}
                        className="col-span-3 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500" />
                      <button type="button" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} disabled={items.length === 1}
                        className="col-span-1 flex items-center justify-center text-gray-300 hover:text-red-400 disabled:opacity-20">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setItems(prev => [...prev, { description: '', quantity: '1', unit_price: '0' }])}
                  className="mt-2 text-green-700 hover:text-green-800 text-xs font-medium flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Line
                </button>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax ({taxRate}%)</span><span>${taxAmount.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
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
                  {saving ? 'Saving...' : selected ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
