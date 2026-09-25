import React, { useState } from 'react';
import { 
  TrendingUp, 
  Droplet, 
  Recycle, 
  Building, 
  Award, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight,
  Info
} from 'lucide-react';
import { TamilNaduImpact, CircularityScore, TNCity } from '../types';

interface ImpactDashboardViewProps {
  impact: TamilNaduImpact;
  selectedCity: TNCity;
  onCitySelect: (city: TNCity) => void;
}

export const ImpactDashboardView: React.FC<ImpactDashboardViewProps> = ({
  impact,
  selectedCity,
  onCitySelect,
}) => {
  const circularityScore: CircularityScore = {
    score: 78,
    level: 'Circular Champion Level II',
    waterReusedLiters: impact.totalWaterReusedLiters,
    reuseFrequency: impact.successfulTransactions,
    badges: [
      {
        id: 'b1',
        name: 'Water Saver',
        icon: '🏅',
        description: 'Reused more than 25,000 Litres of non-potable water in Tamil Nadu.',
        earned: true,
      },
      {
        id: 'b2',
        name: 'Circular Champion',
        icon: '♻️',
        description: 'Completed 10+ verified circular water trades with &lt; 5km transit.',
        earned: true,
      },
      {
        id: 'b3',
        name: 'Reuse Partner',
        icon: '💧',
        description: 'Linked NABL accredited laboratory test data and active digital water passport.',
        earned: true,
      },
      {
        id: 'b4',
        name: 'Sustainability Leader',
        icon: '🌱',
        description: 'Achieved circularity benchmark score of &ge; 75 / 100.',
        earned: true,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-5 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Our Tamil Nadu Water Impact
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time environmental and economic metrics across Salem, Chennai, Coimbatore, Madurai, and connected hubs.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Verified Regional Ledger</span>
        </div>
      </div>

      {/* 4 Animated Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>💧 Total Water Reused</span>
            <Droplet className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {impact.totalWaterReusedLiters.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 ml-1">Liters</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Diverted from urban sewer lines into beneficial local use.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>🚰 Freshwater Avoided</span>
            <Recycle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
              {impact.freshwaterAvoidedLiters.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1">Liters</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Municipal drinking water preserved in dams and reservoirs.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>♻️ Reuse Transactions</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {impact.successfulTransactions}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 ml-1">Trades</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            100% fulfilled via local short-haul tankers.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>📍 Cities Connected</span>
            <Building className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tracking-tight">
              {impact.citiesConnected}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1">Districts</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Salem, Chennai, Coimbatore, Tiruppur, Madurai, Trichy.
          </p>
        </div>
      </div>

      {/* Explanatory Quote Banner */}
      <div className="p-5 rounded-2xl bg-sky-50/80 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Why It Matters: </strong>
          Every successful reuse transaction helps create a more circular approach to water management in Tamil Nadu. By linking commercial generators directly with civil and landscape consumers, urban groundwater depletion and long-distance diesel tanker emissions are curtailed at the source.
        </p>
      </div>

      {/* Section 2: Gamification Circularity Score & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Card */}
        <div className="lg:col-span-5 p-6 rounded-3xl border transition-colors duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Water Circularity Score
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                {circularityScore.level}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-sky-600 dark:text-sky-400">
                {circularityScore.score}
              </span>
              <span className="text-lg font-bold text-slate-400">/ 100</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Based on monthly water reused, laboratory verification compliance, wastewater recovery efficiency, and proximity optimization.
            </p>

            <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                style={{ width: `${circularityScore.score}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            Next Level (Circular Master) unlocks at 85 / 100 points.
          </div>
        </div>

        {/* Right: Badges Grid */}
        <div className="lg:col-span-7 p-6 rounded-3xl border transition-colors duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Earned Sustainability Badges</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {circularityScore.badges.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl border transition-colors bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
              >
                <span className="text-2xl shrink-0">{b.icon}</span>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    {b.name}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Tamil Nadu City Reuse Breakdown Table */}
      <div className="p-6 rounded-3xl border transition-colors duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">
          Regional Tamil Nadu District Circular Performance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">District / City</th>
                <th className="py-3 px-4 text-right">Water Reused (Liters)</th>
                <th className="py-3 px-4 text-right">Completed Trades</th>
                <th className="py-3 px-4 text-right">Active Listings</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {impact.cityImpact.map((item) => (
                <tr key={item.city} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span>{item.city}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sky-600 dark:text-sky-400">
                    {item.waterReusedLiters.toLocaleString()} L
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    {item.transactionsCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    {item.activeListingCount}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onCitySelect(item.city)}
                      className="text-sky-600 dark:text-sky-400 hover:underline font-semibold text-[11px] flex items-center gap-1"
                    >
                      <span>Explore City</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
