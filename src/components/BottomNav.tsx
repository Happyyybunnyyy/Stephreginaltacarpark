import React from 'react';
import { MapPin, ListFilter, Bookmark, Sparkles, BookOpen } from 'lucide-react';

export type NavTab = 'map' | 'list' | 'saved' | 'heuristics' | 'guide';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount: number;
  hasActiveTimer: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  hasActiveTimer
}) => {
  const tabs = [
    {
      id: 'map' as NavTab,
      label: 'Map View',
      icon: MapPin,
      badge: null,
    },
    {
      id: 'list' as NavTab,
      label: 'Carparks',
      icon: ListFilter,
      badge: null,
    },
    {
      id: 'saved' as NavTab,
      label: 'Saved',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : (hasActiveTimer ? '⏱' : null),
    },
    {
      id: 'heuristics' as NavTab,
      label: 'Heuristics',
      icon: Sparkles,
      badge: '10',
    },
    {
      id: 'guide' as NavTab,
      label: 'Guide & API',
      icon: BookOpen,
      badge: null,
    },
  ];

  return (
    <nav
      id="bottom-navigation-dock"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md md:max-w-xl lg:max-w-3xl mx-auto px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 select-none min-w-[58px] ${
                isActive
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <span className="absolute inset-0 bg-emerald-50 rounded-xl -z-10 transition-transform duration-200" />
              )}

              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
