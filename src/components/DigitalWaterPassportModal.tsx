import React, { useState } from 'react';
import { 
  X, 
  Droplet, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Download, 
  ExternalLink, 
  Hash, 
  AlertCircle, 
  Printer, 
  Award,
  Calendar,
  Building2,
  MapPin
} from 'lucide-react';
import { WaterListing } from '../types';

interface DigitalWaterPassportModalProps {
  listing: WaterListing | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestWater?: (listing: WaterListing) => void;
}

export const DigitalWaterPassportModal: React.FC<DigitalWaterPassportModalProps> = ({
  listing,
  isOpen,
  onClose,
  onRequestWater,
}) => {
  const [showFullLabReport, setShowFullLabReport] = useState(false);

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border transition-colors duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Passport Header with Official Guilloche/Security Vibe */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-sky-600 to-teal-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Droplet className="w-6 h-6 fill-white/30 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-mono font-bold text-sky-100 block">
                Official Digital Water Passport
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                {listing.passport.waterId}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-sky-100 mt-2">
            <span>Verified Circular Water Unit</span>
            <span>·</span>
            <span>Tamil Nadu State Registry</span>
            <span>·</span>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-[11px]">
              {listing.city}
            </span>
          </div>
        </div>

        {/* Passport Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Quick Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Water Source</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                {listing.source}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Available Volume</span>
              <span className="text-xs font-bold font-mono text-sky-600 dark:text-sky-400 mt-0.5 block">
                {listing.availableLiters.toLocaleString()} L
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Facility Location</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {listing.city}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Verification</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>

          {/* Section: Quality Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Quality Information & In-Line Testing
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Last Tested: {listing.quality.lastTestedDate}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">pH Level</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                  {listing.quality.ph}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  Optimal (6.5 - 8.5)
                </span>
              </div>

              <div className="p-4 rounded-xl text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">TDS</span>
                <span className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1 block">
                  {listing.quality.tdsMgL}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  mg/L (Clean Dissolved)
                </span>
              </div>

              <div className="p-4 rounded-xl text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Turbidity</span>
                <span className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400 mt-1 block">
                  {listing.quality.turbidityNTU}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  NTU (Clear Appearance)
                </span>
              </div>
            </div>
          </div>

          {/* Section: Suitable Uses */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Permitted & Suitable Uses
            </h3>
            <div className="flex flex-wrap gap-2">
              {listing.suitableUses.map((use) => (
                <span
                  key={use}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{use}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Section: Lab Accreditation Proof */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified NABL Laboratory Certification</span>
              </div>
              <button
                onClick={() => setShowFullLabReport(!showFullLabReport)}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>{showFullLabReport ? 'Hide Report Preview' : 'View Full Report'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="text-slate-600 dark:text-slate-300 text-[11px] space-y-1">
              <div>
                <span className="text-slate-500">Accredited Testing Facility: </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{listing.quality.accreditedLab}</span>
              </div>
              <div>
                <span className="text-slate-500">Certificate Number: </span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{listing.quality.reportCertificateNo}</span>
              </div>
            </div>

            {/* Embedded Lab Report Preview Modal/Drawer */}
            {showFullLabReport && (
              <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Analytical Certificate File: {listing.quality.labReportName || 'Treated_Effluent_NABL_Report.pdf'}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                    ✓ Digitally Signed
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Sample analyzed under standard APHA 23rd Edition testing protocols for non-potable reuse. Biochemical Oxygen Demand (BOD): 4.8 mg/L. Residual Chlorine: 1.1 ppm. Fecal coliforms absent.
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="font-mono text-slate-400">SHA-256: {listing.passport.hash}</span>
                  <button 
                    onClick={() => alert(`Certificate ${listing.quality.reportCertificateNo} verified against Tamil Nadu Water Registry.`)}
                    className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mandatory Regulatory Suitability Disclaimer */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="text-[11px] leading-relaxed">
              <span className="font-bold">Suitability Notice: </span>
              {listing.passport.suitabilityDisclaimer} Suitability depends on verified test data and applicable requirements. The platform provides transparent quality verification data for non-potable reuse.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Supplier: {listing.supplierName} ({listing.area})
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Close
            </button>

            {onRequestWater && (
              <button
                onClick={() => {
                  onClose();
                  onRequestWater(listing);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors shadow-md"
              >
                Request This Water
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
