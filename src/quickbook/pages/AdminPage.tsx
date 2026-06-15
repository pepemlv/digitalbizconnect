import { useEffect, useState } from 'react';
import { Check, Clock3, LogOut, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Profile } from '../lib/supabase';

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'contact@digitalbizconnect.com';

export default function AdminPage() {
  const { session, loading, signOut } = useAuth();
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = session?.user.email?.toLowerCase() === adminEmail.toLowerCase();

  const loadProfiles = async () => {
    const { data, error: loadError } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (loadError) {
      setError(loadError.message);
      return;
    }
    setProfiles(data as Profile[] ?? []);
  };

  useEffect(() => {
    if (isAdmin) loadProfiles();
  }, [isAdmin]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setSigningIn(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    setSigningIn(false);
  };

  const updateStatus = async (profile: Profile, approvalStatus: 'approved' | 'rejected') => {
    await supabase.from('profiles').update({
      approval_status: approvalStatus,
      approved_at: approvalStatus === 'approved' ? new Date().toISOString() : '',
      approved_by: session?.user.email ?? '',
    }).eq('id', profile.id);
    loadProfiles();
  };

  if (loading) {
    return <div className="min-h-screen bg-green-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
        <form onSubmit={login} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-4">
          <div className="text-center mb-5">
            <ShieldCheck className="w-12 h-12 text-green-700 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">DBC Book Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Review and approve business account requests.</p>
          </div>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Admin Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </label>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
          <button disabled={signingIn} className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white rounded-lg py-3 font-semibold text-sm">
            {signingIn ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 text-center">
          <ShieldCheck className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
          <p className="text-sm text-gray-600 mb-5">Sign in with the DigitalBizConnect admin account to manage requests.</p>
          <button onClick={signOut} className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded-lg px-5 py-3 text-sm font-semibold">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const pending = profiles.filter((profile) => (profile.approval_status ?? 'pending') === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-950 text-white px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">DigitalBizConnect</p>
            <h1 className="text-xl font-bold">DBC Book Account Approvals</h1>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-5 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pending Requests</h2>
            <p className="text-sm text-gray-500 mt-1">{pending.length} account request{pending.length === 1 ? '' : 's'} waiting for approval.</p>
          </div>
          <button onClick={loadProfiles} className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}

        {pending.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-500">
            <Clock3 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            No pending requests.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {pending.map((profile) => (
              <article key={profile.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900">{profile.company_name || 'Unnamed company'}</h3>
                  <p className="text-sm text-gray-500">{profile.full_name || 'No contact name'}</p>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Detail label="Phone" value={profile.phone} />
                  <Detail label="Email" value={profile.email} />
                  <Detail label="Business" value={profile.business_type} />
                  <Detail label="Company Type" value={profile.company_type} />
                  <Detail label="Company Size" value={profile.company_size} />
                  <Detail label="State" value={profile.state} />
                  <Detail label="Zip Code" value={profile.zipcode} />
                </dl>
                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                  <button onClick={() => updateStatus(profile, 'approved')}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded-lg py-2.5 text-sm font-semibold">
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button onClick={() => updateStatus(profile, 'rejected')}
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-red-200 hover:bg-red-50 text-red-700 rounded-lg py-2.5 text-sm font-semibold">
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase">{label}</dt>
      <dd className="text-gray-700 mt-0.5">{value || '-'}</dd>
    </div>
  );
}
