import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Carpark } from '../types';
import { getAvailabilityStatus } from '../data/mockCarparks';
import { RefreshCw, Navigation, Maximize2, Layers, Bookmark, ArrowRight, Zap, Car } from 'lucide-react';

interface MapViewProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDetail: (carpark: Carpark) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (carpark: Carpark) => void;
  userCoords: { lat: number; lng: number } | null;
  onRefreshLiveData: () => void;
  isRefreshing: boolean;
  lastUpdatedTime: string;
}

export const MapView: React.FC<MapViewProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  onOpenDetail,
  isSaved,
  onToggleSave,
  userCoords,
  onRefreshLiveData,
  isRefreshing,
  lastUpdatedTime,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [tileMode, setTileMode] = useState<'light' | 'street'>('light');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Singapore central coordinates
    const defaultCenter: L.LatLngExpression = [1.3521, 103.8198];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
    });

    // Clean light tiles (CartoDB Positron) for aesthetic minimalism
    const lightTileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const streetTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileLayer = L.tileLayer(tileMode === 'light' ? lightTileUrl : streetTileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when tileMode toggles
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const url =
      tileMode === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(url, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);
  }, [tileMode]);

  // Render Carpark Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    carparks.forEach((carpark) => {
      const status = getAvailabilityStatus(carpark.availableLots);
      const isSelected = selectedCarpark?.id === carpark.id;

      // Color coding: Green for abundant, Amber for moderate, Red for low/full
      let bgBadgeColor = 'bg-emerald-600 text-white border-emerald-700';
      if (status.status === 'moderate') {
        bgBadgeColor = 'bg-amber-500 text-white border-amber-600';
      } else if (status.status === 'limited' || status.status === 'full') {
        bgBadgeColor = 'bg-rose-600 text-white border-rose-700';
      }

      const customHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'
        }">
          <div class="px-2 py-0.5 rounded-full text-[11px] font-bold shadow-md border flex items-center gap-1 ${bgBadgeColor}">
            <span class="tracking-tight">${carpark.availableLots}</span>
            <span class="text-[9px] font-normal opacity-90">lots</span>
          </div>
          <div class="w-2.5 h-2.5 -mt-1 rotate-45 ${
            status.status === 'moderate'
              ? 'bg-amber-500'
              : status.status === 'limited' || status.status === 'full'
              ? 'bg-rose-600'
              : 'bg-emerald-600'
          }"></div>
          ${
            isSelected
              ? `<div class="absolute -top-1 w-full h-full rounded-full ring-4 ring-emerald-400/40 animate-ping"></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-carpark-pin',
        iconSize: [60, 32],
        iconAnchor: [30, 28],
      });

      const marker = L.marker([carpark.coordinates.lat, carpark.coordinates.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.on('click', () => {
        onSelectCarpark(carpark);
      });

      markersRef.current[carpark.id] = marker;
    });
  }, [carparks, selectedCarpark, onSelectCarpark]);

  // Handle User Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userCoords) {
      if (!userMarkerRef.current) {
        const userIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center w-6 h-6">
              <span class="absolute w-6 h-6 rounded-full bg-blue-500/30 animate-ping"></span>
              <span class="relative w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-md"></span>
            </div>
          `,
          className: 'user-location-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
          icon: userIcon,
        }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      }
    }
  }, [userCoords]);

  // Pan to selected carpark
  useEffect(() => {
    if (selectedCarpark && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedCarpark.coordinates.lat, selectedCarpark.coordinates.lng],
        15,
        { duration: 0.8 }
      );
    }
  }, [selectedCarpark]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([1.3521, 103.8198], 12, { duration: 0.8 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[580px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating System Status Badge (Heuristic 1: Visibility of System Status) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-xs text-slate-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-slate-800">Singapore Live Feed</span>
        <span className="text-slate-400 text-[11px]">• {lastUpdatedTime}</span>
        <button
          onClick={onRefreshLiveData}
          disabled={isRefreshing}
          title="Refresh lot availability"
          className="ml-1 p-1 text-slate-500 hover:text-emerald-700 rounded-md transition-colors"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-emerald-600' : ''} />
        </button>
      </div>

      {/* Map Control Buttons (Top-Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-slate-700 hover:bg-slate-50 text-sm font-bold transition-colors border-b border-slate-100"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-slate-700 hover:bg-slate-50 text-sm font-bold transition-colors"
          >
            -
          </button>
        </div>

        <button
          onClick={handleResetView}
          title="Reset to Singapore Overview"
          className="p-2 bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200/80 shadow-sm transition-colors"
        >
          <Maximize2 size={15} />
        </button>

        <button
          onClick={() => setTileMode(tileMode === 'light' ? 'street' : 'light')}
          title="Toggle Map Style"
          className="p-2 bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200/80 shadow-sm transition-colors"
        >
          <Layers size={15} />
        </button>
      </div>

      {/* Map Legend (Bottom-Left) */}
      <div className="hidden sm:flex absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs items-center gap-3 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>&gt;50 lots</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>15-50 lots</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>&lt;15 lots / Full</span>
        </div>
      </div>

      {/* Floating Selected Carpark Card (Docked at bottom of map) */}
      {selectedCarpark && (
        <div
          id="map-selected-carpark-card"
          className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-96 z-30 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {selectedCarpark.agency}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedCarpark.area}
                </span>
                {selectedCarpark.hasEvCharging && (
                  <span className="flex items-center gap-0.5 text-[10px] font-medium text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">
                    <Zap size={10} /> EV
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {selectedCarpark.name}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {selectedCarpark.address}
              </p>
            </div>

            {/* Availability pill */}
            {(() => {
              const status = getAvailabilityStatus(selectedCarpark.availableLots);
              return (
                <div className={`px-2.5 py-1 rounded-xl border text-right shrink-0 ${status.bg} ${status.border}`}>
                  <div className={`text-base font-extrabold leading-none ${status.color}`}>
                    {selectedCarpark.availableLots}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">lots left</div>
                </div>
              );
            })()}
          </div>

          {/* Quick Rates & Distance Row */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                {selectedCarpark.rates.weekdayPeak.split(',')[0]}
              </span>
              <span className="text-slate-400">•</span>
              <span>{selectedCarpark.distanceKm} km away</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onToggleSave(selectedCarpark)}
                title={isSaved(selectedCarpark.id) ? 'Remove bookmark' : 'Save carpark'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSaved(selectedCarpark.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Bookmark size={14} className={isSaved(selectedCarpark.id) ? 'fill-amber-500' : ''} />
              </button>

              <button
                type="button"
                onClick={() => onOpenDetail(selectedCarpark)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
              >
                <span>Details</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
