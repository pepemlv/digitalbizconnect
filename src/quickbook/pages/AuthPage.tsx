import { useState } from 'react';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Mode = 'login' | 'register';

const businessTypes = ['Retail', 'Professional Services', 'Construction', 'Restaurant', 'Insurance', 'Healthcare', 'Real Estate', 'Other'];
const companyTypes = ['Sole Proprietorship', 'LLC', 'Corporation', 'Partnership', 'Nonprofit', 'Other'];
const companySizes = ['1 employee', '2-5 employees', '6-10 employees', '11-25 employees', '26-50 employees', '51+ employees'];

export default function AuthPage() {
  const initialMode = new URLSearchParams(window.location.search).get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) throw new Error('Passwords do not match.');

        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            company_name: companyName,
            email,
            phone,
            business_type: businessType,
            state,
            zipcode,
            company_size: companySize,
            company_type: companyType,
            approval_status: 'pending',
          });
        }

        await supabase.auth.signOut();
        setRequestSent(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (requestSent) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-7 h-7 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h1>
          <p className="text-sm text-gray-600 mb-6">
            Your DBC Book account request is pending approval. We will activate your dashboard after review.
          </p>
          <button onClick={() => { setRequestSent(false); setMode('login'); }}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="text-green-400 text-xs font-medium tracking-widest uppercase">Digitalbizconnect</p>
              <h1 className="text-white text-2xl font-bold leading-none">DBC Book</h1>
            </div>
          </div>
          <p className="text-green-300 text-sm">Business records, invoicing, and financial organization</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-green-700 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>
              Sign In
            </button>
            <button onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-green-700 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={fullName} onChange={setFullName} placeholder="John Smith" required />
                <Field label="Company Name" value={companyName} onChange={setCompanyName} placeholder="Your company" required />
                <Field label="Phone" value={phone} onChange={setPhone} placeholder="(704) 831-1314" required type="tel" />
                <SelectField label="Type of Business" value={businessType} onChange={setBusinessType} options={businessTypes} required />
                <Field label="State" value={state} onChange={setState} placeholder="NC" required />
                <Field label="Zip Code" value={zipcode} onChange={setZipcode} placeholder="28202" required />
                <SelectField label="Company Size" value={companySize} onChange={setCompanySize} options={companySizes} required />
                <SelectField label="Type of Company" value={companyType} onChange={setCompanyType} options={companyTypes} required />
              </div>
            )}

            <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" required type="email" />

            <div className={`grid ${mode === 'register' ? 'sm:grid-cols-2' : ''} gap-4`}>
              <PasswordField label="Password" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              {mode === 'register' && (
                <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} visible={showPassword} />
              )}
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Request My Free Business Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required = false, type = 'text' }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
    </label>
  );
}

function SelectField({ label, value, onChange, options, required = false }: {
  label: string; value: string; onChange: (value: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} required={required}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
        <option value="">Select an option</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function PasswordField({ label, value, onChange, visible, onToggle }: {
  label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle?: () => void;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="relative">
        <input type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)}
          required minLength={6} placeholder="Password"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
        {onToggle && (
          <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </label>
  );
}
