import { useEffect, useRef, useState } from 'react';

interface ScrollytellingSection {
  id: string;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
  visual?: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  background?: string;
}

interface ScrollytellingProps {
  sections: ScrollytellingSection[];
  progressBar?: boolean;
  showNavigation?: boolean;
}

export function Scrollytelling({
  sections,
  progressBar = true,
  showNavigation = true,
}: ScrollytellingProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate overall progress
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const scrollable = containerHeight - windowHeight;
      const scrolled = -containerTop;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      setScrollProgress(progress * 100);

      // Determine active section based on scroll position
      const sectionElements = containerRef.current.querySelectorAll('[data-scrolly-section]');
      sectionElements.forEach((el, index) => {
        const sectionRect = el.getBoundingClientRect();
        const sectionCenter = sectionRect.top + sectionRect.height / 2;
        
        if (sectionCenter < windowHeight * 0.6) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Progress Bar */}
      {progressBar && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--bg-secondary)] z-50">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* Section Navigation */}
      {showNavigation && (
        <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => {
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? 'bg-[var(--accent-primary)] scale-125'
                  : 'bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50'
              }`}
              aria-label={`Go to ${section.title || section.id}`}
            />
          ))}
        </nav>
      )}

      {/* Scrollytelling Sections */}
      {sections.map((section, index) => {
        const isActive = activeSection === index;
        const isPast = activeSection > index;

        return (
          <section
            key={section.id}
            id={section.id}
            data-scrolly-section
            className={`min-h-screen flex items-center py-20 transition-all duration-500 ${
              section.background || ''
            }`}
          >
            <div className="container-custom">
              <div
                className={`grid md:grid-cols-2 gap-12 items-center`}
              >
                {/* Content */}
                <div
                  className={`transition-all duration-700 ${
                    isPast
                      ? 'opacity-40 translate-x-[-20px]'
                      : isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-[20px]'
                  } ${section.align === 'right' ? 'md:order-2' : ''}`}
                >
                  {section.title && (
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
                      {section.title}
                    </h2>
                  )}
                  {section.subtitle && (
                    <p className="text-lg text-[var(--text-secondary)] mb-6">
                      {section.subtitle}
                    </p>
                  )}
                  {section.content}
                </div>

                {/* Visual */}
                {section.visual && (
                  <div
                    className={`transition-all duration-700 delay-200 ${
                      isPast
                        ? 'opacity-40 translate-x-[20px]'
                        : isActive
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-[-20px]'
                    } ${section.align === 'right' ? 'md:order-1' : ''}`}
                  >
                    {section.visual}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
