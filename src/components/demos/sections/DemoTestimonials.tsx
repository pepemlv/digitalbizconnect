import { Star, Quote } from 'lucide-react';
import type { IndustryConfig } from '../industryConfigs';

interface Props {
  config: IndustryConfig;
}

export default function DemoTestimonials({ config }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 mb-3">
            What Our Clients Say
          </h2>
          <p className="text-slate-500">Real reviews from real customers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {config.testimonials.map((t, i) => (
            <div key={i} className="relative bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <Quote className="absolute top-4 right-5 w-8 h-8 text-slate-100" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: config.accentLightHex, color: config.accentTextHex }}
                >
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
