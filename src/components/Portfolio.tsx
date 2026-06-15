import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, Star, ArrowRight, X } from 'lucide-react';

const categories = ['All', 'Restaurant', 'Construction', 'Healthcare', 'Events', 'Services'];

const projects = [
  {
    id: 1,
    category: 'Restaurant',
    title: 'La Bella Cucina',
    subtitle: 'Restaurant Website & Online Ordering',
    afterImg: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop',
    features: ['Online ordering system', 'Table reservation', 'Menu management', 'Google review integration'],
    results: { Traffic: '+187%', Bookings: '+240%', Revenue: '+$8K/mo' },
    testimonial: '"Our online orders tripled in the first month. Best investment we made."',
    client: 'Maria G., Owner',
    rating: 5,
  },
  {
    id: 2,
    category: 'Construction',
    title: 'SteelCraft Builders',
    subtitle: 'Construction Company Platform',
    afterImg: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?w=600&h=400&fit=crop',
    features: ['Project portfolio showcase', 'Lead capture forms', 'Quote request system', 'SEO optimization'],
    results: { Traffic: '+320%', Bookings: '+95%', Revenue: '+$22K/mo' },
    testimonial: '"We went from 2 leads a month to 20+ qualified leads. Incredible results."',
    client: 'James T., CEO',
    rating: 5,
  },
  {
    id: 3,
    category: 'Healthcare',
    title: 'ClearSmile Dental',
    subtitle: 'Medical Office Booking System',
    afterImg: 'https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?w=600&h=400&fit=crop',
    features: ['Online appointment booking', 'Patient portal', 'Insurance info collection', 'Automated reminders'],
    results: { Traffic: '+145%', Bookings: '+310%', Revenue: '+$15K/mo' },
    testimonial: '"No-shows dropped 70%. Patients love booking online at midnight."',
    client: 'Dr. Sarah K.',
    rating: 5,
  },
  {
    id: 4,
    category: 'Events',
    title: 'PremiumEvents Co.',
    subtitle: 'Event Rental Booking Platform',
    afterImg: 'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg?w=600&h=400&fit=crop',
    features: ['Equipment catalog', 'Online deposit payments', 'Availability calendar', 'Customer contracts'],
    results: { Traffic: '+260%', Bookings: '+180%', Revenue: '+$12K/mo' },
    testimonial: '"Customers now book and pay deposits without calling. We save 10 hrs/week."',
    client: 'Kevin R., Founder',
    rating: 5,
  },
  {
    id: 5,
    category: 'Services',
    title: 'FastClean Pro',
    subtitle: 'Cleaning Company Website',
    afterImg: 'https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?w=600&h=400&fit=crop',
    features: ['Instant quote calculator', 'Recurring booking', 'Review showcase', 'Local SEO'],
    results: { Traffic: '+198%', Bookings: '+420%', Revenue: '+$9K/mo' },
    testimonial: '"From 3 clients to 35 in 4 months. This team changed our entire business."',
    client: 'Ana M., Owner',
    rating: 5,
  },
  {
    id: 6,
    category: 'Services',
    title: 'Shield Insurance Group',
    subtitle: 'Insurance Agency Website',
    afterImg: 'https://images.pexels.com/photos/7821686/pexels-photo-7821686.jpeg?w=600&h=400&fit=crop',
    features: ['Quote request forms', 'Policy comparison', 'Live chat integration', 'CRM connection'],
    results: { Traffic: '+230%', Bookings: '+150%', Revenue: '+$18K/mo' },
    testimonial: '"Lead quality improved dramatically. Our close rate went from 20% to 45%."',
    client: 'Robert L., Principal',
    rating: 5,
  },
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);

  const filtered = activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#portfolio .animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-4">
            Our Work
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-slate-900 mb-4">
            Real Results for{' '}
            <span className="text-gradient">Real Businesses</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every project tells a story of transformation. See what we've built for businesses just like yours.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-on-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="animate-on-scroll group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
              style={{ transitionDelay: `${i * 0.05}s` }}
              onClick={() => setActiveProject(project)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.afterImg}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 to-transparent" />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary-700 px-2.5 py-1 rounded-full">
                  {project.category}
                </span>
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {Object.values(project.results).slice(0, 2).map((r) => (
                    <span key={r} className="flex items-center gap-1 bg-cyan-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" />{r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-slate-900 mb-0.5">{project.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{project.subtitle}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic mb-3 line-clamp-2">{project.testimonial}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex">
                      {Array.from({ length: project.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{project.client}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary-600">
                    View Case <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52">
              <img src={activeProject.afterImg} alt={activeProject.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 to-transparent" />
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-5">
                <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {activeProject.category}
                </span>
                <h3 className="font-display font-bold text-2xl text-white mt-1">{activeProject.title}</h3>
                <p className="text-white/75 text-sm">{activeProject.subtitle}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 mb-6">
                {Object.entries(activeProject.results).map(([key, val]) => (
                  <div key={key} className="bg-cyan-50 border border-cyan-100 rounded-xl p-3 text-center">
                    <p className="text-xl font-display font-bold text-cyan-700">{val}</p>
                    <p className="text-xs text-slate-500">{key}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Features Built</h4>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {activeProject.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <blockquote className="bg-slate-50 border-l-4 border-primary-600 rounded-r-xl p-4 mb-5">
                <p className="text-slate-700 italic mb-2 text-sm">{activeProject.testimonial}</p>
                <footer className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: activeProject.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-600">{activeProject.client}</span>
                </footer>
              </blockquote>

              <button
                onClick={() => { setActiveProject(null); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary-600/20"
              >
                Get Results Like This <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
