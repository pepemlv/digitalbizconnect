import type { IndustryConfig } from '../industryConfigs';

interface Props {
  config: IndustryConfig;
}

export default function DemoFeatures({ config }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="inline-block text-sm font-semibold rounded-full px-4 py-1.5 mb-4"
            style={{ backgroundColor: config.accentLightHex, color: config.accentTextHex }}
          >
            Our Services
          </span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 mb-3">
            Built for {config.industry} Businesses
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Every feature is designed to help you get more customers, save time, and grow revenue.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {config.features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors"
                style={{ backgroundColor: config.accentLightHex }}
              >
                <Icon className="w-5 h-5" style={{ color: config.accentHex }} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
