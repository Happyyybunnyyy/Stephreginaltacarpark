import React from 'react';
import { CheckCircle2, RotateCcw, X, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onClose: () => void;
  type?: 'success' | 'info' | 'warning';
}

export const ToastUndo: React.FC<ToastProps> = ({
  message,
  onUndo,
  onClose,
  type = 'success',
}) => {
  return (
    <div
      id="system-status-toast"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-3 text-xs max-w-sm w-[90vw] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="shrink-0">
        {type === 'success' ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : (
          <Info size={16} className="text-blue-400" />
        )}
      </div>

      <span className="flex-1 text-slate-100 font-medium truncate">
        {message}
      </span>

      {onUndo && (
        <button
          onClick={onUndo}
          className="flex items-center gap-1 px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-emerald-300 font-bold transition-colors"
        >
          <RotateCcw size={12} />
          <span>Undo</span>
        </button>
      )}

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};
