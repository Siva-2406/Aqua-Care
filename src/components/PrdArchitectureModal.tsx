import React, { useState } from 'react';
import { 
  FileCode2, 
  Database, 
  GitBranch, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  CheckCircle2, 
  Layers, 
  Server, 
  Smartphone,
  Cpu
} from 'lucide-react';
import { 
  PRD_CONTENT, 
  POSTGIS_SCHEMA_SQL, 
  ARCHITECTURE_EXPLANATION, 
  STARTER_CODE_SNIPPETS 
} from '../data/prdArchitectureData';
import { WaterListing, BuyerProfile } from '../types';
import { calculateDistanceKm, calculateLogisticsPriceInr } from '../utils/matching';

interface PrdArchitectureModalProps {
  listings: WaterListing[];
  buyer: BuyerProfile;
}

export const PrdArchitectureModal: React.FC<PrdArchitectureModalProps> = ({
  listings,
  buyer,
}) => {
  const [activeTab, setActiveTab] = useState<'prd' | 'architecture' | 'schema' | 'code' | 'playground'>('prd');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Playground state
  const [selectedEndpoint, setSelectedEndpoint] = useState<'geoSearch' | 'createListing' | 'iotTelemetry'>('geoSearch');
  const [testRadius, setTestRadius] = useState<number>(5);
  const [testGrade, setTestGrade] = useState<string>('Construction');
  const [simulatedResponse, setSimulatedResponse] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const runSimulatedQuery = () => {
    setIsSimulating(true);
    setSimulatedResponse(null);

    setTimeout(() => {
      if (selectedEndpoint === 'geoSearch') {
        const matches = listings
          .filter(l => {
            const dist = calculateDistanceKm(buyer.lat, buyer.lng, l.lat, l.lng);
            return dist <= testRadius;
          })
          .map(l => {
            const dist = calculateDistanceKm(buyer.lat, buyer.lng, l.lat, l.lng);
            const pricing = calculateLogisticsPriceInr(6000, dist, l.pricePerThousandLiters);
            return {
              id: l.id,
              title: l.title,
              supplier_name: l.supplierName,
              source: l.source,
              city: l.city,
              area: l.area,
              price_per_1000L_inr: l.pricePerThousandLiters,
              available_volume_liters: l.availableLiters,
              distance_km: dist,
              transport_fee_inr: pricing.transportCostInr,
              total_estimated_inr: pricing.totalCostInr,
              ph: l.quality.ph,
              tds_mg_l: l.quality.tdsMgL,
              turbidity_ntu: l.quality.turbidityNTU,
              water_passport_id: l.passport.waterId,
              lab_certificate_no: l.quality.reportCertificateNo,
            };
          });

        setSimulatedResponse({
          status: 200,
          latency_ms: 14.8,
          postgis_engine: "PostgreSQL 15.4 / PostGIS 3.3.4 (ST_DWithin spatial index hit on Tamil Nadu coordinates)",
          query: {
            buyer_origin_wkt: `POINT(${buyer.lng} ${buyer.lat}) - ${buyer.city} (${buyer.area})`,
            radius_meters: testRadius * 1000,
            matches_count: matches.length,
          },
          results: matches,
        });
      } else if (selectedEndpoint === 'createListing') {
        setSimulatedResponse({
          status: 201,
          latency_ms: 24.1,
          message: "Water listing successfully registered into PostgreSQL with spatial GIST loading_bay_geom",
          listing_id: "wlst-uuid-2026-b4819a",
          status_lifecycle: "pending_lab_review",
          compliance_check: {
            ph_within_bounds: true,
            turbidity_within_bounds: true,
            lab_cert_registered: true,
          }
        });
      } else {
        setSimulatedResponse({
          status: 200,
          latency_ms: 8.2,
          packet_ingested: true,
          anomaly_detected: false,
          auto_interlock_engaged: false,
          current_readings: {
            sensor_id: "IOT-MBR-8841",
            ph: 7.24,
            turbidity_ntu: 0.82,
            tds_ppm: 342,
            flow_lpm: 185
          }
        });
      }
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Architecture, PRD & Engineering Specification
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete technical blueprint: Product Requirements Document, PostgreSQL+PostGIS DDL, and API source code.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('prd')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'prd'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            01. PRD Document
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'architecture'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            02. System Architecture
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'schema'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            03. PostGIS Schema DDL
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'code'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            04. Core API Backend
          </button>

          <button
            onClick={() => {
              setActiveTab('playground');
              if (!simulatedResponse) runSimulatedQuery();
            }}
            className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Live Query Runner
          </button>
        </div>
      </div>

      {/* 1. PRD TAB */}
      {activeTab === 'prd' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs uppercase font-mono tracking-wider text-teal-400 block font-semibold">
              Official PRD · Version {PRD_CONTENT.version}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {PRD_CONTENT.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {PRD_CONTENT.summary}
            </p>
          </div>

          {/* Problem Statement */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Problem Statement & Urban Context
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {PRD_CONTENT.problemStatement.map((prob, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <span>{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Value Propositions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Core Value Proposition Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRD_CONTENT.valuePropositions.map((vp, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-teal-400 block">{vp.actor}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{vp.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Water Quality Standards (Tier 1-3) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              3. Non-Potable Water Quality Standards (ISO 16075 & EPA Reclaimed Water)
            </h3>
            <div className="space-y-3">
              {PRD_CONTENT.waterGradesSpecification.map((spec, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-teal-300 text-sm">{spec.grade}</span>
                  </div>
                  <div className="text-slate-300 font-mono text-[11px] bg-slate-900/80 p-2 rounded border border-slate-800">
                    {spec.parameters}
                  </div>
                  <div className="text-slate-400 text-[11px] pt-1">
                    <span className="text-slate-300 font-semibold">Approved Reuse Applications: </span>
                    {spec.approvedUses}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Functional Requirements */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              4. Functional MVP Requirements
            </h3>
            <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              {PRD_CONTENT.functionalRequirements.map((fr) => (
                <div key={fr.id} className="p-4 flex items-start gap-4 text-xs">
                  <span className="font-mono font-bold text-teal-400 shrink-0">{fr.id}</span>
                  <div>
                    <span className="font-semibold text-white block">{fr.name}</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">{fr.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ARCHITECTURE TAB */}
      {activeTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">End-to-End System Architecture</h2>
            <p className="text-xs text-slate-400 mt-1">
              Microservice dataflow connecting Client SPA, Geospatial Matching Engine, IoT Telemetry Gateway, and PostGIS Database.
            </p>
          </div>

          {/* Interactive Visual Architecture Topology */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Layer 1: Client */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-teal-400 font-semibold">
                  <Smartphone className="w-4 h-4" />
                  <span>Client Tier</span>
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px]">
                  <li>• React 19 + Tailwind CSS</li>
                  <li>• Vector Radar Canvas Map</li>
                  <li>• Generator & Buyer Portals</li>
                  <li>• ESG Certificate Generator</li>
                </ul>
              </div>

              {/* Layer 2: API Gateway */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-semibold">
                  <Server className="w-4 h-4" />
                  <span>API Gateway Tier</span>
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px]">
                  <li>• Express.js / Node 22</li>
                  <li>• JWT Auth & RBAC Guard</li>
                  <li>• Dynamic Pricing Calculator</li>
                  <li>• Order Escrow & Booking</li>
                </ul>
              </div>

              {/* Layer 3: Engines */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  <Cpu className="w-4 h-4" />
                  <span>Real-Time Engines</span>
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px]">
                  <li>• PostGIS Proximity Engine</li>
                  <li>• ST_DWithin & ST_Distance</li>
                  <li>• IoT Ingestion Worker</li>
                  <li>• Auto-Quarantine Safety Interlock</li>
                </ul>
              </div>

              {/* Layer 4: Storage */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Database className="w-4 h-4" />
                  <span>Data & GIS Tier</span>
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px]">
                  <li>• PostgreSQL 15+ & PostGIS</li>
                  <li>• Spatial GIST Index on Points</li>
                  <li>• Timescale IoT Partitioning</li>
                  <li>• Cryptographic Audit Hashes</li>
                </ul>
              </div>
            </div>

            {/* Narrative Explanation */}
            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-300 space-y-3 leading-relaxed">
              <h4 className="font-semibold text-white">How the Quality & Geospatial Workflows Interact:</h4>
              <p>
                1. <strong>Generator Registration</strong>: Facilities register STP details and upload certified laboratory test results (ISO 17025). 
                The platform assigns a spatial GPS coordinate to their loading bay stored as <code className="text-teal-400 font-mono">GEOGRAPHY(Point, 4326)</code>.
              </p>
              <p>
                2. <strong>Continuous IoT Stream Telemetry</strong>: In-line digital probes (pH, Turbidity, TDS, flow meter) publish readings via MQTT/REST to 
                the ingestion worker. If turbidity breaches safe limits (&gt; 2.0 NTU for Tier 1), the listing is quarantined instantly to protect downstream buyers.
              </p>
              <p>
                3. <strong>Geospatial Query Execution</strong>: When a buyer requests water, the backend queries PostGIS using 
                <code className="text-teal-400 font-mono">ST_DWithin(loading_bay_geom, buyer_geom, radius_meters)</code> utilizing a spatial GIST index. 
                This limits transport distance strictly to &lt; 5 km, minimizing trucking emissions and logistics costs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. SCHEMA DDL TAB */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">PostgreSQL & PostGIS Database Schema (DDL)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Includes spatial geography types, GIST indexing, quality test tables, and transaction models.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(POSTGIS_SCHEMA_SQL, 'schema')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'schema' ? 'Copied SQL' : 'Copy DDL SQL'}
            </button>
          </div>

          <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto max-h-[550px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>{POSTGIS_SCHEMA_SQL}</code>
            </pre>
          </div>
        </div>
      )}

      {/* 4. CODE SNIPPETS TAB */}
      {activeTab === 'code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Core Backend Source Code</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-ready Express.js geospatial endpoint and real-time IoT compliance guard worker.
            </p>
          </div>

          {/* Snippet 1 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-teal-400 font-mono">
                1. /api/listings/geo-search (Express + PostGIS ST_DWithin)
              </span>
              <button
                onClick={() => copyToClipboard(STARTER_CODE_SNIPPETS.geoSearchEndpoint, 'snippet1')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1.5"
              >
                {copiedKey === 'snippet1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Code
              </button>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[380px]">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                <code>{STARTER_CODE_SNIPPETS.geoSearchEndpoint}</code>
              </pre>
            </div>
          </div>

          {/* Snippet 2 */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-teal-400 font-mono">
                2. Real-Time IoT Quality Guard Worker (TypeScript)
              </span>
              <button
                onClick={() => copyToClipboard(STARTER_CODE_SNIPPETS.iotIngestionWorker, 'snippet2')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1.5"
              >
                {copiedKey === 'snippet2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Code
              </button>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[380px]">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                <code>{STARTER_CODE_SNIPPETS.iotIngestionWorker}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 5. LIVE PLAYGROUND TAB */}
      {activeTab === 'playground' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Interactive PostGIS API Test Runner</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute live simulated calls against the PostGIS matching engine and inspect formatted response JSON.
            </p>
          </div>

          {/* Control Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="md:col-span-4">
              <label className="block text-slate-400 mb-1.5 font-medium">Endpoint to Execute</label>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs"
              >
                <option value="geoSearch">GET /api/listings/geo-search</option>
                <option value="createListing">POST /api/listings</option>
                <option value="iotTelemetry">POST /api/iot/telemetry</option>
              </select>
            </div>

            {selectedEndpoint === 'geoSearch' && (
              <>
                <div className="md:col-span-3">
                  <label className="block text-slate-400 mb-1.5 font-medium">Radius (km)</label>
                  <select
                    value={testRadius}
                    onChange={(e) => setTestRadius(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs"
                  >
                    <option value={2}>2.0 km (Tight)</option>
                    <option value={5}>5.0 km (Default &lt;5km)</option>
                    <option value={10}>10.0 km (Extended)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-slate-400 mb-1.5 font-medium">Quality Grade</label>
                  <select
                    value={testGrade}
                    onChange={(e) => setTestGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs"
                  >
                    <option value="ALL">All Grades</option>
                    <option value="Tier 1">Tier 1 (High Purity)</option>
                    <option value="Tier 2">Tier 2 (General Non-potable)</option>
                    <option value="Tier 3">Tier 3 (Industrial)</option>
                  </select>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <button
                onClick={runSimulatedQuery}
                disabled={isSimulating}
                className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                {isSimulating ? 'Querying...' : 'Send Request'}
              </button>
            </div>
          </div>

          {/* JSON Response Terminal */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span className="font-mono text-slate-300 font-semibold">PostgreSQL Server Response</span>
              </div>
              {simulatedResponse && (
                <span className="font-mono text-emerald-400 text-[11px]">
                  HTTP {simulatedResponse.status} OK · {simulatedResponse.latency_ms} ms
                </span>
              )}
            </div>

            <div className="overflow-x-auto max-h-[420px] bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <pre className="font-mono text-xs text-teal-300 leading-relaxed">
                <code>
                  {simulatedResponse 
                    ? JSON.stringify(simulatedResponse, null, 2) 
                    : '// Click "Send Request" to invoke query...'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
