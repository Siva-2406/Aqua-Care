import React from 'react';
import { 
  Droplet, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Recycle, 
  Building2, 
  Factory, 
  Trees, 
  CheckCircle2, 
  MapPin,
  TrendingDown
} from 'lucide-react';
import { TNCity } from '../types';

interface LandingHeroProps {
  onFindWater: () => void;
  onListWater: () => void;
  onExploreDemo: () => void;
  selectedCity: TNCity;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onFindWater,
  onListWater,
  onExploreDemo,
  selectedCity,
}) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Visual Section */}
      <div className="relative overflow-hidden rounded-3xl border transition-colors duration-200 bg-gradient-to-b from-sky-50/80 via-white to-sky-50/40 border-sky-100 dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-900/80 dark:border-slate-800 p-8 sm:p-12 shadow-xl">
        <div className="max-w-3xl">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 dark:border dark:border-sky-800/60">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>“Wastewater-ku oru Second Life.”</span>
            <span className="opacity-60">·</span>
            <span>Tamil Nadu B2B Circular Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Turn reusable treated water into a valuable local resource.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Connect nearby water suppliers (hotels, industries, apartments) with organizations that need non-potable water (construction, landscaping, factories) in <span className="font-semibold text-sky-700 dark:text-sky-400">{selectedCity}</span> and across Tamil Nadu.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onFindWater}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950"
            >
              <span>Find Reusable Water</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onListWater}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all border bg-white hover:bg-slate-50 text-slate-800 border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
            >
              List Your Water
            </button>

            <button
              onClick={onExploreDemo}
              className="px-4 py-3.5 rounded-xl text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Explore {selectedCity} Demo →
            </button>
          </div>

          {/* Quick value proof row */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Average Proximity</span>
              <span className="font-bold text-slate-900 dark:text-white text-base">&lt; 3.5 km</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5">Ultra-local tanker routes</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Typical Cost</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">₹320 - ₹480 / kL</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5">Save 40-60% vs tap water</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 dark:text-slate-400 block">Quality Trust</span>
              <span className="font-bold text-sky-600 dark:text-sky-400 text-base">Digital Water Passport</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5">NABL Lab & IoT verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Visual Flow: Water Source → Verification → Matching → Reuse */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 block">
            How It Works in 10 Seconds
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Simple 4-Step Circular Water Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl border transition-all duration-200 bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm mb-3">
              01
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              1. Water Source
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Hotels, textile mills, apartments, and industries in Tamil Nadu produce clean treated wastewater daily from their STPs.
            </p>
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-500 font-medium">
              Examples: Salem Grand Palace, Chennai Tech Park
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl border transition-all duration-200 bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
              02
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              2. Verification
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Every batch has certified test data (pH, TDS, Turbidity) and a tamper-resistant Digital Water Passport.
            </p>
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-500 font-medium">
              NABL accredited laboratory reports
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl border transition-all duration-200 bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
              03
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              3. Smart Matching
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Nearby buyers enter their volume and purpose. Our engine matches them within 1-5 km to minimize transport cost.
            </p>
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-500 font-medium">
              Matches by Distance + Purpose + Price
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl border transition-all duration-200 bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm mb-3">
              04
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              4. Safe Reuse
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Treated water is reused for construction curing, road compaction, landscaping, and industries. Drinking water is preserved.
            </p>
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-500 font-medium">
              Saves potable freshwater & ₹ costs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
