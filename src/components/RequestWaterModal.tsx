import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Droplet, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { WaterListing, BuyerProfile, WaterRequest, SuitableUse } from '../types';
import { calculateDistanceKm, calculateLogisticsPriceInr } from '../utils/matching';

interface RequestWaterModalProps {
  listing: WaterListing | null;
  buyer: BuyerProfile;
  initialQuantity?: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (newReq: WaterRequest) => void;
}

export const RequestWaterModal: React.FC<RequestWaterModalProps> = ({
  listing,
  buyer,
  initialQuantity = 6000,
  isOpen,
  onClose,
  onSubmitRequest,
}) => {
  const [quantityLiters, setQuantityLiters] = useState<number>(initialQuantity);
  const [purpose, setPurpose] = useState<SuitableUse>(listing?.suitableUses[0] || 'Construction');
  const [deliveryMode, setDeliveryMode] = useState<'Tanker Delivery' | 'Self Pickup'>('Tanker Delivery');
  const [preferredDate, setPreferredDate] = useState<string>('2026-09-25 14:00');
  const [buyerArea, setBuyerArea] = useState<string>(buyer.area);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen || !listing) return null;

  const distanceKm = calculateDistanceKm(buyer.lat, buyer.lng, listing.lat, listing.lng);
  const pricing = calculateLogisticsPriceInr(quantityLiters, distanceKm, listing.pricePerThousandLiters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requestNumber = `REQ-TN-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newReq: WaterRequest = {
      id: `req-${Date.now()}`,
      requestNumber,
      listingId: listing.id,
      supplierName: listing.supplierName,
      buyerName: buyer.name,
      buyerCity: buyer.city,
      buyerArea,
      quantityLiters,
      purpose,
      deliveryMode,
      preferredDate,
      distanceKm,
      pricePerThousandLiters: listing.pricePerThousandLiters,
      waterCostInr: pricing.waterCostInr,
      transportCostInr: deliveryMode === 'Tanker Delivery' ? pricing.transportCostInr : 0,
      totalCostInr: deliveryMode === 'Tanker Delivery' ? pricing.totalCostInr : pricing.waterCostInr,
      status: 'requested',
      timestamp: new Date().toISOString(),
      waterPassportId: listing.passport.waterId,
      freshwaterSavedLiters: quantityLiters,
    };

    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitRequest(newReq);
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border transition-colors duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 block">
                Simple Water Request
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Request Water from {listing.supplierName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{listing.city} ({listing.area})</span>
                <span>·</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{distanceKm} km transit</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Quantity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Required Quantity (Liters)
                  </label>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                    {quantityLiters.toLocaleString()} L
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max={Math.min(30000, listing.availableLiters)}
                  step="500"
                  value={quantityLiters}
                  onChange={(e) => setQuantityLiters(Number(e.target.value))}
                  className="w-full accent-sky-600 dark:accent-sky-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>1,000 L</span>
                  <span>Available: {listing.availableLiters.toLocaleString()} L</span>
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Purpose of Reuse
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as SuitableUse)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                >
                  {listing.suitableUses.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Delivery or Self-Pickup */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Delivery Mode
                  </label>
                  <select
                    value={deliveryMode}
                    onChange={(e) => setDeliveryMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Tanker Delivery">Tanker Delivery</option>
                    <option value="Self Pickup">Self Pickup Tanker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Date & Time
                  </label>
                  <input
                    type="text"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    placeholder="e.g. Tomorrow 11:00 AM"
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Buyer Destination */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Drop-off Location / Site
                </label>
                <input
                  type="text"
                  value={buyerArea}
                  onChange={(e) => setBuyerArea(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Request Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Request Summary
                </span>

                <div className="space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Water:</span>
                    <span className="font-mono font-semibold">{quantityLiters.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier:</span>
                    <span className="font-medium truncate max-w-[220px]">{listing.supplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transit Distance:</span>
                    <span className="font-mono">{distanceKm} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Price:</span>
                    <span className="font-mono">₹{pricing.waterCostInr} (₹{listing.pricePerThousandLiters}/kL)</span>
                  </div>
                  {deliveryMode === 'Tanker Delivery' && (
                    <div className="flex justify-between">
                      <span>Tanker Transport:</span>
                      <span className="font-mono">₹{pricing.transportCostInr}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-sm">
                    <span className="text-slate-900 dark:text-white">Estimated Cost:</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400 text-base">
                      ₹{(deliveryMode === 'Tanker Delivery' ? pricing.totalCostInr : pricing.waterCostInr).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>vs Fresh Potable Tanker:</span>
                  <span>Save ~₹{pricing.savingsInr.toLocaleString()} ({pricing.savingsPercent}%)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Send Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Request Sent ✓
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your request for <span className="font-bold">{quantityLiters.toLocaleString()} L</span> has been routed directly to <span className="font-semibold">{listing.supplierName}</span>.
            </p>

            {/* Stepper Preview */}
            <div className="pt-4 max-w-sm mx-auto">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span className="text-sky-600 dark:text-sky-400 font-bold">1. Requested ✓</span>
                <span>2. Accepted</span>
                <span>3. Scheduled</span>
                <span>4. Delivered</span>
                <span>5. Reused</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
