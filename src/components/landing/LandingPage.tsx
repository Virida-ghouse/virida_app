import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './sections/HeroSection';
import GreenhouseSection from './sections/GreenhouseSection';
import DashboardPreview from './sections/DashboardPreview';
import MarketplaceSection from './sections/MarketplaceSection';
import PricingSection from './sections/PricingSection';
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
        <GreenhouseSection />
        <DashboardPreview />
        <MarketplaceSection />
        <PricingSection />
        <CTASection onNavigateToLogin={onNavigateToLogin} />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
