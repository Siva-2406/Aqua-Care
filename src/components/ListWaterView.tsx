import React, { useState } from 'react';
import { 
  PlusCircle, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  Droplet, 
  AlertCircle, 
  Building2, 
  FileText,
  MapPin
} from 'lucide-react';
import { 
  WaterListing, 
  WaterSourceType, 
  SuitableUse, 
  TNCity, 
  VerificationStatus,
  DigitalWaterPassport 
} from '../types';
import { TN_CITY_COORDINATES } from '../data/tnMockData';

interface ListWaterViewProps {
  onAddListing: (newListing: WaterListing) => void;
  selectedCity: TNCity;
}

export const ListWaterView: React.FC<ListWaterViewProps> = ({
  onAddListing,
  selectedCity,
}) => {
  const [title, setTitle] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierType, setSupplierType] = useState<WaterListing['supplierType']>('Hotel');
  const [source, setSource] = useState<WaterSourceType>('STP Treated Water');
  const [city, setCity] = useState<TNCity>(selectedCity);
  const [area, setArea] = useState('');
  const [availableLiters, setAvailableLiters] = useState<number>(10000);
  const [dailyGenerationLiters, setDailyGenerationLiters] = useState<number>(12000);
  const [pricePerThousandLiters, setPricePerThousandLiters] = useState<number>(400);
  const [suitableUses, setSuitableUses] = useState<SuitableUse[]>(['Construction', 'Gardening', 'Cleaning']);
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Water Quality
  const [ph, setPh] = useState<number>(7.2);
  const [tds, setTds] = useState<number>(420);
  const [turbidity, setTurbidity] = useState<number>(2.1);
  const [labName, setLabName] = useState('TN Environmental Testing Lab (NABL Accredited)');
  const [certNo, setCertNo] = useState(`TN-LAB-${city.slice(0,3).toUpperCase()}-2026-90${Math.floor(10 + Math.random()*89)}`);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleSuitableUse = (use: SuitableUse) => {
    if (suitableUses.includes(use)) {
      setSuitableUses(suitableUses.filter((u) => u !== use));
    } else {
      setSuitableUses([...suitableUses, use]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cityCoords = TN_CITY_COORDINATES[city] || { lat: 11.6643, lng: 78.1460 };
    const waterId = `WHSL-${Math.floor(10000 + Math.random() * 90000)}`;

    const passport: DigitalWaterPassport = {
      waterId,
      source,
      quantityLiters: availableLiters,
      locationCity: city,
      locationArea: area || `${city} Central`,
      qualityStatus: 'verified',
      ph,
      tds,
      turbidity,
      suitableUses,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      accreditedLab: labName,
      labReportNo: certNo,
      hash: '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      suitabilityDisclaimer: 'Suitability depends on verified test data and applicable TNPCB non-potable reuse requirements. Not for direct human consumption.',
    };

    const newListing: WaterListing = {
      id: waterId,
      title: title || `${supplierName} ${source}`,
      supplierName,
      supplierType,
      source,
      city,
      area: area || `${city} Central`,
      lat: cityCoords.lat + (Math.random() * 0.02 - 0.01),
      lng: cityCoords.lng + (Math.random() * 0.02 - 0.01),
      availableLiters,
      dailyGenerationLiters,
      pricePerThousandLiters,
      suitableUses,
      verificationStatus: 'verified',
      quality: {
        ph,
        tdsMgL: tds,
        turbidityNTU: turbidity,
        lastTestedDate: '2026-09-24',
        accreditedLab: labName,
        reportCertificateNo: certNo,
        labReportName: 'Treated_Effluent_NABL_Report.pdf',
      },
      passport,
      contactPerson: contactPerson || 'Facility Operations Head',
      contactPhone: contactPhone || '+91 94440 00000',
      storageCapacityLiters: availableLiters * 2,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    onAddListing(newListing);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b pb-5 border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          List Your Treated Water
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Turn your daily treated wastewater into a monetized circular asset for local construction, landscaping, and industries.
        </p>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold block">Water Listing Published with Digital Passport!</span>
            Nearby buyers in {city} will now be able to discover and request your treated water.
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl border transition-colors duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        {/* Section 1: Facility Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>1. Organization & Facility Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Facility / Organization Name
              </label>
              <input
                type="text"
                placeholder="e.g. Salem Green Residency / Kovai Textile Park"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Facility Category
              </label>
              <select
                value={supplierType}
                onChange={(e) => setSupplierType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Hotel">Hotel & Hospitality Complex</option>
                <option value="Apartment Complex">Apartment Complex / Gated Community</option>
                <option value="Textile Industry">Textile / Garment Washing Unit</option>
                <option value="Commercial Building">Commercial IT Park / Mall</option>
                <option value="Engineering College">College / University Campus</option>
                <option value="STP Facility">Dedicated Municipal / Common STP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Water Source Type
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              >
                <option value="STP Treated Water">STP Treated Water</option>
                <option value="Greywater">Greywater (Bathing/Wash basin)</option>
                <option value="Industrial Treated Water">Industrial Treated Water (ETP)</option>
                <option value="Commercial HVAC Condensate">HVAC Cooling Condensate</option>
                <option value="Other">Other Permitted Non-potable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                City / District
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="Salem">Salem</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
                <option value="Tiruppur">Tiruppur</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
                <option value="Erode">Erode</option>
                <option value="Vellore">Vellore</option>
                <option value="Thoothukudi">Thoothukudi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Area / Landmark
              </label>
              <input
                type="text"
                placeholder="e.g. Five Roads / Peelamedu"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Quantity & Pricing */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            2. Available Volume & Expected Price
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Currently Available (Liters)
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={availableLiters}
                onChange={(e) => setAvailableLiters(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                = {(availableLiters / 1000).toFixed(1)} Kilolitres (kL)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Replenish Rate (L/day)
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={dailyGenerationLiters}
                onChange={(e) => setDailyGenerationLiters(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Expected Price (₹ / 1,000 L)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min="100"
                  max="1500"
                  step="10"
                  value={pricePerThousandLiters}
                  onChange={(e) => setPricePerThousandLiters(Number(e.target.value))}
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-sky-500"
                />
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
                Benchmark: ₹300 - ₹500 / kL in TN
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Suitable For */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            3. Suitable For (Check all that apply)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              'Construction',
              'Gardening',
              'Cleaning',
              'Industrial use',
              'Toilet flushing',
              'Dust Suppression',
              'Farming',
            ].map((use) => {
              const isChecked = suitableUses.includes(use as SuitableUse);
              return (
                <button
                  type="button"
                  key={use}
                  onClick={() => toggleSuitableUse(use as SuitableUse)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors flex items-center justify-between border ${
                    isChecked
                      ? 'bg-sky-50 dark:bg-sky-950/80 border-sky-400 text-sky-800 dark:text-sky-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span>{use}</span>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Water Quality & Lab Proof */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>4. Quality Data & Lab Test Report</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              ✓ NABL Ready
            </span>
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                pH Level (6.5 - 8.5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={ph}
                onChange={(e) => setPh(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                TDS (mg/L)
              </label>
              <input
                type="number"
                min="50"
                max="3000"
                value={tds}
                onChange={(e) => setTds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Turbidity (NTU)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="30"
                value={turbidity}
                onChange={(e) => setTurbidity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Accredited Testing Laboratory
              </label>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Test Certificate Reference No.
              </label>
              <input
                type="text"
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Regulatory Safe Harbor Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="text-[11px] leading-relaxed">
              <span className="font-bold">Safety & Regulatory Disclaimer: </span>
              Suitability depends strictly on verified laboratory test data and applicable Tamil Nadu Pollution Control Board (TNPCB) non-potable requirements. Water listed is intended exclusively for authorized non-drinking applications.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-all shadow-lg flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate Passport & Publish Listing</span>
          </button>
        </div>
      </form>
    </div>
  );
};
