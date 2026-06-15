import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Plus, Search, Trash2, User } from 'lucide-react';
import ClientForm from '../components/ClientForm';
import { supabase, type Client } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Clients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('clients').select('*').eq('user_id', user.id).order('name');
    setClients(data as Client[] ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const openEdit = (client: Client) => {
    setSelected(client);
    setShowForm(true);
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Delete this client? Related invoices will lose their client reference.')) return;
    await supabase.from('clients').delete().eq('id', id);
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  const filtered = clients.filter((client) => {
    const value = `${client.name ?? ''} ${client.email ?? ''} ${client.company ?? ''} ${client.phone ?? ''}`.toLowerCase();
    return value.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-500 mt-1">Manage customers, company details, contact information, balances, and notes.</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      {showForm && (
        <section>
          <ClientForm
            client={selected}
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
          <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No clients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <div key={client.id} onClick={() => openEdit(client)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-sm">{client.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{client.name}</h4>
                    {client.company && <p className="text-xs text-gray-500 mt-0.5">{client.company}</p>}
                  </div>
                </div>
                <button onClick={(event) => { event.stopPropagation(); deleteClient(client.id); }}
                  className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-gray-500">
                {client.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 flex-shrink-0" />{client.email}</p>}
                {client.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 flex-shrink-0" />{client.phone}</p>}
                {client.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 flex-shrink-0" />{client.address}</p>}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">Balance</p>
                <p className="text-lg font-bold text-gray-900">
                  ${(client.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
