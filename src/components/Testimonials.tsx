import { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maria Garcia',
    role: 'Owner, La Bella Cucina',
    text: 'DigitalBizConnect completely transformed our restaurant. We went from barely surviving to having a 3-week waitlist. The online ordering system alone pays for their fees 10x over every month.',
    rating: 5,
    img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
    industry: 'Restaurant',
  },
  {
    name: 'James Thompson',
    role: 'CEO, SteelCraft Builders',
    text: 'We were spending $5,000/month on ads with zero tracking. Now we know exactly where every lead comes from, our website converts visitors, and we\'ve cut our cost per lead by 60%.',
    rating: 5,
    img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face',
    industry: 'Construction',
  },
  {
    name: 'Dr. Sarah Kim',
    role: 'Dentist, ClearSmile Dental',
    text: 'The appointment booking system is incredible. Patients book online at 11pm, we confirm automatically, and our no-show rate dropped 70%. I wish I had done this 5 years earlier.',
    rating: 5,
    img: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100&h=100&fit=crop&crop=face',
    industry: 'Healthcare',
  },
  {
    name: 'Kevin Rodriguez',
    role: 'Founder, PremiumEvents Co.',
    text: 'I was answering phone calls 12 hours a day. Now customers book and pay deposits online while I sleep. My revenue doubled and I actually have a life again. Incredible team.',
    rating: 5,
    img: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop&crop=face',
    industry: 'Events',
  },
  {
    name: 'Ana Martinez',
    role: 'Owner, FastClean Pro',
    text: 'From 3 clients to 35 in 4 months. The instant quote calculator on my website converts visitors automatically. I\'ve had to hire 4 more cleaners to keep up with demand.',
    rating: 5,
    img: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face',
    industry: 'Services',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5500);
    return () => clearInterval(id);
  }, [autoplay]);

  const prev = () => { setAutoplay(false); setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length); };
  const next = () => { setAutoplay(false); setCurrent((c) => (c + 1) % testimonials.length); };

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-4">
            Client Stories
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-slate-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Real words from real business owners who transformed their growth.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 p-8 lg:p-10">
            <Quote className="absolute top-6 right-8 w-12 h-12 text-slate-100" />
            <div className="flex mb-5">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-xl text-slate-700 leading-relaxed mb-7 italic font-medium">
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={testimonials[current].img}
                  alt={testimonials[current].name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
                />
                <div>
                  <p className="font-semibold text-slate-900">{testimonials[current].name}</p>
                  <p className="text-sm text-slate-400">{testimonials[current].role}</p>
                </div>
              </div>
              <span className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1.5 rounded-full font-semibold">
                {testimonials[current].industry}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAutoplay(false); setCurrent(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-primary-600 w-6' : 'bg-slate-300 w-1.5'}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => { setAutoplay(false); setCurrent(i); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-200 ${
                i === current
                  ? 'border-primary-300 bg-primary-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <img src={t.img} alt={t.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="text-xs font-medium text-slate-700">{t.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
