import { useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { api } from '../lib/api';

export interface CartItem {
  id: string;
  model: '41mm' | '45mm';
  color: 'midnight' | 'silver' | 'gold';
  colorName: string;
  price: number;
  quantity: number;
  addedAt: number;
}

export interface WishlistItem {
  id: string;
  model: '41mm' | '45mm';
  color: 'midnight' | 'silver' | 'gold';
  colorName: string;
  addedAt: number;
}

interface UseCartReturn {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isInCart: (model: string, color: string) => boolean;
}

interface UseWishlistReturn {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  isInWishlist: (model: string, color: string) => boolean;
}

const CART_STORAGE_KEY = 'aiwatch_cart';
const WISHLIST_STORAGE_KEY = 'aiwatch_wishlist';

function generateId(model: string, color: string): string {
  return `${model}-${color}`;
}

function mapCartToApi(items: CartItem[]) {
  return items.map(item => ({
    model: item.model,
    color: item.color,
    colorName: item.colorName,
    price: item.price,
    quantity: item.quantity,
  }));
}

function mapWishlistToApi(items: WishlistItem[]) {
  return items.map(item => ({
    model: item.model,
    color: item.color,
    colorName: item.colorName,
  }));
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const toast = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const syncCart = useCallback(async (currentItems: CartItem[]) => {
    try {
      await api.cart(mapCartToApi(currentItems));
    } catch {
      toast.error('Sync failed', 'Cart could not be synced to server.');
    }
  }, [toast]);

  const addToCart = useCallback((item: Omit<CartItem, 'id' | 'addedAt'>) => {
    const id = generateId(item.model, item.color);
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      const next = existing
        ? prev.map(i => i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i)
        : [...prev, { ...item, id, addedAt: Date.now() }];
      syncCart(next);
      return next;
    });
  }, [syncCart]);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(item => item.id !== id);
      syncCart(next);
      return next;
    });
  }, [syncCart]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => {
      const next = prev.map(item => item.id === id ? { ...item, quantity } : item);
      syncCart(next);
      return next;
    });
  }, [removeFromCart, syncCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    syncCart([]);
  }, [syncCart]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isInCart = useCallback((model: string, color: string) => {
    const id = generateId(model, color);
    return items.some(item => item.id === id);
  }, [items]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isInCart,
  };
}

export function useWishlist(): UseWishlistReturn {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const toast = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const syncWishlist = useCallback(async (currentItems: WishlistItem[]) => {
    try {
      await api.wishlist(mapWishlistToApi(currentItems));
    } catch {
      toast.error('Sync failed', 'Wishlist could not be synced to server.');
    }
  }, [toast]);

  const addToWishlist = useCallback((item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const id = generateId(item.model, item.color);
    setItems(prev => {
      if (prev.some(i => i.id === id)) return prev;
      const next = [...prev, { ...item, id, addedAt: Date.now() }];
      syncWishlist(next);
      return next;
    });
  }, [syncWishlist]);

  const removeFromWishlist = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(item => item.id !== id);
      syncWishlist(next);
      return next;
    });
  }, [syncWishlist]);

  const toggleWishlist = useCallback((item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const id = generateId(item.model, item.color);
    setItems(prev => {
      const next = prev.some(i => i.id === id)
        ? prev.filter(i => i.id !== id)
        : [...prev, { ...item, id, addedAt: Date.now() }];
      syncWishlist(next);
      return next;
    });
  }, [syncWishlist]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    syncWishlist([]);
  }, [syncWishlist]);

  const wishlistCount = items.length;

  const isInWishlist = useCallback((model: string, color: string) => {
    const id = generateId(model, color);
    return items.some(item => item.id === id);
  }, [items]);

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount,
    isInWishlist,
  };
}
