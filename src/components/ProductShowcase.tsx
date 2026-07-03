import { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingBag, Check, Star, Sparkles, TrendingUp } from 'lucide-react';
import { useCartContext } from '../hooks/CartContext';
import { useViewedProducts } from '../hooks/useViewedProducts';
import { ScrollReveal, ParallaxSection } from './ScrollAnimations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const colorOptions = [
  { id: 'midnight', name: 'Midnight Black', hex: '#1a1a1a', bgClass: 'bg-zinc-900' },
  { id: 'silver', name: 'Silver', hex: '#c0c0c0', bgClass: 'bg-gray-300' },
  { id: 'gold', name: 'Gold', hex: '#d4af37', bgClass: 'bg-amber-400' },
];

const modelOptions = [
  { id: '41mm', name: '41mm', description: 'Compact & Light', price: 299 },
  { id: '45mm', name: '45mm', description: 'Larger Display', price: 329 },
];

const badges = [
  { id: 'bestseller', icon: TrendingUp, label: 'Best Seller', color: 'text-orange-500 bg-orange-500/10' },
  { id: 'new', icon: Sparkles, label: 'New Arrival', color: 'text-purple-500 bg-purple-500/10' },
  { id: 'limited', icon: Star, label: 'Limited Edition', color: 'text-yellow-500 bg-yellow-500/10' },
];

interface ProductCardProps {
  model: typeof modelOptions[0];
  color: typeof colorOptions[0];
  badge?: typeof badges[0];
  isInCart: boolean;
  isInWishlist: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onView?: () => void;
}

function ProductCard({ model, color, badge, isInCart, isInWishlist, onAddToCart, onToggleWishlist, onView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Track when product card enters viewport
  useEffect(() => {
    const element = cardRef.current;
    if (!element || !onView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onView();
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onView]);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-3xl overflow-hidden bg-[var(--card-bg)] backdrop-blur border border-[var(--card-border)] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {badge && (
        <div className={`absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.color}`}>
          <badge.icon className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">{badge.label}</span>
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={onToggleWishlist}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-300 ${
          isInWishlist 
            ? 'bg-red-500 text-white' 
            : 'bg-white/80 backdrop-blur text-gray-600 hover:bg-white hover:text-red-500'
        }`}
      >
        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
      </button>

      {/* Product image */}
      <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-hidden">
        {/* Watch mockup — gentle parallax so the watch "breathes" while scrolling */}
        <ParallaxSection speed={0.15} direction="up" className="absolute inset-0 flex items-center justify-center">
          <div
            className={`relative w-32 h-32 md:w-40 md:h-40 transition-transform duration-500 ${isHovered ? 'scale-110 rotate-3' : ''}`}
            style={{ transform: isHovered ? 'scale(1.1) rotate(3deg)' : 'scale(1)' }}
          >
          {/* Watch glow */}
          <div 
            className={`absolute inset-0 rounded-full blur-2xl opacity-30 transition-opacity duration-300 ${isHovered ? 'opacity-50' : ''}`}
            style={{ backgroundColor: color.hex }}
          />
          
          {/* Watch body */}
          <div className="absolute inset-4 rounded-[2rem] shadow-2xl overflow-hidden" style={{ backgroundColor: color.hex === '#1a1a1a' ? '#27272a' : color.hex === '#c0c0c0' ? '#d1d5db' : '#fcd34d' }}>
            {/* Screen */}
            <div className="absolute inset-1 rounded-[1.75rem] bg-black overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-white">10:30</div>
                <div className="text-[8px] text-gray-400">AI Watch</div>
              </div>
            </div>
          </div>

          {/* Side button */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full bg-gray-600" />
        </div>
        </ParallaxSection>

        {/* Floating price tag */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur shadow-lg">
          <span className="font-mono text-sm font-bold text-gray-900">${model.price}</span>
        </div>
      </div>

      {/* Product info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-[var(--text-secondary)]">{model.name}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
          <span className="text-xs font-medium text-[var(--text-secondary)]">{color.name}</span>
        </div>

        <h3 className="font-semibold text-[var(--text-primary)] mb-3">
          AI Watch {model.name}
        </h3>

        {/* Add to cart button */}
        <button
          onClick={onAddToCart}
          disabled={isInCart}
          className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            isInCart
              ? 'bg-green-500/10 text-green-600 cursor-default'
              : 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 active:scale-[0.98]'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface ProductShowcaseProps {
  onCartClick: () => void;
}

export function ProductShowcase({ onCartClick }: ProductShowcaseProps) {
  const { cart, wishlist } = useCartContext();
  const { addViewedProduct } = useViewedProducts();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.25 });

  const handleViewProduct = (modelId: string, colorId: string, colorName: string, price: number) => {
    addViewedProduct({
      model: modelId,
      color: colorId,
      colorName,
      price,
    });
  };

  const handleAddToCart = (_modelId: string, _colorId: string, _modelName: string, colorName: string, price: number) => {
    cart.addToCart({
      model: _modelId as '41mm' | '45mm',
      color: _colorId as 'midnight' | 'silver' | 'gold',
      colorName,
      price,
      quantity: 1,
    });
    onCartClick();
  };

  const handleToggleWishlist = (_modelId: string, _colorId: string, _modelName: string, colorName: string) => {
    wishlist.toggleWishlist({
      model: _modelId as '41mm' | '45mm',
      color: _colorId as 'midnight' | 'silver' | 'gold',
      colorName,
    });
  };

  // Define product combinations with badges
  const products = [
    { model: modelOptions[1], color: colorOptions[0], badge: badges[0] }, // 45mm Midnight - Best Seller
    { model: modelOptions[0], color: colorOptions[2], badge: badges[1] }, // 41mm Gold - New
    { model: modelOptions[1], color: colorOptions[1], badge: badges[2] }, // 45mm Silver - Limited
    { model: modelOptions[0], color: colorOptions[0], badge: undefined }, // 41mm Midnight
    { model: modelOptions[0], color: colorOptions[1], badge: undefined }, // 41mm Silver
    { model: modelOptions[1], color: colorOptions[2], badge: undefined }, // 45mm Gold
  ];

  return (
    <section id="products" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <ParallaxSection speed={0.2} direction="up" className="mb-12">
          <div
            ref={headerRef}
            className={`text-center transition-all duration-700 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Our Collection
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Find Your Perfect <span className="gradient-text">Match</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              From compact elegance to bold statements, choose the combination that speaks to you.
            </p>
          </div>
        </ParallaxSection>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ScrollReveal
              key={`${product.model.id}-${product.color.id}`}
              animation="fade-up"
              delay={index * 120}
              duration={700}
            >
              <ProductCard
                model={product.model}
                color={product.color}
                badge={product.badge}
                isInCart={cart.isInCart(product.model.id, product.color.id)}
                isInWishlist={wishlist.isInWishlist(product.model.id, product.color.id)}
                onAddToCart={() => handleAddToCart(
                  product.model.id,
                  product.color.id,
                  product.model.name,
                  product.color.name,
                  product.model.price
                )}
                onToggleWishlist={() => handleToggleWishlist(
                  product.model.id,
                  product.color.id,
                  product.model.name,
                  product.color.name
                )}
                onView={() => handleViewProduct(
                  product.model.id,
                  product.color.id,
                  product.color.name,
                  product.model.price
                )}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="text-center mt-12">
            <p className="text-[var(--text-secondary)] mb-4">
              Not sure which one? Use our <button className="text-[var(--accent-primary)] underline">product finder</button>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
