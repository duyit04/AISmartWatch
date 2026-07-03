import { useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { api } from '../lib/api';

export interface ViewedProduct {
  model: string;
  color: string;
  colorName: string;
  price: number;
  image?: string;
  viewedAt: number;
}

const STORAGE_KEY = 'aiwatch_viewed_products';
const MAX_VIEWED_PRODUCTS = 10;
const SYNC_DEBOUNCE_MS = 1500;

function mapViewedToApi(items: ViewedProduct[]) {
  return items.map(item => ({
    model: item.model,
    color: item.color,
    colorName: item.colorName,
    price: item.price,
    viewedAt: item.viewedAt,
  }));
}

export function useViewedProducts() {
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setViewedProducts(JSON.parse(stored));
      }
    } catch {
      setViewedProducts([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedProducts));
    } catch {
      // ignore
    }
  }, [viewedProducts, isLoaded]);

  const syncViewed = useCallback(async (currentItems: ViewedProduct[]) => {
    try {
      await api.viewed(mapViewedToApi(currentItems));
    } catch {
      toast.error('Sync failed', 'Viewed products could not be synced to server.');
    }
  }, [toast]);

  const syncViewedDebounced = useCallback((currentItems: ViewedProduct[]) => {
    const timeout = setTimeout(() => syncViewed(currentItems), SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [syncViewed]);

  const addViewedProduct = useCallback((product: Omit<ViewedProduct, 'viewedAt'>) => {
    setViewedProducts(prev => {
      const existingIndex = prev.findIndex(
        p => p.model === product.model && p.color === product.color
      );

      let updated: ViewedProduct[];

      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        updated = [
          { ...existing, viewedAt: Date.now() },
          ...prev.slice(0, existingIndex),
          ...prev.slice(existingIndex + 1),
        ];
      } else {
        const newProduct: ViewedProduct = {
          ...product,
          viewedAt: Date.now(),
        };
        updated = [newProduct, ...prev];
      }

      const next = updated.slice(0, MAX_VIEWED_PRODUCTS);
      syncViewedDebounced(next);
      return next;
    });
  }, [syncViewedDebounced]);

  const removeViewedProduct = useCallback((model: string, color: string) => {
    setViewedProducts(prev => {
      const next = prev.filter(p => !(p.model === model && p.color === color));
      syncViewedDebounced(next);
      return next;
    });
  }, [syncViewedDebounced]);

  const clearViewedProducts = useCallback(() => {
    const next: ViewedProduct[] = [];
    setViewedProducts(next);
    syncViewedDebounced(next);
  }, [syncViewedDebounced]);

  const getUniqueProducts = useCallback(() => {
    const seen = new Set<string>();
    return viewedProducts.filter(p => {
      const key = `${p.model}-${p.color}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [viewedProducts]);

  return {
    viewedProducts,
    isLoaded,
    addViewedProduct,
    removeViewedProduct,
    clearViewedProducts,
    getUniqueProducts,
    hasViewedProducts: viewedProducts.length > 0,
    viewedCount: viewedProducts.length,
  };
}
