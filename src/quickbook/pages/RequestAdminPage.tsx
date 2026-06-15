import { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  LogOut,
  Mail,
  Phone,
  Search,
  ShieldCheck,
} from 'lucide-react';
import {
  subscribeToContactMessages,
  updateContactMessageStatus,
  type ContactMessage,
} from '../../lib/firebase';

const adminUsername = import.meta.env.VITE_REQUEST_ADMIN_USERNAME || 'admin';
const adminPassword = import.meta.env.VITE_REQUEST_ADMIN_PASSWORD || 'admin123';
const adminSessionKey = 'dbc-request-admin';

type Filter = 'all' | 'new' | 'callbacks' | 'contacted' | 'completed';

const filterOptions: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Requests' },
  { value: 'new', label: 'New' },
  { value: 'callbacks', label: 'Callback Requests' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'completed', label: 'Completed' },
];

export default function RequestAdminPage() {
  const [signedIn, setSignedIn] = useState(() => sessionStorage.getItem(adminSessionKey) === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [requests, setRequests] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    if (!signedIn) return;

    setLoading(true);
    const unsubscribe = subscribeToContactMessages(
      (messages) => {
        setRequests(messages);
        setLoadError('');
        setLoading(false);
      },
      (error) => {
        setLoadError(error.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [signedIn]);

  const visibleRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return requests.filter((request) => {
      if (filter === 'callbacks' && request.requestType !== 'schedule_call') return false;
      if (filter !== 'all' && filter !== 'callbacks' && request.status !== filter) return false;
      if (!normalizedQuery) return true;

      return [
        request.name,
        request.company,
        request.email,
        request.phone,
        request.message,
        request.requestType,
      ].some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [filter, query, requests]);

  const callbacks = requests.filter((request) => request.requestType === 'schedule_call');
  const newRequests = requests.filter((request) => request.status === 'new');

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (username === adminUsername && password === adminPassword) {
      sessionStorage.setItem(adminSessionKey, 'true');
      setSignedIn(true);
      setLoginError('');
      return;
    }

    setLoginError('Incorrect username or password.');
  };

  const logout = () => {
    sessionStorage.removeItem(adminSessionKey);
    setSignedIn(false);
    setUsername('');
    setPassword('');
  };

  const changeStatus = async (request: ContactMessage, status: ContactMessage['status']) => {
    setUpdatingId(request.id);
    setLoadError('');
    try {
      await updateContactMessageStatus(request.id, status);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not update this request.');
    } finally {
      setUpdatingId('');
    }
  };

  if (!signedIn) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
        <form onSubmit={login} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-4">
          <div className="text-center mb-5">
            <ShieldCheck className="w-12 h-12 text-green-700 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">DigitalBizConnect Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to review contact and callback requests.</p>
          </div>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Username</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} required autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          {loginError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{loginError}</p>}
          <button className="w-full bg-green-700 hover:bg-green-800 text-white rounded-lg py-3 font-semibold text-sm">
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-950 text-white px-5 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">DigitalBizConnect</p>
            <h1 className="text-xl font-bold">Request Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin/account-approvals" className="text-sm font-semibold text-white/75 hover:text-white">
              Account Approvals
            </a>
            <button onClick={logout} className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-5 sm:p-8 space-y-6">
        <section className="grid sm:grid-cols-3 gap-4">
          <SummaryCard icon={ClipboardList} label="All Requests" value={requests.length} />
          <SummaryCard icon={CheckCircle2} label="New Requests" value={newRequests.length} />
          <SummaryCard icon={CalendarClock} label="Callback Requests" value={callbacks.length} />
        </section>

        <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button key={option.value} onClick={() => setFilter(option.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    filter === option.value ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {option.label}
                </button>
              ))}
            </div>
            <label className="relative block lg:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requests..."
                className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </label>
          </div>
        </section>

        {loadError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{loadError}</p>}

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visibleRequests.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-500">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            No requests found.
          </div>
        ) : (
          <section className="grid xl:grid-cols-2 gap-4">
            {visibleRequests.map((request) => (
              <RequestCard key={request.id} request={request} updating={updatingId === request.id} onStatusChange={changeStatus} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof ClipboardList; label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-700" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function RequestCard({
  request,
  updating,
  onStatusChange,
}: {
  request: ContactMessage;
  updating: boolean;
  onStatusChange: (request: ContactMessage, status: ContactMessage['status']) => void;
}) {
  const isCallback = request.requestType === 'schedule_call';

  return (
    <article className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="font-bold text-gray-900">{request.name || 'Unnamed contact'}</h2>
            {isCallback && <span className="text-xs font-semibold bg-orange-50 text-orange-700 rounded-full px-2 py-1">Callback</span>}
            <StatusBadge status={request.status} />
          </div>
          <p className="text-sm text-gray-500">{request.company || 'No company provided'}</p>
        </div>
        <time className="text-xs text-gray-400 text-right">{formatDate(request.createdAt)}</time>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
        <ContactLink icon={Phone} href={request.phone ? `tel:${request.phone}` : undefined} label={request.phone || 'No phone'} />
        <ContactLink icon={Mail} href={request.email ? `mailto:${request.email}` : undefined} label={request.email || 'No email'} />
        {request.website && <ContactLink icon={ExternalLink} href={request.website} label="Open website" />}
        {isCallback && <Detail label="Preferred time" value={[request.preferredDate, request.preferredTime].filter(Boolean).join(' at ')} />}
      </div>

      {(request.services ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(request.services ?? []).map((service) => <span key={service} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">{service}</span>)}
        </div>
      )}

      {request.message && <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4 whitespace-pre-wrap">{request.message}</p>}

      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        {request.status !== 'contacted' && (
          <button disabled={updating} onClick={() => onStatusChange(request, 'contacted')}
            className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white rounded-lg px-3 py-2 text-sm font-semibold">
            Mark Contacted
          </button>
        )}
        {request.status !== 'completed' && (
          <button disabled={updating} onClick={() => onStatusChange(request, 'completed')}
            className="border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-gray-700 rounded-lg px-3 py-2 text-sm font-semibold">
            Mark Completed
          </button>
        )}
        {request.status !== 'new' && (
          <button disabled={updating} onClick={() => onStatusChange(request, 'new')}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-60 rounded-lg px-3 py-2 text-sm font-semibold">
            Reopen
          </button>
        )}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: ContactMessage['status'] }) {
  const colors = {
    new: 'bg-blue-50 text-blue-700',
    contacted: 'bg-yellow-50 text-yellow-700',
    completed: 'bg-green-50 text-green-700',
  };

  return <span className={`text-xs font-semibold rounded-full px-2 py-1 capitalize ${colors[status]}`}>{status}</span>;
}

function ContactLink({ icon: Icon, href, label }: { icon: typeof Phone; href?: string; label: string }) {
  const content = <><Icon className="w-4 h-4 text-green-700 flex-shrink-0" /><span className="truncate">{label}</span></>;
  return href
    ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-green-700">{content}</a>
    : <div className="flex items-center gap-2 text-gray-400">{content}</div>;
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
      <p className="text-sm text-gray-700">{value || '-'}</p>
    </div>
  );
}

function formatDate(timestamp?: number) {
  return timestamp ? new Date(timestamp).toLocaleString() : 'Date unavailable';
}
