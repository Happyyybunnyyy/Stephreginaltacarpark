import React from 'react';
import { Carpark } from '../types';
import { getAvailabilityStatus } from '../data/mockCarparks';
import {
  Bookmark,
  Trash2,
  Clock,
  Navigation,
  ArrowRight,
  ExternalLink,
  Timer,
  AlertCircle
} from 'lucide-react';

interface ActiveParkingSession {
  carparkId: string;
  carparkName: string;
  startTime: number; // timestamp
  ratePerHour: number;
  gracePeriodMins: number;
}

interface SavedCarparksViewProps {
  savedCarparks: Carpark[];
  onRemoveSaved: (id: string) => void;
  onOpenDetail: (carpark: Carpark) => void;
  onSelectCarpark: (carpark: Carpark) => void;
  activeSession: ActiveParkingSession | null;
  onEndSession: () => void;
  onNavigateToMap: () => void;
}

export const SavedCarparksView: React.FC<SavedCarparksViewProps> = ({
  savedCarparks,
  onRemoveSaved,
  onOpenDetail,
  onSelectCarpark,
  activeSession,
  onEndSession,
  onNavigateToMap,
}) => {
  // Calculate elapsed time for active session
  const [elapsedMinutes, setElapsedMinutes] = React.useState<number>(0);

  React.useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      const diffMins = Math.floor((Date.now() - activeSession.startTime) / 60000);
      setElapsedMinutes(diffMins);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const estimatedCost = activeSession
    ? (Math.ceil(Math.max(0, elapsedMinutes - activeSession.gracePeriodMins) / 30) * (activeSession.ratePerHour / 2)).toFixed(2)
    : '0.00';

  return (
    <div id="saved-carparks-view" className="space-y-5 pb-12">
      {/* Active Parking Session Timer Card (Heuristic 1: Visibility of System Status) */}
      {activeSession ? (
        <div className="bg-emerald-950 text-white rounded-3xl p-5 border border-emerald-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active Parking Session</span>
            </div>
            <button
              onClick={onEndSession}
              className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
            >
              Stop Timer
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            {activeSession.carparkName}
          </h3>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-800/80">
            <div className="bg-emerald-900/60 p-3 rounded-xl">
              <span className="text-slate-400 text-[11px] block">Elapsed Time</span>
              <div className="text-xl font-extrabold text-emerald-300 mt-0.5">
                {Math.floor(elapsedMinutes / 60)}h {elapsedMinutes % 60}m
              </div>
              <span className="text-[10px] text-emerald-400/80">
                Grace period: {activeSession.gracePeriodMins} mins
              </span>
            </div>

            <div className="bg-emerald-900/60 p-3 rounded-xl">
              <span className="text-slate-400 text-[11px] block">Est. Incurred Cost</span>
              <div className="text-xl font-extrabold text-white mt-0.5">
                ${estimatedCost}
              </div>
              <span className="text-[10px] text-slate-300">
                {elapsedMinutes <= activeSession.gracePeriodMins ? 'Within free grace' : 'Standard hourly tariff'}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Saved List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Bookmarked Carparks
          </h2>
          <p className="text-xs text-slate-500">
            Quickly monitor availability at your frequent parking destinations
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
          {savedCarparks.length} Saved
        </span>
      </div>

      {/* Empty State */}
      {savedCarparks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bookmark size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No saved carparks yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Tap the bookmark icon on any carpark card or map pin to save your daily office, mall, or home parking lots.
          </p>
          <button
            onClick={onNavigateToMap}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Explore Map
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedCarparks.map((carpark) => {
            const status = getAvailabilityStatus(carpark.availableLots);

            return (
              <div
                key={carpark.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                      {carpark.agency}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {carpark.area}
                    </span>
                  </div>

                  <h4
                    onClick={() => onOpenDetail(carpark)}
                    className="text-sm font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {carpark.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {carpark.rates.weekdayPeak.split(',')[0]} • {carpark.distanceKm} km
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Indicator */}
                  <div className={`px-2.5 py-1 rounded-xl border text-right ${status.bg} ${status.border}`}>
                    <div className={`text-base font-extrabold leading-none ${status.color}`}>
                      {carpark.availableLots}
                    </div>
                    <div className="text-[9px] text-slate-500">lots left</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenDetail(carpark)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      title="View full details"
                    >
                      <ArrowRight size={14} />
                    </button>

                    <button
                      onClick={() => onRemoveSaved(carpark.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove from saved (with Undo)"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
