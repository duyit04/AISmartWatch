import { useCallback } from 'react';
import { useToast } from './ToastContext';

interface UseBehaviorTrackingOptions {
  webhookUrl?: string;
  enableClickTracking?: boolean;
  enableScrollTracking?: boolean;
}

interface TrackingEvent {
  type: 'click' | 'scroll' | 'page_view' | 'add_to_cart' | 'add_to_wishlist' | 'form_submit' | 'chatbot_open' | 'section_view';
  action: string;
  target?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
  page: string;
}

export function useBehaviorTracking(options: UseBehaviorTrackingOptions = {}) {
  const { webhookUrl, enableClickTracking = true, enableScrollTracking = true } = options;
  const toast = useToast();

  // Generate or retrieve session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('aiwatch_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('aiwatch_session_id', sessionId);
    }
    return sessionId;
  };

  // Track event
  const track = useCallback((event: Omit<TrackingEvent, 'timestamp' | 'sessionId' | 'page'>) => {
    const trackingEvent: TrackingEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      page: window.location.pathname + window.location.hash,
    };

    // Send to webhook if configured
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingEvent),
      }).catch(() => {}); // Silently fail
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('[Track]', trackingEvent);
    }

    return trackingEvent;
  }, [webhookUrl]);

  // Click tracking
  const trackClick = useCallback((target: string, metadata?: Record<string, unknown>) => {
    if (!enableClickTracking) return;
    
    const event = track({
      type: 'click',
      action: 'element_clicked',
      target,
      metadata,
    });

    // Show toast for certain actions
    if (target.includes('add-to-cart')) {
      toast.success('Added to Cart!', 'Product has been added to your cart.');
    } else if (target.includes('add-to-wishlist') || target.includes('wishlist')) {
      toast.success('Added to Wishlist!', 'Product saved to your favorites.');
    } else if (target.includes('preorder') || target.includes('submit')) {
      toast.success('Submitted Successfully!', 'Your pre-order has been received.');
    }

    return event;
  }, [track, enableClickTracking, toast]);

  // Scroll tracking
  const trackScroll = useCallback((depth: number, section?: string) => {
    if (!enableScrollTracking) return;
    
    return track({
      type: 'scroll',
      action: 'page_scrolled',
      target: section,
      metadata: { depth: Math.round(depth) },
    });
  }, [track, enableScrollTracking]);

  // Section view tracking
  const trackSectionView = useCallback((sectionId: string, sectionName: string) => {
    return track({
      type: 'section_view',
      action: 'section_viewed',
      target: sectionId,
      metadata: { sectionName },
    });
  }, [track]);

  // Cart tracking
  const trackAddToCart = useCallback((product: { model: string; color: string; price: number }) => {
    const event = track({
      type: 'add_to_cart',
      action: 'product_added_to_cart',
      target: `${product.model}-${product.color}`,
      metadata: { price: product.price },
    });
    
    toast.success('Added to Cart!', `${product.model} ${product.color} added to your cart.`);
    return event;
  }, [track, toast]);

  // Wishlist tracking
  const trackAddToWishlist = useCallback((product: { model: string; color: string }) => {
    const event = track({
      type: 'add_to_wishlist',
      action: 'product_added_to_wishlist',
      target: `${product.model}-${product.color}`,
    });
    
    toast.success('Saved to Favorites!', 'Product added to your wishlist.');
    return event;
  }, [track, toast]);

  // Form submit tracking
  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    const event = track({
      type: 'form_submit',
      action: 'form_submitted',
      target: formName,
      metadata: { success },
    });
    
    if (success) {
      toast.success('Success!', 'Your information has been submitted.');
    } else {
      toast.error('Submission Failed', 'Please try again.');
    }
    return event;
  }, [track, toast]);

  // Chatbot tracking
  const trackChatbotOpen = useCallback(() => {
    return track({
      type: 'chatbot_open',
      action: 'chatbot_opened',
    });
  }, [track]);

  // Page view tracking
  const trackPageView = useCallback(() => {
    return track({
      type: 'page_view',
      action: 'page_viewed',
    });
  }, [track]);

  return {
    track,
    trackClick,
    trackScroll,
    trackSectionView,
    trackAddToCart,
    trackAddToWishlist,
    trackFormSubmit,
    trackChatbotOpen,
    trackPageView,
  };
}
