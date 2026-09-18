import React from 'react';
import { Carpark } from '../types';
import { getAvailabilityStatus } from '../data/mockCarparks';
import {
  X,
  MapPin,
  Bookmark,
  Navigation,
  Clock,
  Shield,
  Zap,
  CheckCircle2,
  ExternalLink,
  Car,
  Bike,
  CreditCard,
  Timer
} from 'lucide-react';

interface CarparkDetailModalProps {
  carpark: Carpark | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onStartTimer: (carpark: Carpark) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  onClose,
  isSaved,
  onToggleSave,
  onStartTimer,
}) => {
  if (!carpark) return null;

  const status = getAvailabilityStatus(carpark.availableLots);
  const percentFilled = Math.min(
    100,
    Math.round(((carpark.totalLots - carpark.availableLots) / carpark.totalLots) * 100)
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${carpark.coordinates.lat},${carpark.coordinates.lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${carpark.coordinates.lat},${carpark.coordinates.lng}&navigate=yes`;

  return (
    <div
      id="carpark-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="carpark-detail-sheet"
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  carpark.agency === 'HDB'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : carpark.agency === 'URA'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {carpark.agency} Carpark
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Code: {carpark.carparkNumber}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {carpark.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin size={12} className="shrink-0 text-slate-400" />
              <span>{carpark.address}</span>
            </p>
          </div>

          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Live Lot Gauge Card */}
          <div className={`p-4 rounded-2xl border ${status.bg} ${status.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Real-Time Availability
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-3xl font-extrabold ${status.color}`}>
                    {carpark.availableLots}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    / {carpark.totalLots} total lots
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.border} ${status.color}`}
                >
                  <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
                  {status.label}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Updated {carpark.lastUpdated}
                </p>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-medium">
                <span>Total Occupancy</span>
                <span>{percentFilled}% full</span>
              </div>
              <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden border border-slate-200/50">
                <div
                  className={`h-full rounded-full ${
                    percentFilled > 90
                      ? 'bg-rose-500'
                      : percentFilled > 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
            </div>

            {/* Vehicle breakdown */}
            {carpark.lotBreakdown && (
              <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-medium">
                  <Car size={14} className="text-slate-500" />
                  <span>Cars: <strong>{carpark.lotBreakdown.cars}</strong> lots</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Bike size={14} className="text-slate-500" />
                  <span>Motorcycles: <strong>{carpark.lotBreakdown.motorcycles}</strong> lots</span>
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Parking Rates Table (Singapore Standard) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center justify-between">
              <span>Parking Rates & Charges</span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {carpark.rates.gracePeriodMins} Mins Grace Period
              </span>
            </h3>

            <div className="divide-y divide-slate-200 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Weekday Day / Peak</span>
                <span className="font-semibold text-slate-900 text-right">
                  {carpark.rates.weekdayPeak}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Weekday Evening / Off-Peak</span>
                <span className="font-semibold text-slate-900 text-right">
                  {carpark.rates.weekdayOffPeak}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Saturday</span>
                <span className="font-semibold text-slate-900 text-right">
                  {carpark.rates.saturday}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-600">Sunday & Public Holidays</span>
                <span className="font-semibold text-slate-900 text-right">
                  {carpark.rates.sundayHoliday}
                </span>
              </div>
            </div>
          </div>

          {/* Carpark Specs & Access */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block text-[11px]">Height Clearance</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {carpark.heightLimitM} Meters
              </span>
              <span className="text-[10px] text-slate-500">
                {carpark.heightLimitM >= 2.0 ? 'Suitable for SUVs' : 'Watch out for roof racks'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block text-[11px]">Gantry System</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {carpark.gantryType}
              </span>
              <span className="text-[10px] text-slate-500">
                IU / CashCard / FlashPay
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block text-[11px]">Shelter</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {carpark.isCovered ? 'Covered / Multi-Storey' : 'Open Air Surface'}
              </span>
              <span className="text-[10px] text-slate-500">
                {carpark.isCovered ? 'Rain sheltered' : 'Direct sunlight'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium block text-[11px]">EV Charging</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {carpark.hasEvCharging ? `${carpark.evChargersCount || 2} Chargers` : 'No Chargers'}
              </span>
              <span className="text-[10px] text-slate-500">
                {carpark.hasEvCharging ? 'Type 2 AC / CCS2 DC' : 'Nearby EV stations available'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onToggleSave}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark size={14} className={isSaved ? 'fill-amber-500 text-amber-500' : ''} />
              <span>{isSaved ? 'Bookmarked' : 'Save'}</span>
            </button>

            <button
              onClick={() => onStartTimer(carpark)}
              title="Set a parking duration timer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Timer size={14} className="text-emerald-600" />
              <span>Park Timer</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:flex-1">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Navigation size={14} />
              <span>Google Maps</span>
              <ExternalLink size={12} className="opacity-75" />
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Waze</span>
              <ExternalLink size={12} className="opacity-75" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
