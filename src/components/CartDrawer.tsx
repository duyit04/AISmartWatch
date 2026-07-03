import { X, Plus, Minus, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useCartContext } from '../hooks/CartContext';
import type { CartItem } from '../hooks/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, wishlist } = useCartContext();

  const handleMoveToWishlist = (item: CartItem) => {
    wishlist.addToWishlist({
      model: item.model,
      color: item.color,
      colorName: item.colorName,
    });
    cart.removeFromCart(item.id);
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
              <ShoppingBag className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Your Cart</h2>
              {cart.cartCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--accent-primary)] text-white">
                  {cart.cartCount}
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
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Your cart is empty
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  Add items to your cart to see them here
                </p>
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
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
                            onClick={() => cart.removeFromCart(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-[var(--border-color)] transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold text-[var(--text-primary)]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-[var(--border-color)] transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-mono text-lg font-bold text-[var(--text-primary)]">
                              ${modelPrices[item.model] * item.quantity}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              ${modelPrices[item.model]} each
                            </div>
                          </div>
                        </div>

                        {/* Move to wishlist */}
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          className="mt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Move to wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--text-secondary)]">Subtotal</span>
                <span className="font-mono text-2xl font-bold text-[var(--text-primary)]">
                  ${cart.cartTotal}
                </span>
              </div>
              <button className="btn-primary w-full text-lg py-4">
                Checkout — ${cart.cartTotal}
              </button>
              <p className="mt-3 text-xs text-center text-[var(--text-secondary)]">
                Shipping calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
