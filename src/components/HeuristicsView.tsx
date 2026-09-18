import React, { useState } from 'react';
import { USABILITY_HEURISTICS } from '../data/heuristicsData';
import { HeuristicItem } from '../types';
import { Sparkles, CheckCircle2, ArrowRight, BookOpen, Layers, Search, ShieldCheck } from 'lucide-react';
import { NavTab } from './BottomNav';

interface HeuristicsViewProps {
  onNavigateToTab: (tab: NavTab) => void;
  onTriggerHeuristicDemo?: (heuristicId: string) => void;
}

export const HeuristicsView: React.FC<HeuristicsViewProps> = ({
  onNavigateToTab,
  onTriggerHeuristicDemo,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('heuristic-1');

  const filteredHeuristics = USABILITY_HEURISTICS.filter(
    (h) =>
      h.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      h.definition.toLowerCase().includes(filterQuery.toLowerCase()) ||
      h.appImplementation.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div id="heuristics-framework-view" className="space-y-6 pb-12">
      {/* Framework Introduction Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles size={14} />
          <span>UX Evaluation & Design System</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          10 Usability Heuristics Framework
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
          Drivers navigating Singapore’s arterial expressways and bustling CBD towers cannot afford confusing interfaces or ambiguous parking data. 
          Every screen, indicator, and transition in this application is intentionally structured according to Jakob Nielsen's 10 Usability Heuristics.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Primary Target</span>
            <span className="font-semibold text-white">Singapore Drivers</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Core Objective</span>
            <span className="font-semibold text-emerald-400">Zero Driver Error & Real-time Clarity</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[11px]">Framework Standard</span>
            <span className="font-semibold text-white">10 Nielsen Heuristics</span>
          </div>
        </div>
      </div>

      {/* Filter / Search within Heuristics */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search heuristics (e.g. Error, Status, Control)..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredHeuristics.length} of 10 Heuristics
        </span>
      </div>

      {/* Heuristics Cards Grid */}
      <div className="space-y-4">
        {filteredHeuristics.map((heuristic) => {
          const isExpanded = expandedId === heuristic.id;

          return (
            <div
              key={heuristic.id}
              id={`heuristic-card-${heuristic.number}`}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : heuristic.id)}
                className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                    #{heuristic.number}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {heuristic.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {heuristic.definition}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-slate-400 shrink-0 font-medium mt-1">
                  {isExpanded ? 'Collapse' : 'Details'}
                </span>
              </div>

              {/* Expanded Deep Breakdown */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in fade-in duration-200">
                  {/* How it is implemented in this Carpark App */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>How This Carpark Application Implements It</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {heuristic.appImplementation}
                    </p>
                  </div>

                  {/* Concrete Examples Checklist */}
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Key Concrete Design Implementations
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {heuristic.concreteExamples.map((example, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 text-slate-700"
                        >
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Action Button (Test in App) */}
                  {heuristic.targetTab && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-500">
                        Experience this heuristic directly in the interface:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (heuristic.targetTab) {
                            onNavigateToTab(heuristic.targetTab);
                          }
                          if (onTriggerHeuristicDemo) {
                            onTriggerHeuristicDemo(heuristic.id);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                      >
                        <span>{heuristic.testActionText || 'See in Action'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
