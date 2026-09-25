import { WaterListing, SuitableUse, SmartMatchResult } from '../types';

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

export function calculateLogisticsPriceInr(
  quantityLiters: number,
  distanceKm: number,
  pricePerThousandLiters: number
) {
  const waterCostInr = Math.round((quantityLiters / 1000) * pricePerThousandLiters);
  
  // Local Tamil Nadu water tanker pricing:
  // Base dispatch ₹350 + ₹40 per km for heavy 6,000-12,000 L tankers
  const baseDispatch = 350;
  const perKmRate = 40;
  const transportCostInr = Math.round(baseDispatch + distanceKm * perKmRate);
  
  const totalCostInr = waterCostInr + transportCostInr;

  // Comparison with municipal commercial tanker / drinking water rate (approx ₹1.10 - ₹1.50 per Liter = ₹1,100 - ₹1,500 per 1,000 L)
  const municipalDrinkingCost = Math.round((quantityLiters / 1000) * 1200);
  const savingsInr = Math.max(0, municipalDrinkingCost - totalCostInr);
  const savingsPercent = Math.round((savingsInr / municipalDrinkingCost) * 100);

  return {
    waterCostInr,
    transportCostInr,
    totalCostInr,
    municipalDrinkingCost,
    savingsInr,
    savingsPercent,
  };
}

export function calculateSmartMatch(
  listing: WaterListing,
  requiredLiters: number,
  requiredPurpose: SuitableUse,
  buyerLat: number,
  buyerLng: number
): SmartMatchResult {
  const distanceKm = calculateDistanceKm(buyerLat, buyerLng, listing.lat, listing.lng);
  const { totalCostInr } = calculateLogisticsPriceInr(requiredLiters, distanceKm, listing.pricePerThousandLiters);

  const isSuitable = listing.suitableUses.includes(requiredPurpose);
  
  // Weights:
  // Suitability: 35 pts
  let suitabilityScore = isSuitable ? 35 : 5;

  // Distance: 30 pts (Closer = better)
  let distanceScore = 0;
  if (distanceKm <= 1.5) distanceScore = 30;
  else if (distanceKm <= 3.5) distanceScore = 26;
  else if (distanceKm <= 5.0) distanceScore = 20;
  else if (distanceKm <= 10.0) distanceScore = 12;
  else distanceScore = 5;

  // Quantity: 20 pts
  let quantityScore = 0;
  if (listing.availableLiters >= requiredLiters * 1.5) quantityScore = 20;
  else if (listing.availableLiters >= requiredLiters) quantityScore = 17;
  else if (listing.availableLiters >= requiredLiters * 0.7) quantityScore = 10;
  else quantityScore = 5;

  // Price: 10 pts (Lower price per 1,000 L)
  let priceScore = 0;
  if (listing.pricePerThousandLiters <= 350) priceScore = 10;
  else if (listing.pricePerThousandLiters <= 420) priceScore = 8;
  else priceScore = 6;

  // Verification & Quality: 5 pts
  const verificationScore = listing.verificationStatus === 'verified' ? 5 : 2;

  const matchScore = Math.min(99, suitabilityScore + distanceScore + quantityScore + priceScore + verificationScore);

  const reasons: string[] = [];
  if (distanceKm <= 3.0) {
    reasons.push(`📍 Ultra-local: Only ${distanceKm} km away`);
  } else {
    reasons.push(`📍 ${distanceKm} km haulage`);
  }

  if (isSuitable) {
    reasons.push(`✓ Lab-certified for ${requiredPurpose}`);
  }

  if (listing.availableLiters >= requiredLiters) {
    reasons.push(`💧 Full volume (${listing.availableLiters.toLocaleString()} L ready)`);
  } else {
    reasons.push(`⚠️ Partial volume (${listing.availableLiters.toLocaleString()} L available)`);
  }

  reasons.push(`₹ Affordable: ₹${listing.pricePerThousandLiters} / 1,000 L`);

  return {
    listing,
    matchScore,
    distanceKm,
    estimatedCostInr: totalCostInr,
    matchBreakdown: {
      suitability: isSuitable,
      distanceWeight: distanceScore,
      quantityWeight: quantityScore,
      priceWeight: priceScore,
      availabilityWeight: verificationScore,
    },
    reasons,
  };
}
