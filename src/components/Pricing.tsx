import { useEffect } from 'react';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

const plans = [
  {
    name: 'Business',
    tagline: 'Grow faster with automation',
    price: 1800,
    highlight: false,
    features: [
      'Everything in Starter',
      'Booking & appointment system',
      'Online payment integration',
      'Bookkeeping support included',
      'Tax preparation support included',
      'Google Ads setup & management',
      'Customer support integration',
      'Up to 10 pages',
      'CRM setup',
      'Monthly performance reports',
      'Priority support',
    ],
    cta: 'Grow My Business',
  },
  {
    name: 'Starter',
    tagline: 'Launch your online presence',
    price: 500,
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Professional business website',
      'Mobile-responsive design',
      'Contact & lead capture forms',
      'Free access to client dashboard',
      'Free bookkeeping dashboard tools',
      'Basic SEO setup',
      'Google Business Profile setup',
      '3 pages included',
      'SSL certificate',
      '1 month free support',
    ],
    cta: 'Most Popular Choice',
  },
  {
    name: 'Premium Growth',
    tagline: 'Full automation & management',
    price: 3500,
    highlight: false,
    features: [
      'Everything in Business',
      'Full business automation',
      'Premium bookkeeping support',
      'Premium tax preparation support',
      'AI chatbot integration',
      'Live customer support team',
      'Email & SMS marketing',
      'Lead tracking dashboard',
      'Unlimited pages',
      'Review management system',
      'Social media integration',
      'Dedicated account manager',
    ],
    cta: 'Scale My Business',
  },
];

export default function Pricing() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#pricing .animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="section-padding bg-[#052E24]">
      <div className="container-max">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="inline-block text-sm font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/25 rounded-full px-4 py-1.5 mb-4">
            Pricing
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Transparent Pricing, <span className="text-orange-400">Real ROI</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            One-time setup pricing with business tools, records, and support built in.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start mb-12">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`animate-on-scroll relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                plan.highlight
                  ? 'bg-[#041F19] border border-orange-500/45 shadow-2xl shadow-black/35 ring-2 ring-orange-500 ring-offset-2 ring-offset-[#052E24] scale-[1.02]'
                  : 'bg-white/7 border border-white/10 shadow-lg shadow-black/10 hover:bg-white/10 hover:-translate-y-0.5'
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {'badge' in plan && plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-orange-600/30">
                    <Star className="w-3 h-3 fill-white" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.highlight ? 'text-orange-400' : 'text-orange-300'}`}>
                  {plan.name}
                </p>
                <h3 className="font-display font-bold text-xl text-white">
                  {plan.tagline}
                </h3>
              </div>

              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-4xl text-white">
                    ${plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-white/45">one time</span>
                </div>
                <p className="text-sm mt-1 text-white/60">No ongoing monthly website fee</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-orange-400' : 'text-green-400'}`} />
                    <span className="text-sm text-white/75">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => scrollTo('#contact')}
                className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30'
                    : 'bg-white/10 hover:bg-white/15 border border-white/15 text-white shadow-sm hover:shadow-md'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

   

        <div className="mt-7 text-center animate-on-scroll">
          <p className="text-sm text-white/60">
            All plans include a <span className="font-semibold text-white">30-day satisfaction guarantee</span>.
           
          </p>
        </div>
      </div>
    </section>
  );
}
