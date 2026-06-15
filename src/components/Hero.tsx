import { useEffect } from 'react';
import { ArrowRight, Play, CheckCircle, BadgeCheck, BookOpenCheck, Search } from 'lucide-react';

const stats = [
  { icon: BadgeCheck, value: 'Certified', label: 'QuickBooks ProAdvisor' },
  { icon: BookOpenCheck, value: 'Monthly', label: 'Bookkeeping Support' },
  { icon: Search, value: 'SEO', label: 'Google Visibility Setup' },
];

const floatingCards = [
  {
    title: 'Order Received',
    subtitle: 'Online payment recorded',
    bg: 'bg-orange-600',
    shadow: 'shadow-orange-600/30',
    position: '-top-3 left-2 sm:-top-[18px] sm:-left-[22px]',
  },
  {
    title: 'Tax Ready',
    subtitle: 'Books are organized',
    bg: 'bg-green-700',
    shadow: 'shadow-green-700/30',
    position: 'top-[42%] -right-1 sm:top-[45%] sm:-right-[22px]',
  },
  {
    title: 'Customer Visited',
    subtitle: 'New website activity',
    bg: 'bg-[#052E24] border border-white/10',
    shadow: 'shadow-green-950/30',
    position: '-bottom-3 left-5 sm:-bottom-[18px] sm:left-6',
  },
];

export default function Hero() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#hero .animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-bg grid-pattern relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#041F19]/45 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 sm:pt-28 pb-20">
        <div className="grid min-[900px]:grid-cols-2 gap-8 sm:gap-12 min-[900px]:gap-16 lg:gap-20 items-center">
          <div className="order-2 min-[900px]:order-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-7">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm text-white/75 font-medium">Business Websites • Google Visibility • Tax • Bookkeeping Support</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.4rem] text-white leading-[1.08] mb-6 tracking-tight drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)]">
              Focus on Running Your Business.{' '}
              <span className="text-orange-400">We'll Handle the Rest.</span>
            </h1>

            <p className="text-[1.1rem] text-white leading-relaxed mb-6 max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              We help small businesses establish a strong online presence, maintain 
              organized bookkeeping, accept payments online, and prepare for tax season 
              with confidence.
              <br />
              <span className="inline-block mt-2 font-semibold text-orange-300">
                $500 one-time payment includes full support.
              </span>
            </p>
            <div className="flex flex-wrap gap-2 mb-7">
              {[
                'Business Websites',
                  'Google Visibility',
                'Bookkeeping',
                'Online Payment Solutions',
                'Tax Preparation',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-full bg-[#041F19]/88 border border-white/20 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => scrollTo('#pricing')}
                className="group flex items-center justify-center gap-2 px-7 py-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-500/35 hover:shadow-xl transition-all duration-300"
              >
                View All Packages
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="group flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/16 backdrop-blur-sm border border-white/15 text-white font-semibold rounded-xl transition-all duration-300"
              >
                <Play className="w-4 h-4 text-green-400" />
                Book a Free Consultation
              </button>
            </div>

         
          </div>

          <div className="relative order-1 min-[900px]:order-2 max-w-xl w-full mx-auto min-[900px]:mx-0">
            <div className="bg-[#052E24]/88 backdrop-blur-xl border border-white/12 rounded-2xl p-3 sm:p-5 lg:p-6 shadow-2xl">
              <div className="flex items-center gap-1.5 mb-2 sm:gap-2 sm:mb-5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400/70" />
                <span className="ml-1 sm:ml-2 text-[0.65rem] sm:text-xs text-white/45 font-medium">Business Activity</span>
                <div className="ml-auto flex items-center gap-1 sm:gap-1.5 bg-green-500/15 border border-green-500/20 rounded-full px-2 sm:px-2.5 py-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[0.65rem] sm:text-xs text-green-400 font-medium">Live</span>
                </div>
              </div>

              <div className="mb-2 sm:mb-5">
                <div className="flex items-end gap-1 h-[9vh] min-h-12 max-h-16 sm:gap-1.5 sm:h-20 sm:max-h-none min-[900px]:h-24">
                  {[35, 55, 42, 70, 58, 85, 68, 92, 74, 88, 100, 82].map((h, i) => (
                    <div
                      key={i}
                      className={`hero-chart-bar flex-1 rounded-t-sm transition-opacity hover:opacity-100 ${
                        i === 10
                          ? 'bg-orange-500 opacity-100'
                          : i === 5
                            ? 'bg-yellow-400 opacity-85'
                            : 'bg-green-700 opacity-70'
                      }`}
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.18}s`,
                        animationDuration: `${9 + (i % 4) * 0.35}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[0.6rem] sm:text-xs text-white/35 mt-1 px-0.5">
                  <span>Jan</span><span>Apr</span><span>Jul</span><span>Dec</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                {[
                  { label: 'Online Orders', value: 'Received', delta: 'Payments tracked', color: 'text-orange-500' },
                  { label: 'Website Traffic', value: 'Customers', delta: 'Visited today', color: 'text-green-400' },
                  { label: 'Tax Records', value: 'Ready', delta: 'Books organized', color: 'text-green-400' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/8 rounded-lg sm:rounded-xl p-1.5 sm:p-3">
                    <p className="text-[0.56rem] sm:text-xs text-white/45 mb-0.5 sm:mb-1 leading-tight">{s.label}</p>
                    <p className="text-xs sm:text-sm font-bold text-white">{s.value}</p>
                    <p className={`text-[0.6rem] sm:text-xs font-medium mt-0.5 ${s.color}`}>{s.delta}</p>
                  </div>
                ))}
              </div>
            </div>

            {floatingCards.map((card, i) => (
              <div
                key={card.title}
                className={`absolute ${card.position} ${card.bg} ${card.shadow} z-10 animate-float rounded-md sm:rounded-xl px-1.5 py-1 text-white shadow-xl sm:px-4 sm:py-3`}
                style={{ animationDelay: `${i * 2}s` }}
              >
                <p className="text-[0.56rem] leading-tight font-bold sm:text-xs">{card.title}</p>
                <p className="mt-0.5 hidden text-xs opacity-70 sm:block">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto lg:mx-0 lg:max-w-md border-t border-white/8 pt-10">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-white/8 rounded-xl mb-2 lg:mb-0 lg:mr-3 lg:inline-flex">
                <Icon className="w-4.5 h-4.5 text-green-400" />
              </div>
              <div className="lg:inline-block lg:align-middle">
                <p className="text-xl font-display font-bold text-white">{value}</p>
                <p className="text-xs text-white/45">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full fill-slate-50" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
