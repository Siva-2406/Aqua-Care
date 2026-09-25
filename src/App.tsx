import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { MarketplaceView } from './components/MarketplaceView';
import { SmartMatchingView } from './components/SmartMatchingView';
import { ListWaterView } from './components/ListWaterView';
import { RequestsTrackerView } from './components/RequestsTrackerView';
import { ImpactDashboardView } from './components/ImpactDashboardView';
import { AdminConsoleView } from './components/AdminConsoleView';
import { DigitalWaterPassportModal } from './components/DigitalWaterPassportModal';
import { RequestWaterModal } from './components/RequestWaterModal';
import { PrdArchitectureModal } from './components/PrdArchitectureModal';
import { 
  INITIAL_TN_LISTINGS, 
  INITIAL_TN_BUYER, 
  INITIAL_TN_REQUESTS, 
  INITIAL_TN_IMPACT 
} from './data/tnMockData';
import { 
  WaterListing, 
  WaterRequest, 
  BuyerProfile, 
  UserRole, 
  TNCity, 
  TamilNaduImpact 
} from './types';
import { CheckCircle2, Droplet, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  // Theme state: default to 'light' as requested for familiar Swiggy/Google Maps feel, but fully supports 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('whsl_theme') as 'light' | 'dark') || 'light';
  });

  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [selectedCity, setSelectedCity] = useState<TNCity>('Salem');

  // Application Data State
  const [listings, setListings] = useState<WaterListing[]>(INITIAL_TN_LISTINGS);
  const [requests, setRequests] = useState<WaterRequest[]>(INITIAL_TN_REQUESTS);
  const [buyer, setBuyer] = useState<BuyerProfile>(INITIAL_TN_BUYER);
  const [impact, setImpact] = useState<TamilNaduImpact>(INITIAL_TN_IMPACT);

  // Modals state
  const [passportListing, setPassportListing] = useState<WaterListing | null>(null);
  const [requestListing, setRequestListing] = useState<WaterListing | null>(null);
  const [prefilledQuantity, setPrefilledQuantity] = useState<number>(6000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme class to document element
  useEffect(() => {
    localStorage.setItem('whsl_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync city change to buyer profile location
  const handleCityChange = (newCity: TNCity) => {
    setSelectedCity(newCity);
    setBuyer(prev => ({
      ...prev,
      city: newCity,
      area: `${newCity} Central Infrastructure Site`,
    }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    setListings(INITIAL_TN_LISTINGS);
    setRequests(INITIAL_TN_REQUESTS);
    setImpact(INITIAL_TN_IMPACT);
    setSelectedCity('Salem');
    showToast('Reset Tamil Nadu demo data to initial clean state!');
  };

  // Submit water request
  const handleCreateRequest = (newReq: WaterRequest) => {
    setRequests(prev => [newReq, ...prev]);

    // Deduct available volume from listing
    setListings(prev =>
      prev.map(l => {
        if (l.id === newReq.listingId) {
          const remaining = Math.max(0, l.availableLiters - newReq.quantityLiters);
          return {
            ...l,
            availableLiters: remaining,
            status: remaining === 0 ? 'depleted' : l.status,
          };
        }
        return l;
      })
    );

    // Update impact counters
    setImpact(prev => ({
      ...prev,
      totalWaterReusedLiters: prev.totalWaterReusedLiters + newReq.quantityLiters,
      freshwaterAvoidedLiters: prev.freshwaterAvoidedLiters + newReq.quantityLiters,
      successfulTransactions: prev.successfulTransactions + 1,
      moneySavedBuyersInr: prev.moneySavedBuyersInr + Math.round(newReq.quantityLiters * 0.7),
    }));

    showToast(`Request ${newReq.requestNumber} placed successfully with ${newReq.supplierName}!`);
  };

  // Add new water listing
  const handleAddListing = (newListing: WaterListing) => {
    setListings(prev => [newListing, ...prev]);
    showToast(`Listing for ${newListing.supplierName} published with Digital Passport!`);
    setActiveTab('find-water');
  };

  // Update order status (requested -> accepted -> scheduled -> delivered -> reused)
  const handleUpdateStatus = (reqId: string, nextStatus: WaterRequest['status']) => {
    setRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status: nextStatus } : r))
    );
    showToast(`Order status updated to: ${nextStatus.toUpperCase()}`);
  };

  // Admin verification
  const handleVerifyListing = (listingId: string, status: 'verified' | 'suspended') => {
    setListings(prev =>
      prev.map(l => (l.id === listingId ? { ...l, verificationStatus: status } : l))
    );
    showToast(`Listing ${listingId} verified and published!`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        theme={theme}
        setTheme={setTheme}
        selectedCity={selectedCity}
        setSelectedCity={handleCityChange}
        onResetDemoData={handleResetDemoData}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="p-3.5 px-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: LANDING PAGE */}
        {activeTab === 'landing' && (
          <div className="space-y-8">
            <LandingHero
              onFindWater={() => setActiveTab('find-water')}
              onListWater={() => setActiveTab('list-water')}
              onExploreDemo={() => setActiveTab('find-water')}
              selectedCity={selectedCity}
            />

            {/* Quick Preview of Marketplace below landing */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Available Water in {selectedCity} Right Now
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified STP and treated effluent ready for local delivery
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('find-water')}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Listings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <MarketplaceView
                listings={listings}
                buyer={buyer}
                currentCity={selectedCity}
                onCityChange={handleCityChange}
                onRequestWater={(listing) => {
                  setRequestListing(listing);
                  setPrefilledQuantity(6000);
                }}
                onOpenPassport={(listing) => setPassportListing(listing)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: FIND WATER (MARKETPLACE + MAP) */}
        {activeTab === 'find-water' && (
          <MarketplaceView
            listings={listings}
            buyer={buyer}
            currentCity={selectedCity}
            onCityChange={handleCityChange}
            onRequestWater={(listing) => {
              setRequestListing(listing);
              setPrefilledQuantity(6000);
            }}
            onOpenPassport={(listing) => setPassportListing(listing)}
          />
        )}

        {/* TAB 3: SMART REUSE MATCHING */}
        {activeTab === 'smart-match' && (
          <SmartMatchingView
            listings={listings}
            buyer={buyer}
            onRequestWater={(listing, qty) => {
              setRequestListing(listing);
              if (qty) setPrefilledQuantity(qty);
            }}
            onOpenPassport={(listing) => setPassportListing(listing)}
          />
        )}

        {/* TAB 4: LIST WATER (SUPPLIER FORM) */}
        {activeTab === 'list-water' && (
          <ListWaterView
            onAddListing={handleAddListing}
            selectedCity={selectedCity}
          />
        )}

        {/* TAB 5: REQUESTS & ORDERS */}
        {activeTab === 'requests' && (
          <RequestsTrackerView
            requests={requests}
            userRole={userRole}
            onUpdateStatus={handleUpdateStatus}
            onOpenPassportById={(passportId) => {
              const matched = listings.find(l => l.passport.waterId === passportId || l.id === passportId);
              if (matched) setPassportListing(matched);
            }}
          />
        )}

        {/* TAB 6: IMPACT DASHBOARD */}
        {activeTab === 'impact' && (
          <ImpactDashboardView
            impact={impact}
            selectedCity={selectedCity}
            onCitySelect={handleCityChange}
          />
        )}

        {/* TAB 7: ADMIN CONSOLE */}
        {activeTab === 'admin' && (
          <AdminConsoleView
            listings={listings}
            requests={requests}
            impact={impact}
            onVerifyListing={handleVerifyListing}
            onOpenPassport={(listing) => setPassportListing(listing)}
          />
        )}

        {/* TAB 8: TECHNICAL SPECS, PRD & POSTGIS */}
        {activeTab === 'tech-specs' && (
          <PrdArchitectureModal
            listings={listings as any}
            buyer={buyer as any}
          />
        )}
      </main>

      {/* Global Modals */}
      {/* 1. Digital Water Passport Modal */}
      {passportListing && (
        <DigitalWaterPassportModal
          listing={passportListing}
          isOpen={!!passportListing}
          onClose={() => setPassportListing(null)}
          onRequestWater={(l) => {
            setRequestListing(l);
            setPrefilledQuantity(6000);
          }}
        />
      )}

      {/* 2. Simple Request Water Modal */}
      {requestListing && (
        <RequestWaterModal
          listing={requestListing}
          buyer={buyer}
          initialQuantity={prefilledQuantity}
          isOpen={!!requestListing}
          onClose={() => setRequestListing(null)}
          onSubmitRequest={handleCreateRequest}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t py-8 text-xs transition-colors duration-200 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Water Has a Second Life</span>
            <span>·</span>
            <span>“Wastewater-ku oru Second Life.”</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Salem · Chennai · Coimbatore · Madurai · Tiruppur · Trichy</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('tech-specs')}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
            >
              PRD & Architecture DDL
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
