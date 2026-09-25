import React from 'react';
import { 
  ClipboardList, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Recycle, 
  ArrowRight, 
  FileText,
  Building,
  Eye,
  AlertCircle
} from 'lucide-react';
import { WaterRequest, UserRole } from '../types';

interface RequestsTrackerViewProps {
  requests: WaterRequest[];
  userRole: UserRole;
  onUpdateStatus: (reqId: string, nextStatus: WaterRequest['status']) => void;
  onOpenPassportById?: (passportId: string) => void;
}

export const RequestsTrackerView: React.FC<RequestsTrackerViewProps> = ({
  requests,
  userRole,
  onUpdateStatus,
  onOpenPassportById,
}) => {
  const statusSteps: WaterRequest['status'][] = [
    'requested',
    'accepted',
    'scheduled',
    'delivered',
    'reused',
  ];

  const getStatusIndex = (st: WaterRequest['status']) => statusSteps.indexOf(st);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-5 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Water Requests & Reuse Tracking
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track real-time lifecycle: <span className="font-semibold text-slate-700 dark:text-slate-300">Requested → Accepted → Scheduled → Delivered → Reused</span>.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
          Active Orders: <span className="font-bold text-sky-600 dark:text-sky-400">{requests.length}</span>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => {
          const currentStepIdx = getStatusIndex(req.status);

          return (
            <div
              key={req.id}
              className="p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md space-y-5"
            >
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                      {req.requestNumber}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {req.purpose}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Passport: {req.waterPassportId}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {req.quantityLiters.toLocaleString()} L from {req.supplierName}
                  </h3>
                </div>

                <div className="sm:text-right">
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                    ₹{req.totalCostInr.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {req.deliveryMode} · {req.distanceKm} km
                  </span>
                </div>
              </div>

              {/* Visual 5-Step Progress Bar */}
              <div className="py-2">
                <div className="grid grid-cols-5 gap-2">
                  {statusSteps.map((step, sIdx) => {
                    const isCompleted = sIdx <= currentStepIdx;
                    const isCurrent = sIdx === currentStepIdx;

                    return (
                      <div key={step} className="space-y-1.5 text-center">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted
                              ? 'bg-sky-600 dark:bg-sky-500'
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        />
                        <span
                          className={`text-[11px] block capitalize font-medium ${
                            isCurrent
                              ? 'text-sky-600 dark:text-sky-400 font-bold'
                              : isCompleted
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Metadata and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    Drop-off: <strong className="text-slate-700 dark:text-slate-300">{req.buyerArea}</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Schedule: <strong className="text-slate-700 dark:text-slate-300">{req.preferredDate}</strong>
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    🌱 {req.freshwaterSavedLiters.toLocaleString()} L drinking water saved
                  </span>
                </div>

                {/* Workflow Progression Button for demo */}
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenPassportById && (
                    <button
                      onClick={() => onOpenPassportById(req.waterPassportId)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Passport</span>
                    </button>
                  )}

                  {req.status === 'requested' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'accepted')}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:text-slate-950 font-bold text-xs transition-colors"
                    >
                      Accept Request
                    </button>
                  )}

                  {req.status === 'accepted' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'scheduled')}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Schedule Tanker</span>
                    </button>
                  )}

                  {req.status === 'scheduled' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'delivered')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Delivery</span>
                    </button>
                  )}

                  {req.status === 'delivered' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'reused')}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Recycle className="w-3.5 h-3.5" />
                      <span>Mark as Reused</span>
                    </button>
                  )}

                  {req.status === 'reused' && (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Successfully Reused</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
