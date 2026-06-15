import { useState } from 'react';
import { Calendar, Clock, Users, ChevronDown, Check, Home, Bed, Bath, Maximize, TrendingUp, Star, Phone, Search } from 'lucide-react';
import type { IndustryConfig } from '../industryConfigs';

// ─── Booking Widget ───────────────────────────────────────────────────────────
function BookingWidget({ config }: { config: IndustryConfig }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [guests, setGuests] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  });

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-10 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: config.accentLightHex }}
        >
          <Check className="w-8 h-8" style={{ color: config.accentHex }} />
        </div>
        <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Booking Confirmed!</h3>
        <p className="text-slate-500 text-sm">
          {selectedDate && selectedTime
            ? `Your appointment is confirmed for ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${selectedTime}.`
            : 'Your appointment has been confirmed. You\'ll receive a confirmation shortly.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-slate-100" style={{ backgroundColor: config.accentLightHex }}>
        <h3 className="font-display font-bold text-lg" style={{ color: config.accentTextHex }}>
          {config.industry === 'Event Rentals' ? 'Check Availability & Book' : 'Book an Appointment'}
        </h3>
        <p className="text-sm mt-0.5" style={{ color: config.accentTextHex, opacity: 0.7 }}>{config.ctaSubtext}</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Service selection */}
        {config.services && (
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
              {config.industry === 'Event Rentals' ? 'Package' : 'Service Type'}
            </label>
            <div className="grid gap-2">
              {config.services.map((svc) => (
                <button
                  key={svc.name}
                  onClick={() => setSelectedService(svc.name)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    selectedService === svc.name
                      ? 'border-2'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={selectedService === svc.name ? { borderColor: config.accentHex, backgroundColor: config.accentLightHex } : {}}
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{svc.name}</p>
                    <p className="text-xs text-slate-400">{svc.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: selectedService === svc.name ? config.accentHex : '#334155' }}>{svc.price}</p>
                    {selectedService === svc.name && (
                      <Check className="w-4 h-4 ml-auto mt-0.5" style={{ color: config.accentHex }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date selection */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Select Date
          </label>
          <div className="grid grid-cols-7 gap-1">
            {dates.map((d) => {
              const dateStr = d.toISOString().split('T')[0];
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all ${
                    isSelected ? 'text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 border border-slate-100'
                  }`}
                  style={isSelected ? { backgroundColor: config.accentHex } : {}}
                >
                  <span className="font-medium">{d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}</span>
                  <span className="font-bold text-sm">{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time selection */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Select Time
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedTime === t ? 'text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
                style={selectedTime === t ? { backgroundColor: config.accentHex } : {}}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Party size (restaurants / events) */}
        {(config.industry === 'Restaurants' || config.industry === 'Event Rentals') && (
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {config.industry === 'Event Rentals' ? 'Expected Guests' : 'Party Size'}
            </label>
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-lg leading-none">−</button>
              <span className="w-8 text-center font-bold text-slate-900">{guests}</span>
              <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-lg leading-none">+</button>
              <span className="text-sm text-slate-400">{config.industry === 'Event Rentals' ? 'guests' : 'people'}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-3.5 text-white font-semibold rounded-xl transition-all hover:opacity-90 shadow-md hover:shadow-lg mt-2"
          style={{ backgroundColor: config.accentHex }}
        >
          {config.ctaText}
        </button>
      </div>
    </div>
  );
}

// ─── Quote Widget ─────────────────────────────────────────────────────────────
function QuoteWidget({ config }: { config: IndustryConfig }) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const allSelected = config.quoteOptions?.every(o => selections[o.label]) && name && email;

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-10 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: config.accentLightHex }}>
          <Check className="w-8 h-8" style={{ color: config.accentHex }} />
        </div>
        <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Quote Request Received!</h3>
        <p className="text-slate-500 text-sm">We'll review your project details and send a custom estimate to {email} within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-slate-100" style={{ backgroundColor: config.accentLightHex }}>
        <h3 className="font-display font-bold text-lg" style={{ color: config.accentTextHex }}>Get Your Free Quote</h3>
        <p className="text-sm mt-0.5" style={{ color: config.accentTextHex, opacity: 0.7 }}>{config.ctaSubtext}</p>
      </div>

      <div className="p-5 space-y-4">
        {config.quoteOptions?.map((opt) => (
          <div key={opt.label}>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">{opt.label}</label>
            <div className="relative">
              <select
                value={selections[opt.label] || ''}
                onChange={(e) => setSelections(p => ({ ...p, [opt.label]: e.target.value }))}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-slate-400 pr-10"
              >
                <option value="">Select {opt.label}</option>
                {opt.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@email.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <button
          onClick={() => allSelected && setSubmitted(true)}
          className={`w-full py-3.5 text-white font-semibold rounded-xl transition-all shadow-md ${allSelected ? 'hover:opacity-90 hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}`}
          style={{ backgroundColor: config.accentHex }}
        >
          Request Free Estimate
        </button>
        <p className="text-xs text-center text-slate-400">No obligation · Response within 24 hours</p>
      </div>
    </div>
  );
}

// ─── Menu Widget ──────────────────────────────────────────────────────────────
function MenuWidget({ config }: { config: IndustryConfig }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!config.menuItems) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-slate-100" style={{ backgroundColor: config.accentLightHex }}>
        <h3 className="font-display font-bold text-lg" style={{ color: config.accentTextHex }}>Our Menu</h3>
        <p className="text-sm mt-0.5" style={{ color: config.accentTextHex, opacity: 0.7 }}>Fresh ingredients, seasonal specials</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {config.menuItems.map((cat, i) => (
          <button
            key={cat.category}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              activeTab === i ? 'text-white' : 'text-slate-500 hover:text-slate-700'
            }`}
            style={activeTab === i ? { backgroundColor: config.accentHex } : {}}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="p-5 space-y-3">
        {config.menuItems[activeTab].items.map((item) => (
          <div key={item.name} className="flex items-start justify-between gap-4 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
            <span className="font-bold text-sm flex-shrink-0" style={{ color: config.accentHex }}>{item.price}</span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <button
          className="w-full py-3 text-white font-semibold rounded-xl transition-all hover:opacity-90 text-sm"
          style={{ backgroundColor: config.accentHex }}
        >
          Reserve a Table
        </button>
      </div>
    </div>
  );
}

// ─── Property Widget ──────────────────────────────────────────────────────────
function PropertyWidget({ config }: { config: IndustryConfig }) {
  if (!config.properties) return null;

  return (
    <div>
      {/* Search bar */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-3 mb-5 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city, neighborhood, or ZIP..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-100 focus:outline-none text-slate-700"
          />
        </div>
        <button
          className="px-5 py-2.5 text-white font-semibold rounded-xl text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: config.accentHex }}
        >
          Search
        </button>
      </div>

      <div className="grid gap-4">
        {config.properties.map((prop) => (
          <div key={prop.address} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-44">
              <img src={prop.img} alt={prop.address} className="w-full h-full object-cover" />
              <span
                className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: config.accentHex, color: 'white' }}
              >
                {prop.tag}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-display font-bold text-xl" style={{ color: config.accentHex }}>{prop.price}</p>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-slate-700 mb-3">
                <Home className="w-3.5 h-3.5 text-slate-400" />
                {prop.address}
              </p>
              <div className="flex gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{prop.beds} beds</span>
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{prop.baths} baths</span>
                <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{prop.sqft}</span>
              </div>
              <button
                className="w-full py-2.5 text-white font-semibold rounded-xl text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: config.accentHex }}
              >
                Schedule a Tour
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Policy Widget ────────────────────────────────────────────────────────────
function PolicyWidget({ config }: { config: IndustryConfig }) {
  const [selected, setSelected] = useState('Business Owners');

  const plans = [
    {
      name: 'Individuals',
      price: 'Review',
      highlight: false,
      features: ['Auto Coverage', 'Home Coverage', 'Life Options', 'Rate Review', 'Claims Guidance'],
    },
    {
      name: 'Business Owners',
      price: 'Tailored',
      highlight: true,
      features: ['Property & Casualty', 'Commercial Auto', 'Workers Comp', 'Coverage Comparison', 'Renewal Support', 'Dedicated Follow-Up'],
    },
    {
      name: 'Multi-State',
      price: 'Custom',
      highlight: false,
      features: ['All Business Owner features', 'Multi-State Compliance', 'Umbrella Options', 'Custom Limits', 'Renewal Strategy', 'Account Retention'],
    },
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">Let Me Help You Compare Coverage</h3>
        <p className="text-slate-500 text-sm">For individuals, families, and business owners who want protection that makes sense.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div
            key={plan.name}
            onClick={() => setSelected(plan.name)}
            className={`rounded-2xl p-5 cursor-pointer transition-all border-2 ${
              plan.name === selected
                ? 'shadow-xl scale-[1.02]'
                : 'border-slate-100 bg-white hover:shadow-md'
            }`}
            style={plan.name === selected ? { borderColor: config.accentHex, backgroundColor: config.accentLightHex } : {}}
          >
            {plan.highlight && plan.name === selected && (
              <span
                className="inline-block text-xs font-bold px-2.5 py-1 rounded-full text-white mb-3"
                style={{ backgroundColor: config.accentHex }}
              >
                Best Value
              </span>
            )}
            <h4 className="font-display font-bold text-lg text-slate-900 mb-1">{plan.name}</h4>
            <p className="font-bold text-2xl mb-4" style={{ color: config.accentHex }}>{plan.price}</p>
            <ul className="space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: config.accentHex }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="w-full mt-5 py-2.5 text-white font-semibold rounded-xl text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: config.accentHex }}
            >
              Get {plan.name} Quote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Results Widget ───────────────────────────────────────────────────────────
function ResultsWidget({ config }: { config: IndustryConfig }) {
  const metrics = [
    { label: 'Google Ranking', before: '#47', after: '#2', icon: TrendingUp, improvement: '+45 positions' },
    { label: 'Monthly Calls', before: '12', after: '67', icon: Phone, improvement: '+458%' },
    { label: 'Google Reviews', before: '8', after: '143', icon: Star, improvement: '+1,688%' },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">Real Client Results</h3>
        <p className="text-slate-500 text-sm">Average results for local service businesses in 90 days.</p>
      </div>
      <div className="grid gap-4">
        {metrics.map(({ label, before, after, icon: Icon, improvement }) => (
          <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: config.accentLightHex }}>
                  <Icon className="w-4 h-4" style={{ color: config.accentHex }} />
                </div>
                <span className="font-semibold text-slate-800">{label}</span>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: config.accentLightHex, color: config.accentTextHex }}
              >
                {improvement}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Before</p>
                <p className="font-display font-bold text-xl text-slate-400">{before}</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ backgroundColor: config.accentLightHex }}>
                <p className="text-xs mb-1" style={{ color: config.accentTextHex, opacity: 0.7 }}>After 90 days</p>
                <p className="font-display font-bold text-xl" style={{ color: config.accentHex }}>{after}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function DemoWidget({ config }: { config: IndustryConfig }) {
  return (
    <section className={`py-20 px-6 lg:px-8 ${config.widgetType === 'property' ? 'bg-white' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: context text */}
          <div>
            <span
              className="inline-block text-sm font-semibold rounded-full px-4 py-1.5 mb-4"
              style={{ backgroundColor: config.accentLightHex, color: config.accentTextHex }}
            >
              {config.widgetType === 'booking' ? 'Online Booking' :
               config.widgetType === 'quote' ? 'Instant Quote System' :
               config.widgetType === 'menu' ? 'Digital Menu' :
               config.widgetType === 'property' ? 'Property Listings' :
               config.widgetType === 'policy' ? 'Policy Comparison' :
               'Live Results Dashboard'}
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 mb-4">
              {config.widgetType === 'booking' ? 'Customers Book 24/7 Without Calling' :
               config.widgetType === 'quote' ? 'Instant Quotes That Convert Browsers to Buyers' :
               config.widgetType === 'menu' ? 'Your Menu, Always Up to Date' :
               config.widgetType === 'property' ? 'Every Listing at Your Buyers\' Fingertips' :
               config.widgetType === 'policy' ? 'I Make Coverage Easier to Understand' :
               'See the Numbers That Matter Most'}
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              {config.widgetType === 'booking'
                ? `Stop losing customers to voicemail. Our booking system lets ${config.industry.toLowerCase()} customers schedule appointments any time of day — fully integrated with your calendar and sending automatic confirmations.`
                : config.widgetType === 'quote'
                ? `Visitors become leads when they can get an instant estimate. Our quote system collects project details and routes every submission to your inbox in real-time — ready to close.`
                : config.widgetType === 'menu'
                ? `Update your menu in seconds from any device. Add daily specials, mark items as sold out, and let customers order online or pre-order before they arrive.`
                : config.widgetType === 'property'
                ? `Every listing page captures buyer interest. Integrated search, virtual tours, and one-click showing requests — all driving leads directly to your agents.`
                : config.widgetType === 'policy'
                ? `I help individuals and business owners compare options, understand what affects their rates, and choose coverage with confidence. It is not only about price, but I am always looking for smart ways to help you save.`
                : `Track the metrics that prove your digital investment is working. Real-time dashboards showing rankings, calls, and reviews — updated daily.`}
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: config.widgetType === 'booking' ? '24/7' : config.widgetType === 'results' ? '+458%' : '< 30s', label: config.widgetType === 'booking' ? 'Available' : config.widgetType === 'results' ? 'More Calls' : 'Response Time' },
                { val: config.widgetType === 'booking' ? '-70%' : config.widgetType === 'results' ? '90 days' : '+340%', label: config.widgetType === 'booking' ? 'No-Shows' : config.widgetType === 'results' ? 'To Results' : 'More Leads' },
                { val: config.widgetType === 'booking' ? '+310%' : config.widgetType === 'results' ? '#1–3' : '98%', label: config.widgetType === 'booking' ? 'More Bookings' : config.widgetType === 'results' ? 'Google Rank' : 'Satisfaction' },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 text-center border"
                  style={{ backgroundColor: config.accentLightHex, borderColor: `${config.accentHex}30` }}
                >
                  <p className="font-display font-bold text-xl" style={{ color: config.accentHex }}>{val}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: widget */}
          <div>
            {config.widgetType === 'booking' && <BookingWidget config={config} />}
            {config.widgetType === 'quote' && <QuoteWidget config={config} />}
            {config.widgetType === 'menu' && <MenuWidget config={config} />}
            {config.widgetType === 'property' && <PropertyWidget config={config} />}
            {config.widgetType === 'policy' && <PolicyWidget config={config} />}
            {config.widgetType === 'results' && <ResultsWidget config={config} />}
          </div>
        </div>
      </div>
    </section>
  );
}
