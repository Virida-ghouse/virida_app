import React, { useEffect } from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './sections/HeroSection';
import EveSection from './sections/EveSection';
import MarketplaceSection from './sections/MarketplaceSection';
import GreenhouseSection from './sections/GreenhouseSection';
import DashboardPreview from './sections/DashboardPreview';
import PricingSection from './sections/PricingSection';
import AboutSection from './sections/AboutSection';
import PartnersSection from './sections/PartnersSection';
import ContactFormSection from './sections/ContactFormSection';
import CTASection from './sections/CTASection';
import LandingFooter from './LandingFooter';
import OpenSourceSection from './sections/OpenSourceSection';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToLegal?: (page: 'mentions' | 'confidentialite') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToLegal }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <LandingHeader onNavigateToLogin={onNavigateToLogin} />
      <main>
        <HeroSection onNavigateToLogin={onNavigateToLogin} />
        <GreenhouseSection />
        <EveSection />
        <DashboardPreview />
        <OpenSourceSection />
        <MarketplaceSection />
        <PricingSection />
        <PartnersSection />
        <AboutSection />
        <ContactFormSection />
        <CTASection onNavigateToLogin={onNavigateToLogin} />
      </main>
      <LandingFooter onNavigateToLegal={onNavigateToLegal} />
    </div>
  );
};

export default LandingPage;
