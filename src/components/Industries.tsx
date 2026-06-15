import { useEffect, useState } from 'react';
import { HardHat, ShieldCheck, Utensils, CalendarDays, Sparkles, Home, Heart, Wrench, MapPin, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const industries = [
  {
    id: 'construction',
    icon: HardHat,
    name: 'Construction',
    desc: 'Project portfolios, quote systems, and lead generation that keeps your crew booked solid.',
    keywords: ['Project Gallery', 'Quote System', 'Local SEO', 'Lead Forms'],
    img: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'insurance',
    icon: ShieldCheck,
    name: 'Insurance',
    desc: 'Lead capture, policy comparison tools, CRM integration, and trust-building branding.',
    keywords: ['Quote Forms', 'CRM Integration', 'Trust Signals', 'Policy Pages'],
    img: 'https://images.pexels.com/photos/7821686/pexels-photo-7821686.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'restaurants',
    icon: Utensils,
    name: 'Restaurants',
    desc: 'Online ordering, table reservations, menu management, and review generation.',
    keywords: ['Online Ordering', 'Reservations', 'Menu CMS', 'Google Reviews'],
    img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'event-rentals',
    icon: CalendarDays,
    name: 'Event Rentals',
    desc: 'Equipment catalogs, availability calendars, online deposits, and automated contracts.',
    keywords: ['Booking Calendar', 'Online Deposits', 'Equipment Catalog', 'Contracts'],
    img: 'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'cleaning',
    icon: Sparkles,
    name: 'Cleaning Companies',
    desc: 'Instant quote calculators, recurring booking, background check showcase, local SEO.',
    keywords: ['Quote Calculator', 'Recurring Booking', 'Reviews', 'Local SEO'],
    img: 'https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'real-estate',
    icon: Home,
    name: 'Real Estate',
    desc: 'Property listings, mortgage calculators, lead capture, and CRM for every buyer and seller.',
    keywords: ['Listings', 'Mortgage Calc', 'Lead Capture', 'Virtual Tours'],
    img: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'medical',
    icon: Heart,
    name: 'Medical Offices',
    desc: 'HIPAA-aware booking systems, patient portals, insurance collection, no-show reduction.',
    keywords: ['Patient Booking', 'Insurance Forms', 'Reminders', 'Portal'],
    img: 'https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'contractors',
    icon: Wrench,
    name: 'Contractors',
    desc: 'Service area pages, licensing display, before/after galleries, 5-star review programs.',
    keywords: ['Service Areas', 'Photo Galleries', 'Reviews', 'Estimates'],
    img: 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'local-services',
    icon: MapPin,
    name: 'Local Services',
    desc: 'Any local business that needs more customers — we build the digital presence that drives calls.',
    keywords: ['Local SEO', 'Google Profile', 'Review Gen', 'Ads'],
    img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'maid-service',
    icon: Sparkles,
    name: 'Sanchez Cleaning Services',
    desc: 'Charlotte cleaning website template for Sanchez Cleaning Services with domain sanchezcleanservice.com.',
    keywords: ['Subscriptions', 'Cleaner Profiles', 'Instant Estimates', 'Reminders'],
    img: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'commercial-cleaning',
    icon: Sparkles,
    name: 'Charlotte Cleaning Service',
    desc: 'Cleaning website template for Charlotte Cleaning Service with domain charlottecleanservices.com.',
    keywords: ['B2B Leads', 'Walkthroughs', 'Service Plans', 'Contracts'],
    img: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'carpet-cleaning',
    icon: Sparkles,
    name: 'Oxy Magic of the Carolinas',
    desc: 'Carpet cleaning website template for room-based quotes, stain treatment requests, and callbacks.',
    keywords: ['Room Quotes', 'Add-Ons', 'Gallery', 'Online Booking'],
    img: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'window-cleaning',
    icon: Sparkles,
    name: 'Scrub and Shine Cleaning Solutions',
    desc: 'House cleaning website template with quote requests, callback scheduling, and service details.',
    keywords: ['Pane Counts', 'Routes', 'Seasonal Offers', 'Reviews'],
    img: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'pressure-washing',
    icon: Sparkles,
    name: 'New Hope Cleaning Services',
    desc: 'Pressure washing website template for driveways, siding, patios, and exterior cleaning requests.',
    keywords: ['Exterior Quotes', 'Service Areas', 'Photos', 'Upsells'],
    img: 'https://images.pexels.com/photos/4239119/pexels-photo-4239119.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'move-out-cleaning',
    icon: Sparkles,
    name: 'B & Z Cleaning Services LLC',
    desc: 'Cleaning service website template for homes, apartments, and move-out cleaning requests.',
    keywords: ['Move-Out', 'Landlords', 'Rush Booking', 'Checklists'],
    img: 'https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'post-construction-cleaning',
    icon: Sparkles,
    name: 'Xtreme Cleaning Services LLC',
    desc: 'Charlotte cleaning service template with online requests, calls, and callback scheduling.',
    keywords: ['Dust Removal', 'Final Cleans', 'Punch Lists', 'Contractors'],
    img: 'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'airbnb-cleaning',
    icon: Sparkles,
    name: 'Sweets After Hour Cleaning',
    desc: 'After-hour cleaning website template for flexible quotes, calls, and service requests.',
    keywords: ['Turnovers', 'Calendar Sync', 'Photo Reports', 'Linen Tracking'],
    img: 'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'janitorial-services',
    icon: Sparkles,
    name: 'MB.SPOTLESS CLEANING SERVICES',
    desc: 'Spotless cleaning website template for recurring service requests and customer callbacks.',
    keywords: ['Contracts', 'Multi-Location', 'Supplies', 'Compliance'],
    img: 'https://images.pexels.com/photos/4099471/pexels-photo-4099471.jpeg?w=500&h=320&fit=crop',
  },
  {
    id: 'green-cleaning',
    icon: Sparkles,
    name: "Titi's Cleaning Services",
    desc: 'Friendly house cleaning website template for quotes, callbacks, and local Charlotte service.',
    keywords: ['Eco-Friendly', 'Pet-Safe', 'Products', 'Subscriptions'],
    img: 'https://images.pexels.com/photos/5217897/pexels-photo-5217897.jpeg?w=500&h=320&fit=crop',
  },
];

interface Props {
  onOpenDemo: (id: string) => void;
}

export default function Industries({ onOpenDemo }: Props) {
  const [showMore, setShowMore] = useState(false);
  const visibleIndustries = showMore ? industries : industries.slice(0, 9);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#industries .animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [showMore]);

  return (
    <section id="industries" className="section-padding bg-[#041F19]">
      <div className="container-max">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="inline-block text-sm font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/25 rounded-full px-4 py-1.5 mb-4">
            Industries We Serve
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Your Industry, Our Expertise
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Click any industry card to see a live website demo built specifically for that business type.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleIndustries.map((industry, i) => (
            <div
              key={industry.id}
              className="animate-on-scroll group relative rounded-2xl overflow-hidden border border-[#0B4A3A] bg-[#03251D] shadow-lg shadow-black/20 hover:bg-[#042D23] hover:shadow-xl hover:shadow-black/35 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{ transitionDelay: `${i * 0.05}s` }}
              onClick={() => onOpenDemo(industry.id)}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={industry.img}
                  alt={industry.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041F19]/90 via-[#041F19]/25 to-transparent" />

                <div className="absolute top-3 left-3 w-9 h-9 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
                  <industry.icon className="w-4 h-4 text-white" />
                </div>

                <div className="absolute top-3 left-14 rounded-full bg-[#041F19]/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm border border-white/15">
                  T{i + 1}
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    View Demo
                  </span>
                </div>

                <h3 className="absolute bottom-3 left-4 font-display font-bold text-lg text-white">
                  {industry.name}
                </h3>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-white/70 leading-relaxed mb-3">{industry.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {industry.keywords.map((kw) => (
                    <span key={kw} className="text-xs bg-[#0B4A3A] border border-[#14614E] text-white/85 px-2 py-0.5 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-orange-400 group-hover:gap-1.5 transition-all">
                  <span>See live demo</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center animate-on-scroll">
          <button
            type="button"
            onClick={() => setShowMore((current) => !current)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-500 hover:shadow-orange-500/30"
          >
            {showMore ? 'See less templates' : 'See more templates'}
            {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}
