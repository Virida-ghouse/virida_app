import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './sections/HeroSection';
import EveSection from './sections/EveSection';
import MarketplaceSection from './sections/MarketplaceSection';
import GreenhouseSection from './sections/GreenhouseSection';
import PricingSection from './sections/PricingSection';
import AboutSection from './sections/AboutSection';
import PartnersSection from './sections/PartnersSection';
import CTASection from './sections/CTASection';
import LandingFooter from './LandingFooter';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <LandingHeader onNavigateToLogin={onNavigateToLogin} />
      <main>
        <HeroSection onNavigateToLogin={onNavigateToLogin} />
        <EveSection />
        <MarketplaceSection />
        <GreenhouseSection />
        <PricingSection />
        <AboutSection />
        <PartnersSection />
        <CTASection onNavigateToLogin={onNavigateToLogin} />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
