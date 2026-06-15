import { useEffect } from 'react';
import { ArrowLeft, Phone, Zap } from 'lucide-react';
import { industryConfigs } from './demos/industryConfigs';
import DemoHero from './demos/sections/DemoHero';
import DemoFeatures from './demos/sections/DemoFeatures';
import DemoWidget from './demos/sections/DemoWidget';
import DemoGallery from './demos/sections/DemoGallery';
import DemoTestimonials from './demos/sections/DemoTestimonials';
import DemoCTAFooter from './demos/sections/DemoCTAFooter';
import CleaningTemplatePage from './demos/CleaningTemplatePage';

interface Props {
  industryId: string;
  onBack: () => void;
}

export default function IndustryPage({ industryId, onBack }: Props) {
  const config = industryConfigs.find(c => c.id === industryId);

  useEffect(() => {
    if (config) document.title = `${config.businessName} — Industry Demo`;
    return () => { document.title = 'DigitalBizConnect'; };
  }, [config]);

  // Keyboard back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onBack(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack]);

  if (!config) return null;

  if (config.industry === 'Cleaning Companies') {
    return <CleaningTemplatePage config={config} onBack={onBack} />;
  }

  const handleCTAClick = (action = 'more_info') => {
    sessionStorage.setItem('demoInquiry', JSON.stringify({
      action,
      businessName: config.businessName,
      industry: config.industry,
      message: 'We Built This Website Demo for Your Company\n\nAfter checking Google, we noticed your company does not have a professional website yet. If you like this demo, we can provide the domain and website with your own custom details added. Pay $500 to get your receipt, and your website will be online within 24 hours.\n\nCustom website • Domain included • Online within 24 hours',
    }));
    onBack();
    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Demo site navbar */}
      <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/14 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">Back to DigitalBizConnect</span>
            </button>

            {/* Business brand */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                style={{ backgroundColor: config.accentHex }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white text-sm">
                {config.businessName}
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Live demo badge */}
              <div className="hidden sm:flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.accentHex }} />
                <span className="text-xs text-slate-400 font-medium">Live Demo</span>
              </div>

              {/* Phone */}
              <span className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-400 px-2">
                <Phone className="w-3.5 h-3.5" />
                {config.phone}
              </span>

              {/* CTA */}
              <button
              onClick={() => handleCTAClick('build_site')}
                className="text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: config.accentHex }}
              >
                Build My Site
              </button>
            </div>
          </div>

          {/* Mobile nav links */}
          <div className="flex gap-1 pb-2 overflow-x-auto scrollbar-hide md:hidden">
            {config.navLinks.map((link) => (
              <span
                key={link}
                className="flex-shrink-0 px-3 py-1 text-xs font-medium text-slate-400 bg-white/6 rounded-lg cursor-pointer hover:text-white hover:bg-white/10 transition-all"
              >
                {link}
              </span>
            ))}
          </div>
        </div>

        {/* Desktop nav links row */}
        <div className="hidden md:block border-t border-white/6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0.5 py-1.5">
            {config.navLinks.map((link) => (
              <span
                key={link}
                className="px-4 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/8 rounded-lg cursor-pointer transition-all"
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Page content */}
      <DemoHero config={config} onCTAClick={() => handleCTAClick('build_site')} />
      <DemoFeatures config={config} />
      <DemoWidget config={config} />
      <DemoGallery config={config} />
      <DemoTestimonials config={config} />
      <DemoCTAFooter config={config} onDemoInquiry={handleCTAClick} />
    </div>
  );
}
