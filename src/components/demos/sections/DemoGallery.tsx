import type { IndustryConfig } from '../industryConfigs';

interface Props {
  config: IndustryConfig;
}

export default function DemoGallery({ config }: Props) {
  return (
    <section className="py-20 px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 mb-3">
            Our Work
          </h2>
          <p className="text-slate-500">See the quality we deliver for every client.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
          {config.galleryImages.map((img, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              style={{ aspectRatio: i === 0 ? '16/10' : '4/3' }}
            >
              <img
                src={img}
                alt={`${config.businessName} gallery ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
