import { useCallback, useRef } from 'react';

interface UseBehaviorTrackingOptions {
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

const SESSION_STORAGE_KEY = 'aiwatch_session_id';

function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

async function sendEvent(event: TrackingEvent): Promise<void> {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': event.sessionId,
      },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // Tracking is best-effort; never block UX on it
  }
}

export function useBehaviorTracking(options: UseBehaviorTrackingOptions = {}) {
  const { enableClickTracking = true, enableScrollTracking = true } = options;
  const sessionIdRef = useRef<string>(getSessionId());

  const track = useCallback((event: Omit<TrackingEvent, 'timestamp' | 'sessionId' | 'page'>) => {
    const trackingEvent: TrackingEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: sessionIdRef.current,
      page: window.location.pathname + window.location.hash,
    };

    if (import.meta.env.DEV) {
      console.log('[Track]', trackingEvent);
    }

    void sendEvent(trackingEvent);
    return trackingEvent;
  }, []);

  const trackClick = useCallback(
    (target: string, metadata?: Record<string, unknown>) => {
      if (!enableClickTracking) return;
      return track({
        type: 'click',
        action: 'element_clicked',
        target,
        metadata,
      });
    },
    [track, enableClickTracking],
  );

  const trackScroll = useCallback(
    (depth: number, section?: string) => {
      if (!enableScrollTracking) return;
      return track({
        type: 'scroll',
        action: 'page_scrolled',
        target: section,
        metadata: { depth: Math.round(depth) },
      });
    },
    [track, enableScrollTracking],
  );

  const trackSectionView = useCallback(
    (sectionId: string, sectionName: string) => {
      return track({
        type: 'section_view',
        action: 'section_viewed',
        target: sectionId,
        metadata: { sectionName },
      });
    },
    [track],
  );

  const trackAddToCart = useCallback(
    (product: { model: string; color: string; price: number }) => {
      return track({
        type: 'add_to_cart',
        action: 'product_added_to_cart',
        target: `${product.model}-${product.color}`,
        metadata: { price: product.price },
      });
    },
    [track],
  );

  const trackAddToWishlist = useCallback(
    (product: { model: string; color: string }) => {
      return track({
        type: 'add_to_wishlist',
        action: 'product_added_to_wishlist',
        target: `${product.model}-${product.color}`,
      });
    },
    [track],
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean) => {
      return track({
        type: 'form_submit',
        action: 'form_submitted',
        target: formName,
        metadata: { success },
      });
    },
    [track],
  );

  const trackChatbotOpen = useCallback(() => {
    return track({
      type: 'chatbot_open',
      action: 'chatbot_opened',
    });
  }, [track]);

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
