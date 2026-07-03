import { createContext, useContext, type ReactNode } from 'react';
import { useCart, useWishlist, type CartItem, type WishlistItem } from './useCart';

interface CartContextValue {
  cart: {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isInCart: (model: string, color: string) => boolean;
  };
  wishlist: {
    items: WishlistItem[];
    addToWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
    removeFromWishlist: (id: string) => void;
    toggleWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
    clearWishlist: () => void;
    wishlistCount: number;
    isInWishlist: (model: string, color: string) => boolean;
  };
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartHook = useCart();
  const wishlistHook = useWishlist();

  return (
    <CartContext.Provider value={{ cart: cartHook, wishlist: wishlistHook }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
