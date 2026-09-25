import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  AlertTriangle, 
  Users, 
  Eye, 
  MapPin, 
  Droplet,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { WaterListing, WaterRequest, TamilNaduImpact } from '../types';

interface AdminConsoleViewProps {
  listings: WaterListing[];
  requests: WaterRequest[];
  impact: TamilNaduImpact;
  onVerifyListing: (listingId: string, status: 'verified' | 'suspended') => void;
  onOpenPassport: (listing: WaterListing) => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  listings,
  requests,
  impact,
  onVerifyListing,
  onOpenPassport,
}) => {
  const [activeSection, setActiveSection] = useState<'verifications' | 'listings' | 'transactions' | 'users'>('verifications');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingListings = listings.filter((l) => l.verificationStatus === 'pending');
  const verifiedListings = listings.filter((l) => l.verificationStatus === 'verified');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-5 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              State Regulator & Admin Console
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Supervise Tamil Nadu circular water operations, verify NABL laboratory certificates, and manage district compliance.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveSection('verifications')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSection === 'verifications'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Verifications ({pendingListings.length})
          </button>

          <button
            onClick={() => setActiveSection('listings')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSection === 'listings'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Listings ({listings.length})
          </button>

          <button
            onClick={() => setActiveSection('transactions')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSection === 'transactions'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Transactions ({requests.length})
          </button>
        </div>
      </div>

      {/* Admin KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Suppliers</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {listings.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Hotels, Mills, STPs</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Buyers</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            24 Sites
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Construction, Agri</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Pending Reviews</span>
          <span className={`text-xl font-bold font-mono mt-1 block ${pendingListings.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {pendingListings.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Lab test reports</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Active Listings</span>
          <span className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1 block">
            {verifiedListings.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Available for trade</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">TN Water Reused</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
            {(impact.totalWaterReusedLiters / 1000).toFixed(0)} kL
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">1,24,500 L total</span>
        </div>
      </div>

      {/* SECTION 1: VERIFICATION REQUESTS */}
      {activeSection === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Water Quality Verification Queue
            </h3>
            <span className="text-xs text-slate-500">
              Audit lab test parameters against non-potable thresholds
            </span>
          </div>

          {pendingListings.length === 0 ? (
            <div className="p-8 rounded-3xl border text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">All Reports Verified</h4>
              <p className="text-xs text-slate-500 mt-1">
                There are no pending lab certificates awaiting administrative audit right now.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((l) => (
                <div
                  key={l.id}
                  className="p-6 rounded-3xl border bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                          {l.passport.waterId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          PENDING APPROVAL
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {l.supplierName} ({l.city} - {l.area})
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Source: {l.source} · Available: {l.availableLiters.toLocaleString()} L · Price: ₹{l.pricePerThousandLiters}/kL
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenPassport(l)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Passport</span>
                      </button>

                      <button
                        onClick={() => onVerifyListing(l.id, 'verified')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Lab Data</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick parameter verification pills */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-center">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Reported pH</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{l.quality.ph}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Reported TDS</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{l.quality.tdsMgL} mg/L</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Reported Turbidity</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{l.quality.turbidityNTU} NTU</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: ALL LISTINGS */}
      {activeSection === 'listings' && (
        <div className="p-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              All Tamil Nadu Water Listings ({listings.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Water ID</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Available (L)</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">{l.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{l.supplierName}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{l.city} ({l.area})</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">{l.availableLiters.toLocaleString()} L</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{l.pricePerThousandLiters}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {l.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onOpenPassport(l)}
                        className="text-sky-600 dark:text-sky-400 hover:underline font-semibold text-xs"
                      >
                        Passport
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: TRANSACTIONS AUDIT */}
      {activeSection === 'transactions' && (
        <div className="p-6 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            State Circular Transactions Ledger ({requests.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Req #</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Buyer Site</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4 text-right">Cost (₹)</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{r.requestNumber}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{r.supplierName}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{r.buyerName} ({r.buyerCity})</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sky-600 dark:text-sky-400">{r.quantityLiters.toLocaleString()} L</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">₹{r.totalCostInr.toLocaleString()}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-emerald-600 dark:text-emerald-400">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
