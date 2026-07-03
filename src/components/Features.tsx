import { Heart, Battery, Sun, Droplets, MapPin} from 'lucide-react';
import { useAnimatedElements } from '../hooks/useScrollAnimation';
import { ScrollReveal, AnimatedCounter } from './ScrollAnimations';

const features = [
  {
    icon: Heart,
    title: 'AI Health Monitor',
    description: 'Advanced AI analyzes your heart rate, sleep patterns, and stress levels 24/7. Get personalized insights and early warning alerts.',
    stats: '50+ biomarkers',
    size: 'large',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    icon: Battery,
    title: '14-Day Battery',
    description: 'Revolutionary power efficiency keeps you going for two weeks on a single charge. Spend less time charging, more time living.',
    stats: '14 days',
    size: 'wide',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: Sun,
    title: 'Always-On Display',
    description: '1.9" AMOLED with 2000 nits peak brightness, visible in direct sunlight.',
    stats: '2000 nits',
    size: 'normal',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    icon: Droplets,
    title: '50m Water Resistant',
    description: 'Swim, surf, or shower. Built to withstand your adventures.',
    stats: '5 ATM',
    size: 'normal',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: MapPin,
    title: 'Precision GPS',
    description: 'Built-in dual-band GPS tracks your routes with centimeter accuracy.',
    stats: 'Dual-band',
    size: 'normal',
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  // {
  //   icon: Bell,
  //   title: 'Smart Notifications',
  //   description: 'AI prioritizes what matters, silences the noise. Stay connected without the distraction.',
  //   stats: 'AI-powered',
  //   size: 'normal',
  //   gradient: 'from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20',
  // },
];

export function Features() {
  const { containerRef } = useAnimatedElements<HTMLDivElement>(features.length);

  return (
    <section id="features" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--bg-secondary)]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Everything You Need,
              <br />
              <span className="gradient-text">Nothing You Don't</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Packed with intelligent features designed to enhance every aspect of your daily life.
            </p>

            {/* Animated counter strip — visualises the "more with less" promise */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm text-[var(--text-secondary)]">
              <span><AnimatedCounter end={50} suffix="+" className="text-[var(--accent-primary)] font-mono font-bold" /> biomarkers</span>
              <span className="opacity-30">•</span>
              <span><AnimatedCounter end={14} suffix=" days" className="text-[var(--accent-primary)] font-mono font-bold" /> battery</span>
              <span className="opacity-30">•</span>
              <span><AnimatedCounter end={2000} suffix=" nits" className="text-[var(--accent-primary)] font-mono font-bold" /> brightness</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-animate
              className={`animate-on-scroll group relative rounded-3xl p-6 md:p-8 
                bg-[var(--card-bg)] backdrop-blur border border-[var-card-border]
                hover:scale-[1.02] transition-all duration-300
                ${index === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex p-3 rounded-2xl mb-4 bg-[var(--bg-secondary)] group-hover:bg-white/10 transition-colors">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-[var(--accent-primary)]" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mt-4
                  bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-mono text-sm font-semibold">
                  {feature.stats}
                </div>

                {/* First feature extra visual */}
                {index === 0 && (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <div className="font-mono text-lg md:text-xl font-bold text-[var(--accent-primary)]">24/7</div>
                      <div className="text-xs text-[var(--text-secondary)]">Monitoring</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <div className="font-mono text-lg md:text-xl font-bold text-[var(--accent-secondary)]">±1%</div>
                      <div className="text-xs text-[var(--text-secondary)]">Accuracy</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <div className="font-mono text-lg md:text-xl font-bold text-white">50+</div>
                      <div className="text-xs text-[var(--text-secondary)]">Biomarkers</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 60px var(--glow-color)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
