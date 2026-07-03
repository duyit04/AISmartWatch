import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Battery, Droplets, Brain } from 'lucide-react';
import { smoothScrollTo } from '../lib/utils';

const stats = [
  { icon: Battery, label: '14-Day Battery', value: '14' },
  { icon: Droplets, label: 'Water Resistant', value: '50m' },
  { icon: Brain, label: 'AI Features', value: '50+' },
];

export function Hero() {
  const watchRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!watchRef.current) return;
      
      const rect = watchRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 20;
      const y = (e.clientY - rect.top - rect.height / 2) / 20;
      
      watchRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    const handleMouseLeave = () => {
      if (!watchRef.current) return;
      watchRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    };

    const watch = watchRef.current;
    if (watch) {
      watch.addEventListener('mousemove', handleMouseMove);
      watch.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (watch) {
        watch.removeEventListener('mousemove', handleMouseMove);
        watch.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Parallax calculations
  const parallaxY = scrollY * 0.3;
  const contentParallax = Math.max(0, 1 - scrollY / 600);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements with Parallax */}
      <div 
        className="absolute inset-0 gradient-bg opacity-20"
        style={{ transform: `translateY(${parallaxY * 0.5}px)` }}
      />
      <div 
        className="absolute inset-0 grid-pattern opacity-30"
        style={{ transform: `translateY(${parallaxY * 0.3}px)` }}
      />
      
      {/* Floating orbs with parallax */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-primary)] rounded-full blur-[128px] opacity-20 animate-float"
        style={{ 
          transform: `translateY(${parallaxY * 0.4}px)`,
          animationDuration: '8s' 
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-secondary)] rounded-full blur-[128px] opacity-20 animate-float"
        style={{ 
          transform: `translateY(${-parallaxY * 0.4}px)`,
          animationDuration: '10s',
          animationDelay: '2s'
        }}
      />

      <div className="container-custom relative z-10">
        <div 
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          style={{ 
            opacity: contentParallax,
            transform: `translateY(${parallaxY * 0.2}px)`
          }}
        >
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="text-sm font-medium text-[var(--accent-primary)]">Launching August 1, 2026</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-[var(--text-primary)]">The Future of</span>
              <br />
              <span className="gradient-text">Time is Here</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-xl mx-auto lg:mx-0">
              AI-powered smartwatch with 14-day battery life. Your health, your style, elevated to extraordinary heights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button
                onClick={() => smoothScrollTo('preorder')}
                className="btn-primary group"
              >
                Pre-order Now - $299
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => smoothScrollTo('features')}
                className="btn-secondary group"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl bg-[var(--card-bg)] backdrop-blur border border-[var(--card-border)] animate-on-scroll visible"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-[var(--accent-primary)]" />
                  <div className="font-mono text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Watch Mockup */}
          <div className="relative flex items-center justify-center">
            <div
              ref={watchRef}
              className="relative w-72 h-72 md:w-96 md:h-96 transition-transform duration-300 ease-out animate-float"
              style={{ animationDuration: '6s' }}
            >
              {/* Watch glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] blur-3xl opacity-30 animate-pulse-glow" />
              
              {/* Watch body */}
              <div className="absolute inset-8 rounded-[3rem] bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl border border-zinc-700/50 overflow-hidden">
                {/* Screen */}
                <div className="absolute inset-2 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
                  {/* Watch face */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    {/* Time */}
                    <div className="font-mono text-4xl md:text-5xl font-bold text-white mb-2">
                      10:30
                    </div>
                    <div className="text-sm text-zinc-400 mb-6">Thursday, Jul 2</div>
                    
                    {/* Mini stats */}
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-xs text-zinc-500 mb-1">HR</div>
                        <div className="font-mono text-lg font-semibold text-[var(--accent-secondary)]">72</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-zinc-500 mb-1">Steps</div>
                        <div className="font-mono text-lg font-semibold text-white">8.4k</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-zinc-500 mb-1">Cal</div>
                        <div className="font-mono text-lg font-semibold text-[var(--accent-primary)]">420</div>
                      </div>
                    </div>
                  </div>

                  {/* Screen reflection */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-[2.5rem]" />
                </div>
              </div>

              {/* Side button */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-12 rounded-r-full bg-zinc-700" />
              <div className="absolute right-2 top-[calc(50%+20px)] -translate-y-1/2 w-2 h-8 rounded-r-full bg-zinc-600" />
            </div>

            {/* Floating badges */}
            <div className="absolute top-10 right-0 md:right-10 px-4 py-2 rounded-full glass animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Battery className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">Battery</div>
                  <div className="font-mono text-sm font-bold">100%</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 md:left-10 px-4 py-2 rounded-full glass animate-float" style={{ animationDelay: '3s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">AI Status</div>
                  <div className="text-sm font-bold text-green-500">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-[var(--text-secondary)] flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-[var(--text-secondary)] animate-pulse" />
        </div>
        <span className="text-xs text-[var(--text-secondary)]">Scroll</span>
      </div>
    </section>
  );
}
