import React from 'react';
import { Sparkles, ArrowRight, MapPin, Droplet, TrendingUp, CheckCircle2 } from 'lucide-react';
import { TNCity, WaterListing, BuyerProfile } from '../types';

interface WaterOpportunityFinderProps {
  currentCity: TNCity;
  onViewMatch: (listing: WaterListing) => void;
  featuredListing?: WaterListing;
  buyer?: BuyerProfile;
}

export const WaterOpportunityFinder: React.FC<WaterOpportunityFinderProps> = ({
  currentCity,
  onViewMatch,
  featuredListing,
  buyer,
}) => {
  if (!featuredListing) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 border-amber-500/30 dark:from-amber-950/40 dark:via-sky-950/40 dark:to-emerald-950/30 dark:border-amber-500/40 shadow-md">
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Header Tag */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              AI Water Opportunity Finder
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Active Radius Analysis ({currentCity})
            </span>
          </div>

          {/* Opportunity Statement */}
          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
            <span className="text-sky-600 dark:text-sky-400 font-bold">
              {featuredListing.availableLiters.toLocaleString()} L
            </span>{' '}
            of reusable treated water is available within{' '}
            <span className="font-bold text-slate-900 dark:text-white">2.4 km</span> at{' '}
            <span className="underline decoration-sky-500/40">{featuredListing.supplierName}</span>.
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            A nearby construction project ({buyer?.name || 'Local Infrastructure Project'}) in {currentCity} currently needs approximately{' '}
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {buyer?.requiredDailyLiters.toLocaleString() || '6,000'} L
            </span>{' '}
            for civil curing. <span className="text-emerald-600 dark:text-emerald-400 font-semibold">High-affinity circular reuse opportunity detected (94% Match).</span>
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              {featuredListing.area}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              ₹{featuredListing.pricePerThousandLiters} / 1,000 L
            </span>
            <span>·</span>
            <span className="text-teal-700 dark:text-teal-300 font-medium">
              ✓ Tested pH {featuredListing.quality.ph} · TDS {featuredListing.quality.tdsMgL} mg/L
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center gap-3 pt-2 md:pt-0">
          <button
            onClick={() => onViewMatch(featuredListing)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 dark:bg-amber-400 dark:hover:bg-amber-300 font-bold"
          >
            <span>View & Request Match</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
