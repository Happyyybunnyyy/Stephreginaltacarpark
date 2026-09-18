/**
 * Singapore Carpark Live - Real-time Lot Availability & Navigation
 * Built with Jakob Nielsen's 10 Usability Heuristics Framework
 */

import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_CARPARKS } from './data/mockCarparks';
import { Carpark, FilterState, AgencyType } from './types';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { SearchBar } from './components/SearchBar';
import { QuickFilters } from './components/QuickFilters';
import { MapView } from './components/MapView';
import { CarparkList } from './components/CarparkList';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { ParkingTimerModal } from './components/ParkingTimerModal';
import { SavedCarparksView } from './components/SavedCarparksView';
import { HeuristicsView } from './components/HeuristicsView';
import { GuideView } from './components/GuideView';
import { ToastUndo } from './components/ToastUndo';
import { Map, List, Sparkles } from 'lucide-react';

export default function App() {
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_CARPARKS);
  const [activeTab, setActiveTab] = useState<NavTab>('map');
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [detailModalCarpark, setDetailModalCarpark] = useState<Carpark | null>(null);
  const [timerModalCarpark, setTimerModalCarpark] = useState<Carpark | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');

  // Active parking session
  const [activeSession, setActiveSession] = useState<{
    carparkId: string;
    carparkName: string;
    startTime: number;
    ratePerHour: number;
    gracePeriodMins: number;
  } | null>(null);

  // Saved bookmarks
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sg_saved_carparks');
      return stored ? JSON.parse(stored) : ['mbs-01', 'ion-04', 'bugis-07'];
    } catch {
      return ['mbs-01', 'ion-04', 'bugis-07'];
    }
  });

  // Recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sg_recent_searches');
      return stored ? JSON.parse(stored) : ['Marina Bay Sands', 'Orchard Road', 'Bugis'];
    } catch {
      return ['Marina Bay Sands', 'Orchard Road', 'Bugis'];
    }
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    agency: 'ALL',
    vehicleType: 'car',
    availableOnly: false,
    evChargingOnly: false,
    coveredOnly: false,
    maxHourlyRate: 0,
    sortBy: 'distance',
    area: 'ALL',
  });

  // User location (GPS)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Toast feedback with Undo (Heuristic 3: User Control & Freedom)
  const [toast, setToast] = useState<{
    message: string;
    onUndo?: () => void;
  } | null>(null);

  // Sync saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sg_saved_carparks', JSON.stringify(savedIds));
    } catch (e) {
      console.warn(e);
    }
  }, [savedIds]);

  // Sync recent searches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sg_recent_searches', JSON.stringify(recentSearches));
    } catch (e) {
      console.warn(e);
    }
  }, [recentSearches]);

  // Handle GPS location request
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setIsLocating(false);
        setToast({
          message: 'Location acquired! Showing carparks near your GPS position.',
        });
      },
      (error) => {
        setIsLocating(false);
        // Realistic fallback to Singapore CBD coordinates
        setUserCoords({ lat: 1.2838, lng: 103.8591 });
        setLocationError('GPS permission denied or unavailable. Centered on Marina Bay CBD.');
        setTimeout(() => setLocationError(null), 5000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Real-time lot availability fluctuation simulator
  const simulateLotFluctuation = () => {
    setIsRefreshing(true);
    setCarparks((prev) =>
      prev.map((cp) => {
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4 lots
        const newLots = Math.max(0, Math.min(cp.totalLots, cp.availableLots + change));
        return {
          ...cp,
          availableLots: newLots,
          lastUpdated: 'Just now',
          lotBreakdown: cp.lotBreakdown
            ? {
                ...cp.lotBreakdown,
                cars: newLots,
              }
            : undefined,
        };
      })
    );

    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedTime('Just now');
      setToast({
        message: 'Live lot availability updated across all Singapore gantries!',
      });
    }, 400);
  };

  // Refresh data handler
  const handleRefresh = () => {
    simulateLotFluctuation();
  };

  // Auto-refresh timer every 45 seconds to maintain live feel
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedTime('45s ago');
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  // Filter and sort carparks
  const filteredCarparks = useMemo(() => {
    return carparks
      .filter((cp) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchName = cp.name.toLowerCase().includes(query);
          const matchAddress = cp.address.toLowerCase().includes(query);
          const matchArea = cp.area.toLowerCase().includes(query);
          const matchAgency = cp.agency.toLowerCase().includes(query);
          if (!matchName && !matchAddress && !matchArea && !matchAgency) {
            return false;
          }
        }

        // Agency
        if (filters.agency !== 'ALL' && cp.agency !== filters.agency) {
          return false;
        }

        // Vehicle type
        if (filters.vehicleType && cp.vehicleType !== filters.vehicleType) {
          return false;
        }

        // Available only
        if (filters.availableOnly && cp.availableLots === 0) {
          return false;
        }

        // EV charging only
        if (filters.evChargingOnly && !cp.hasEvCharging) {
          return false;
        }

        // Covered only
        if (filters.coveredOnly && !cp.isCovered) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'availableLots') {
          return b.availableLots - a.availableLots;
        }
        if (filters.sortBy === 'rate') {
          // Parse first dollar rate
          const rateA = parseFloat(a.rates.weekdayPeak.match(/\$([0-9.]+)/)?.[1] || '99');
          const rateB = parseFloat(b.rates.weekdayPeak.match(/\$([0-9.]+)/)?.[1] || '99');
          return rateA - rateB;
        }
        // Default: nearest distance
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      });
  }, [carparks, filters]);

  // Bookmarking / Saved handlers
  const isSaved = (id: string) => savedIds.includes(id);

  const toggleSave = (carpark: Carpark) => {
    if (isSaved(carpark.id)) {
      setSavedIds((prev) => prev.filter((id) => id !== carpark.id));
      setToast({
        message: `Removed "${carpark.name}" from saved.`,
        onUndo: () => {
          setSavedIds((prev) => [...prev, carpark.id]);
          setToast(null);
        },
      });
    } else {
      setSavedIds((prev) => [...prev, carpark.id]);
      setToast({
        message: `Saved "${carpark.name}" to your bookmarks.`,
      });
    }
  };

  const removeSaved = (id: string) => {
    const cp = carparks.find((c) => c.id === id);
    setSavedIds((prev) => prev.filter((item) => item !== id));
    if (cp) {
      setToast({
        message: `Removed "${cp.name}" from saved.`,
        onUndo: () => {
          setSavedIds((prev) => [...prev, id]);
          setToast(null);
        },
      });
    }
  };

  // Search input change handler
  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev.filter((q) => q !== query.trim())].slice(0, 5));
    }
  };

  // Select location from suggestions
  const handleSelectLocation = (name: string, lat: number, lng: number) => {
    // Find closest carpark or select first matching
    const match = carparks.find(
      (cp) => cp.name.toLowerCase().includes(name.toLowerCase()) || cp.area.toLowerCase().includes(name.toLowerCase())
    );
    if (match) {
      setSelectedCarpark(match);
    }
  };

  // Parking Session Start
  const handleStartSession = (carpark: Carpark, ratePerHour: number, gracePeriodMins: number) => {
    setActiveSession({
      carparkId: carpark.id,
      carparkName: carpark.name,
      startTime: Date.now(),
      ratePerHour,
      gracePeriodMins,
    });
    setToast({
      message: `Parking timer active at ${carpark.name}! Grace period: ${gracePeriodMins} mins.`,
    });
  };

  const savedCarparksList = useMemo(() => {
    return carparks.filter((c) => savedIds.includes(c.id));
  }, [carparks, savedIds]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-emerald-500 selection:text-white pb-20">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        onOpenHeuristics={() => setActiveTab('heuristics')}
        onRefreshData={handleRefresh}
        isRefreshing={isRefreshing}
        onSimulateFluctuation={simulateLotFluctuation}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md md:max-w-xl lg:max-w-4xl w-full mx-auto px-3 sm:px-4 pt-3">
        {/* Top Search & Filter Bar (Shown in Map & List tabs) */}
        {(activeTab === 'map' || activeTab === 'list') && (
          <div className="space-y-2 mb-3">
            <SearchBar
              searchQuery={filters.searchQuery}
              onSearchChange={handleSearchChange}
              onSelectLocation={handleSelectLocation}
              onUseCurrentLocation={handleUseCurrentLocation}
              isLocating={isLocating}
              locationError={locationError}
              recentSearches={recentSearches}
              onClearRecentSearches={() => setRecentSearches([])}
            />

            {/* Quick Filter Row */}
            <QuickFilters
              filters={filters}
              onFilterChange={setFilters}
              totalResultsCount={filteredCarparks.length}
            />
          </div>
        )}

        {/* Tab 1: Map View */}
        {activeTab === 'map' && (
          <div className="flex flex-col gap-3">
            {/* View Mode Toggle Switch (Heuristic 7: Flexibility and Efficiency) */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-500 font-medium">
                Tap any marker to view real-time lots & parking tariffs
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <List size={13} />
                <span>Switch to List</span>
              </button>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="h-[58vh] sm:h-[65vh] w-full">
              <MapView
                carparks={filteredCarparks}
                selectedCarpark={selectedCarpark}
                onSelectCarpark={(cp) => setSelectedCarpark(cp)}
                onOpenDetail={(cp) => setDetailModalCarpark(cp)}
                isSaved={isSaved}
                onToggleSave={toggleSave}
                userCoords={userCoords}
                onRefreshLiveData={handleRefresh}
                isRefreshing={isRefreshing}
                lastUpdatedTime={lastUpdatedTime}
              />
            </div>
          </div>
        )}

        {/* Tab 2: List View */}
        {activeTab === 'list' && (
          <div>
            <div className="flex items-center justify-between text-xs px-1 mb-2.5">
              <span className="text-slate-500 font-medium">
                Sorted by {filters.sortBy === 'distance' ? 'Nearest Distance' : filters.sortBy === 'availableLots' ? 'Most Available Lots' : 'Lowest Rate'}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <Map size={13} />
                <span>Switch to Map</span>
              </button>
            </div>

            <CarparkList
              carparks={filteredCarparks}
              onSelectCarpark={(cp) => {
                setSelectedCarpark(cp);
                setActiveTab('map');
              }}
              onOpenDetail={(cp) => setDetailModalCarpark(cp)}
              isSaved={isSaved}
              onToggleSave={toggleSave}
              onResetFilters={() =>
                setFilters({
                  searchQuery: '',
                  agency: 'ALL',
                  vehicleType: 'car',
                  availableOnly: false,
                  evChargingOnly: false,
                  coveredOnly: false,
                  maxHourlyRate: 0,
                  sortBy: 'distance',
                  area: 'ALL',
                })
              }
              searchQuery={filters.searchQuery}
            />
          </div>
        )}

        {/* Tab 3: Saved & Active Timer */}
        {activeTab === 'saved' && (
          <SavedCarparksView
            savedCarparks={savedCarparksList}
            onRemoveSaved={removeSaved}
            onOpenDetail={(cp) => setDetailModalCarpark(cp)}
            onSelectCarpark={(cp) => {
              setSelectedCarpark(cp);
              setActiveTab('map');
            }}
            activeSession={activeSession}
            onEndSession={() => {
              setActiveSession(null);
              setToast({ message: 'Parking session ended. Drive safely!' });
            }}
            onNavigateToMap={() => setActiveTab('map')}
          />
        )}

        {/* Tab 4: 10 Usability Heuristics Framework */}
        {activeTab === 'heuristics' && (
          <HeuristicsView
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onTriggerHeuristicDemo={(id) => {
              if (id === 'heuristic-1') {
                simulateLotFluctuation();
              } else if (id === 'heuristic-3') {
                // Trigger an undoable toast demo
                setToast({
                  message: 'Heuristic 3 Demo: User Control & Freedom with instant Undo action!',
                  onUndo: () => setToast({ message: 'Action successfully reversed!' }),
                });
              }
            }}
          />
        )}

        {/* Tab 5: Singapore Guide & API Integration */}
        {activeTab === 'guide' && <GuideView />}
      </main>

      {/* Carpark Full Detail Modal */}
      {detailModalCarpark && (
        <CarparkDetailModal
          carpark={detailModalCarpark}
          onClose={() => setDetailModalCarpark(null)}
          isSaved={isSaved(detailModalCarpark.id)}
          onToggleSave={() => toggleSave(detailModalCarpark)}
          onStartTimer={(cp) => {
            setDetailModalCarpark(null);
            setTimerModalCarpark(cp);
          }}
        />
      )}

      {/* Parking Timer Modal */}
      {timerModalCarpark && (
        <ParkingTimerModal
          carpark={timerModalCarpark}
          onClose={() => setTimerModalCarpark(null)}
          onStartSession={handleStartSession}
        />
      )}

      {/* Toast Feedback with Undo */}
      {toast && (
        <ToastUndo
          message={toast.message}
          onUndo={toast.onUndo}
          onClose={() => setToast(null)}
        />
      )}

      {/* Bottom Navigation Dock */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedIds.length}
        hasActiveTimer={activeSession !== null}
      />
    </div>
  );
}
