import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Platform', href: '#business-platform' },
  { label: 'Industries', href: '#industries' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openCustomerApp = () => {
    setMenuOpen(false);
    window.history.pushState({}, '', '/app');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#041F19]/98 backdrop-blur-md border-b border-white/16 shadow-lg shadow-green-950/30'
          : 'bg-[#041F19]/45 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <img src="/logo.png" alt="DigitalBizConnect" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-display font-bold text-white text-lg tracking-tight">
              DigitalBiz<span className="text-orange-300">Connect</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="px-4 py-2 text-sm font-semibold text-white hover:text-orange-200 hover:bg-white/12 rounded-lg transition-all duration-200 drop-shadow-sm"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={openCustomerApp}
              className="px-4 py-2.5 text-sm font-semibold text-white hover:text-orange-200 hover:bg-white/12 rounded-xl transition-all duration-200 drop-shadow-sm"
            >
              Customer Login
            </button>
            <button
              onClick={() => handleNav('#contact')}
              className="px-5 py-2.5 text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all duration-200 shadow-md shadow-orange-600/25 hover:shadow-orange-500/35 hover:shadow-lg"
            >
              Free Consultation
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-white rounded-lg bg-white/8 hover:bg-white/14 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-[#041F19]/98 backdrop-blur-md border-t border-white/10`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left px-4 py-3 text-sm font-semibold text-white hover:text-orange-200 hover:bg-white/10 rounded-xl transition-all"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={openCustomerApp}
            className="text-left px-4 py-3 text-sm font-semibold text-white hover:text-orange-200 hover:bg-white/10 rounded-xl transition-all"
          >
            Customer Login
          </button>
          <button
            onClick={() => handleNav('#contact')}
            className="mt-2 px-5 py-3 text-sm font-semibold bg-orange-600 text-white rounded-xl"
          >
            Free Consultation
          </button>
        </div>
      </div>
    </header>
  );
}
