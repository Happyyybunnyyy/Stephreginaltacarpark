import { HeuristicItem } from '../types';

export const USABILITY_HEURISTICS: HeuristicItem[] = [
  {
    id: 'heuristic-1',
    number: 1,
    title: 'Visibility of System Status',
    definition:
      'Clearly communicate what is happening after every action. Provide appropriate loading states, progress indicators, save status, and success or failure feedback. Prevent users from wondering whether their action worked.',
    appImplementation:
      'The app provides immediate visual feedback at every touchpoint: pulsing green/amber/red real-time sync indicators, countdown timers for data freshness ("Updated 8s ago"), animated lot capacity progress meters, live location GPS acquisition states, and toast notifications confirming when carparks are saved or removed.',
    concreteExamples: [
      'Pulsing "Live Sync" badge in the header shows real-time connection status',
      'Lot capacity progress bars dynamically calculate occupancy percentage',
      'Interactive "Simulate Live Changes" button shows real-time lot count flux and visual flash',
      'Save/Bookmark trigger provides instant snackbar feedback with undo option'
    ],
    testActionText: 'Inspect Live Status Badge',
    targetTab: 'map'
  },
  {
    id: 'heuristic-2',
    number: 2,
    title: 'Match with the Real World',
    definition:
      'Use familiar language, recognizable concepts, and logical workflows. Replace unnecessary technical jargon with clear labels. Arrange information in the order users naturally need it.',
    appImplementation:
      'The interface speaks authentic Singapore driver terminology rather than developer abstractions: HDB Multi-Storey vs URA Surface vs Commercial Mall, Electronic Parking System (EPS), CashCard/EZ-Link/NETS FlashPay, Grace Period (10-15 mins), Central Area parking surcharge, and Sunday Free Parking schemes.',
    concreteExamples: [
      'Accurate Singapore agency classifications (HDB, URA, LTA, Commercial)',
      'Real-world parking lot rules (White lots, Red/White season lots, Yellow night lots)',
      'Pricing formatted as drivers expect in SG: "per 30 mins" or "per entry after 5/6pm"',
      'Grace period clearly displayed so drivers know how long they can wait or drop off without payment'
    ],
    testActionText: 'View Singapore Parking Guide',
    targetTab: 'guide'
  },
  {
    id: 'heuristic-3',
    number: 3,
    title: 'User Control and Freedom',
    definition:
      'Make it easy to go back, cancel, edit, undo, and exit a workflow. Preserve user input when navigating or recovering from errors. Provide confirmation for destructive actions and recovery where possible.',
    appImplementation:
      'Users are never trapped in unwanted states. A 1-click "Clear Search" button resets queries while retaining previous results, modal drawers can be dismissed with a single tap or Esc key, bookmarks feature a 5-second "Undo" snackbar if accidentally deleted, and filters have an instant "Reset all filters" control.',
    concreteExamples: [
      'Dedicated (X) clear button on the search bar with instant query rollback',
      'Instant "Undo" snackbar when removing a carpark from saved list',
      'One-tap "Reset All Filters" button when criteria are over-constrained',
      'Non-blocking bottom sheet drawers that can be swiped, closed with (X), or clicked outside'
    ],
    testActionText: 'Test Undo on Saved Lots',
    targetTab: 'saved'
  },
  {
    id: 'heuristic-4',
    number: 4,
    title: 'Consistency and Standards',
    definition:
      'Standardize navigation, buttons, icons, colors, typography, spacing, and terminology. Similar actions should behave the same way throughout the workspace. Follow familiar interface conventions.',
    appImplementation:
      'Standard mobile-first bottom navigation dock with universally recognized icons (Map, List, Saved, Heuristics, Guide). Consistent traffic-light color system: Emerald for abundant lots (>50), Amber for moderate capacity (15-50), and Rose for critically low lots (<15) applied synchronously across map pins, badges, and detail sheets.',
    concreteExamples: [
      'Fixed bottom navigation bar following iOS/Android native guidelines',
      'Unified capacity colors: Green = Abundant, Amber = Moderate, Red = Filling Fast / Full',
      'Standard Lucide icons for Car, Motorcycle, EV Charging, Height Clearance, and Navigation',
      'Consistent card structure across all list items and map popups'
    ],
    testActionText: 'Examine Navigation Standards',
    targetTab: 'list'
  },
  {
    id: 'heuristic-5',
    number: 5,
    title: 'Error Prevention',
    definition:
      'Prevent mistakes through clear instructions, sensible defaults, input constraints, and timely validation. Explain why an action is unavailable. Check prerequisites before starting a task and protect against accidental duplicate submissions.',
    appImplementation:
      'The app prevents costly driver errors before they happen: a prominent warning appears if a carpark has fewer than 5 lots left before initiating navigation, height clearance limit badges alert tall vehicle drivers (e.g. 1.9m limit), and instant location autocomplete prevents mistyped Singapore street addresses.',
    concreteExamples: [
      'Warning banner when attempting to navigate to a nearly-full carpark (< 5 lots)',
      'Vehicle height limit clearance badge prominently displayed on every card',
      'Validated location autocomplete chips matching verified Singapore precincts',
      'Disabled states with explanatory tooltips when conflicting filters yield 0 results'
    ],
    testActionText: 'See Error Prevention Badges',
    targetTab: 'list'
  },
  {
    id: 'heuristic-6',
    number: 6,
    title: 'Recognition Rather than Recall',
    definition:
      'Keep relevant options, instructions, and context visible when needed. Use descriptive labels, examples, recent items, and clear selection states. Avoid making users remember information from previous screens.',
    appImplementation:
      'Drivers do not need to memorize search terms or carpark codes. The interface retains "Recent Searches", highlights selected filter tags with prominent active rings, displays live distance and rate directly on preview cards, and keeps the active carpark preview card visible while panning the map.',
    concreteExamples: [
      'Recent Searches history pills visible directly below the search bar',
      'Popular Singapore hotspot chips (Marina Bay, Orchard, Jurong, Tampines) for 1-tap lookup',
      'Persistent lot availability counters right inside the map pins without clicking',
      'Side-by-side comparison of distance, rate, and available lot count on all cards'
    ],
    testActionText: 'View Hotspot Chips & Recent Searches',
    targetTab: 'map'
  },
  {
    id: 'heuristic-7',
    number: 7,
    title: 'Flexibility and Efficiency',
    definition:
      'Streamline frequent tasks and reduce unnecessary steps. Where useful, provide search, filters, shortcuts, reusable settings, and bulk actions. Keep beginner workflows simple while making advanced features discoverable.',
    appImplementation:
      'Novice drivers can simply type an area name or tap a hotspot chip. Power drivers have quick filter toggles ("Available Only", "EV Charging", "Under $2/hr", "Covered"), sorting by nearest distance or cheapest rates, 1-tap launch into Google Maps / Apple Maps / Waze, and an integrated Parking Duration Timer.',
    concreteExamples: [
      'One-tap Quick Filters: "Available Only", "EV Charging", "Under $2/hr", "Covered"',
      'Multi-app navigation launcher (Google Maps, Apple Maps, Waze)',
      'Built-in Parking Timer so drivers track grace period and hourly block increments',
      'Instant switch between interactive Map View and dense List View'
    ],
    testActionText: 'Test Quick Filters & Shortcuts',
    targetTab: 'list'
  },
  {
    id: 'heuristic-8',
    number: 8,
    title: 'Aesthetic and Minimalist Design',
    definition:
      'Create a clean interface with clear visual hierarchy and focused primary actions. Remove redundant content and unnecessary decoration. Reveal advanced options progressively and use whitespace to improve readability.',
    appImplementation:
      'Designed with a restrained, high-contrast palette (neutral slate, emerald accents, optical borders) and strict mathematical spacing. Uncluttered cards show only crucial driver data at first glance, using progressive disclosure to reveal detailed hourly breakdown tables, EV charger speeds, and season parking terms on demand.',
    concreteExamples: [
      'Generous padding, clean typography, and zero distracting gradients or decorative fluff',
      'Visual hierarchy: Big bold available lot count → Carpark name → Distance & Rate',
      'Progressive disclosure: Tap "View Details" to open deep rates breakdown table',
      'Clean bottom navigation with crisp icons and readable single-line labels'
    ],
    testActionText: 'Explore Clean Minimalist Layout',
    targetTab: 'map'
  },
  {
    id: 'heuristic-9',
    number: 9,
    title: 'Help Users Recognize, Diagnose, and Recover from Errors',
    definition:
      'Write error messages that explain what happened and how to fix it in plain language. Place feedback near the relevant issue. Preserve entered information and provide actionable recovery options such as retry, edit, or restore.',
    appImplementation:
      'When a search query yields no matches (e.g. typing a typo like "Orchrd"), the app does not show a blank screen. It provides a human-friendly recovery card explaining why, suggests nearby alternative locations ("Did you mean Orchard Road?"), and provides a 1-click "Reset Search" or "Show All Singapore Lots" recovery button.',
    concreteExamples: [
      'Empty search results offer 1-click recovery ("Clear Search" or "Browse Orchard Road")',
      'Preserves the user’s search term in the input so they can easily fix typos',
      'GPS permission denial displays a helpful fallback explaining how to enable location or pick an area manually',
      'Simulated network offline banner with instantaneous "Retry Connection" button'
    ],
    testActionText: 'Inspect Error Recovery UI',
    targetTab: 'list'
  },
  {
    id: 'heuristic-10',
    number: 10,
    title: 'Help and Documentation',
    definition:
      'Provide concise onboarding, contextual guidance, examples, and searchable help where appropriate. Explain unfamiliar features at the point of use without interrupting experienced users.',
    appImplementation:
      'Features a dedicated "Guide & API" tab with comprehensive documentation on Singapore parking rules (Electronic Parking System EPS, season parking restrictions, color-coded lot meanings) and a Developer API Readiness Blueprint showing how to bind the Singapore Government LTA/HDB Carpark Availability APIs.',
    concreteExamples: [
      'Comprehensive Singapore driver parking rules reference guide (HDB vs URA vs Commercial)',
      'Explanation of EPS, In-Vehicle Units (IU), CashCard/NETS FlashPay, and Grace Periods',
      'Color-coded lot guide: White (All motorists), Yellow (Night season), Red (Season only)',
      'Backend API integration readiness guide with LTA Datamall and data.gov.sg schema documentation'
    ],
    testActionText: 'Open Guide & API Specs',
    targetTab: 'guide'
  }
];
