import React from 'react';
import { Filter, Zap, ShieldCheck, Car, Bike, RotateCcw, ArrowDownUp } from 'lucide-react';
import { FilterState, AgencyType, VehicleType } from '../types';

interface QuickFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResultsCount: number;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  filters,
  onFilterChange,
  totalResultsCount
}) => {
  const isFiltered =
    filters.agency !== 'ALL' ||
    filters.availableOnly ||
    filters.evChargingOnly ||
    filters.coveredOnly ||
    filters.vehicleType !== 'car' ||
    filters.sortBy !== 'distance';

  const handleReset = () => {
    onFilterChange({
      ...filters,
      agency: 'ALL',
      vehicleType: 'car',
      availableOnly: false,
      evChargingOnly: false,
      coveredOnly: false,
      sortBy: 'distance',
      searchQuery: '',
      maxHourlyRate: 0,
    });
  };

  return (
    <div className="w-full flex flex-col gap-2 pt-1 pb-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Filter size={13} className="text-slate-400" />
          <span>Showing <strong className="text-slate-900 font-semibold">{totalResultsCount}</strong> carparks</span>
        </div>

        {/* Reset Filters (Heuristic 3: User Control & Freedom) */}
        {isFiltered && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium hover:underline transition-colors"
          >
            <RotateCcw size={11} /> Reset Filters
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {/* Vehicle Toggle */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, vehicleType: 'car' })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              filters.vehicleType === 'car'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car size={13} /> Cars
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, vehicleType: 'motorcycle' })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              filters.vehicleType === 'motorcycle'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bike size={13} /> Bikes
          </button>
        </div>

        {/* Available Only */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, availableOnly: !filters.availableOnly })}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium border transition-all ${
            filters.availableOnly
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Available Lots
        </button>

        {/* EV Charging */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, evChargingOnly: !filters.evChargingOnly })}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium border transition-all ${
            filters.evChargingOnly
              ? 'bg-cyan-50 border-cyan-500 text-cyan-800 font-semibold shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <Zap size={13} className={filters.evChargingOnly ? 'text-cyan-600' : 'text-slate-400'} />
          EV Charger
        </button>

        {/* Covered / Multi-Storey */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, coveredOnly: !filters.coveredOnly })}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium border transition-all ${
            filters.coveredOnly
              ? 'bg-slate-800 border-slate-800 text-white font-semibold shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <ShieldCheck size={13} />
          Covered / Sheltered
        </button>

        {/* Agency Filter Dropdown */}
        <select
          value={filters.agency}
          onChange={(e) => onFilterChange({ ...filters, agency: e.target.value as 'ALL' | AgencyType })}
          className="shrink-0 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500"
          aria-label="Filter by Agency"
        >
          <option value="ALL">All Agencies</option>
          <option value="HDB">HDB Multi-Storey</option>
          <option value="URA">URA Carparks</option>
          <option value="Commercial">Commercial Malls</option>
        </select>

        {/* Sort dropdown */}
        <div className="shrink-0 flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-700">
          <ArrowDownUp size={12} className="text-slate-400" />
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as 'distance' | 'availableLots' | 'rate' })}
            className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            aria-label="Sort carparks by"
          >
            <option value="distance">Sort: Nearest</option>
            <option value="availableLots">Sort: Most Lots</option>
            <option value="rate">Sort: Lowest Price</option>
          </select>
        </div>
      </div>
    </div>
  );
};
