import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, LockKeyhole } from 'lucide-react';
import { subscribeToContactMessages } from '../lib/firebase';

const footerLinks = {
  Services: ['Website Development', 'E-Commerce Stores', 'Booking Systems', 'Payment Integration', 'Customer Support', 'Business Automation'],
  Industries: ['Construction', 'Restaurants', 'Medical Offices', 'Insurance Agencies', 'Event Rentals', 'Real Estate'],
  Company: ['About Us', 'Our Work', 'Pricing', 'Blog', 'Careers', 'Contact'],
};

const socials = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Instagram, label: 'Instagram' },
];

export default function Footer() {
  const [newRequestCount, setNewRequestCount] = useState(0);

  useEffect(() => {
    return subscribeToContactMessages(
      (messages) => setNewRequestCount(messages.filter((message) => message.status === 'new').length),
      () => setNewRequestCount(0),
    );
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#041F19]">
      <div className="border-t border-white/8 bg-[#052E24] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-3">
            Ready to Connect Your Business to Digital Growth?
          </h2>
          <p className="text-white/65 mb-7">
            Get your website and business dashboard access in less than 48 hours.
          </p>
          <button
            onClick={() => scrollTo('#contact')}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-600/25"
          >
            Get Free Consultation <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-white/6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="DigitalBizConnect" className="w-12 h-12 object-contain" />
              <span className="font-display font-bold text-white text-lg tracking-tight">
                DigitalBiz<span className="text-orange-300">Connect</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5 max-w-xs">
              Connecting small and medium businesses to digital growth through modern websites, automation,
              and customer support solutions.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <span>(704) 831-1314</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <span>contact@digitalbizconnect.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <span>Nationwide Service</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollTo('#services')}
                      className="text-sm text-white/60 hover:text-orange-200 transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} DigitalBizConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="w-8 h-8 bg-white/5 hover:bg-orange-500/15 border border-white/6 hover:border-orange-500/25 rounded-lg flex items-center justify-center transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-white/55" />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-white/40">
            <button className="hover:text-orange-200 transition-colors">Privacy Policy</button>
            <button className="hover:text-orange-200 transition-colors">Terms of Service</button>
            <a href="/admin" className="relative inline-flex items-center gap-1.5 hover:text-orange-200 transition-colors">
              <LockKeyhole className="w-3.5 h-3.5" />
              Admin Login
              {newRequestCount > 0 && (
                <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-[0.65rem] font-bold text-white">
                  {newRequestCount}
                </span>
              )}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
