import React, { useState } from 'react';
import { MapPin, Navigation, Info, ShieldCheck, Droplet, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { TNCity, WaterListing, BuyerProfile } from '../types';
import { TN_CITY_COORDINATES } from '../data/tnMockData';
import { calculateDistanceKm } from '../utils/matching';

interface InteractiveTNMapProps {
  currentCity: TNCity;
  onCityChange: (city: TNCity) => void;
  listings: WaterListing[];
  buyer: BuyerProfile;
  radiusKm: number;
  onRadiusChange: (r: number) => void;
  onSelectListing: (listing: WaterListing) => void;
  onOpenPassport: (listing: WaterListing) => void;
}

export const InteractiveTNMap: React.FC<InteractiveTNMapProps> = ({
  currentCity,
  onCityChange,
  listings,
  buyer,
  radiusKm,
  onRadiusChange,
  onSelectListing,
  onOpenPassport,
}) => {
  const [selectedPin, setSelectedPin] = useState<WaterListing | null>(null);
  const [viewMode, setViewMode] = useState<'city-zoom' | 'state-overview'>('city-zoom');

  // Center coordinate is the active city or buyer coordinate
  const cityCenter = TN_CITY_COORDINATES[currentCity] || TN_CITY_COORDINATES['Salem'];

  // Dimensions of SVG map
  const svgWidth = 640;
  const svgHeight = 420;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Scale: 1 km = 24 SVG pixels on city-zoom, 1 km = 1.2 pixels on state-overview
  const scale = viewMode === 'city-zoom' ? 24 : 3.8;

  // Coordinate projection from GPS to SVG
  const projectCoords = (lat: number, lng: number) => {
    // 1 deg lat ~= 111 km, 1 deg lng at 11 deg lat ~= 109 km
    const dLatKm = (lat - cityCenter.lat) * 111;
    const dLngKm = (lng - cityCenter.lng) * 109;

    const x = centerX + dLngKm * scale;
    const y = centerY - dLatKm * scale; // invert Y for North up
    return { x, y };
  };

  const buyerPos = projectCoords(buyer.lat, buyer.lng);
  const radiusSvg = radiusKm * scale;

  return (
    <div className="rounded-3xl border transition-colors duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
      {/* Top Map Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Tamil Nadu Circular Water Proximity Map
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              {currentCity}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing verified suppliers, active buyers, and non-potable water flows in your district.
          </p>
        </div>

        {/* View Mode & Radius Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Radius pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="px-2 text-slate-400 font-medium hidden sm:inline">Radius:</span>
            {[1, 3, 5, 10].map((r) => (
              <button
                key={r}
                onClick={() => onRadiusChange(r)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  radiusKm === r
                    ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          {/* Zoom toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'city-zoom' ? 'state-overview' : 'city-zoom')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {viewMode === 'city-zoom' ? 'TN State View' : `${currentCity} Zoom`}
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 select-none">
        {/* Subtle grid lines */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0284c7 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />

        <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <defs>
            <radialGradient id="tnRadiusGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Active Search Radius Circle centered at Buyer location */}
          <circle
            cx={buyerPos.x}
            cy={buyerPos.y}
            r={radiusSvg}
            fill="url(#tnRadiusGradient)"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            className="transition-all duration-300"
          />

          {/* Radius text annotation */}
          <text
            x={buyerPos.x + radiusSvg + 6}
            y={buyerPos.y - 6}
            fill="#0284c7"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            {radiusKm} km radius
          </text>

          {/* Connecting dashed transit lines to in-range suppliers */}
          {listings.map((l) => {
            const coords = projectCoords(l.lat, l.lng);
            const dist = calculateDistanceKm(buyer.lat, buyer.lng, l.lat, l.lng);
            const inRange = dist <= radiusKm;

            if (!inRange) return null;

            return (
              <line
                key={`line-${l.id}`}
                x1={buyerPos.x}
                y1={buyerPos.y}
                x2={coords.x}
                y2={coords.y}
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.45"
              />
            );
          })}

          {/* Supplier Pins: 🔵 Verified Suppliers & 🟡 Pending Verification */}
          {listings.map((l) => {
            const { x, y } = projectCoords(l.lat, l.lng);
            const dist = calculateDistanceKm(buyer.lat, buyer.lng, l.lat, l.lng);
            const inRange = dist <= radiusKm;
            const isSelected = selectedPin?.id === l.id;
            const isPending = l.verificationStatus === 'pending';

            return (
              <g
                key={l.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setSelectedPin(l)}
              >
                {/* Pulsing ring for in-range suppliers */}
                {inRange && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 18 : 13}
                    fill={isPending ? '#eab308' : '#0284c7'}
                    opacity={isSelected ? 0.35 : 0.2}
                    className="animate-pulse-ring"
                  />
                )}

                {/* Pin Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 9 : 7}
                  fill={isPending ? '#eab308' : '#0284c7'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Drop icon inside pin */}
                <circle cx={x} cy={y} r="2" fill="#ffffff" />

                {/* Label pill on hover/selected */}
                <g transform={`translate(${x + 10}, ${y - 12})`}>
                  <rect
                    x="0"
                    y="0"
                    width="100"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    opacity="0.88"
                  />
                  <text
                    x="6"
                    y="12"
                    fill="#f8fafc"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {l.supplierName.slice(0, 12)} · {dist}km
                  </text>
                </g>
              </g>
            );
          })}

          {/* Buyer Target Location Pin: 🟢 */}
          <g>
            <circle
              cx={buyerPos.x}
              cy={buyerPos.y}
              r="14"
              fill="#10b981"
              opacity="0.25"
              className="animate-pulse"
            />
            <circle
              cx={buyerPos.x}
              cy={buyerPos.y}
              r="8"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx={buyerPos.x} cy={buyerPos.y} r="2.5" fill="#0f172a" />
            <g transform={`translate(${buyerPos.x - 55}, ${buyerPos.y + 16})`}>
              <rect x="0" y="0" width="110" height="18" rx="4" fill="#065f46" stroke="#34d399" strokeWidth="1" />
              <text x="55" y="12" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                🟢 YOUR DEMAND SITE
              </text>
            </g>
          </g>
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs flex flex-wrap items-center gap-4 shadow-md text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 dark:bg-sky-400 inline-block" />
            <span>🔵 Verified Suppliers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>🟢 Buyer Requirement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>🟡 Pending Verification</span>
          </div>
        </div>

        {/* Selected Pin Popup Drawer */}
        {selectedPin && (
          <div className="absolute top-3 right-3 max-w-xs bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-400/50 p-4 rounded-2xl shadow-2xl text-xs space-y-2 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedPin.supplierName}
                </h4>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  <MapPin className="w-3 h-3 text-sky-500" />
                  <span>{selectedPin.area} · {selectedPin.city}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-200 dark:border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400 block">Available Water</span>
                <span className="font-bold font-mono text-sky-600 dark:text-sky-400">
                  {selectedPin.availableLiters.toLocaleString()} L
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Price</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{selectedPin.pricePerThousandLiters} / 1,000 L
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Distance</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {calculateDistanceKm(buyer.lat, buyer.lng, selectedPin.lat, selectedPin.lng)} km
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ✓ {selectedPin.verificationStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onOpenPassport(selectedPin)}
                className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Passport</span>
              </button>

              <button
                onClick={() => onSelectListing(selectedPin)}
                className="flex-1 py-1.5 px-2 bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:text-slate-950 font-bold rounded-lg text-center transition-colors shadow-sm"
              >
                Request
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Major Tamil Nadu Cities Quick Selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Jump City:</span>
        {(['Salem', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruppur', 'Tiruchirappalli', 'Erode'] as TNCity[]).map((city) => (
          <button
            key={city}
            onClick={() => onCityChange(city)}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              currentCity === city
                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
