import './index.css';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductShowcase } from './components/ProductShowcase';
import { Features } from './components/Features';
import { Specs } from './components/Specs';
import { Testimonials } from './components/Testimonials';
import { Countdown } from './components/Countdown';
import { FAQ } from './components/FAQ';
import { PreOrderForm } from './components/PreOrderForm';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ToastProvider } from './hooks/ToastContext';
import { CartProvider } from './hooks/CartContext';
import { useBehaviorTracking } from './hooks/useBehaviorTracking';

const CartDrawer = lazy(() => import('./components/CartDrawer').then((m) => ({ default: m.CartDrawer })));
const WishlistDrawer = lazy(() => import('./components/WishlistDrawer').then((m) => ({ default: m.WishlistDrawer })));
const ViewedProductsDrawer = lazy(() =>
  import('./components/ViewedProductsDrawer').then((m) => ({ default: m.ViewedProductsDrawer })),
);
const Chatbot = lazy(() => import('./components/Chatbot').then((m) => ({ default: m.Chatbot })));

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ToastProvider>
  );
}

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isViewedOpen, setIsViewedOpen] = useState(false);
  const { trackPageView, trackScroll } = useBehaviorTracking();

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  useEffect(() => {
    let lastDepth = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = Math.round((scrollY / docHeight) * 100);

      if (depth >= lastDepth + 25) {
        trackScroll(depth);
        lastDepth = depth;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onViewedClick={() => setIsViewedOpen(true)}
      />
      <main>
        <Hero />
        <ProductShowcase onCartClick={() => setIsCartOpen(true)} />
        <Features />
        <Specs />
        <Testimonials />
        <Countdown />
        <FAQ />
        <PreOrderForm />
      </main>
      <Footer />

      {/* Drawers */}
      <Suspense fallback={null}>
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          onOpenCart={() => {
            setIsWishlistOpen(false);
            setIsCartOpen(true);
          }}
        />
        <ViewedProductsDrawer
          isOpen={isViewedOpen}
          onClose={() => setIsViewedOpen(false)}
        />
      </Suspense>

      {/* Chatbot */}
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
