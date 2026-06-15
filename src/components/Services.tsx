import { useEffect } from 'react';
import {
  Globe, ShoppingCart, Calendar, Smartphone,
  CreditCard, FileText, RefreshCw, MessageSquare,
  Phone, Clock, Bot, Mail, BarChart2, Megaphone, Search, Share2
} from 'lucide-react';

const serviceGroups = [
  {
    category: 'Website Development',
    color: 'bg-primary-600',
    borderColor: 'border-primary-100',
    bgLight: 'bg-primary-50/50',
    iconColor: 'text-primary-600',
    badgeColor: 'bg-primary-100 text-primary-700',
    description: 'Beautiful, fast, mobile-friendly websites that turn visitors into paying customers.',
    items: [
      { icon: Globe, title: 'Business Websites', desc: 'Professional sites that build trust and drive conversions.' },
      { icon: ShoppingCart, title: 'E-Commerce Stores', desc: 'Full online stores with product management and checkout.' },
      { icon: Calendar, title: 'Booking Systems', desc: 'Let customers book appointments 24/7 automatically.' },
      { icon: Smartphone, title: 'Mobile-First Design', desc: 'Pixel-perfect on every device — phone, tablet, desktop.' },
    ],
  },
  {
    category: 'Payment Integration',
    color: 'bg-cyan-600',
    borderColor: 'border-cyan-100',
    bgLight: 'bg-cyan-50/50',
    iconColor: 'text-cyan-600',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    description: 'Accept payments, send invoices, and manage subscriptions seamlessly.',
    items: [
      { icon: CreditCard, title: 'Online Payments', desc: 'Stripe & PayPal integration for instant transactions.' },
      { icon: FileText, title: 'Invoice Systems', desc: 'Automated invoicing that saves hours each week.' },
      { icon: RefreshCw, title: 'Subscription Billing', desc: 'Recurring revenue made easy for any business model.' },
      { icon: ShoppingCart, title: 'Checkout Optimization', desc: 'Reduce cart abandonment with streamlined flows.' },
    ],
  },
  {
    category: 'Customer Support Services',
    color: 'bg-[#0F172A]',
    borderColor: 'border-slate-200',
    bgLight: 'bg-slate-50',
    iconColor: 'text-slate-700',
    badgeColor: 'bg-slate-100 text-slate-700',
    description: 'We become your digital front desk — handling every customer interaction professionally.',
    items: [
      { icon: MessageSquare, title: 'Live Chat Support', desc: 'Real-time conversations that convert leads instantly.' },
      { icon: Phone, title: 'Phone Answering', desc: 'Professional agents answer calls in your business name.' },
      { icon: Clock, title: 'Appointment Scheduling', desc: 'Never miss a booking with fully managed scheduling.' },
      { icon: Mail, title: 'Email Management', desc: 'Fast, professional replies to every customer inquiry.' },
    ],
  },
  {
    category: 'Business Automation',
    color: 'bg-primary-700',
    borderColor: 'border-primary-100',
    bgLight: 'bg-primary-50/30',
    iconColor: 'text-primary-700',
    badgeColor: 'bg-primary-100 text-primary-700',
    description: 'Let technology handle the repetitive work so you can focus on growth.',
    items: [
      { icon: Bot, title: 'AI Chatbot Integration', desc: 'Answer FAQs and qualify leads automatically 24/7.' },
      { icon: BarChart2, title: 'CRM Setup', desc: 'Organize leads and customers in one central hub.' },
      { icon: RefreshCw, title: 'Automated Email/SMS', desc: 'Follow-up sequences that nurture leads on autopilot.' },
      { icon: MessageSquare, title: 'Lead Management', desc: 'Track every prospect from first touch to closed deal.' },
    ],
  },
  {
    category: 'Google & Marketing Setup',
    color: 'bg-cyan-700',
    borderColor: 'border-cyan-100',
    bgLight: 'bg-cyan-50/40',
    iconColor: 'text-cyan-700',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    description: 'Get found online and outrank your competitors with proven digital marketing strategies.',
    items: [
      { icon: Search, title: 'SEO Optimization', desc: 'Rank higher on Google for your local business keywords.' },
      { icon: Globe, title: 'Google Business Profile', desc: 'Optimized profile that drives calls and visits.' },
      { icon: Megaphone, title: 'Google Ads', desc: 'Targeted campaigns that bring qualified customers.' },
      { icon: Share2, title: 'Social Media Integration', desc: 'Consistent presence across all platforms.' },
    ],
  },
];

export default function Services() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#services .animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="section-padding bg-slate-50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-4">
            What We Offer
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-slate-900 mb-4">
            Everything Your Business Needs{' '}
            <span className="text-gradient">to Thrive Online</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From your first website to full business automation — we handle it all under one roof.
          </p>
        </div>

        {/* Service Groups */}
        <div className="space-y-6">
          {serviceGroups.map((group, gi) => (
            <div
              key={group.category}
              className={`animate-on-scroll rounded-2xl border ${group.borderColor} ${group.bgLight} p-7 lg:p-8`}
              style={{ transitionDelay: `${gi * 0.08}s` }}
            >
              {/* Group header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${group.color} shadow-md flex-shrink-0`}>
                  {(() => { const Icon = group.items[0].icon; return <Icon className="w-5 h-5 text-white" />; })()}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="font-display font-bold text-xl text-slate-900">{group.category}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${group.badgeColor}`}>
                      {group.items.length} services
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{group.description}</p>
                </div>
              </div>

              {/* Items grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {group.items.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Icon className={`w-5 h-5 ${group.iconColor} mb-3`} />
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
