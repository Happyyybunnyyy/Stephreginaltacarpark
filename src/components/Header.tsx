import React from 'react';
import { Sparkles, RefreshCw, Car, Activity, Zap } from 'lucide-react';
import { NavTab } from './BottomNav';

interface HeaderProps {
  onOpenHeuristics: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onSimulateFluctuation: () => void;
  activeTab: NavTab;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHeuristics,
  onRefreshData,
  isRefreshing,
  onSimulateFluctuation,
  activeTab
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-md md:max-w-xl lg:max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <span className="text-base tracking-tighter">SG</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                Singapore Carpark Live
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-1">
              Real-time lot availability & navigation
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Live Simulation Flux Button (Great for testing real-time updates) */}
          <button
            type="button"
            onClick={onSimulateFluctuation}
            title="Simulate real-time Singapore lot changes"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold transition-colors"
          >
            <Activity size={12} className="text-emerald-600" />
            <span className="hidden sm:inline">Simulate Flux</span>
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Sync with latest Singapore carpark lots"
            className="p-1.5 text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs transition-colors"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-emerald-600' : ''} />
          </button>

          {/* 10 Usability Heuristics Badge / Button */}
          <button
            type="button"
            id="header-heuristics-btn"
            onClick={onOpenHeuristics}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
              activeTab === 'heuristics'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Sparkles size={13} className={activeTab === 'heuristics' ? 'text-white' : 'text-emerald-600'} />
            <span>10 Heuristics</span>
          </button>
        </div>
      </div>
    </header>
  );
};
