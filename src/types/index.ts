export type UserRole = 'supplier' | 'buyer' | 'admin';

export type TNCity = 
  | 'Salem'
  | 'Chennai'
  | 'Coimbatore'
  | 'Madurai'
  | 'Tiruchirappalli'
  | 'Tiruppur'
  | 'Erode'
  | 'Vellore'
  | 'Thoothukudi';

export type WaterSourceType = 
  | 'STP Treated Water'
  | 'Greywater'
  | 'Industrial Treated Water'
  | 'Commercial HVAC Condensate'
  | 'Other';

export type SuitableUse = 
  | 'Construction'
  | 'Gardening'
  | 'Cleaning'
  | 'Industrial use'
  | 'Toilet flushing'
  | 'Dust Suppression'
  | 'Farming';

export type VerificationStatus = 'verified' | 'pending' | 'expired' | 'suspended';

export interface WaterQualityData {
  ph: number; // e.g. 7.2
  tdsMgL: number; // e.g. 420 mg/L
  turbidityNTU: number; // e.g. 2.1 NTU
  bodMgL?: number; // e.g. 6.5 mg/L
  residualChlorine?: number; // e.g. 0.8 ppm
  lastTestedDate: string;
  labReportName?: string;
  accreditedLab: string;
  reportCertificateNo: string;
}

export interface DigitalWaterPassport {
  waterId: string; // e.g. WHSL-10245
  source: WaterSourceType;
  quantityLiters: number;
  locationCity: TNCity;
  locationArea: string;
  qualityStatus: VerificationStatus;
  ph: number;
  tds: number;
  turbidity: number;
  suitableUses: SuitableUse[];
  lastUpdated: string;
  accreditedLab: string;
  labReportNo: string;
  hash: string;
  suitabilityDisclaimer: string;
}

export interface WaterListing {
  id: string;
  title: string;
  supplierName: string;
  supplierType: 'Hotel' | 'Apartment Complex' | 'Textile Industry' | 'Commercial Building' | 'Engineering College' | 'STP Facility';
  source: WaterSourceType;
  city: TNCity;
  area: string;
  lat: number;
  lng: number;
  availableLiters: number;
  dailyGenerationLiters: number;
  pricePerThousandLiters: number; // in ₹ INR per 1,000 L
  suitableUses: SuitableUse[];
  verificationStatus: VerificationStatus;
  quality: WaterQualityData;
  passport: DigitalWaterPassport;
  contactPerson: string;
  contactPhone: string;
  storageCapacityLiters: number;
  createdAt: string;
  image?: string;
  status: 'active' | 'reserved' | 'depleted' | 'suspended';
}

export interface BuyerProfile {
  id: string;
  name: string;
  buyerType: 'Construction Site' | 'Landscaping Company' | 'Farm / Nursery' | 'Industrial Facility' | 'Cleaning Service' | 'Municipal Project';
  city: TNCity;
  area: string;
  lat: number;
  lng: number;
  requiredDailyLiters: number;
  preferredUses: SuitableUse[];
  contactPhone: string;
}

export interface WaterRequest {
  id: string;
  requestNumber: string;
  listingId: string;
  supplierName: string;
  buyerName: string;
  buyerCity: TNCity;
  buyerArea: string;
  quantityLiters: number;
  purpose: SuitableUse;
  deliveryMode: 'Tanker Delivery' | 'Self Pickup';
  preferredDate: string;
  distanceKm: number;
  pricePerThousandLiters: number;
  waterCostInr: number;
  transportCostInr: number;
  totalCostInr: number;
  status: 'requested' | 'accepted' | 'scheduled' | 'delivered' | 'reused';
  timestamp: string;
  waterPassportId: string;
  freshwaterSavedLiters: number;
}

export interface SmartMatchResult {
  listing: WaterListing;
  matchScore: number; // 0 - 100
  distanceKm: number;
  estimatedCostInr: number;
  matchBreakdown: {
    suitability: boolean;
    distanceWeight: number;
    quantityWeight: number;
    priceWeight: number;
    availabilityWeight: number;
  };
  reasons: string[];
}

export interface CircularityScore {
  score: number; // 0 - 100
  level: string;
  waterReusedLiters: number;
  reuseFrequency: number;
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    earned: boolean;
  }[];
}

export interface TamilNaduImpact {
  totalWaterReusedLiters: number;
  freshwaterAvoidedLiters: number;
  successfulTransactions: number;
  citiesConnected: number;
  co2AvoidedKg: number;
  moneySavedBuyersInr: number;
  revenueGeneratedSuppliersInr: number;
  cityImpact: {
    city: TNCity;
    waterReusedLiters: number;
    transactionsCount: number;
    lat: number;
    lng: number;
    activeListingCount: number;
  }[];
}
