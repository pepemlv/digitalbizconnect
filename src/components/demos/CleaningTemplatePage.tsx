import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  ArrowLeft,
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Hand,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import type { IndustryConfig } from './industryConfigs';
import { formatTemplatePrice, getCachedTemplatePrice, subscribeToTemplatePrice } from '../../lib/templatePricing';

interface Props {
  config: IndustryConfig;
  onBack: () => void;
}

type CheckoutStep = 'form' | 'done';
type CheckoutMode = 'full' | 'reserve';
const reservationPrice = 1;
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const clientStories = [
  {
    quote:
      "PristineClean has transformed our home. The team is incredibly thorough and professional. I come home to a spotless house every week - it's made such a difference to our family's quality of life.",
    name: 'Sarah Mitchell',
    role: 'Homeowner',
  },
  {
    quote:
      "We've used them for our office for two years and they never disappoint. Reliable, trustworthy, and the results are always immaculate. Highly recommend for any commercial space.",
    name: 'James Okafor',
    role: 'Business Owner',
  },
];

const footerLinks = {
  Services: ['Residential', 'Commercial', 'Deep Clean', 'Carpet & Upholstery', 'Post-Construction'],
  Company: ['About Us', 'Careers', 'Blog', 'Press', 'Contact'],
  Support: ['FAQ', 'Pricing', 'Terms of Service', 'Privacy Policy', 'Refund Policy'],
};

function HeroCompanyName({ name, accentColor }: { name: string; accentColor: string }) {
  const [firstWord, ...remainingWords] = name.split(' ');

  return (
    <p className="font-display text-2xl font-bold">
      <span style={{ color: accentColor }}>{firstWord}</span>
      {remainingWords.length > 0 && <span className="text-white"> {remainingWords.join(' ')}</span>}
    </p>
  );
}

function PromoCountdown() {
  const [targetTime] = useState(() => Date.now() + 5 * 24 * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(() => Math.max(targetTime - Date.now(), 0));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(Math.max(targetTime - Date.now(), 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetTime]);

  const totalSeconds = Math.floor(remaining / 1000);
  const countdown = [
    { label: 'Days', value: Math.floor(totalSeconds / 86400) },
    { label: 'Hours', value: Math.floor((totalSeconds % 86400) / 3600) },
    { label: 'Minutes', value: Math.floor((totalSeconds % 3600) / 60) },
    { label: 'Seconds', value: totalSeconds % 60 },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Five day promo countdown">
      {countdown.map((item) => (
        <div key={item.label} className="rounded-lg bg-white/10 px-2 py-2 text-center ring-1 ring-white/15 sm:px-3">
          <p className="font-display text-lg font-black text-white sm:text-2xl">
            {String(item.value).padStart(2, '0')}
          </p>
          <p className="mt-0.5 text-[10px] font-bold uppercase text-white/60 sm:text-[11px]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function WebsiteCheckoutForm({
  config,
  price,
  promoPrice,
  checkoutMode,
  onPaid,
}: {
  config: IndustryConfig;
  price: number;
  promoPrice: number;
  checkoutMode: CheckoutMode;
  onPaid: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: config.businessName,
    domain: config.websiteDomain || '',
    notes: '',
  });

  const handleChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const orderId = `website-${config.id}-${Date.now()}`;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${apiUrl}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          promoPrice,
          balanceDue: Math.max(promoPrice - price, 0),
          orderId,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          businessName: customerInfo.businessName,
          websiteDomain: customerInfo.domain,
          templateId: config.id,
          productType: checkoutMode === 'reserve' ? 'website-template-reservation' : 'website-template',
          notes: customerInfo.notes,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unable to start checkout. Please try again.');
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Stripe did not return a client secret.');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Payment failed. Please try again.');
      }

      if (paymentIntent?.status === 'succeeded') {
        onPaid(paymentIntent.id);
      } else {
        throw new Error('Payment was not completed.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="space-y-4 p-6" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required placeholder="Your name" value={customerInfo.name} onChange={(event) => handleChange('name', event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]" />
        <input required type="email" placeholder="Email address" value={customerInfo.email} onChange={(event) => handleChange('email', event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required type="tel" placeholder="Phone number" value={customerInfo.phone} onChange={(event) => handleChange('phone', event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]" />
        <input placeholder="Business name" value={customerInfo.businessName} onChange={(event) => handleChange('businessName', event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]" />
      </div>
      <input
        value={customerInfo.domain}
        onChange={(event) => handleChange('domain', event.target.value)}
        placeholder="Preferred domain name"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]"
      />
      <textarea rows={3} value={customerInfo.notes} onChange={(event) => handleChange('notes', event.target.value)} placeholder="Business details, colors, photos, logo notes, services, or service area" className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]" />
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
          <CreditCard className="h-4 w-4" />
          Card Information
        </label>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#0f172a',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  '::placeholder': { color: '#94a3b8' },
                },
                invalid: { color: '#dc2626' },
              },
            }}
          />
        </div>
      </div>
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <p className="text-xs leading-5 text-slate-500">
        Secure payment powered by Stripe. Your card details are encrypted and never stored on this site.
      </p>
      <button type="submit" disabled={!stripe || isProcessing} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#781AAB] px-5 py-4 font-bold text-white hover:bg-[#64158f] disabled:cursor-not-allowed disabled:opacity-60">
        <CreditCard className="h-5 w-5" />
        {isProcessing
          ? 'Processing...'
          : checkoutMode === 'reserve'
            ? `Reserve for ${formatTemplatePrice(price)} Securely`
            : `Pay ${formatTemplatePrice(price)} Securely`}
      </button>
    </form>
  );
}

function CheckoutModal({
  config,
  checkoutPrice,
  promoPrice,
  checkoutMode,
  onClose,
}: {
  config: IndustryConfig;
  checkoutPrice: number;
  promoPrice: number;
  checkoutMode: CheckoutMode;
  onClose: () => void;
}) {
  const [step, setStep] = useState<CheckoutStep>('form');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const balanceDue = Math.max(promoPrice - checkoutPrice, 0);
  const isReservation = checkoutMode === 'reserve';
  const StatusIcon = isReservation ? AlertTriangle : AlertCircle;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#781AAB]">Cart Checkout</p>
              <h2 className="font-display font-bold text-2xl text-slate-950">{config.businessName} Website</h2>
            </div>
            <button onClick={onClose} className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {step === 'done' ? (
            <div className="px-6 py-12 text-center">
              <div
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
                  isReservation ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <StatusIcon className="h-8 w-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-950">
                {isReservation ? 'Website reserved' : 'Full payment received'}
              </h3>
              <p
                className={`mx-auto mt-4 max-w-md rounded-xl border p-3 text-sm font-bold ${
                  isReservation
                    ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {isReservation ? 'Reservation alert: follow-up payment is still due.' : 'Paid-in-full alert: no reservation balance remains.'}
              </p>
              <p className="mx-auto mt-3 max-w-md text-slate-600">
                {isReservation
                  ? `Your website is reserved for ${formatTemplatePrice(checkoutPrice)}. We will contact you to complete the remaining ${formatTemplatePrice(balanceDue)} within 5 days and get this website online.`
                  : `Your ${formatTemplatePrice(promoPrice)} website payment is complete. We will contact you to get this website online for your business.`}
              </p>
              {paymentIntentId && <p className="mt-3 text-xs font-semibold text-slate-400">Payment ID: {paymentIntentId}</p>}
              <button onClick={onClose} className="mt-7 rounded-xl bg-[#781AAB] px-6 py-3 font-semibold text-white hover:bg-[#64158f]">
                Close
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_260px]">
              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <WebsiteCheckoutForm
                    config={config}
                    price={checkoutPrice}
                    promoPrice={promoPrice}
                    checkoutMode={checkoutMode}
                    onPaid={(id) => {
                      setPaymentIntentId(id);
                      setStep('done');
                    }}
                  />
                </Elements>
              ) : (
                <div className="p-6">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    Stripe checkout needs <span className="font-bold">VITE_STRIPE_PUBLISHABLE_KEY</span> in the frontend environment before card payment can load.
                  </div>
                </div>
              )}

              <aside className="bg-slate-50 p-6 border-t lg:border-l lg:border-t-0 border-slate-100">
                <div className="rounded-2xl bg-white border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[#781AAB]/10 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-[#781AAB]" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">Template setup</p>
                      <p className="text-xs text-slate-500">
                        {isReservation ? 'Reserve today. Pay the rest within 5 days.' : 'Pay in full today. No monthly charge.'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">{config.businessName}</span>
                      <span className="font-semibold text-slate-900">{formatTemplatePrice(promoPrice)}</span>
                    </div>
                    {isReservation && (
                      <>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Reserve today</span>
                          <span className="font-semibold text-slate-900">{formatTemplatePrice(checkoutPrice)}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Due within 5 days</span>
                          <span className="font-semibold text-slate-900">{formatTemplatePrice(balanceDue)}</span>
                        </div>
                      </>
                    )}
                    {config.websiteDomain && (
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Domain</span>
                        <span className="font-semibold text-slate-900">{config.websiteDomain}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-100 pt-3 flex justify-between gap-3">
                      <span className="font-bold text-slate-950">Total</span>
                      <span className="font-display text-2xl font-bold text-[#781AAB]">{formatTemplatePrice(checkoutPrice)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  {isReservation
                    ? 'Limited offer includes your domain name, professional email, custom website, and launch support. Your reservation holds this promo price for 5 days.'
                    : 'Limited offer includes your domain name, professional email, custom website, and launch support so your site can move forward today.'}
                </p>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CleaningTemplatePage({ config, onBack }: Props) {
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode | null>(null);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [detailedCallbackSubmitted, setDetailedCallbackSubmitted] = useState(false);
  const [templatePrice, setTemplatePrice] = useState(() => getCachedTemplatePrice(config.id));
  const serviceOptions = useMemo(() => config.quoteOptions?.[1]?.options || ['Standard Clean', 'Deep Clean', 'Move-In/Out'], [config.quoteOptions]);
  const contactEmail = config.websiteDomain ? `hello@${config.websiteDomain}` : 'hello@pristineclean.com';
  const accentStyle = { color: config.accentHex };
  const accentBgStyle = { backgroundColor: config.accentHex };
  const accentLightStyle = { backgroundColor: config.accentLightHex, color: config.accentTextHex };

  useEffect(() => {
    return subscribeToTemplatePrice(config.id, setTemplatePrice, (error) => {
      console.error('Unable to load template price from Firestore:', error);
    });
  }, [config.id]);

  const openCheckout = (mode: CheckoutMode) => {
    setCheckoutMode(mode);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2 font-display font-bold text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={accentBgStyle}>
              <Sparkles className="h-5 w-5" />
            </span>
            {config.businessName}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button onClick={() => openCheckout('full')} className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={accentBgStyle}>
              Pay Now {formatTemplatePrice(templatePrice)}
            </button>
            <button onClick={() => openCheckout('reserve')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50">
              Reserve {formatTemplatePrice(reservationPrice)}
            </button>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen sm:min-h-[80vh] flex items-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={config.heroImage}
          aria-label={`${config.businessName} cleaning service background video`}
        >
          <source src="/images/cleaning/video/cleaninghero2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-950/18 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20 w-full">
          <div className="max-w-[22rem] sm:max-w-3xl">
            <div className="inline-flex flex-col gap-1.5 text-white">
              <HeroCompanyName name={config.businessName} accentColor="#020617" />
              {config.websiteDomain && <p className="text-xs sm:text-sm font-semibold text-white/85">{config.websiteDomain}</p>}
            </div>
            <h1 className="mt-5 sm:mt-6 font-display text-3xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white">
              {config.tagline}
            </h1>
            <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-lg leading-6 sm:leading-8 text-white/85">
              {config.subTagline}
            </p>
            <span className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 sm:px-4 text-xs sm:text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur">
              <ShieldCheck className="h-4 w-4" style={accentStyle} />
              Licensed, bonded, insured cleaning professionals
            </span>
          </div>
        </div>
      </section>

      <section className="mt-5 px-4 sm:mt-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-2xl bg-slate-950 px-4 py-4 text-white shadow-2xl shadow-slate-950/20 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_260px] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/15" style={{ color: config.accentLightHex }}>
                  5 Day Special Promo
                </span>
                <span className="text-sm font-bold" style={{ color: config.accentLightHex }}>
                  Only {formatTemplatePrice(templatePrice)} One Time
                </span>
                <span className="text-sm font-bold text-white">
                  Reserve today for {formatTemplatePrice(reservationPrice)}
                </span>
              </div>
              <h2 className="mt-2 font-display text-lg font-black leading-snug sm:text-2xl">
                Get this website online: {config.websiteDomain || 'your company website'}
              </h2>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-white/65 sm:text-sm sm:leading-6">
                Put your company website online today with no monthly charge. Reserve it for {formatTemplatePrice(reservationPrice)} and pay the remaining {formatTemplatePrice(Math.max(templatePrice - reservationPrice, 0))} within the next 5 days. Free domain, professional email, fully coded website, customized photos, colors, and your logo added.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => openCheckout('full')}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg"
                style={accentBgStyle}
              >
                <CreditCard className="h-4 w-4" />
                Pay Now {formatTemplatePrice(templatePrice)}
              </button>
              <button
                onClick={() => openCheckout('reserve')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-white/15"
              >
                <ShoppingCart className="h-4 w-4" />
                Reserve for {formatTemplatePrice(reservationPrice)}
              </button>
            </div>
            <div>
              <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-white/50">
                Ends In
              </p>
              <PromoCountdown />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
        
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-950 mb-4">
              Ready for a <span style={accentStyle}>cleaner home?</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Every space we touch is transformed into something you will be proud to call yours.
            </p>
          </div>

          <div className="mb-10 rounded-2xl bg-slate-50 p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-950"> Results Speak for Themselves</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Tell us what you need cleaned and when you need service. Our team will review your request and follow up with a clear cleaning estimate.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                <a href={`tel:${config.phone}`} className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
                  <Phone className="h-4 w-4" />
                  Call Us Now
                </a>
                <a href="#quote" className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white" style={accentBgStyle}>
                  <Sparkles className="h-4 w-4" />
                  Get Quote
                </a>
                <a href="#callback" className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-100">
                  <CalendarClock className="h-4 w-4" />
                  Request Call Back
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <figure className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
              <video
                className="h-full min-h-[280px] w-full object-cover lg:min-h-[460px]"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/cleaning/video/ourworkpic.jpg"
              >
                <source src="/images/cleaning/video/ouworkvid.mp4" type="video/mp4" />
              </video>
              <figcaption className="px-5 py-4 text-sm font-bold text-slate-800">
                Spotless modern kitchen
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
              <img
                src="/images/cleaning/video/ourworkpic.jpg"
                alt="Fresh clean bathroom"
                className="h-[280px] w-full object-cover lg:h-[460px]"
                loading="lazy"
              />
              <figcaption className="px-5 py-4 text-sm font-bold text-slate-800">
                Fresh clean bathroom
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 max-w-3xl">
            <span className="inline-flex rounded-full px-4 py-1.5 text-sm font-bold" style={accentLightStyle}>Get your cleaning quote</span>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Try our service and you will see the difference: a professional team dedicated to careful work, clear communication, and a spotless result every time.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_420px] gap-10 items-stretch">
          <div>
            <div className="h-full overflow-hidden rounded-2xl border border-white bg-white shadow-xl shadow-slate-200/70">
              <img
                src="/images/cleaning/video/getyour.jpg"
                alt="Professional cleaner preparing a home for service"
                className="h-full min-h-72 w-full object-cover"
              />
            </div>
          </div>

          <div id="quote" className="flex h-full rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/70 border border-slate-100">
            {quoteSubmitted ? (
              <div className="flex h-full w-full flex-col items-center justify-center py-10 text-center">
                <Check className="mx-auto h-10 w-10" style={accentStyle} />
                <h3 className="mt-3 font-display text-xl font-bold">Quote request sent</h3>
                <p className="mt-2 text-sm text-slate-500">We will send your cleaning estimate shortly.</p>
              </div>
            ) : (
              <form
                className="flex h-full w-full flex-col gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setQuoteSubmitted(true);
                }}
              >
                <h3 className="font-display text-2xl font-bold text-slate-950">Cleaning Quote Request</h3>
                <div className="relative">
                  <select required className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#781AAB]">
                    <option value="">Select service</option>
                    {serviceOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required placeholder="Name" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]" />
                  <input required type="tel" placeholder="Phone" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]" />
                </div>
                <input placeholder="Home size or address" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#781AAB]" />
                <label className="flex flex-1 flex-col text-sm font-semibold text-slate-700">
                  Message
                  <textarea placeholder="Tell us what needs cleaning, preferred date, pets, or special instructions" className="mt-2 min-h-32 flex-1 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none focus:border-[#781AAB]" />
                </label>
                <button className="w-full rounded-xl px-4 py-3 font-bold text-white" style={accentBgStyle}>Request Quote</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section id="callback" className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-100 bg-slate-950 p-6 sm:p-8 text-white">
          {callbackSubmitted ? (
            <div className="py-8 text-center">
              <Check className="mx-auto h-10 w-10" style={{ color: config.accentLightHex }} />
              <h2 className="mt-3 font-display text-2xl font-bold">Callback requested</h2>
              <p className="mt-2 text-white/65">We will call you at your selected open time.</p>
            </div>
          ) : (
            <form
              className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-end"
              onSubmit={(event) => {
                event.preventDefault();
                setCallbackSubmitted(true);
              }}
            >
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: config.accentLightHex }}>
                  <Clock className="h-4 w-4" />
                  Open time callback
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold">Request a cleaning callback</h2>
                <p className="mt-2 text-sm text-white/60">Choose the best time for our cleaning team to call you back.</p>
              </div>
              <div className="grid sm:grid-cols-4 gap-3">
                <input required placeholder="Name" className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none" />
                <input required type="tel" placeholder="Phone" className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none" />
                <input required type="time" className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none" />
                <button className="rounded-xl px-4 py-3 text-sm font-bold text-white" style={accentBgStyle}>Request Call</button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: 'We Bring the Supplies',
              text: 'No need to provide cleaning products or equipment. Whether you need a one-time deep clean or recurring service, we bring everything needed to make your home shine.',
              image: 'https://images.pexels.com/photos/5217897/pexels-photo-5217897.jpeg?auto=compress&cs=tinysrgb&w=700',
            },
            {
              icon: Hand,
              title: 'Trusted & Experienced Cleaners',
              text: 'Our professional cleaners are fully trained, background-checked, bonded, and insured, delivering reliable, high-quality service every visit.',
              image: 'https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?auto=compress&cs=tinysrgb&w=700',
            },
            {
              icon: BadgeCheck,
              title: 'Proven & Reliable Service',
              text: 'With over 20 years of experience and thousands of satisfied customers, we are committed to providing consistent, dependable cleaning services tailored to your needs.',
              image: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&cs=tinysrgb&w=700',
            },
          ].map(({ icon: Icon, title, text, image }) => (
            <article key={title} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <div className="relative h-48">
                <img src={image} alt={title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-lg">
                  <Icon className="h-6 w-6" style={accentStyle} />
                </div>
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl font-bold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={accentLightStyle}>
              Client Stories
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-950 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Don't take our word for it. Hear from the people who trust us with their spaces.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {clientStories.map((story) => (
              <article key={story.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-1" style={accentStyle} aria-label="Five star rating">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 leading-7">"{story.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full font-bold" style={accentLightStyle}>
                    {story.name.split(' ').map((part) => part[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-950">{story.name}</p>
                    <p className="text-sm text-slate-500">{story.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={accentLightStyle}>
              Get in Touch
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-950 leading-tight">
              Request a Free <span style={accentStyle}>Callback Today</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Tell us about your space and we will call you back within 2 hours to discuss your needs and provide a free quote.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { title: 'Quick Response', text: 'We call back within 2 hours on business days.' },
                { title: 'Flexible Scheduling', text: 'Choose dates and times that work around your life.' },
                { title: '100% Satisfaction', text: "Not happy? We'll re-clean for free, no questions asked." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={accentLightStyle}>
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-950">{item.title}</h3>
                    <p className="text-sm leading-6 text-slate-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold text-white/60">Prefer to call directly?</p>
              <a href={`tel:${config.phone}`} className="mt-2 inline-flex items-center gap-2 font-display text-2xl font-bold hover:text-[#e6d3f1]">
                <Phone className="h-5 w-5" />
                {config.phone}
              </a>
              <p className="mt-2 text-sm text-white/60">Mon-Sat, 8am - 6pm</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:p-7 shadow-xl shadow-slate-200/60">
            {detailedCallbackSubmitted ? (
              <div className="py-14 text-center">
                <Check className="mx-auto h-12 w-12" style={accentStyle} />
                <h3 className="mt-4 font-display text-2xl font-bold text-slate-950">Callback request sent</h3>
                <p className="mx-auto mt-2 max-w-md text-slate-500">
                  We will call you within 2 business hours to discuss your cleaning needs.
                </p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setDetailedCallbackSubmitted(true);
                }}
              >
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-950">Schedule Your Callback</h3>
                  <p className="mt-1 text-sm text-slate-500">Free quote, no obligation.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm font-semibold text-slate-700">
                    Full Name *
                    <input required placeholder="Jane Smith" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#781AAB]" />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Phone *
                    <input required type="tel" placeholder="+1 (555) 000-0000" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#781AAB]" />
                  </label>
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  Email *
                  <input required type="email" placeholder="jane@example.com" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#781AAB]" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Service Needed
                  <div className="relative mt-2">
                    <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-600 outline-none focus:border-[#781AAB]">
                      <option value="">Select a service...</option>
                      {serviceOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-sm font-semibold text-slate-700">
                    Preferred Date
                    <input type="date" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-600 outline-none focus:border-[#781AAB]" />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Preferred Time
                    <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-600 outline-none focus:border-[#781AAB]">
                      <option>Any time</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                  </label>
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  Additional Notes
                  <textarea rows={4} placeholder="Tell us about your space, any special requirements..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#781AAB]" />
                </label>
                <button className="w-full rounded-xl px-5 py-4 font-bold text-white" style={accentBgStyle}>
                  Request Callback
                </button>
                <p className="text-xs leading-5 text-slate-400">
                  By submitting, you agree to our Privacy Policy. We never spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-14 text-white lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
            <div>
              <div className="flex items-center gap-2 font-display text-2xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={accentBgStyle}>
                  <Sparkles className="h-5 w-5" />
                </span>
                {config.businessName}
              </div>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
                Professional cleaning services that bring peace of mind and a healthier home to thousands of families.
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <a href={`tel:${config.phone}`} className="flex items-center gap-3 hover:text-white">
                  <Phone className="h-4 w-4" style={{ color: config.accentLightHex }} />
                  {config.phone}
                </a>
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 hover:text-white">
                  <Mail className="h-4 w-4" style={{ color: config.accentLightHex }} />
                  {contactEmail}
                </a>
                <p className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" style={{ color: config.accentLightHex }} />
                  {config.address}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="font-bold text-white">{category}</h3>
                  <ul className="mt-4 space-y-3 text-sm text-white/60">
                    {links.map((link) => (
                      <li key={link}>
                        <a href="#" className="hover:text-white">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 {config.businessName}. All rights reserved.</p>
            <p>Made with care for clean spaces</p>
          </div>
        </div>
      </footer>

      {checkoutMode && (
        <CheckoutModal
          config={config}
          checkoutPrice={checkoutMode === 'full' ? templatePrice : reservationPrice}
          promoPrice={templatePrice}
          checkoutMode={checkoutMode}
          onClose={() => setCheckoutMode(null)}
        />
      )}
    </div>
  );
}
