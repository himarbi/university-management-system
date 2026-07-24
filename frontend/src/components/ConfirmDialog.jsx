import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  detail = '',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning'
  loading = false
}) => {
  if (!open) return null;

  const variants = {
    danger: {
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      buttonBg: 'bg-rose-600 hover:bg-rose-700',
      ring: 'ring-rose-500/20',
    },
    warning: {
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      buttonBg: 'bg-amber-600 hover:bg-amber-700',
      ring: 'ring-amber-500/20',
    },
  };

  const v = variants[variant] || variants.danger;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.12s_ease-out]">
      <div 
        className={`bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-[fadeIn_0.15s_ease-out] ring-1 ${v.ring}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with icon */}
        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
          <div className={`p-3 rounded-xl ${v.iconBg} shrink-0`}>
            <AlertTriangle className={`h-6 w-6 ${v.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-[#0f224a] leading-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {message}
            </p>
            {detail && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-500 font-semibold break-all">
                  {detail}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200 transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl ${v.buttonBg} text-white text-sm font-bold shadow-md transition-all disabled:opacity-50`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
