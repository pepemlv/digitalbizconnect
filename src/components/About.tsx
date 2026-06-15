import { useEffect } from 'react';
import { Target, Heart, TrendingUp, Users, Award } from 'lucide-react';

const values = [
  { icon: Target, title: 'Results-Driven', desc: 'Every decision we make is focused on growing your business. We measure success by your success.' },
  { icon: Heart, title: 'People First', desc: 'We build long-term partnerships, not one-time transactions. Your growth is our mission.' },
  { icon: TrendingUp, title: 'Always Improving', desc: 'Digital marketing evolves fast. We stay ahead so your business stays competitive.' },
  { icon: Users, title: 'Full Partnership', desc: 'We become your digital team — strategy, execution, and support all under one roof.' },
];

const processSteps = [
  { num: '01', title: 'Discovery Call', desc: 'We learn about your business, goals, and challenges in a free 30-minute consultation.' },
  { num: '02', title: 'Strategy & Design', desc: 'Custom plan and design mockups for your approval before writing a single line of code.' },
  { num: '03', title: 'Build & Launch', desc: 'Our team builds your solution fast — most projects launch within 2–4 weeks.' },
  { num: '04', title: 'Grow Together', desc: 'We monitor, optimize, and support your digital presence month after month.' },
];

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#about .animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left */}
          <div className="animate-on-scroll">
            <span className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-4">
              About Us
            </span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-slate-900 mb-6">
              We Built This for{' '}
              <span className="text-gradient">Businesses Like Yours</span>
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Most small businesses fail online not because of their products — but because they lack
                the digital infrastructure to compete. A slow website, no booking system, unanswered calls,
                and no online reviews can kill a great business.
              </p>
              <p>
                We started DigitalBizConnect to change that. We combine deep technical expertise in web
                development and automation with a genuine passion for customer service, creating a one-stop
                digital partner for growing businesses.
              </p>
              <p>
                Our team brings together years of experience in web development, digital marketing, and
                customer operations. We've helped over 300 businesses transform their online presence into
                a revenue-generating machine.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { val: '300+', label: 'Businesses Served' },
                { val: '5 yrs', label: 'In Business' },
                { val: '$2M+', label: 'Revenue Generated' },
                { val: '98%', label: 'Client Retention' },
              ].map(({ val, label }) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="font-display font-bold text-2xl text-primary-600">{val}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="animate-on-scroll relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/80">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=700&h=500&fit=crop"
                alt="Our team at work"
                className="w-full h-80 object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-600/30">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Top Agency 2024</p>
                <p className="text-xs text-slate-400">Clutch.co Verified</p>
              </div>
            </div>

            <div className="absolute -top-5 -right-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-xl">
              <div className="flex mb-1.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-800">5.0 on Google</p>
              <p className="text-xs text-slate-400">127 reviews</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h3 className="font-display font-bold text-2xl text-slate-900 text-center mb-8 animate-on-scroll">
            Our Core Values
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="animate-on-scroll bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="w-11 h-11 bg-[#0F172A] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="animate-on-scroll">
          <h3 className="font-display font-bold text-2xl text-slate-900 text-center mb-10">How We Work</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map(({ num, title, desc }, i) => (
              <div key={num} className="relative text-center">
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] right-[-50%] h-px bg-gradient-to-r from-slate-200 to-transparent" />
                )}
                <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-900/15">
                  <span className="text-white font-display font-bold text-lg">{num}</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
