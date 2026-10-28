import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { PromoIAModal } from './components/PromoIAModal.js';
import { NewOfferModal } from './components/NewOfferModal.js';
import { OnboardingModal } from './components/OnboardingModal.js';

// Pages
import { DashboardPage } from './pages/DashboardPage.js';
import { OffersPage } from './pages/OffersPage.js';
import { LinkConverterPage } from './pages/LinkConverterPage.js';
import { AdGeneratorPage } from './pages/AdGeneratorPage.js';
import { ArtStudioPage } from './pages/ArtStudioPage.js';
import { CreativesLibraryPage } from './pages/CreativesLibraryPage.js';
import { CampaignsPage } from './pages/CampaignsPage.js';
import { ChannelsPage } from './pages/ChannelsPage.js';
import { PromoIAAgentPage } from './pages/PromoIAAgentPage.js';
import { StorefrontEditorPage } from './pages/StorefrontEditorPage.js';
import { PublicStorefrontPage } from './pages/PublicStorefrontPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { SubscriptionsPage } from './pages/SubscriptionsPage.js';
import { ReferralPage } from './pages/ReferralPage.js';
import { AdminPage } from './pages/AdminPage.js';
import { FinancialPage } from './pages/FinancialPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { SupportPage } from './pages/SupportPage.js';
import { PoliciesPage } from './pages/PoliciesPage.js';
import { LandingPage } from './pages/LandingPage.js';

import { Offer } from './types/index.js';
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Link2,
  Share2,
  Store,
  Layers,
} from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isNewOfferModalOpen, setIsNewOfferModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedOfferForAd, setSelectedOfferForAd] = useState<Offer | null>(null);
  const [selectedOfferForArt, setSelectedOfferForArt] = useState<Offer | null>(null);

  useEffect(() => {
    // Check if user came via landing or storefront
    const path = window.location.pathname;
    if (path.startsWith('/ofertas/')) {
      setCurrentTab('storefront-public');
    }
    const hasSeenOnboarding = localStorage.getItem('divulgapromo_onboarded');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('divulgapromo_onboarded', 'true');
  };

  // If in pure Public Storefront view
  if (currentTab === 'storefront-public') {
    return (
      <PublicStorefrontPage
        slug={user?.storefrontSlug || 'achadinhos-do-carlos'}
        onBackToApp={() => setCurrentTab('dashboard')}
      />
    );
  }

  // If in pure Landing page view
  if (currentTab === 'landing') {
    return <LandingPage onEnterApp={() => setCurrentTab('dashboard')} />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAiModal={() => setIsAiModalOpen(true)}
        openNewOfferModal={() => setIsNewOfferModalOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          openAiModal={() => setIsAiModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-200">
            {currentTab === 'dashboard' && (
              <DashboardPage
                setCurrentTab={setCurrentTab}
                openAiModal={() => setIsAiModalOpen(true)}
                openNewOfferModal={() => setIsNewOfferModalOpen(true)}
              />
            )}

            {currentTab === 'offers' && (
              <OffersPage
                setCurrentTab={setCurrentTab}
                openNewOfferModal={() => setIsNewOfferModalOpen(true)}
                onSelectOfferForAd={offer => setSelectedOfferForAd(offer)}
                onSelectOfferForArt={offer => setSelectedOfferForArt(offer)}
              />
            )}

            {currentTab === 'converter' && (
              <LinkConverterPage setCurrentTab={setCurrentTab} />
            )}

            {currentTab === 'ad-generator' && (
              <AdGeneratorPage
                initialOffer={selectedOfferForAd}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === 'art-studio' && (
              <ArtStudioPage
                initialOffer={selectedOfferForArt}
                setCurrentTab={setCurrentTab}
              />
            )}

            {currentTab === 'creatives' && (
              <CreativesLibraryPage setCurrentTab={setCurrentTab} />
            )}

            {currentTab === 'campaigns' && (
              <CampaignsPage setCurrentTab={setCurrentTab} />
            )}

            {currentTab === 'channels' && <ChannelsPage />}

            {currentTab === 'promo-ai' && (
              <PromoIAAgentPage setCurrentTab={setCurrentTab} />
            )}

            {currentTab === 'storefront' && (
              <StorefrontEditorPage setCurrentTab={setCurrentTab} />
            )}

            {currentTab === 'analytics' && <AnalyticsPage />}

            {currentTab === 'subscriptions' && <SubscriptionsPage />}

            {currentTab === 'referrals' && <ReferralPage />}

            {currentTab === 'admin' && <AdminPage />}

            {currentTab === 'financial' && <FinancialPage />}

            {currentTab === 'settings' && <SettingsPage />}

            {currentTab === 'support' && <SupportPage />}

            {currentTab === 'policies' && <PoliciesPage />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-2 text-[10px] text-slate-400">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'dashboard' ? 'text-blue-400 font-bold' : ''}`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Painel</span>
        </button>

        <button
          onClick={() => setCurrentTab('offers')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'offers' ? 'text-blue-400 font-bold' : ''}`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Ofertas</span>
        </button>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex flex-col items-center gap-1 text-purple-400 font-bold -mt-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50">
            <Sparkles className="h-5 w-5" />
          </div>
          <span>Promo IA</span>
        </button>

        <button
          onClick={() => setCurrentTab('converter')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'converter' ? 'text-blue-400 font-bold' : ''}`}
        >
          <Link2 className="h-4 w-4" />
          <span>Links</span>
        </button>

        <button
          onClick={() => setCurrentTab('storefront-public')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'storefront-public' ? 'text-blue-400 font-bold' : ''}`}
        >
          <Store className="h-4 w-4" />
          <span>Vitrine</span>
        </button>
      </nav>

      {/* Interactive Global Modals */}
      <PromoIAModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onNavigateTab={tab => {
          setCurrentTab(tab);
          setIsAiModalOpen(false);
        }}
      />

      <NewOfferModal
        isOpen={isNewOfferModalOpen}
        onClose={() => setIsNewOfferModalOpen(false)}
        onOfferCreated={() => {
          // Trigger refresh if on offers or dashboard
          if (currentTab === 'offers') setCurrentTab('offers');
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
