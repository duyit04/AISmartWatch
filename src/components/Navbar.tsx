import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Watch, ShoppingBag, Heart, Eye } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { smoothScrollTo } from '../lib/utils';
import { pickActiveSection } from '../lib/scrollSpy';
import { useCartContext } from '../hooks/CartContext';
import { useViewedProducts } from '../hooks/useViewedProducts';

const navLinks = [
  { id: 'products', label: 'Products' },
  { id: 'features', label: 'Features' },
  { id: 'specs', label: 'Specs' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'countdown', label: 'Launch' },
  { id: 'faq', label: 'FAQ' },
];

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onViewedClick?: () => void;
}

export function Navbar({ onCartClick, onWishlistClick, onViewedClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark, toggleTheme } = useDarkMode();
  const { cart, wishlist } = useCartContext();
  const { viewedProducts } = useViewedProducts();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);

      // Update active section using viewport-overlap ratio.
      // See src/lib/scrollSpy.ts for the rationale and unit
      // tests. Extracted from this handler so we can cover
      // the math independently of React/DOM.
      const getRect = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { top: rect.top + window.scrollY, height: rect.height };
      };
      const { id: bestId, ratio: bestRatio } = pickActiveSection(
        navLinks.map((l) => l.id),
        window.scrollY,
        window.innerHeight,
        getRect,
        activeSection
      );
      if (bestRatio > 0 && bestId !== activeSection) {
        setActiveSection(bestId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    smoothScrollTo(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 glass shadow-lg shadow-black/10'
            : 'py-5 bg-transparent'
        }`}
      >
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
        
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Watch className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[var(--text-primary)]">
                AI<span className="gradient-text">Watch</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-5 lg:gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Wishlist Button */}
              <button
                onClick={onWishlistClick}
                className="relative p-2.5 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors"
                aria-label="Open wishlist"
              >
                <Heart className="w-5 h-5 text-[var(--text-primary)]" />
                {wishlist.wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-red-500 text-white">
                    {wishlist.wishlistCount > 9 ? '9+' : wishlist.wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative p-2.5 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5 text-[var(--text-primary)]" />
                {cart.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-[var(--accent-primary)] text-white">
                    {cart.cartCount > 9 ? '9+' : cart.cartCount}
                  </span>
                )}
              </button>

              {/* Viewed Products Button */}
              {onViewedClick && (
                <button
                  onClick={onViewedClick}
                  className="relative p-2.5 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors"
                  aria-label="Viewed products"
                >
                  <Eye className="w-5 h-5 text-[var(--text-primary)]" />
                  {viewedProducts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-purple-500 text-white">
                      {viewedProducts.length > 9 ? '9+' : viewedProducts.length}
                    </span>
                  )}
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-[var(--text-primary)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--text-primary)]" />
                )}
              </button>

              {/* CTA Button - Desktop */}
              <button
                onClick={() => handleNavClick('preorder')}
                className="hidden lg:flex btn-primary text-sm py-3 px-6"
              >
                Pre-order Now
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-[var(--bg-secondary)]"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[var(--bg-primary)] shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left text-lg font-medium py-3 px-4 rounded-xl transition-colors ${
                    activeSection === link.id
                      ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('preorder')}
                className="btn-primary mt-4"
              >
                Pre-order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
