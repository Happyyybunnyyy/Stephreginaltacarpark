import React, { useState } from 'react';
import { Carpark } from '../types';
import { X, Clock, Timer, Check, AlertCircle } from 'lucide-react';

interface ParkingTimerModalProps {
  carpark: Carpark | null;
  onClose: () => void;
  onStartSession: (carpark: Carpark, ratePerHour: number, gracePeriodMins: number) => void;
}

export const ParkingTimerModal: React.FC<ParkingTimerModalProps> = ({
  carpark,
  onClose,
  onStartSession,
}) => {
  if (!carpark) return null;

  // Extract base rate
  const rateMatch = carpark.rates.weekdayPeak.match(/\$([0-9.]+)/);
  const baseRate = rateMatch ? parseFloat(rateMatch[1]) : 2.5;

  const [reminderGrace, setReminderGrace] = useState(true);

  const handleConfirm = () => {
    onStartSession(carpark, baseRate, carpark.rates.gracePeriodMins);
    onClose();
  };

  return (
    <div
      id="parking-timer-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <Timer size={18} />
            <span>Start Parking Timer</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {carpark.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Track your parked duration, receive grace period alerts, and estimate your ERP parking charges accurately.
        </p>

        <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span>Grace Period Window</span>
            <strong className="text-emerald-700 font-bold">
              {carpark.rates.gracePeriodMins} Minutes (Free Exit)
            </strong>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span>Base Hourly Tariff</span>
            <strong className="text-slate-900 font-bold">
              ${baseRate.toFixed(2)}/hr
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <input
            id="grace-reminder-checkbox"
            type="checkbox"
            checked={reminderGrace}
            onChange={(e) => setReminderGrace(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <label htmlFor="grace-reminder-checkbox" className="text-xs text-slate-700 cursor-pointer">
            Alert me 2 minutes before {carpark.rates.gracePeriodMins}-min grace period ends
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
          >
            Start Timer
          </button>
        </div>
      </div>
    </div>
  );
};
