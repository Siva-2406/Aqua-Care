import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Droplet, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  Info, 
  Truck, 
  Eye, 
  TrendingDown,
  Building,
  Check
} from 'lucide-react';
import { TNCity, SuitableUse, WaterListing, BuyerProfile } from '../types';
import { calculateSmartMatch, calculateLogisticsPriceInr } from '../utils/matching';
import { TN_CITY_COORDINATES } from '../data/tnMockData';

interface SmartMatchingViewProps {
  listings: WaterListing[];
  buyer: BuyerProfile;
  onRequestWater: (listing: WaterListing, prefilledQuantity?: number) => void;
  onOpenPassport: (listing: WaterListing) => void;
}

export const SmartMatchingView: React.FC<SmartMatchingViewProps> = ({
  listings,
  buyer,
  onRequestWater,
  onOpenPassport,
}) => {
  const [requiredQuantity, setRequiredQuantity] = useState<number>(6000);
  const [requiredPurpose, setRequiredPurpose] = useState<SuitableUse>('Construction');
  const [selectedCity, setSelectedCity] = useState<TNCity>(buyer.city);

  const cityCoords = TN_CITY_COORDINATES[selectedCity] || TN_CITY_COORDINATES['Salem'];

  // Calculate matches
  const matchResults = useMemo(() => {
    return listings
      .filter((l) => l.status === 'active')
      .map((listing) => {
        return calculateSmartMatch(
          listing,
          requiredQuantity,
          requiredPurpose,
          cityCoords.lat,
          cityCoords.lng
        );
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [listings, requiredQuantity, requiredPurpose, cityCoords]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-5 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Reuse Matching Engine
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Enter your water requirements and purpose. Our algorithmic matching evaluates <span className="font-semibold text-sky-600 dark:text-sky-400">Distance + Quantity + Suitability + Price + Availability</span> to discover the highest-affinity local suppliers.
        </p>
      </div>

      {/* Input Requirement Filter Box */}
      <div className="p-6 rounded-3xl border transition-colors duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <span>Tell Us What You Need</span>
          <span className="text-slate-400 text-xs font-normal">(Instant multi-factor calculation)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Quantity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Quantity Required
              </label>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                {requiredQuantity.toLocaleString()} L
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="1000"
              value={requiredQuantity}
              onChange={(e) => setRequiredQuantity(Number(e.target.value))}
              className="w-full accent-sky-600 dark:accent-sky-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>1,000 L</span>
              <span>15,000 L</span>
              <span>30,000 L</span>
            </div>
          </div>

          {/* 2. Purpose Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Purpose / Application
            </label>
            <select
              value={requiredPurpose}
              onChange={(e) => setRequiredPurpose(e.target.value as SuitableUse)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Construction">Construction (Concrete Curing, Compaction)</option>
              <option value="Gardening">Gardening & Landscaping</option>
              <option value="Dust Suppression">Dust Suppression (Roads & Sites)</option>
              <option value="Cleaning">Industrial & Vehicle Cleaning</option>
              <option value="Industrial use">Industrial Rinse & Processing</option>
              <option value="Toilet flushing">Dual Plumbing Toilet Flushing</option>
              <option value="Farming">Agriculture & Farming</option>
            </select>
          </div>

          {/* 3. Location City */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Delivery Location
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as TNCity)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="Salem">Salem District</option>
              <option value="Chennai">Chennai Metro</option>
              <option value="Coimbatore">Coimbatore District</option>
              <option value="Madurai">Madurai District</option>
              <option value="Tiruppur">Tiruppur Textile Belt</option>
              <option value="Tiruchirappalli">Tiruchirappalli (Trichy)</option>
              <option value="Erode">Erode District</option>
              <option value="Vellore">Vellore District</option>
              <option value="Thoothukudi">Thoothukudi Harbour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Ranked Best Matches in {selectedCity}
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Evaluated against 5 matching criteria
        </span>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {matchResults.map((result, idx) => {
          const l = result.listing;
          const pricing = calculateLogisticsPriceInr(requiredQuantity, result.distanceKm, l.pricePerThousandLiters);

          return (
            <div
              key={l.id}
              className={`p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
                idx === 0 
                  ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-xl' 
                  : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Column: Match Score & Details */}
                <div className="flex items-start gap-4">
                  {/* Big Match Badge */}
                  <div className={`shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold font-mono text-center ${
                    result.matchScore >= 90
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : result.matchScore >= 80
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}>
                    <span className="text-lg leading-none">{result.matchScore}%</span>
                    <span className="text-[10px] uppercase font-sans mt-0.5">Match</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {l.supplierName}
                      </h4>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          TOP RECOMMENDATION
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-sky-500" />
                        {result.distanceKm} km away ({l.area})
                      </span>
                      <span>·</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">
                        {l.availableLiters.toLocaleString()} L available
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ {l.verificationStatus === 'verified' ? 'NABL Verified' : 'Pending Verification'}
                      </span>
                    </div>

                    {/* Simple Match Reasons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {result.reasons.map((reason, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing & Action Buttons */}
                <div className="lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800 flex flex-col lg:items-end justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Estimated Delivered Cost ({requiredQuantity.toLocaleString()} L)
                    </span>
                    <div className="flex items-baseline lg:justify-end gap-2 mt-0.5">
                      <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        ₹{pricing.totalCostInr.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">
                        (₹{l.pricePerThousandLiters}/kL + ₹{pricing.transportCostInr} tanker)
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      Saves ~₹{pricing.savingsInr.toLocaleString()} ({pricing.savingsPercent}%) vs tap water
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPassport(l)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors bg-white hover:bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Water Passport</span>
                    </button>

                    <button
                      onClick={() => onRequestWater(l, requiredQuantity)}
                      className="px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
                    >
                      <span>Request Water</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
