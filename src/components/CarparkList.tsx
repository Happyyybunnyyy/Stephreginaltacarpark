import React from 'react';
import { Carpark } from '../types';
import { getAvailabilityStatus } from '../data/mockCarparks';
import {
  Bookmark,
  Zap,
  Navigation,
  AlertTriangle,
  Clock,
  Shield,
  SearchX,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CarparkListProps {
  carparks: Carpark[];
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDetail: (carpark: Carpark) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (carpark: Carpark) => void;
  onResetFilters: () => void;
  searchQuery: string;
}

export const CarparkList: React.FC<CarparkListProps> = ({
  carparks,
  onSelectCarpark,
  onOpenDetail,
  isSaved,
  onToggleSave,
  onResetFilters,
  searchQuery,
}) => {
  // Empty State / Error Recovery (Heuristic 9)
  if (carparks.length === 0) {
    return (
      <div
        id="carpark-list-empty-state"
        className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-4 shadow-xs"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3.5 border border-amber-200">
          <SearchX size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          No carparks found
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          {searchQuery
            ? `We couldn't find any carparks matching "${searchQuery}". Check for typos or broaden your filter options.`
            : 'Your active filters are too restrictive. Try relaxing your capacity or vehicle constraints.'}
        </p>

        {/* Actionable Error Recovery Button (Heuristic 9 & Heuristic 3) */}
        <div className="flex items-center justify-center gap-2.5 mt-4">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="nearby-carparks-list" className="space-y-3 pb-8">
      {carparks.map((carpark) => {
        const status = getAvailabilityStatus(carpark.availableLots);
        const percentFilled = Math.min(
          100,
          Math.round(((carpark.totalLots - carpark.availableLots) / carpark.totalLots) * 100)
        );
        const isNearlyFull = carpark.availableLots > 0 && carpark.availableLots < 10;
        const isBookmarked = isSaved(carpark.id);

        return (
          <article
            key={carpark.id}
            id={`carpark-card-${carpark.id}`}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-4">
              {/* Header: Agency, Area, and Lots badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-1.5 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        carpark.agency === 'HDB'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : carpark.agency === 'URA'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {carpark.agency}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {carpark.area}
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {carpark.distanceKm} km away
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenDetail(carpark)}
                    className="text-sm sm:text-base font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {carpark.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {carpark.address}
                  </p>
                </div>

                {/* Available Lots Indicator (Heuristic 1: Visibility of System Status) */}
                <div
                  className={`flex flex-col items-end px-3 py-1.5 rounded-xl border shrink-0 text-right ${status.bg} ${status.border}`}
                >
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-extrabold leading-none ${status.color}`}>
                      {carpark.availableLots}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      /{carpark.totalLots}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                    <span className={`text-[10px] font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lot Occupancy Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Occupancy</span>
                  <span className="font-semibold text-slate-600">{percentFilled}% Full</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
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

              {/* Error Prevention Warning (Heuristic 5) */}
              {isNearlyFull && (
                <div className="mt-2.5 px-2.5 py-1.5 rounded-xl bg-rose-50/80 border border-rose-200/80 flex items-center gap-1.5 text-[11px] text-rose-800">
                  <AlertTriangle size={13} className="text-rose-600 shrink-0" />
                  <span>
                    <strong>Only {carpark.availableLots} lots remaining:</strong> High chance of lot taken during transit.
                  </span>
                </div>
              )}

              {/* Feature Tags Row */}
              <div className="flex items-center flex-wrap gap-1.5 mt-3 text-[11px] text-slate-600">
                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200/70 rounded-md font-medium">
                  <span>Rate:</span>
                  <strong className="text-slate-900">{carpark.rates.weekdayPeak.split(',')[0]}</strong>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200/70 rounded-md">
                  <Clock size={11} className="text-slate-400" />
                  <span>{carpark.rates.gracePeriodMins}m grace</span>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200/70 rounded-md">
                  <Shield size={11} className="text-slate-400" />
                  <span>{carpark.heightLimitM}m max</span>
                </div>

                {carpark.hasEvCharging && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-cyan-50 border border-cyan-200 rounded-md text-cyan-800 font-medium">
                    <Zap size={11} className="text-cyan-600" />
                    <span>{carpark.evChargersCount || 2} EV Ports</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="bg-slate-50/70 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                <span>Updated: {carpark.lastUpdated}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Save Button (Heuristic 1 & 3) */}
                <button
                  type="button"
                  id={`save-btn-${carpark.id}`}
                  onClick={() => onToggleSave(carpark)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                    isBookmarked
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bookmark size={13} className={isBookmarked ? 'fill-amber-500 text-amber-500' : ''} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                {/* View on Map */}
                <button
                  type="button"
                  onClick={() => onSelectCarpark(carpark)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Map Pin
                </button>

                {/* Full Details Modal */}
                <button
                  type="button"
                  onClick={() => onOpenDetail(carpark)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
