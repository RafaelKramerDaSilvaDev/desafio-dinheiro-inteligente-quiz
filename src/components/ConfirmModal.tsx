import { AlertTriangle, Trash2, RotateCcw, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const icons = {
  danger: Trash2,
  warning: AlertTriangle,
  info: RotateCcw,
};

const colors = {
  danger: 'bg-red-500 hover:bg-red-600',
  warning: 'bg-amber hover:bg-amber-dark',
  info: 'bg-primary hover:bg-primary-dark',
};

const iconBg = {
  danger: 'bg-red-100 text-red-600',
  warning: 'bg-amber-100 text-amber-dark',
  info: 'bg-primary-100 text-primary-dark',
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const Icon = icons[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconBg[variant]}`}>
            <Icon size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold text-sm ${colors[variant]}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
