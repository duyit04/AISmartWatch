import { useState, useEffect, useCallback } from 'react';

interface UseParallaxOptions {
  speed?: number; // 0-1, lower = slower movement
  direction?: 'vertical' | 'horizontal';
  maxOffset?: number; // max pixels to move
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, direction = 'vertical', maxOffset = 100 } = options;
  
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const newOffset = scrollY * speed;
    const clampedOffset = Math.min(Math.max(newOffset, -maxOffset), maxOffset);
    
    if (direction === 'vertical') {
      setOffset(clampedOffset);
    }
  }, [speed, direction, maxOffset]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return direction === 'vertical' ? { translateY: offset } : { translateX: offset };
}

interface UseScrollProgressReturn {
  progress: number; // 0-1
  isScrollingDown: boolean;
  scrollDirection: 'up' | 'down' | 'none';
  scrollPercentage: number; // 0-100
}

export function useScrollProgress(): UseScrollProgressReturn {
  const [progress, setProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none');
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = documentHeight > 0 ? scrollY / documentHeight : 0;
      
      setProgress(Math.min(Math.max(scrollProgress, 0), 1));
      setScrollPercentage(Math.round(scrollProgress * 100));
      
      if (scrollY > lastScrollY + 5) {
        setScrollDirection('down');
      } else if (scrollY < lastScrollY - 5) {
        setScrollDirection('up');
      } else {
        setScrollDirection('none');
      }
      
      setLastScrollY(scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return {
    progress,
    isScrollingDown: scrollDirection === 'down',
    scrollDirection,
    scrollPercentage,
  };
}

// Enhanced scroll animation with stagger
export function useStaggerAnimation(itemCount: number, baseDelay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger reveal each item
            for (let i = 0; i < itemCount; i++) {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, i]);
              }, i * baseDelay);
            }
          } else {
            // Reset when out of view
            setVisibleItems([]);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef);
    return () => observer.disconnect();
  }, [containerRef, itemCount, baseDelay]);

  return { containerRef: setContainerRef, visibleItems };
}
