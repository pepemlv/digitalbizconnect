import { useEffect, useMemo, useState } from 'react';
import { Lock, LogOut, Save, Settings } from 'lucide-react';
import { industryConfigs } from './demos/industryConfigs';
import {
  defaultTemplatePrice,
  formatTemplatePrice,
  getCachedTemplatePrice,
  saveTemplateAvailability,
  saveTemplatePrice,
  subscribeToTemplateSettings,
  subscribeToWebsitePayments,
  type WebsitePayment,
} from '../lib/templatePricing';

const superAdminUsername = 'superadmin';
const superAdminPassword = 'login123';
const superAdminSessionKey = 'dbc-superadmin-session';

export default function SuperAdmin() {
  const [signedIn, setSignedIn] = useState(() => sessionStorage.getItem(superAdminSessionKey) === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const templates = useMemo(
    () => industryConfigs.map((config, index) => ({ ...config, templateNumber: `T${index + 1}` })),
    []
  );
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(templates.map((template) => [template.id, String(getCachedTemplatePrice(template.id))]))
  );
  const [savedId, setSavedId] = useState('');
  const [savingId, setSavingId] = useState('');
  const [availability, setAvailability] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(templates.map((template) => [template.id, true]))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<WebsitePayment[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!signedIn) return undefined;

    return subscribeToTemplateSettings(
      (firestoreSettings) => {
        setPrices(
          Object.fromEntries(
            templates.map((template) => [
              template.id,
              String(firestoreSettings[template.id]?.price ?? defaultTemplatePrice),
            ]),
          ),
        );
        setAvailability(
          Object.fromEntries(
            templates.map((template) => [
              template.id,
              firestoreSettings[template.id]?.available ?? true,
            ]),
          ),
        );
        setIsLoading(false);
        setErrorMessage('');
      },
      (error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
      },
    );
  }, [signedIn, templates]);

  useEffect(() => {
    if (!signedIn) return undefined;

    return subscribeToWebsitePayments(
      setPayments,
      (error) => setErrorMessage(error.message),
    );
  }, [signedIn]);

  const login = (event: React.FormEvent) => {
    event.preventDefault();

    if (username.trim() === superAdminUsername && password === superAdminPassword) {
      sessionStorage.setItem(superAdminSessionKey, 'true');
      setSignedIn(true);
      setPassword('');
      setLoginError('');
      return;
    }

    setLoginError('Incorrect username or password.');
  };

  const logout = () => {
    sessionStorage.removeItem(superAdminSessionKey);
    setSignedIn(false);
    setUsername('');
    setPassword('');
  };

  const savePrice = async (templateId: string) => {
    const numericPrice = Number(prices[templateId]);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return;
    setSavingId(templateId);
    setErrorMessage('');

    try {
      await saveTemplatePrice(templateId, numericPrice);
      setSavedId(templateId);
      window.setTimeout(() => setSavedId(''), 1800);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save template price.');
    } finally {
      setSavingId('');
    }
  };

  const changeAvailability = async (templateId: string, nextAvailable: boolean) => {
    setAvailability((current) => ({ ...current, [templateId]: nextAvailable }));
    setErrorMessage('');

    try {
      await saveTemplateAvailability(templateId, nextAvailable);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save template availability.');
    }
  };

  const formatPaymentDate = (payment: WebsitePayment) => {
    const value = payment.createdAt;

    if (value instanceof Date) return value.toLocaleString();
    if (value && 'seconds' in value && value.seconds) {
      return new Date(value.seconds * 1000).toLocaleString();
    }

    return 'Pending timestamp';
  };

  if (!signedIn) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white flex items-center justify-center">
        <form onSubmit={login} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Superadmin Login</h1>
              <p className="text-sm text-white/50">Sign in to manage template pricing.</p>
            </div>
          </div>

          <label className="block text-sm font-semibold text-white/70">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-orange-500"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-white/70">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-orange-500"
            />
          </label>

          {loginError && (
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm font-semibold text-red-200">
              {loginError}
            </p>
          )}

          <button className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-500">
            Login
          </button>
          <a href="/" className="mt-4 block text-center text-sm font-semibold text-white/50 hover:text-white">
            Back to Site
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl">Superadmin</h1>
              <p className="text-xs text-white/45">Template checkout pricing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">
              Back to Site
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/70">
            Set the checkout price for every template. Prices are stored in Firestore and update the template checkout automatically.
          </p>
          {isLoading && <p className="mt-3 text-sm font-semibold text-orange-200">Loading Firestore prices...</p>}
          {errorMessage && <p className="mt-3 text-sm font-semibold text-red-300">Firestore error: {errorMessage}</p>}
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="inline-flex rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-bold text-orange-200 ring-1 ring-orange-500/20">
                    {template.templateNumber}
                  </span>
                  <h2 className="mt-3 font-display text-lg font-bold">{template.businessName}</h2>
                  <p className="text-sm text-white/45">{template.id}</p>
                </div>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/60">
                  {template.industry}
                </span>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">
                Checkout Price
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={prices[template.id] ?? ''}
                  onChange={(event) => setPrices((current) => ({ ...current, [template.id]: event.target.value }))}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-orange-500"
                />
                <button
                  onClick={() => savePrice(template.id)}
                  disabled={savingId === template.id}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {savingId === template.id ? 'Saving' : 'Save'}
                </button>
              </div>
              {savedId === template.id && (
                <p className="mt-3 text-sm font-semibold text-emerald-300">
                  Saved. Checkout now uses {formatTemplatePrice(Number(prices[template.id]))}.
                </p>
              )}

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">
                Checkout Status
              </label>
              <select
                value={availability[template.id] === false ? 'unavailable' : 'available'}
                onChange={(event) => changeAvailability(template.id, event.target.value === 'available')}
                className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-orange-500"
              >
                <option value="available">Available</option>
                <option value="unavailable">Not Available</option>
              </select>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Payment History</h2>
              <p className="text-sm text-white/50">Website checkout payments and reservations.</p>
            </div>
            <p className="text-sm font-semibold text-white/60">{payments.length} records</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-white/40">
                <tr className="border-b border-white/10">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Template</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Phone</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Paid</th>
                  <th className="py-3 pr-4">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {payments.map((payment) => (
                  <tr key={payment.id} className="text-white/75">
                    <td className="py-3 pr-4 whitespace-nowrap">{formatPaymentDate(payment)}</td>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-white">{payment.businessName}</p>
                      <p className="text-xs text-white/40">{payment.templateId}</p>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">{payment.customerName}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{payment.customerEmail}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{payment.customerPhone}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        payment.checkoutMode === 'reserve'
                          ? 'bg-yellow-500/15 text-yellow-200'
                          : 'bg-red-500/15 text-red-200'
                      }`}>
                        {payment.checkoutMode === 'reserve' ? 'Reserved' : 'Paid Full'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-white">{formatTemplatePrice(payment.amountPaid)}</td>
                    <td className="py-3 pr-4">{formatTemplatePrice(payment.balanceDue)}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td className="py-6 text-center text-white/45" colSpan={8}>
                      No website payments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
