import { Cpu, Battery, Wifi, Smartphone, Watch, Shield, Waves, Navigation } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const specs = [
  {
    category: 'Display',
    icon: Watch,
    items: [
      { label: 'Size', value: '1.9" AMOLED' },
      { label: 'Resolution', value: '484 x 396 px' },
      { label: 'Refresh Rate', value: '60Hz' },
      { label: 'Brightness', value: 'Up to 2000 nits' },
      { label: 'Protection', value: 'Sapphire Crystal' },
    ],
  },
  {
    category: 'Performance',
    icon: Cpu,
    items: [
      { label: 'Processor', value: 'Dual-core AI Chip' },
      { label: 'RAM', value: '2GB' },
      { label: 'Storage', value: '32GB' },
      { label: 'OS', value: 'AIOS 3.0' },
    ],
  },
  {
    category: 'Battery',
    icon: Battery,
    items: [
      { label: 'Capacity', value: '450mAh' },
      { label: 'Life', value: 'Up to 14 days' },
      { label: 'Charging', value: 'Magnetic, 2hrs' },
      { label: 'Type', value: 'Li-Po' },
    ],
  },
  {
    category: 'Sensors',
    icon: Navigation,
    items: [
      { label: 'Heart Rate', value: 'Optical + ECG' },
      { label: 'Blood Oxygen', value: 'SpO2' },
      { label: 'Temperature', value: 'Skin Sensor' },
      { label: 'Motion', value: '6-axis Gyro' },
    ],
  },
  {
    category: 'Connectivity',
    icon: Wifi,
    items: [
      { label: 'Bluetooth', value: '5.3' },
      { label: 'WiFi', value: '802.11 a/b/g/n' },
      { label: 'NFC', value: 'Payment Ready' },
      { label: 'GPS', value: 'Dual-band L1+L5' },
    ],
  },
  {
    category: 'Build',
    icon: Shield,
    items: [
      { label: 'Frame', value: 'Titanium Grade 5' },
      { label: 'Back', value: 'Ceramic' },
      { label: 'Water Resist', value: '50m / 5 ATM' },
      { label: 'Weight', value: '42g (without band)' },
    ],
  },
];

export function Specs() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section id="specs" ref={ref} className="section relative">
      {/* Background */}
      <div className="absolute inset-0" />
      <div className="absolute inset-0 gradient-bg opacity-10" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-4">
            Technical Specs
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Built for <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Every component meticulously crafted for performance, durability, and style.
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((category, index) => (
            <div
              key={category.category}
              className={`card transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
                <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10">
                  <category.icon className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="font-bold text-lg text-[var(--text-primary)]">
                  {category.category}
                </h3>
              </div>

              {/* Spec Items */}
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] text-sm">
                      {item.label}
                    </span>
                    <span className="font-mono font-medium text-[var(--text-primary)] text-sm">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison highlight */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full glass">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-[var(--accent-primary)]" />
              <span className="text-[var(--text-secondary)]">Swim-proof</span>
            </div>
            <div className="w-px h-6 bg-[var(--border-color)]" />
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[var(--accent-primary)]" />
              <span className="text-[var(--text-secondary)]">iOS & Android</span>
            </div>
            <div className="w-px h-6 bg-[var(--border-color)]" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
              <span className="text-[var(--text-secondary)]">2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
