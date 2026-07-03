import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { ScrollReveal, ParallaxSection } from './ScrollAnimations';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Tech Reviewer, Digital Trends',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    content: "The AI health monitoring is incredible. It detected irregular heart patterns before I even felt any symptoms. This smartwatch literally saved my life.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Marathon Runner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: "14-day battery life is not a joke. I completed a 100-mile ultra with GPS tracking on, and still had 40% battery left. Unmatched performance.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Fitness Instructor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content: "The sleep tracking with AI insights helped me optimize my rest schedule. My energy levels have never been better. Worth every penny.",
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section id="reviews" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-secondary)]/50 to-transparent" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-4">
              <Quote className="w-4 h-4" />
              Early Testers
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Loved by <span className="gradient-text">Early Users</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Join thousands of beta testers who have already experienced the future of smartwatches.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonial Card — wrapped with subtle parallax so card lifts as you scroll */}
        <ScrollReveal animation="zoom-in" duration={700} delay={150}>
          <ParallaxSection speed={0.2} direction="up" className="max-w-4xl mx-auto">
          <div
            className={`relative p-8 md:p-12 rounded-3xl bg-[var(--card-bg)] backdrop-blur border border-[var(--card-border)] transition-all duration-300 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Quote Icon */}
            <div className="absolute -top-4 left-8 w-12 h-12 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
              <Quote className="w-6 h-6 text-white" />
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed mb-8 font-medium">
              "{testimonial.content}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[var(--accent-primary)]"
              />
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  {testimonial.name}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {testimonial.role}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[var(--accent-primary)] w-8'
                    : 'bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          </ParallaxSection>
        </ScrollReveal>
      </div>
    </section>
  );
}
