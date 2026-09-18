export type AgencyType = 'HDB' | 'URA' | 'LTA' | 'Commercial';
export type VehicleType = 'car' | 'motorcycle' | 'heavy';

export interface CarparkRates {
  weekdayPeak: string;
  weekdayOffPeak: string;
  saturday: string;
  sundayHoliday: string;
  gracePeriodMins: number;
}

export interface Carpark {
  id: string;
  carparkNumber: string;
  name: string;
  address: string;
  area: 'Marina & CBD' | 'Orchard & Somerset' | 'Bugis & City Hall' | 'East & Tampines' | 'West & Jurong' | 'North & Woodlands';
  agency: AgencyType;
  coordinates: {
    lat: number;
    lng: number;
  };
  totalLots: number;
  availableLots: number;
  vehicleType: VehicleType;
  rates: CarparkRates;
  heightLimitM: number;
  hasEvCharging: boolean;
  evChargersCount?: number;
  gantryType: 'Electronic (EPS)' | 'Paper Coupon / Manual';
  isCovered: boolean;
  distanceKm?: number;
  lastUpdated: string;
  lotBreakdown?: {
    cars: number;
    motorcycles: number;
    heavyVehicles?: number;
  };
}

export interface FilterState {
  searchQuery: string;
  agency: 'ALL' | AgencyType;
  vehicleType: VehicleType;
  availableOnly: boolean;
  evChargingOnly: boolean;
  coveredOnly: boolean;
  maxHourlyRate: number; // 0 means any
  sortBy: 'distance' | 'availableLots' | 'rate';
  area: string;
}

export interface HeuristicItem {
  id: string;
  number: number;
  title: string;
  definition: string;
  appImplementation: string;
  concreteExamples: string[];
  testActionText?: string;
  targetTab?: 'map' | 'list' | 'saved' | 'guide';
}
