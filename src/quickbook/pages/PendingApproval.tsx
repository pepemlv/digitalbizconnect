import { Clock3, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PendingApproval() {
  const { profile, refreshProfile, signOut } = useAuth();
  const rejected = profile?.approval_status === 'rejected';

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Clock3 className="w-7 h-7 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {rejected ? 'Request Needs Review' : 'Your Request Is Pending Approval'}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {rejected
            ? 'Please contact us so we can review your business account request.'
            : 'Your registration was received. Once your account is approved, you can start using DBC Book.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={refreshProfile}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg text-sm">
            <RefreshCw className="w-4 h-4" />
            Check Status
          </button>
          <button onClick={signOut}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg text-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
