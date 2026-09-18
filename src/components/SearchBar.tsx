import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Navigation, Compass, History } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/mockCarparks';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectLocation?: (name: string, lat: number, lng: number) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  locationError?: string | null;
  recentSearches: string[];
  onClearRecentSearches: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSelectLocation,
  onUseCurrentLocation,
  isLocating,
  locationError,
  recentSearches,
  onClearRecentSearches
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter popular locations matching query
  const filteredSuggestions = searchQuery.trim()
    ? POPULAR_LOCATIONS.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.area.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full z-30" ref={dropdownRef}>
      {/* Search Input Container */}
      <div
        className={`relative flex items-center w-full bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
          isFocused
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="pl-3.5 pr-2 text-slate-400">
          <Search size={18} className={isFocused ? 'text-emerald-600' : 'text-slate-400'} />
        </div>

        <input
          id="carpark-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search Singapore location, mall, or HDB estate..."
          aria-label="Search Singapore carparks"
          className="w-full py-2.5 text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        {/* Clear Button (Heuristic 3: User Control & Freedom) */}
        {searchQuery && (
          <button
            id="clear-search-button"
            type="button"
            onClick={() => {
              onSearchChange('');
            }}
            title="Clear search query"
            className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        )}

        {/* Use My Location GPS Button (Heuristic 1: Visibility of System Status) */}
        <button
          id="use-location-button"
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          title="Detect my current location in Singapore"
          className={`flex items-center gap-1.5 px-3 py-1.5 mr-1.5 rounded-xl text-xs font-semibold transition-all ${
            isLocating
              ? 'bg-emerald-50 text-emerald-700 animate-pulse'
              : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
          }`}
        >
          <Navigation size={13} className={isLocating ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
        </button>
      </div>

      {/* GPS Location Error Notice if any */}
      {locationError && (
        <div className="mt-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
          <span>{locationError}</span>
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {isFocused && (searchQuery.trim() || recentSearches.length > 0) && (
        <div
          id="search-autocomplete-dropdown"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100"
        >
          {/* Matching locations */}
          {filteredSuggestions.length > 0 && (
            <div className="p-2">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Singapore Locations
              </div>
              {filteredSuggestions.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => {
                    onSearchChange(loc.name);
                    if (onSelectLocation) onSelectLocation(loc.name, loc.lat, loc.lng);
                    setIsFocused(false);
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                >
                  <MapPin size={14} className="text-emerald-600 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{loc.name}</span>
                    <span className="text-[11px] text-slate-500">{loc.area}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches (Heuristic 6: Recognition Rather than Recall) */}
          {recentSearches.length > 0 && (
            <div className="p-2 bg-slate-50/70">
              <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <History size={11} /> Recent Searches
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearRecentSearches();
                  }}
                  className="text-[10px] text-slate-400 hover:text-slate-600 underline"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 px-2.5 py-1">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onSearchChange(item);
                      setIsFocused(false);
                    }}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Singapore Hotspots Chips */}
      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1 shrink-0 pl-0.5">
          <Compass size={12} /> Hotspots:
        </span>
        {POPULAR_LOCATIONS.slice(0, 6).map((loc) => {
          const isSelected = searchQuery.toLowerCase() === loc.name.toLowerCase();
          return (
            <button
              key={loc.name}
              type="button"
              onClick={() => {
                onSearchChange(loc.name);
                if (onSelectLocation) onSelectLocation(loc.name, loc.lat, loc.lng);
              }}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:border-emerald-300 hover:text-slate-900'
              }`}
            >
              {loc.name.split(' (')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
