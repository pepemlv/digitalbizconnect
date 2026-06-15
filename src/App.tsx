import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import BusinessPlatform from './components/BusinessPlatform';
// import Services from './components/Services';
import Industries from './components/Industries';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import IndustryPage from './components/IndustryPage';
import SuperAdmin from './components/SuperAdmin';
import { industryConfigs } from './components/demos/industryConfigs';
import QuickBookApp from './quickbook/App';
import AdminApp from './quickbook/AdminApp';

const getDemoIdFromPath = () => {
  const [, basePath, industryId] = window.location.pathname.split('/');
  const validIndustry = industryConfigs.some((config) => config.id === industryId);

  return basePath === 'site' && validIndustry ? industryId : null;
};

const isQuickBookPath = () => {
  const [, basePath] = window.location.pathname.split('/');
  return basePath === 'app' || basePath === 'quickbook';
};

const isAdminPath = () => window.location.pathname.startsWith('/admin');
const isSuperAdminPath = () => window.location.pathname.startsWith('/superadmin');

export default function App() {
  const [activeDemo, setActiveDemo] = useState<string | null>(() => getDemoIdFromPath());
  const [quickBookOpen, setQuickBookOpen] = useState(() => isQuickBookPath());
  const [adminOpen, setAdminOpen] = useState(() => isAdminPath());
  const [superAdminOpen, setSuperAdminOpen] = useState(() => isSuperAdminPath());

  useEffect(() => {
    const handlePopState = () => {
      setActiveDemo(getDemoIdFromPath());
      setQuickBookOpen(isQuickBookPath());
      setAdminOpen(isAdminPath());
      setSuperAdminOpen(isSuperAdminPath());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openDemo = (id: string) => {
    window.history.pushState({}, '', `/site/${id}`);
    setQuickBookOpen(false);
    setAdminOpen(false);
    setSuperAdminOpen(false);
    setActiveDemo(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const closeDemo = () => {
    window.history.pushState({}, '', '/');
    setActiveDemo(null);
    setQuickBookOpen(false);
    setAdminOpen(false);
    setSuperAdminOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (superAdminOpen) {
    return <SuperAdmin />;
  }

  if (adminOpen) {
    return <AdminApp />;
  }

  if (quickBookOpen) {
    return <QuickBookApp />;
  }

  if (activeDemo) {
    return <IndustryPage industryId={activeDemo} onBack={closeDemo} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
     
      <BusinessPlatform />
       <TrustBar />
      <Industries onOpenDemo={openDemo} />
      <Pricing />
      {/* <Services /> 
      <Portfolio />
      <CustomerSupport />
      <About />
      <Testimonials />*/}
    
      
      <Contact />
      <Footer />
    </div>
  );
}
