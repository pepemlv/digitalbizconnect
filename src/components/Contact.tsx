import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Calendar, X } from 'lucide-react';
import { saveContactMessage } from '../lib/firebase';

const services = [
  'Website Development',
  'E-Commerce Store',
  'Booking System',
  'Payment Integration',
  'Bookkeeping',
  'Tax Preparation',
  'Customer Support Services',
  'Business Automation',
  'SEO & Google Optimization',
  'Google Ads Management',
  'CRM Setup',
  'AI Chatbot',
];

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '(704) 831-1314' },
  { icon: Mail, label: 'Email', value: 'contact@digitalbizconnect.com' },
  { icon: MapPin, label: 'Location', value: 'Serving businesses nationwide' },
  { icon: Clock, label: 'Website & Dashboard Access', value: 'Ready in less than 48 hours' },
];

const fieldClassName =
  'w-full bg-white border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all';

export default function Contact() {
  const [form, setForm] = useState({
    company: '',
    website: '',
    name: '',
    email: '',
    phone: '',
    services: [] as string[],
    message: '',
    requestType: 'consultation',
  });
  const [demoContext, setDemoContext] = useState<{
    selectedAction?: string;
    demoBusinessName?: string;
    demoIndustry?: string;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleSubmitted, setScheduleSubmitted] = useState(false);
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [schedule, setSchedule] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#contact .animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const storedInquiry = sessionStorage.getItem('demoInquiry');
    if (!storedInquiry) return;

    try {
      const inquiry = JSON.parse(storedInquiry) as {
        action?: string;
        businessName?: string;
        industry?: string;
        message?: string;
      };

      setDemoContext({
        selectedAction: inquiry.action,
        demoBusinessName: inquiry.businessName,
        demoIndustry: inquiry.industry,
      });
      setForm((prev) => ({
        ...prev,
        company: inquiry.businessName || prev.company,
        requestType: inquiry.action === 'pay_receipt' ? 'pay_receipt' : 'more_info',
        services: prev.services.includes('Website Development')
          ? prev.services
          : [...prev.services, 'Website Development'],
        message: inquiry.message || prev.message,
      }));
    } catch {
      sessionStorage.removeItem('demoInquiry');
    }
  }, []);

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      await saveContactMessage({
        ...form,
        source: demoContext ? 'website_demo_cta' : 'contact_form',
        selectedAction: demoContext?.selectedAction,
        demoBusinessName: demoContext?.demoBusinessName,
        demoIndustry: demoContext?.demoIndustry,
      });
      sessionStorage.removeItem('demoInquiry');
      setSubmitting(false);
      setSubmitted(true);
    } catch {
      setSubmitting(false);
      setSubmitError('We could not send your message right now. Please try again in a moment.');
    }
  };

  const handleScheduleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setScheduleSubmitting(true);
    setScheduleError('');

    try {
      await saveContactMessage({
        company: schedule.company,
        website: '',
        name: schedule.name,
        email: schedule.email,
        phone: schedule.phone,
        services: [],
        message: schedule.message,
        requestType: 'schedule_call',
        source: 'schedule_call_form',
        preferredDate: schedule.preferredDate,
        preferredTime: schedule.preferredTime,
      });
      setScheduleSubmitted(true);
    } catch {
      setScheduleError('We could not schedule your call right now. Please try again in a moment.');
    } finally {
      setScheduleSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-[#041F19] relative overflow-hidden">
      <div className="container-max relative z-10">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="inline-block text-sm font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/25 rounded-full px-4 py-1.5 mb-4">
            Get Started
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Ready to Try It Free for 30 Days?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Need more information? Feel free to contact us. Get your professional website and access to your
            business dashboard in less than 48 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 animate-on-scroll">
            <h3 className="font-display font-bold text-xl text-white mb-6">Contact Us</h3>
            <div className="space-y-4 mb-8">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/6 border border-white/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/45 mb-0.5">{label}</p>
                    <p className="text-sm text-white font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Prefer to Schedule Directly?</h4>
              <button type="button" onClick={() => { setShowScheduleForm(true); setScheduleSubmitted(false); }}
                className="w-full flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl p-3.5 hover:bg-white/7 transition-colors cursor-pointer group text-left">
                <Calendar className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
                <div>
                  <p className="text-sm text-white font-medium">Schedule a Call</p>
                  <p className="text-xs text-white/45">Choose a preferred date and time</p>
                </div>
              </button>
            </div>

            {showScheduleForm && (
              <div className="mt-4 bg-[#052E24] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h4 className="font-semibold text-white">Schedule a Call</h4>
                  <button type="button" onClick={() => setShowScheduleForm(false)} className="text-white/45 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {scheduleSubmitted ? (
                  <div className="py-4 text-center">
                    <CheckCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">Your call request was submitted.</p>
                    <p className="text-xs text-white/55 mt-1">We will contact you to confirm the appointment.</p>
                  </div>
                ) : (
                  <form onSubmit={handleScheduleSubmit} className="space-y-3">
                    <input value={schedule.name} onChange={(event) => setSchedule((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Your name" required className={fieldClassName} />
                    <input value={schedule.company} onChange={(event) => setSchedule((prev) => ({ ...prev, company: event.target.value }))}
                      placeholder="Company name" className={fieldClassName} />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input type="email" value={schedule.email} onChange={(event) => setSchedule((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="Email" required className={fieldClassName} />
                      <input type="tel" value={schedule.phone} onChange={(event) => setSchedule((prev) => ({ ...prev, phone: event.target.value }))}
                        placeholder="Phone" required className={fieldClassName} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input type="date" value={schedule.preferredDate} onChange={(event) => setSchedule((prev) => ({ ...prev, preferredDate: event.target.value }))}
                        required className={fieldClassName} />
                      <input type="time" value={schedule.preferredTime} onChange={(event) => setSchedule((prev) => ({ ...prev, preferredTime: event.target.value }))}
                        required className={fieldClassName} />
                    </div>
                    <textarea value={schedule.message} onChange={(event) => setSchedule((prev) => ({ ...prev, message: event.target.value }))}
                      rows={2} placeholder="What would you like to discuss?" className={`${fieldClassName} resize-none`} />
                    {scheduleError && <p className="text-xs text-red-300">{scheduleError}</p>}
                    <button type="submit" disabled={scheduleSubmitting}
                      className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white rounded-lg py-3 text-sm font-semibold">
                      {scheduleSubmitting ? 'Submitting...' : 'Request Call'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 animate-on-scroll">
            {submitted ? (
              <div className="bg-white/4 border border-white/8 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-16 h-16 bg-orange-500/15 border border-orange-500/20 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">Message Sent!</h3>
                <p className="text-white/65 mb-7 max-w-sm">
                  We'll review your information and follow up with the next steps for your website and
                  business dashboard.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/4 border border-white/8 rounded-2xl p-6 lg:p-8 space-y-5">
                {/* Request type */}
                <div>
                  <label className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-2 block">
                    I want to...
                  </label>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {[
                      { val: 'quote', label: 'Get a Quote' },
                      { val: 'pay_receipt', label: 'Pay $500 Get My Website Now' },
                      { val: 'more_info', label: 'More Info' },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, requestType: val }))}
                        className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          form.requestType === val
                            ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                            : 'bg-white/6 text-white/70 hover:bg-white/10 border border-white/8'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-1.5 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="John Smith"
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-1.5 block">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                      placeholder="Your Business Name"
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-1.5 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="john@company.com"
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-1.5 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="(704) 831-1314"
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-1.5 block">
                    Current Website
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://yourwebsite.com (leave blank if none)"
                    className={fieldClassName}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-2 block">
                    Services Needed
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((svc) => (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => toggleService(svc)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                          form.services.includes(svc)
                            ? 'bg-orange-600 text-white'
                            : 'bg-white/6 text-white/55 hover:bg-white/12 hover:text-white border border-white/8'
                        }`}
                      >
                        {svc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/55 uppercase tracking-wider mb-1.5 block">
                    Tell Us About Your Goals
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="What are your biggest challenges? What results are you hoping for?"
                    className={`${fieldClassName} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 hover:shadow-xl"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send My Request <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                {submitError && (
                  <p className="text-sm text-center text-red-300">
                    {submitError}
                  </p>
                )}

                <p className="text-xs text-center text-white/45">
                  Free consultation, no credit card or commitment required
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
