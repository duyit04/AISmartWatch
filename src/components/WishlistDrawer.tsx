import { X, Heart, ShoppingBag, Trash2, MoveRight } from 'lucide-react';
import { useCartContext } from '../hooks/CartContext';
import type { WishlistItem } from '../hooks/useCart';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

const colorMap: Record<string, { name: string; hex: string }> = {
  midnight: { name: 'Midnight Black', hex: '#1a1a1a' },
  silver: { name: 'Silver', hex: '#c0c0c0' },
  gold: { name: 'Gold', hex: '#d4af37' },
};

const modelPrices: Record<string, number> = {
  '41mm': 299,
  '45mm': 329,
};

export function WishlistDrawer({ isOpen, onClose, onOpenCart }: WishlistDrawerProps) {
  const { cart, wishlist } = useCartContext();

  const handleMoveToCart = (item: WishlistItem) => {
    cart.addToCart({
      model: item.model,
      color: item.color,
      colorName: item.colorName,
      price: modelPrices[item.model],
      quantity: 1,
    });
    wishlist.removeFromWishlist(item.id);
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (!cart.isInCart(item.model, item.color)) {
      cart.addToCart({
        model: item.model,
        color: item.color,
        colorName: item.colorName,
        price: modelPrices[item.model],
        quantity: 1,
      });
    }
    onOpenCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-primary)] shadow-2xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Wishlist</h2>
                {wishlist.wishlistCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                    {wishlist.wishlistCount}
                  </span>
                )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlist.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                  <Heart className="w-10 h-10 text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  Save items you love for later
                </p>
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[var(--card-bg)] backdrop-blur border border-[var(--card-border)]"
                  >
                    <div className="flex gap-4">
                      {/* Product image placeholder */}
                      <div className="w-20 h-20 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full border-2 border-[var(--border-color)]"
                          style={{ backgroundColor: colorMap[item.color]?.hex }}
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)]">
                              AI Watch {item.model}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {item.colorName}
                            </p>
                          </div>
                          <button
                            onClick={() => wishlist.removeFromWishlist(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
                            ${modelPrices[item.model]}
                          </div>

                          <div className="flex items-center gap-2">
                            {cart.isInCart(item.model, item.color) ? (
                              <button
                                onClick={onOpenCart}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 rounded-lg hover:bg-[var(--accent-primary)]/20 transition-colors"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                In Cart
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-[var(--accent-primary)] rounded-lg hover:bg-[var(--accent-primary)]/80 transition-colors"
                              >
                                <MoveRight className="w-4 h-4" />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlist.items.length > 0 && (
            <div className="p-6 border-t border-[var(--border-color)]">
              <button
                onClick={() => {
                  wishlist.items.forEach(item => handleMoveToCart(item));
                }}
                className="btn-primary w-full text-lg py-4"
              >
                Add All to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
