import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Client, Expense, EXPENSE_CATEGORIES, type Vendor } from '../lib/supabase';
import ClientForm from '../components/ClientForm';
import VendorForm from '../components/VendorForm';
import { ChevronDown, Paperclip, Plus, Search, Trash2, TrendingDown, X } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  'Office Supplies': 'bg-blue-100 text-blue-700',
  Travel: 'bg-purple-100 text-purple-700',
  'Meals & Entertainment': 'bg-orange-100 text-orange-700',
  'Software & Subscriptions': 'bg-cyan-100 text-cyan-700',
  Marketing: 'bg-pink-100 text-pink-700',
  Utilities: 'bg-yellow-100 text-yellow-700',
  Rent: 'bg-teal-100 text-teal-700',
  Equipment: 'bg-indigo-100 text-indigo-600',
  'Professional Services': 'bg-emerald-100 text-emerald-700',
  Insurance: 'bg-sky-100 text-sky-700',
  Other: 'bg-gray-100 text-gray-600',
};

type CompanyOption = { id: string; name: string; type: 'Customer' | 'Vendor' };
type PaymentAccount = { id: string; name: string; account_type: string };

export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Expense | null>(null);

  const [payee, setPayee] = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [refNo, setRefNo] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [tax, setTax] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');
  const [attachments, setAttachments] = useState('');
  const [saving, setSaving] = useState(false);

  const [showNewAccount, setShowNewAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('Checking');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [showNewVendor, setShowNewVendor] = useState(false);

  const load = async () => {
    if (!user) return;
    const [expenseRes, clientRes, vendorRes, accountRes] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('clients').select('*').eq('user_id', user.id).order('name'),
      supabase.from('vendors').select('*').eq('user_id', user.id).order('title'),
      supabase.from('payment_accounts').select('*').eq('user_id', user.id).order('name'),
    ]);

    const customers = (clientRes.data as Client[] ?? []).map((client) => ({
      id: `customer:${client.id}`,
      name: client.company || client.name,
      type: 'Customer' as const,
    }));
    const vendors = (vendorRes.data as Vendor[] ?? [])
      .filter((vendor) => vendor.action === 'Add Vendor' || vendor.action === 'Record Vendor Bills' || vendor.action === 'Pay Vendors')
      .map((vendor) => ({
        id: `vendor:${vendor.id}`,
        name: vendor.vendor_name || vendor.company_name || vendor.title,
        type: 'Vendor' as const,
      }));

    setCompanies([...customers, ...vendors]);
    setPaymentAccounts(accountRes.data as PaymentAccount[] ?? []);
    setExpenses(expenseRes.data as Expense[] ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const resetForm = () => {
    setSelected(null);
    setPayee('');
    setPaymentAccount('');
    setPaymentMethod('');
    setRefNo('');
    setCompanyId('');
    setCategory(EXPENSE_CATEGORIES[0]);
    setDescription('');
    setAmount('');
    setTax('');
    setDate(new Date().toISOString().split('T')[0]);
    setMemo('');
    setAttachments('');
    setShowNewAccount(false);
    setShowNewCustomer(false);
    setShowNewVendor(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (exp: Expense) => {
    setSelected(exp);
    setPayee(exp.payee ?? '');
    setPaymentAccount(exp.payment_account ?? '');
    setPaymentMethod(exp.payment_method ?? '');
    setRefNo(exp.ref_no ?? '');
    setCompanyId(exp.company_id ?? '');
    setCategory(exp.category);
    setDescription(exp.description);
    setAmount(String(exp.amount));
    setTax(String(exp.tax ?? ''));
    setDate(exp.date);
    setMemo(exp.memo ?? exp.notes ?? '');
    setAttachments(exp.attachments ?? '');
    setShowForm(true);
  };

  const createPaymentAccount = async () => {
    if (!user || !newAccountName.trim()) return;
    const result = await supabase.from('payment_accounts').insert({
      user_id: user.id,
      name: newAccountName.trim(),
      account_type: newAccountType,
    }) as { data: PaymentAccount[] | null };
    const saved = result.data?.[0];

    if (saved) setPaymentAccount(saved.name);
    setNewAccountName('');
    setNewAccountType('Checking');
    setShowNewAccount(false);
    load();
  };

  const handleClientSaved = (client: Client) => {
    setCompanyId(`customer:${client.id}`);
    setShowNewCustomer(false);
    load();
  };

  const handleVendorSaved = (vendor: Vendor) => {
    setCompanyId(`vendor:${vendor.id}`);
    setShowNewVendor(false);
    load();
  };

  const save = async (e: React.SyntheticEvent, closeAfterSave: boolean) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const selectedCompany = companies.find((company) => company.id === companyId);
      const payload = {
        user_id: user.id,
        payee,
        payment_account: paymentAccount,
        payment_method: paymentMethod,
        ref_no: refNo,
        company_id: companyId,
        company_name: selectedCompany?.name ?? '',
        category,
        description,
        amount: parseFloat(amount) || 0,
        tax: parseFloat(tax) || 0,
        date,
        memo,
        notes: memo,
        attachments,
      };
      if (selected) {
        await supabase.from('expenses').update(payload).eq('id', selected.id);
      } else {
        await supabase.from('expenses').insert(payload);
      }
      if (closeAfterSave) {
        setShowForm(false);
      } else {
        resetForm();
        setShowForm(true);
      }
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

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const names = Array.from(files).map((file) => file.name);
    setAttachments((prev) => [...prev.split('\n').filter(Boolean), ...names].join('\n'));
  };

  const filtered = expenses.filter(exp =>
    (
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      exp.category.toLowerCase().includes(search.toLowerCase()) ||
      (exp.payee ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (exp.company_name ?? '').toLowerCase().includes(search.toLowerCase())
    ) &&
    (filterCategory === '' || exp.category === filterCategory)
  );

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);
  const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
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

      {showForm && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900">{selected ? 'Edit Expense' : 'Add Expense'}</h3>
              <p className="text-sm text-gray-500">Record payee, account, company, expense details, memo, and attachments.</p>
            </div>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={(e) => save(e, true)} className="p-6 space-y-5">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payee</label>
                <input value={payee} onChange={e => setPayee(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Payment Account</label>
                  <button type="button" onClick={() => setShowNewAccount(true)} className="text-xs font-semibold text-green-700 hover:text-green-800">
                    Add payment account
                  </button>
                </div>
                <select
                  value={paymentAccount}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setShowNewAccount(true);
                      return;
                    }
                    setPaymentAccount(e.target.value);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select account</option>
                  {paymentAccounts.map((account) => (
                    <option key={account.id} value={account.name}>{account.name} ({account.account_type})</option>
                  ))}
                  <option value="__new__">+ New payment account...</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select method</option>
                  {['Cash', 'Check', 'Credit Card', 'Debit Card', 'ACH', 'Wire'].map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ref No.</label>
                <input value={refNo} onChange={e => setRefNo(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Company</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowNewCustomer(true)} className="text-xs font-semibold text-green-700 hover:text-green-800">New customer</button>
                    <button type="button" onClick={() => setShowNewVendor(true)} className="text-xs font-semibold text-green-700 hover:text-green-800">New vendor</button>
                  </div>
                </div>
                <select
                  value={companyId}
                  onChange={(e) => {
                    if (e.target.value === '__new_customer__') {
                      setShowNewCustomer(true);
                      return;
                    }
                    if (e.target.value === '__new_vendor__') {
                      setShowNewVendor(true);
                      return;
                    }
                    setCompanyId(e.target.value);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select customer or vendor</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name} ({company.type})</option>
                  ))}
                  <option value="__new_customer__">+ New customer...</option>
                  <option value="__new_vendor__">+ New vendor...</option>
                </select>
              </div>
            </div>

            {(showNewAccount || showNewCustomer || showNewVendor) && (
              <div className="grid md:grid-cols-3 gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                {showNewAccount && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900">New Payment Account</p>
                    <input value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} placeholder="Account name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <select value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      {['Checking', 'Savings', 'Cash', 'Credit Card', 'Loan', 'Other'].map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <button type="button" onClick={createPaymentAccount} className="w-full bg-green-700 text-white rounded-lg py-2 text-sm font-semibold">Create Account</button>
                  </div>
                )}

                {showNewCustomer && (
                  <div className="md:col-span-3">
                    <p className="text-sm font-semibold text-gray-900 mb-3">New Customer</p>
                    <ClientForm compact onSaved={handleClientSaved} onCancel={() => setShowNewCustomer(false)} />
                  </div>
                )}

                {showNewVendor && (
                  <div className="md:col-span-3">
                    <p className="text-sm font-semibold text-gray-900 mb-3">New Vendor</p>
                    <VendorForm compact onSaved={handleVendorSaved} onCancel={() => setShowNewVendor(false)} />
                  </div>
                )}
              </div>
            )}

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-2 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                <span className="col-span-3">Category</span>
                <span className="col-span-4">Description</span>
                <span className="col-span-2 text-right">Amount</span>
                <span className="col-span-2 text-right">Tax</span>
                <span className="col-span-1" />
              </div>
              <div className="grid grid-cols-12 gap-2 p-4">
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="col-span-12 md:col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={description} onChange={e => setDescription(e.target.value)} required placeholder="Description"
                  className="col-span-12 md:col-span-4 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required
                  className="col-span-6 md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="number" min="0" step="0.01" value={tax} onChange={e => setTax(e.target.value)}
                  className="col-span-6 md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500" />
                <div className="hidden md:block" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Memo</label>
                <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Attachments</label>
                <input id="expense-attachments" type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <button
                  type="button"
                  onClick={() => document.getElementById('expense-attachments')?.click()}
                  className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 hover:border-green-500 rounded-lg px-3 py-4 text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  Upload Attachment
                </button>
                {attachments && (
                  <div className="mt-3 rounded-lg bg-gray-50 border border-gray-100 p-3 text-xs text-gray-600 whitespace-pre-line">
                    {attachments}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="sm:ml-auto border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                Cancel
              </button>
              <button type="button" disabled={saving} onClick={(e) => save(e, false)}
                className="bg-white border border-green-700 text-green-700 hover:bg-green-50 disabled:opacity-60 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="submit" disabled={saving}
                className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                {saving ? 'Saving...' : 'Save and Close'}
              </button>
            </div>
          </form>
        </section>
      )}

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
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payee / Company</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tax</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(exp => (
                    <tr key={exp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEdit(exp)}>
                      <td className="px-6 py-4 text-gray-500">{exp.date}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{exp.payee || '-'}</p>
                        {exp.company_name && <p className="text-xs text-gray-400 mt-0.5">{exp.company_name}</p>}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{exp.description}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[exp.category] ?? 'bg-gray-100 text-gray-600'}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        ${(exp.tax ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
    </div>
  );
}
