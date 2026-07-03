import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast, type ToastType } from '../hooks/ToastContext';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const borderColors: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  info: 'border-l-blue-500',
  warning: 'border-l-yellow-500',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] border-l-4 ${borderColors[toast.type]} shadow-2xl animate-slide-in backdrop-blur-sm`}
          role="alert"
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--text-primary)] text-sm">
              {toast.title}
            </p>
            {toast.message && (
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>
      ))}
    </div>
  );
}
