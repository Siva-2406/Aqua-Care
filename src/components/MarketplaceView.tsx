import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Droplet, 
  ShieldCheck, 
  Truck, 
  Eye, 
  ArrowRight, 
  SlidersHorizontal,
  CheckCircle2,
  TrendingDown,
  Building2,
  Sparkles,
  Info
} from 'lucide-react';
import { WaterListing, BuyerProfile, TNCity, SuitableUse } from '../types';
import { calculateDistanceKm, calculateLogisticsPriceInr } from '../utils/matching';
import { InteractiveTNMap } from './InteractiveTNMap';
import { WaterOpportunityFinder } from './WaterOpportunityFinder';

interface MarketplaceViewProps {
  listings: WaterListing[];
  buyer: BuyerProfile;
  currentCity: TNCity;
  onCityChange: (city: TNCity) => void;
  onRequestWater: (listing: WaterListing) => void;
  onOpenPassport: (listing: WaterListing) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  buyer,
  currentCity,
  onCityChange,
  onRequestWater,
  onOpenPassport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUse, setSelectedUse] = useState<string>('ALL');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'cards'>('both');

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Must match search query
      const matchesSearch =
        l.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by city or radius
      const distance = calculateDistanceKm(buyer.lat, buyer.lng, l.lat, l.lng);
      const matchesRadius = l.city === currentCity || distance <= radiusKm;

      // Filter by suitable use
      const matchesUse = selectedUse === 'ALL' || l.suitableUses.includes(selectedUse as SuitableUse);

      return matchesSearch && matchesRadius && matchesUse && l.status === 'active';
    }).sort((a, b) => {
      const distA = calculateDistanceKm(buyer.lat, buyer.lng, a.lat, a.lng);
      const distB = calculateDistanceKm(buyer.lat, buyer.lng, b.lat, b.lng);
      return distA - distB;
    });
  }, [listings, buyer, currentCity, radiusKm, searchQuery, selectedUse]);

  const featuredOpportunity = listings.find((l) => l.city === currentCity && l.availableLiters >= 8000) || listings[0];

  return (
    <div className="space-y-6">
      {/* Top Greeting & User Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Good Morning 👋
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              {currentCity} District Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Discover verified non-potable water from local hotels, apartments, and industries ready for short-haul delivery.
          </p>
        </div>

        {/* View Switcher: Both, Map, or Cards */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs self-start md:self-auto">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              viewMode === 'both'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Map + Cards
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Map Only
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Cards Only
          </button>
        </div>
      </div>

      {/* 6. Quick Stats Bar from Prompt:
          💧 Available Water: 12,500 L
          📍 Nearby Suppliers: 18
          ♻️ Water Reused: 84,200 L
          🌱 Freshwater Saved: 72,500 L */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>💧 Available Water</span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">{currentCity}</span>
          </div>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            12,500 L
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Ready for immediate dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>📍 Nearby Suppliers</span>
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
            18
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Hotels, apartments & STPs</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>♻️ Water Reused</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">This Month</span>
          </div>
          <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
            84,200 L
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">In {currentCity} circular trades</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>🌱 Freshwater Saved</span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">Preserved</span>
          </div>
          <span className="text-2xl font-black font-mono text-sky-600 dark:text-sky-400 mt-1 block">
            72,500 L
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Drinking water protected</span>
        </div>
      </div>

      {/* 💡 Water Opportunity Finder Banner */}
      <WaterOpportunityFinder
        currentCity={currentCity}
        onViewMatch={(l) => onRequestWater(l)}
        featuredListing={featuredOpportunity}
        buyer={buyer}
      />

      {/* Interactive Tamil Nadu Proximity Map */}
      {(viewMode === 'both' || viewMode === 'map') && (
        <InteractiveTNMap
          currentCity={currentCity}
          onCityChange={onCityChange}
          listings={listings}
          buyer={buyer}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          onSelectListing={onRequestWater}
          onOpenPassport={onOpenPassport}
        />
      )}

      {/* Filter and Search Bar */}
      {(viewMode === 'both' || viewMode === 'cards') && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search */}
              <div className="relative md:col-span-6">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by facility name, area, or water source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Purpose Filter */}
              <div className="md:col-span-6 flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                {['ALL', 'Construction', 'Gardening', 'Cleaning', 'Dust Suppression', 'Industrial use'].map((use) => (
                  <button
                    key={use}
                    onClick={() => setSelectedUse(use)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedUse === use
                        ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {use === 'ALL' ? 'All Uses' : use}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Showing {filteredListings.length} verified listings in {currentCity}</span>
              <span>Radius filter: within {radiusKm} km</span>
            </div>
          </div>

          {/* Cards Grid: Clean, Modern Marketplace Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((l) => {
              const distanceKm = calculateDistanceKm(buyer.lat, buyer.lng, l.lat, l.lng);
              const pricing = calculateLogisticsPriceInr(5000, distanceKm, l.pricePerThousandLiters);

              return (
                <div
                  key={l.id}
                  className="rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md flex flex-col justify-between p-5 group"
                >
                  <div className="space-y-3">
                    {/* Header: Title & Distance */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                          <span>{l.city} — {distanceKm} km</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {l.supplierName}
                        </h3>
                      </div>

                      {/* Quality Verified Badge */}
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* Metadata line with typographic separators */}
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span>{l.source}</span>
                      <span className="mx-1.5 opacity-40">·</span>
                      <span>{l.area}</span>
                    </div>

                    {/* Available Water Box */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[11px] block">💧 Available Water</span>
                        <span className="font-bold font-mono text-sky-600 dark:text-sky-400 text-sm mt-0.5 block">
                          {l.availableLiters.toLocaleString()} L
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Quality Status</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 block text-[11px] mt-0.5">
                          pH {l.quality.ph} · {l.quality.tdsMgL} mg/L
                        </span>
                      </div>
                    </div>

                    {/* Suitable Uses tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {l.suitableUses.slice(0, 3).map((use) => (
                        <span
                          key={use}
                          className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {use}
                        </span>
                      ))}
                      {l.suitableUses.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{l.suitableUses.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Price & Action */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                          ₹{l.pricePerThousandLiters}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                          / 1,000 L
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Save ~{pricing.savingsPercent}% vs tap
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenPassport(l)}
                        className="py-2 px-3 rounded-xl border text-xs font-semibold border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Passport</span>
                      </button>

                      <button
                        onClick={() => onRequestWater(l)}
                        className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-all shadow-sm flex items-center justify-center gap-1"
                      >
                        <span>Request</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredListings.length === 0 && (
            <div className="p-10 rounded-3xl border text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <Droplet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">No listings found in current radius</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try expanding your search radius to 10 km or selecting "All Uses" to discover more nearby suppliers.
              </p>
              <button
                onClick={() => {
                  setRadiusKm(10);
                  setSelectedUse('ALL');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-sky-600 dark:text-sky-400"
              >
                Reset Filters & Expand Radius
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
