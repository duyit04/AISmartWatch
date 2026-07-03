import { X, Clock, Trash2, Eye } from 'lucide-react';
import { useViewedProducts } from '../hooks/useViewedProducts';

interface ViewedProductsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProduct?: (model: string, color: string) => void;
}

const colorHexMap: Record<string, string> = {
  midnight: '#1a1a1a',
  silver: '#c0c0c0',
  gold: '#d4af37',
};

export function ViewedProductsDrawer({ isOpen, onClose, onViewProduct }: ViewedProductsDrawerProps) {
  const { viewedProducts, removeViewedProduct, clearViewedProducts } = useViewedProducts();

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-full bg-[var(--bg-primary)] border-l border-[var(--border-color)] z-50 flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="font-semibold text-[var(--text-primary)]">Recently Viewed</h2>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
              {viewedProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {viewedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Eye className="w-12 h-12 text-[var(--text-secondary)]/50 mb-4" />
              <p className="text-[var(--text-secondary)]">No products viewed yet</p>
              <p className="text-sm text-[var(--text-secondary)]/70 mt-1">
                Products you view will appear here
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {viewedProducts.map((product, index) => (
                <div
                  key={`${product.model}-${product.color}-${index}`}
                  className="group p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]/30 transition-colors cursor-pointer"
                  onClick={() => onViewProduct?.(product.model, product.color)}
                >
                  <div className="flex items-start gap-3">
                    {/* Color indicator */}
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: colorHexMap[product.color] || '#666' }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--text-primary)]">
                          {product.model}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)]">
                          • {product.colorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
                        <span className="text-xs text-[var(--text-secondary)]">
                          {formatTime(product.viewedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeViewedProduct(product.model, product.color);
                      }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
                      aria-label="Remove from history"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {viewedProducts.length > 0 && (
          <div className="p-4 border-t border-[var(--border-color)]">
            <button
              onClick={clearViewedProducts}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        )}
      </div>
    </>
  );
}
