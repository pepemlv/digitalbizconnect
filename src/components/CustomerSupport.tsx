import { useEffect } from 'react';
import { Phone, MessageSquare, Calendar, Mail, Clock, Globe, CheckCircle, BarChart2 } from 'lucide-react';

const supportServices = [
  { icon: Phone, title: 'Phone Answering', desc: 'Professional agents answer in your business name, 24/7.' },
  { icon: MessageSquare, title: 'Live Chat Management', desc: 'Real-time chat support that converts visitors to customers.' },
  { icon: Calendar, title: 'Appointment Scheduling', desc: 'Book, confirm, and manage all customer appointments.' },
  { icon: Mail, title: 'Email Response Management', desc: 'Fast, professional replies to every customer inquiry.' },
  { icon: Clock, title: 'Customer Follow-Up', desc: 'Automated and human follow-up sequences for leads.' },
  { icon: Globe, title: 'Bilingual Support', desc: 'English & Spanish support to reach more customers.' },
];

const metrics = [
  { value: '< 2 min', label: 'Avg. Response Time' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '24/7', label: 'Availability' },
  { value: '+65%', label: 'Lead Conversion' },
];

const workflow = [
  { step: '01', title: 'Customer Contacts', desc: 'Via phone, chat, email, or social media.' },
  { step: '02', title: 'Instant Response', desc: 'Our team replies within 2 minutes during business hours.' },
  { step: '03', title: 'Issue Resolved', desc: 'Questions answered, bookings made, problems solved.' },
  { step: '04', title: 'You Get Notified', desc: 'Summary sent to your dashboard in real-time.' },
];

export default function CustomerSupport() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll('#support .animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="support" className="section-padding bg-[#0F172A] relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="container-max relative z-10">
        {/* Header */}
        <div className="text-center mb-14 animate-on-scroll">
          <span className="inline-block text-sm font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
            Customer Support Solutions
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            We Become Your{' '}
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              Digital Front Desk
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Never miss a customer again. Our team handles all communication so you can focus on delivering
            your service.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14 animate-on-scroll">
          {metrics.map(({ value, label }) => (
            <div key={label} className="bg-white/4 border border-white/8 rounded-2xl p-5 text-center hover:bg-white/7 transition-colors">
              <p className="font-display font-bold text-3xl text-white mb-1">{value}</p>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Services list */}
          <div className="animate-on-scroll">
            <h3 className="font-display font-bold text-2xl text-white mb-6">What We Handle For You</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {supportServices.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/4 border border-white/8 rounded-xl p-4 hover:border-cyan-500/30 hover:bg-white/6 transition-all group">
                  <div className="w-9 h-9 bg-primary-600/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-600/30 transition-colors">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow + dashboard */}
          <div className="animate-on-scroll">
            <h3 className="font-display font-bold text-2xl text-white mb-6">How It Works</h3>
            <div className="space-y-4 mb-6">
              {workflow.map(({ step, title, desc }, i) => (
                <div key={step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {step}
                    </div>
                    {i < workflow.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-primary-700/60 to-transparent mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <h4 className="font-semibold text-white mb-0.5">{title}</h4>
                    <p className="text-sm text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live dashboard preview */}
            <div className="bg-white/4 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">Live Support Dashboard</span>
                <span className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  3 agents online
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { channel: 'Chat', name: 'John D.', msg: 'Asking about pricing', time: '1m', active: true },
                  { channel: 'Phone', name: 'Maria S.', msg: 'Booking appointment', time: '3m', active: false },
                  { channel: 'Email', name: 'Robert K.', msg: 'Service inquiry', time: '5m', active: true },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3 bg-white/4 rounded-xl p-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active ? 'bg-cyan-400' : 'bg-yellow-400'}`} />
                    <span className="text-xs bg-primary-600/30 text-primary-300 px-2 py-0.5 rounded-md font-medium">{item.channel}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">{item.name}</p>
                      <p className="text-xs text-slate-500 truncate">{item.msg}</p>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">{item.time} ago</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/8 grid grid-cols-3 gap-2">
                {[
                  { icon: BarChart2, label: 'Resolved Today', val: '47' },
                  { icon: Clock, label: 'Avg. Handle', val: '4.2m' },
                  { icon: CheckCircle, label: 'CSAT Score', val: '98%' },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-white">{val}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center animate-on-scroll">
          <button
            onClick={() => scrollTo('#contact')}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40 hover:shadow-xl transition-all duration-300"
          >
            Start With Free Support Trial
          </button>
          <p className="text-sm text-slate-500 mt-3">No commitment required. See the difference in 30 days.</p>
        </div>
      </div>
    </section>
  );
}
