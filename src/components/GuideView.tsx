import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  HelpCircle,
  ShieldAlert,
  Clock,
  Car,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';

export const GuideView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'rules' | 'api'>('rules');

  const sampleApiJson = `{
  "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/$metadata#CarParkAvailability",
  "value": [
    {
      "CarParkID": "1",
      "Area": "Marina",
      "Development": "Suntec City",
      "Location": "1.2934 103.8572",
      "AvailableLots": 418,
      "LotType": "C",
      "Agency": "LTA"
    },
    {
      "CarParkID": "2",
      "Area": "Orchard",
      "Development": "ION Orchard",
      "Location": "1.3040 103.8318",
      "AvailableLots": 14,
      "LotType": "C",
      "Agency": "LTA"
    }
  ]
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleApiJson);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div id="guide-and-api-view" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen size={15} />
          <span>Singapore Driver Handbook & API Blueprint</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Help, Guidelines & Integration Docs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
          Clear contextual guidance on Singapore parking regulations (Heuristic 10: Help and Documentation) 
          and production-ready API integration contracts for binding Singapore Government real-time data feeds.
        </p>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 mt-5 p-1 bg-slate-100 rounded-2xl w-fit border border-slate-200">
          <button
            onClick={() => setActiveGuideTab('rules')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGuideTab === 'rules'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Singapore Parking Rules
          </button>
          <button
            onClick={() => setActiveGuideTab('api')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGuideTab === 'api'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            API Connection Blueprint
          </button>
        </div>
      </div>

      {activeGuideTab === 'rules' ? (
        /* Singapore Parking Rules Section */
        <div className="space-y-4">
          {/* Color Coded Lots Guide */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Car size={16} className="text-emerald-600" />
              <span>Understanding Singapore Lot Markings & Colors</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-white" />
                  <strong className="text-slate-900 font-bold">White Lots</strong>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Available to all motorists during standard operating hours. Normal parking charges apply via Electronic Parking System (EPS) or parking.sg.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 bg-amber-400" />
                  <strong className="text-amber-950 font-bold">Yellow Lots</strong>
                </div>
                <p className="text-amber-900/80 text-[11px] leading-relaxed">
                  Designated central area or heavy demand lots. Higher hourly rate ($1.20 per 30 mins) applies between 7:00 AM – 5:00 PM (Mon-Sat).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-rose-500 bg-rose-400" />
                  <strong className="text-rose-950 font-bold">Red / Bi-colour Lots</strong>
                </div>
                <p className="text-rose-900/80 text-[11px] leading-relaxed">
                  <strong>Restricted:</strong> Pure red lots are 24/7 Season Parking only. Red-and-White lots become season-only after 7:00 PM and all day Sundays.
                </p>
              </div>
            </div>
          </div>

          {/* Key Singapore Regulations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Clock size={16} className="text-emerald-600" />
                <span>Grace Period (10 – 15 Minutes)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Most HDB and URA carparks provide a <strong>15-minute grace period</strong> (commercial malls typically offer 10 minutes). 
                If you exit the gantry within this window without picking up or parking, you are not charged.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <CreditCard size={16} className="text-emerald-600" />
                <span>Electronic Parking System (EPS)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Overhead antenna gantries read your vehicle's In-Vehicle Unit (IU) on entry and exit. Charges are automatically deducted 
                from your inserted CashCard, NETS FlashPay, Motoring Card, or registered EZ-Link Motoring card.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Info size={16} className="text-emerald-600" />
                <span>Sunday Free Parking (FPS)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Selected HDB carparks outside the Central Area offer <strong>Free Parking on Sundays and Public Holidays</strong> from 7:30 AM to 10:30 PM. 
                Look for the orange "Free Parking Scheme" notice boards at gantry entrances.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Zap size={16} className="text-cyan-600" />
                <span>EV Charging Networks</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                EV lots in Singapore (operated by SP Group, Shell Recharge, CDG ENGIE, Charge+) are reserved strictly for charging electric vehicles. 
                Standard parking fees continue to accrue in addition to per-kWh charging rates.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* API Connection Blueprint Section */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Code2 size={16} className="text-emerald-600" />
                <span>Official Singapore Carpark Data Sources</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Frontend Ready
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This application's data models in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">src/types.ts</code> 
              are designed 1:1 against Singapore’s two primary real-time APIs:
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span>1. LTA DataMall Car Park Availability v2</span>
                  <a
                    href="https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline flex items-center gap-0.5 text-[11px]"
                  >
                    API Docs <ExternalLink size={10} />
                  </a>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Covers major commercial shopping centres (Suntec, Marina Bay Sands, ION Orchard, Vivocity, etc.) and central expressways.
                </p>
                <div className="mt-1.5 font-mono text-[10px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                  GET https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span>2. Data.gov.sg HDB Real-Time Carpark Availability</span>
                  <a
                    href="https://beta.data.gov.sg/datasets?query=carpark+availability"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:underline flex items-center gap-0.5 text-[11px]"
                  >
                    Data.gov.sg <ExternalLink size={10} />
                  </a>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Covers all 2,000+ HDB multi-storey and surface carparks across all Singapore heartland towns.
                </p>
                <div className="mt-1.5 font-mono text-[10px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                  GET https://api.data.gov.sg/v1/transport/carpark-availability
                </div>
              </div>
            </div>
          </div>

          {/* Code Sample */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">Sample LTA JSON Response Payload</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 bg-white/10 rounded-lg transition-colors"
              >
                {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCode ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto p-2 bg-slate-950/80 rounded-xl max-h-56">
              {sampleApiJson}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
