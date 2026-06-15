import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Booking, Client } from '../lib/supabase';
import { Plus, X, Trash2, ChevronDown, Calendar, Clock, MapPin } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const;

const toLocalDatetimeValue = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);

  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState<Booking['status']>('pending');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    const [bookRes, cliRes] = await Promise.all([
      supabase.from('bookings').select('*, clients(name, email)').eq('user_id', user.id).order('start_time'),
      supabase.from('clients').select('*').eq('user_id', user.id).order('name'),
    ]);
    setBookings(bookRes.data as Booking[] ?? []);
    setClients(cliRes.data as Client[] ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const defaultStart = () => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return toLocalDatetimeValue(d.toISOString());
  };

  const openCreate = () => {
    setSelected(null);
    setTitle('');
    setClientId('');
    setDescription('');
    const s = defaultStart();
    setStartTime(s);
    const end = new Date(s);
    end.setHours(end.getHours() + 1);
    setEndTime(toLocalDatetimeValue(end.toISOString()));
    setStatus('pending');
    setLocation('');
    setNotes('');
    setShowForm(true);
  };

  const openEdit = (b: Booking) => {
    setSelected(b);
    setTitle(b.title);
    setClientId(b.client_id ?? '');
    setDescription(b.description);
    setStartTime(toLocalDatetimeValue(b.start_time));
    setEndTime(toLocalDatetimeValue(b.end_time));
    setStatus(b.status);
    setLocation(b.location);
    setNotes(b.notes);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        client_id: clientId || null,
        title,
        description,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        status,
        location,
        notes,
      };
      if (selected) {
        await supabase.from('bookings').update(payload).eq('id', selected.id);
      } else {
        await supabase.from('bookings').insert(payload);
      }
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Delete this booking?')) return;
    await supabase.from('bookings').delete().eq('id', id);
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const now = new Date();
  const upcoming = bookings.filter(b => new Date(b.start_time) >= now && b.status !== 'cancelled');
  const past = bookings.filter(b => new Date(b.start_time) < now || b.status === 'cancelled');

  const BookingCard = ({ b }: { b: Booking }) => (
    <div onClick={() => openEdit(b)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{b.title}</h4>
          <p className="text-sm text-gray-500 truncate mt-0.5">{(b.clients as Client | undefined)?.name ?? 'No client'}</p>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[b.status]}`}>
            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
          </span>
          <button onClick={e => { e.stopPropagation(); deleteBooking(b.id); }}
            className="text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{new Date(b.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {new Date(b.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            {' — '}
            {new Date(b.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {b.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{b.location}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{upcoming.length} upcoming</span>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{past.length} past</span>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No bookings yet</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Upcoming</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map(b => <BookingCard key={b.id} b={b} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Past & Cancelled</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                {past.map(b => <BookingCard key={b.id} b={b} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{selected ? 'Edit Booking' : 'New Booking'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <div className="relative">
                    <select value={status} onChange={e => setStatus(e.target.value as Booking['status'])}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                      {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                  <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                  <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {saving ? 'Saving...' : selected ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
