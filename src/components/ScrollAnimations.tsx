import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'scale' | 'slide';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isVisible ? 'translateY(0) translateX(0) scale(1)' : undefined,
        ...(animation === 'fade-up' && { transform: isVisible ? undefined : 'translateY(32px)' }),
        ...(animation === 'fade-down' && { transform: isVisible ? undefined : 'translateY(-32px)' }),
        ...(animation === 'fade-left' && { transform: isVisible ? undefined : 'translateX(-32px)' }),
        ...(animation === 'fade-right' && { transform: isVisible ? undefined : 'translateX(32px)' }),
        ...(animation === 'zoom-in' && { transform: isVisible ? undefined : 'scale(0.95)' }),
        ...(animation === 'scale' && { transform: isVisible ? undefined : 'scale(0.75)' }),
        ...(animation === 'slide' && { transform: isVisible ? undefined : 'translateY(100%)' }),
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}

// Staggered reveal for lists
interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: 'fade-up' | 'fade-left' | 'zoom-in';
}

export function StaggerReveal({
  children,
  className = '',
  staggerDelay = 100,
  animation = 'fade-up',
}: StaggerRevealProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          animation={animation}
          delay={index * staggerDelay}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}

// Parallax section wrapper
interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  enableOnMobile?: boolean;
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
  enableOnMobile = false,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!enableOnMobile && isMobile) return;

    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = viewportCenter - elementCenter;
      
      const maxOffset = 100 * speed;
      const newOffset = Math.max(-maxOffset, Math.min(maxOffset, distance * speed));
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, enableOnMobile]);

  const transforms = {
    up: `translateY(${offset}px)`,
    down: `translateY(${-offset}px)`,
    left: `translateX(${offset}px)`,
    right: `translateX(${-offset}px)`,
  };

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      <div
        className={className}
        style={{ transform: transforms[direction], transition: 'transform 0.1s ease-out' }}
      >
        {children}
      </div>
    </div>
  );
}

// Floating element that follows scroll
interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  floatRange?: number;
  floatSpeed?: number;
}

export function FloatingElement({
  children,
  className = '',
  floatRange = 10,
  floatSpeed = 2000,
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % floatSpeed) / floatSpeed;
      const sine = Math.sin(progress * Math.PI * 2);
      setTranslateY(sine * floatRange);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [floatRange, floatSpeed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${translateY}px)`, willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

// Counter animation hook
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
