import { Phone, MapPin, ArrowRight } from 'lucide-react';
import type { IndustryConfig } from '../industryConfigs';

interface Props {
  config: IndustryConfig;
  onCTAClick: () => void;
}

export default function DemoHero({ config, onCTAClick }: Props) {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={config.heroImage}
          alt={config.businessName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className={config.agentPhoto ? 'grid lg:grid-cols-[minmax(0,1fr)_360px] gap-12 items-center' : 'max-w-2xl'}>
          <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
            style={{ backgroundColor: `${config.accentHex}20`, border: `1px solid ${config.accentHex}40`, color: config.accentHex }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.accentHex }} />
            {config.industry} Website Demo
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08] mb-5 tracking-tight">
            {config.agentName || config.tagline}
          </h1>

          {config.agentTitle && (
            <p className="text-xl sm:text-2xl font-semibold mb-4" style={{ color: config.accentHex }}>
              {config.agentTitle}
            </p>
          )}

          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
            {config.subTagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={onCTAClick}
              className="group flex items-center justify-center gap-2 px-7 py-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{ backgroundColor: config.accentHex }}
            >
              {config.ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onCTAClick}
              className="flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl transition-all"
            >
              <Phone className="w-4 h-4" style={{ color: config.accentHex }} />
              {config.phone}
            </button>
          </div>

          <p className="text-sm text-slate-400 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            {config.address}
          </p>
          </div>

          {config.agentPhoto && (
            <div className="flex justify-center lg:justify-end order-first lg:order-none">
              <div
                className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full p-2 shadow-2xl"
                style={{ backgroundColor: config.accentHex }}
              >
                <img
                  src={config.agentPhoto}
                  alt={config.agentPhotoAlt || config.businessName}
                  className="w-full h-full rounded-full object-cover border-8 border-white/90"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
