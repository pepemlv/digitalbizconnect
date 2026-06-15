import { BarChart3, CreditCard, FileText, FolderLock, ReceiptText, Search } from 'lucide-react';

const included = [
  { icon: FileText, title: 'Professional Website', desc: 'Launch a modern website starting at $500 with your business details, services, and calls to action.' },
  { icon: Search, title: 'Google Visibility', desc: 'Improve local search presence with SEO foundations and Google Business Profile support.' },
  { icon: CreditCard, title: 'Payments & Invoicing', desc: 'Accept online payments, create invoices, and make it easier for customers to pay you.' },
  { icon: BarChart3, title: 'Free Business Dashboard', desc: 'Track income, expenses, sales, customer payments, and revenue reports in one place.' },
];

const dashboard = [
  'Record income and expenses',
  'Track customer payments',
  'Create and send invoices',
  'Upload receipts and business documents',
  'Monitor sales and revenue reports',
  'Keep records organized year-round',
];

const support = [
  { icon: ReceiptText, title: 'Bookkeeping Support & Payroll Help', desc: 'Partners can organize records, prepare reports, and help keep your books clean. Support is available for payroll.' },

  { icon: FolderLock, title: 'Secure Documents & Tax Partner Access', desc: 'Store receipts and business documents so your records are easier to review. Tax professionals can securely review your records and assist with preparation and filing' },

];

export default function BusinessPlatform() {
  return (
    <section id="business-platform" className="section-padding bg-[#041F19] text-white">
      <div className="container-max">

        <div className="max-w-3xl mb-6">
          <span className="inline-block text-sm font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/25 rounded-full px-4 py-1.5 mb-4">
            Included With Every Business Account
          </span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Website, Payments, Records, and Tax Support in One Platform
          </h2>
          <p className="text-lg text-white/75 leading-relaxed">
            You run your business. We provide the website, business tools, financial record system, and expert support to help you stay organized and tax-ready.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <a
            href="/app"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-600/20"
          >
            Customer Login
          </a>

        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {included.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#052E24] border border-white/10 rounded-2xl p-5 shadow-lg shadow-black/10">
              <div className="w-11 h-11 rounded-xl bg-orange-500/12 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">{title}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">
              Your Free Business Dashboard
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">

              <a
                href="/app?mode=register"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold rounded-xl transition-colors"
              >
                Start My Free Business Account
              </a>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Similar to QuickBooks, your dashboard gives you a practical place to manage daily records, payments, invoices, and reports without losing track of the details.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {dashboard.map((item) => (
                <div key={item} className="flex items-center gap-2.5 bg-white/7 border border-white/10 rounded-xl px-4 py-3">
                  <span className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  </span>
                  <span className="text-sm font-medium text-white/85">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">
              Bookkeeping, Payroll, and Tax Support
            </h3>
            <p className="text-white/70 leading-relaxed mb-6">
              When you need help, bookkeeping and tax partners can securely access your records, organize your books, prepare reports, process payroll, and assist with tax preparation.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {support.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-[#052E24] border border-white/10 rounded-2xl p-4 shadow-lg shadow-black/10">
                  <Icon className="w-5 h-5 text-orange-400 mb-3" />
                  <h4 className="font-semibold text-white mb-1">{title}</h4>
                  <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
