import { useState, useEffect } from 'react';
import { Clock, Zap, AlertTriangle } from 'lucide-react';
import { ScrollReveal, ParallaxSection } from './ScrollAnimations';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

interface FlipCardProps {
  value: string;
  label: string;
}

function FlipCard({ value, label }: FlipCardProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Top half */}
        <div className="w-16 h-14 md:w-20 md:h-16 rounded-xl bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--card-bg)] border border-[var(--card-border)] shadow-lg overflow-hidden">
          <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border-color)]" />
          <div 
            className={`absolute inset-0 flex items-center justify-center font-mono text-3xl md:text-4xl font-bold text-[var(--text-primary)] transition-all duration-300 ${
              isFlipping ? '[transform:perspective(200px)_rotateX(-90deg)] opacity-0' : '[transform:perspective(200px)_rotateX(0)] opacity-100'
            }`}
          >
            {prevValue}
          </div>
          <div 
            className={`absolute inset-0 flex items-center justify-center font-mono text-3xl md:text-4xl font-bold text-[var(--text-primary)] transition-all duration-300 ${
              isFlipping ? '[transform:perspective(200px)_rotateX(0)] opacity-100' : '[transform:perspective(200px)_rotateX(90deg)] opacity-0'
            }`}
          >
            {value}
          </div>
        </div>
        
        {/* Bottom half */}
        <div className="w-16 h-14 md:w-20 md:h-16 -mt-1 rounded-b-xl bg-gradient-to-t from-[var(--bg-secondary)] to-[var(--card-bg)] border border-t-0 border-[var(--card-border)] shadow-lg overflow-hidden">
          <div 
            className="absolute inset-0 flex items-center justify-center font-mono text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
          >
            {value}
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      </div>
      <span className="mt-3 text-xs md:text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  // Set launch date to 30 days from August 1, 2026
  const launchDate = new Date('2026-08-01T00:00:00');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(launchDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(launchDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section id="countdown" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-secondary)]/5" />
      <div className="absolute inset-0 grid-pattern opacity-5" />
      
      <div className="container-custom relative z-10">
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
              <span className="text-[var(--accent-primary)] font-semibold">Mark Your Calendar</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Launching <span className="gradient-text">August 1, 2026</span>
            </h2>
            
            <p className="text-lg text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
              Be among the first to experience the future of smartwatches. Limited first batch available.
            </p>
          </div>
        </ScrollReveal>

        {/* Countdown — four flip cards sit on a single parallax layer so the whole
            timer floats gently while the user scrolls */}
        <ScrollReveal animation="zoom-in" duration={700} delay={150}>
          <ParallaxSection speed={0.25} direction="up" className="flex items-start justify-center gap-3 md:gap-6 mb-8">

          {/* Countdown — four flip cards */}
          <FlipCard value={formatNumber(timeLeft.days)} label="Days" />
          <span className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mt-8 md:mt-10">:</span>
          <FlipCard value={formatNumber(timeLeft.hours)} label="Hours" />
          <span className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mt-8 md:mt-10">:</span>
          <FlipCard value={formatNumber(timeLeft.minutes)} label="Minutes" />
          <span className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mt-8 md:mt-10">:</span>
          <FlipCard value={formatNumber(timeLeft.seconds)} label="Seconds" />
          </ParallaxSection>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" duration={600} delay={200}>
          <div className="max-w-4xl mx-auto text-center">

          {/* Urgency Banner */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-orange-500 font-semibold">
              Limited First Batch — Only 5,000 units available
            </span>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>

          {/* CTA */}
          <div className="mt-10">
            <a
              href="#preorder"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('preorder')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Reserve Yours Now
            </a>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
