export const PRD_CONTENT = {
  title: "Product Requirement Document (PRD) — Water Has a Second Life MVP",
  version: "v1.0-MVP",
  date: "2026-09-25",
  author: "Chief Product Officer & Principal Systems Architect",
  summary: "A hyper-local B2B circular economy marketplace connecting urban wastewater generators (hotels, commercial towers, breweries, data centers) with verified non-potable water consumers (construction contractors, landscapers, municipal authorities).",
  
  problemStatement: [
    "Rapidly growing urban centers face severe freshwater depletion and municipal water tariffs that increase 8-15% annually.",
    "Simultaneously, commercial facilities (hotels, commercial towers, breweries, life science hubs) produce tens of thousands of liters of treated non-potable water daily via on-site sewage treatment plants (STPs) and membrane bioreactors (MBRs).",
    "Due to lack of transparent local demand discovery, verified quality accreditation, and automated short-haul transport logistics, over 85% of this high-grade treated water is dumped down municipal sewers as a disposal liability incurring municipal discharge tariffs.",
    "Non-potable users (ready-mix concrete plants, civil rail/metro earthworks, public parks) currently draw potable drinking water from municipal grids or pay high prices for long-haul diesel water tankers."
  ],

  valuePropositions: [
    {
      actor: "Generators (Suppliers)",
      value: "Monetize daily wastewater discharge (~$1.50 - $2.50 / kL), eliminate municipal sewer surcharge penalties, and document Scope 3 ESG circular resource metrics."
    },
    {
      actor: "Buyers (Consumers)",
      value: "Cut non-potable water procurement costs by 40-60% compared to municipal tap water, secure reliable hyper-local supply within a <5 km radius, and verify compliance with regional building standards."
    },
    {
      actor: "Municipal Regulators & Society",
      value: "Relieve stress on urban freshwater reservoirs, prevent sewer network overload during peak hours, and slash trucking emissions through algorithmic proximity matching."
    }
  ],

  waterGradesSpecification: [
    {
      grade: "Tier 1: Advanced Reclaimed Water (MBR / RO / UV)",
      parameters: "pH: 6.5–8.5, Turbidity: < 2 NTU, TDS: < 600 ppm, BOD: < 5 mg/L, E. coli: 0 CFU/100mL, Residual Chlorine: 0.5–2.0 ppm",
      approvedUses: "HVAC cooling tower makeup, dual-plumbing toilet flushing, commercial vehicle washing, botanical conservatories, dust suppression near public pedestrian zones."
    },
    {
      grade: "Tier 2: Secondary Clarified Reclaimed Water (UF / Sand Filter)",
      parameters: "pH: 6.0–9.0, Turbidity: < 5 NTU, TDS: < 1200 ppm, BOD: < 10 mg/L, E. coli: 0 CFU/100mL",
      approvedUses: "Urban park and median landscaping, golf course irrigation, construction soil compaction, perimeter dust mitigation."
    },
    {
      grade: "Tier 3: Industrial Utility Water (Activated Sludge)",
      parameters: "pH: 6.0–9.0, Turbidity: < 15 NTU, TDS: < 2000 ppm, BOD: < 30 mg/L, E. coli: < 100 CFU/100mL",
      approvedUses: "Heavy civil construction, concrete batching, subsurface deep foundation drilling, industrial equipment washing."
    }
  ],

  functionalRequirements: [
    {
      id: "FR-01",
      name: "Geo-Spatial Proximity Matching Engine",
      description: "Match active listings with buyer demand within a configurable tight radius (< 5 km default, up to 15 km) using PostGIS ST_DWithin and ST_Distance to minimize transport emissions and cost."
    },
    {
      id: "FR-02",
      name: "Quality Verification & Telemetry Ingestion",
      description: "Dual-layer quality gate requiring: (1) upload of accredited laboratory test certificates (ISO 17025) verified by platform compliance, and (2) live simulated IoT telemetry (pH, turbidity NTU, TDS ppm, flow rate)."
    },
    {
      id: "FR-03",
      name: "Dynamic Pricing & Logistics Calculator",
      description: "Real-time calculation combining base water volume rate + flat truck dispatch fee + per-km haulage fee + platform service fee, benchmarked against local municipal tap water tariffs to display instant net savings."
    },
    {
      id: "FR-04",
      name: "Real-Time Transaction & Dispatch Management",
      description: "Order booking workflow with tanker assignment, delivery scheduling, live status transitions (pending, scheduled, in-transit, delivered), and cryptographic batch verification hash."
    },
    {
      id: "FR-05",
      name: "ESG & Carbon/Water Offset Accounting",
      description: "Automatic generation of Scope 3 Water Stewardship certificates with volume preserved, carbon emissions avoided vs municipal grid/long-haul trucking, and printable compliance audits."
    }
  ]
};

export const POSTGIS_SCHEMA_SQL = `-- =========================================================================
-- WATER HAS A SECOND LIFE - DATABASE SCHEMA (PostgreSQL 15+ & PostGIS 3.3+)
-- =========================================================================

-- Enable PostGIS spatial extension for geospatial indices and calculations
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. USERS & ORGANIZATIONS TABLE
CREATE TYPE user_role_enum AS ENUM ('generator', 'buyer', 'regulator', 'logistics_operator', 'admin');
CREATE TYPE org_type_enum AS ENUM (
  'hospitality', 'commercial_real_estate', 'industrial_manufacturing', 
  'beverage_brewery', 'healthcare_campus', 'construction_contractor', 
  'landscaping_firm', 'municipal_authority', 'ready_mix_concrete'
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    tax_identifier VARCHAR(64) UNIQUE NOT NULL,
    org_type org_type_enum NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(32) NOT NULL,
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(3) DEFAULT 'USA',
    -- PostGIS geography column (SRID 4326 for WGS 84 GPS coordinates)
    geom GEOGRAPHY(Point, 4326) NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index on organization location
CREATE INDEX idx_organizations_geom ON organizations USING GIST (geom);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL,
    hashed_password TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WATER GRADES & STANDARDS
CREATE TYPE water_grade_enum AS ENUM ('Tier 1', 'Tier 2', 'Tier 3');
CREATE TYPE treatment_tech_enum AS ENUM (
  'mbr_membrane_bioreactor', 'ro_uv_polishing', 
  'activated_sludge_sand_filter', 'ultrafiltration', 'ozonation'
);

-- 3. WATER LISTINGS TABLE (Available inventory from Generators)
CREATE TYPE listing_status_enum AS ENUM ('draft', 'pending_lab_review', 'active', 'reserved', 'depleted', 'suspended');

CREATE TABLE water_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generator_org_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(200) NOT NULL,
    grade water_grade_enum NOT NULL,
    treatment_tech treatment_tech_enum NOT NULL,
    water_source_description VARCHAR(255) NOT NULL,
    
    -- Volumetrics in kiloLiters (1 kL = 1 m³ = 1,000 Liters)
    available_volume_kl NUMERIC(10, 2) NOT NULL CHECK (available_volume_kl >= 0),
    daily_production_rate_kl NUMERIC(10, 2) NOT NULL CHECK (daily_production_rate_kl >= 0),
    min_order_kl NUMERIC(8, 2) DEFAULT 5.0 CHECK (min_order_kl > 0),
    max_order_kl NUMERIC(8, 2) NOT NULL,
    storage_capacity_kl NUMERIC(10, 2) NOT NULL,
    
    -- Commercial terms ($/kL)
    price_per_kl NUMERIC(8, 2) NOT NULL CHECK (price_per_kl > 0),
    pickup_tanker_compatible BOOLEAN DEFAULT TRUE,
    direct_pipeline_compatible BOOLEAN DEFAULT FALSE,
    
    -- Spatial location of the loading bay
    loading_bay_geom GEOGRAPHY(Point, 4326) NOT NULL,
    
    status listing_status_enum DEFAULT 'pending_lab_review',
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_water_listings_geom ON water_listings USING GIST (loading_bay_geom);
CREATE INDEX idx_water_listings_status ON water_listings(status);
CREATE INDEX idx_water_listings_grade ON water_listings(grade);

-- 4. LAB ACCREDITATION & QUALITY VERIFICATION
CREATE TYPE lab_compliance_status_enum AS ENUM ('submitted', 'approved', 'rejected', 'expired');

CREATE TABLE lab_test_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES water_listings(id) ON DELETE CASCADE,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    testing_laboratory_name VARCHAR(255) NOT NULL,
    laboratory_accreditation_id VARCHAR(100) NOT NULL,
    sample_collected_at TIMESTAMPTZ NOT NULL,
    analysis_completed_at TIMESTAMPTZ NOT NULL,
    
    -- Water physicochemical parameters
    ph NUMERIC(4, 2) NOT NULL CHECK (ph BETWEEN 0 AND 14),
    turbidity_ntu NUMERIC(6, 2) NOT NULL CHECK (turbidity_ntu >= 0),
    tds_ppm NUMERIC(8, 2) NOT NULL CHECK (tds_ppm >= 0),
    bod_mg_l NUMERIC(6, 2) NOT NULL,
    cod_mg_l NUMERIC(6, 2) NOT NULL,
    ecoli_cfu_per_100ml INT NOT NULL DEFAULT 0,
    residual_chlorine_ppm NUMERIC(4, 2),
    
    verified_by_regulator_id UUID REFERENCES users(id),
    verification_status lab_compliance_status_enum DEFAULT 'submitted',
    verification_notes TEXT,
    document_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REAL-TIME IOT SENSOR TELEMETRY STREAM
CREATE TABLE iot_sensor_telemetry (
    id BIGSERIAL PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES water_listings(id) ON DELETE CASCADE,
    sensor_device_id VARCHAR(64) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ph NUMERIC(4, 2) NOT NULL,
    turbidity_ntu NUMERIC(6, 2) NOT NULL,
    tds_ppm NUMERIC(8, 2) NOT NULL,
    flow_rate_lpm NUMERIC(8, 2) NOT NULL,
    tank_level_pct NUMERIC(5, 2) NOT NULL,
    battery_level_pct NUMERIC(5, 2),
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_reason VARCHAR(255)
);

CREATE INDEX idx_iot_telemetry_listing_time ON iot_sensor_telemetry(listing_id, recorded_at DESC);

-- 6. TRANSACTIONS & LOGISTICS DISPATCH
CREATE TYPE order_status_enum AS ENUM (
  'pending_generator_accept', 'confirmed', 'tanker_dispatched', 
  'loaded_at_facility', 'in_transit', 'delivered', 'cancelled', 'disputed'
);

CREATE TABLE water_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_reference VARCHAR(32) UNIQUE NOT NULL,
    listing_id UUID NOT NULL REFERENCES water_listings(id),
    buyer_org_id UUID NOT NULL REFERENCES organizations(id),
    generator_org_id UUID NOT NULL REFERENCES organizations(id),
    
    volume_kl NUMERIC(8, 2) NOT NULL CHECK (volume_kl > 0),
    water_rate_per_kl NUMERIC(8, 2) NOT NULL,
    water_subtotal NUMERIC(10, 2) NOT NULL,
    
    -- PostGIS computed logistics metrics
    hauling_distance_km NUMERIC(6, 2) NOT NULL,
    transport_fee NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    
    -- Environmental impact accounting
    freshwater_saved_liters BIGINT NOT NULL,
    co2_avoided_kg NUMERIC(8, 2) NOT NULL,
    
    delivery_destination_geom GEOGRAPHY(Point, 4326) NOT NULL,
    delivery_destination_address TEXT NOT NULL,
    requested_delivery_time TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    
    status order_status_enum DEFAULT 'pending_generator_accept',
    tanker_id VARCHAR(64),
    driver_name VARCHAR(150),
    verification_hash VARCHAR(66) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer ON water_orders(buyer_org_id);
CREATE INDEX idx_orders_generator ON water_orders(generator_org_id);
CREATE INDEX idx_orders_status ON water_orders(status);
`;

export const ARCHITECTURE_EXPLANATION = `
### System Architecture Overview

The "Water Has a Second Life" platform is built on an event-driven, micro-service-ready architecture designed for low-latency geo-spatial querying, continuous IoT sensor stream verification, and auditable circular resource settlement.

1. **Client Tier (Presentation & Spatial Visualization)**:
   - Next.js / React 19 SPA with Tailwind CSS.
   - Interactive Geo-Spatial Radar & Map powered by PostGIS geo-coordinates, client-side vector renderers, and live radius projections (< 5 km).
   - Real-time IoT telemetry polling/WebSockets for continuous pH, Turbidity, and TDS health monitoring.

2. **API & Application Tier (Node.js / Express or FastAPI)**:
   - **Geo-Spatial Matching Engine**: Executes ST_DWithin and ST_Distance calculations against PostGIS spatial indices to filter suppliers within hyper-local radii and compute optimal transit corridors.
   - **Quality Verification Pipeline**: Automated validator testing incoming lab certificates and live sensor streams against Tier 1/2/3 regulatory parameters. If telemetry deviates from safety thresholds (e.g. turbidity > 2 NTU for Tier 1), listings are automatically suspended.
   - **Dynamic Pricing Engine**: Calculates split costs (water volume + base dispatch fee + distance-based haulage fee + platform escrow).
   - **ESG Ledger Service**: Calculates net liters of potable drinking water preserved and carbon emissions saved vs long-haul trucking.

3. **Data Tier (PostgreSQL + PostGIS Extension)**:
   - Spatial indexing (GIST) on geography points for sub-millisecond proximity queries.
   - Time-series partitioning for high-frequency IoT sensor telemetry.
   - ACID-compliant transaction records with cryptographic verification hashes for corporate ESG auditing.
`;

export const STARTER_CODE_SNIPPETS = {
  geoSearchEndpoint: `// =========================================================================
// EXPRESS.JS + POSTGIS CORE GEO-MATCHING ENDPOINT (Node.js / TypeScript)
// =========================================================================
import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * GET /api/listings/geo-search
 * Finds active water listings within a specified geographic radius (meters)
 * Calculates precise transport distance and hauling fee.
 */
router.get('/geo-search', async (req: Request, res: Response) => {
  try {
    const { 
      buyerLat, 
      buyerLng, 
      radiusKm = 5, 
      grade, 
      minVolumeKL = 5 
    } = req.query;

    if (!buyerLat || !buyerLng) {
      return res.status(400).json({ error: 'buyerLat and buyerLng coordinates are required.' });
    }

    const radiusMeters = Number(radiusKm) * 1000;
    const buyerPointWKT = \`SRID=4326;POINT(\${Number(buyerLng)} \${Number(buyerLat)})\`;

    // SQL utilizes PostGIS ST_DWithin on the spatial GIST index
    // and ST_Distance to compute exact driving/straight-line distance in kilometers
    let query = \`
      SELECT 
        l.id,
        l.title,
        l.grade,
        l.treatment_tech,
        l.price_per_kl,
        l.available_volume_kl,
        o.legal_name AS generator_name,
        o.street_address,
        ST_Y(l.loading_bay_geom::geometry) AS lat,
        ST_X(l.loading_bay_geom::geometry) AS lng,
        ROUND((ST_Distance(l.loading_bay_geom, ST_GeogFromText($1)) / 1000.0)::numeric, 2) AS distance_km,
        -- Haulage logistics formula: $25 base dispatch + $2.40 per km
        ROUND((25.0 + (ST_Distance(l.loading_bay_geom, ST_GeogFromText($1)) / 1000.0 * 2.40))::numeric, 2) AS transport_fee,
        r.ph AS verified_ph,
        r.turbidity_ntu AS verified_turbidity,
        r.tds_ppm AS verified_tds,
        r.certificate_number
      FROM water_listings l
      JOIN organizations o ON l.generator_org_id = o.id
      LEFT JOIN lab_test_reports r ON r.listing_id = l.id AND r.verification_status = 'approved'
      WHERE l.status = 'active'
        AND l.available_volume_kl >= $2
        AND ST_DWithin(l.loading_bay_geom, ST_GeogFromText($1), $3)
    \`;

    const queryParams: any[] = [buyerPointWKT, minVolumeKL, radiusMeters];

    if (grade && grade !== 'ALL') {
      queryParams.push(grade);
      query += \` AND l.grade = $\${queryParams.length}\`;
    }

    query += \` ORDER BY distance_km ASC LIMIT 50;\`;

    const { rows } = await pool.query(query, queryParams);
    
    return res.json({
      query: { buyerLat, buyerLng, radiusKm, grade, resultsCount: rows.length },
      listings: rows
    });
  } catch (err: any) {
    console.error('Error during geospatial search:', err);
    return res.status(500).json({ error: 'Internal server error executing geospatial match.' });
  }
});

export default router;`,

  iotIngestionWorker: `// =========================================================================
// REAL-TIME IOT TELEMETRY INGESTION & COMPLIANCE GUARD (TypeScript)
// =========================================================================
interface TelemetryPacket {
  listingId: string;
  sensorDeviceId: string;
  timestamp: string;
  ph: number;
  turbidityNTU: number;
  tdsPpm: number;
  flowRateLpm: number;
}

export async function processIoTTelemetry(packet: TelemetryPacket, db: any) {
  // 1. Fetch listing's required quality grade
  const listing = await db.query(
    'SELECT grade, status FROM water_listings WHERE id = $1',
    [packet.listingId]
  );
  
  if (!listing.rows.length) throw new Error('Listing not found');
  const { grade, status } = listing.rows[0];

  // 2. Automated Rule Guard for Water Safety Limits
  let isAnomaly = false;
  let anomalyReason = '';

  if (grade === 'Tier 1' && (packet.turbidityNTU > 2.0 || packet.ph < 6.5 || packet.ph > 8.5)) {
    isAnomaly = true;
    anomalyReason = \`Tier 1 breach: Turbidity \${packet.turbidityNTU} NTU (max 2.0) or pH \${packet.ph} out of bounds (6.5-8.5)\`;
  } else if (grade === 'Tier 2' && (packet.turbidityNTU > 5.0 || packet.tdsPpm > 1200)) {
    isAnomaly = true;
    anomalyReason = \`Tier 2 breach: Turbidity \${packet.turbidityNTU} NTU (max 5.0) or TDS \${packet.tdsPpm} ppm (max 1200)\`;
  }

  // 3. Save telemetry record
  await db.query(
    \`INSERT INTO iot_sensor_telemetry 
     (listing_id, sensor_device_id, ph, turbidity_ntu, tds_ppm, flow_rate_lpm, is_anomaly, anomaly_reason)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\`,
    [packet.listingId, packet.sensorDeviceId, packet.ph, packet.turbidityNTU, packet.tdsPpm, packet.flowRateLpm, isAnomaly, anomalyReason]
  );

  // 4. Auto-quarantine listing if consecutive anomalies detected
  if (isAnomaly && status === 'active') {
    await db.query(
      "UPDATE water_listings SET status = 'suspended' WHERE id = $1",
      [packet.listingId]
    );
    console.warn(\`Listing \${packet.listingId} auto-suspended due to sensor anomaly: \${anomalyReason}\`);
  }
}`
};
