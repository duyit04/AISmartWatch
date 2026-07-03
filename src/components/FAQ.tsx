import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollAnimations';

const faqs = [
  {
    id: 1,
    question: 'When will my order ship?',
    answer: 'Orders placed during the pre-order period (July 1 - July 31, 2026) will begin shipping on August 1, 2026. All pre-orders are fulfilled on a first-come, first-served basis. You will receive tracking information via email once your order ships.',
  },
  {
    id: 2,
    question: "What's the warranty coverage?",
    answer: 'AI Watch comes with a comprehensive 2-year limited warranty covering manufacturing defects and hardware failures. The warranty does not cover physical damage, water damage beyond 50m depth, or unauthorized modifications. Extended warranty options will be available for purchase.',
  },
  {
    id: 3,
    question: 'Is it compatible with my phone?',
    answer: 'AI Watch is compatible with both iOS (version 14.0 and above) and Android (version 8.0 and above) devices. The AI Watch companion app is available on the App Store and Google Play Store. All core features work seamlessly across both platforms.',
  },
  {
    id: 4,
    question: 'Can I return the product?',
    answer: 'Yes! We offer a 30-day money-back guarantee. If you are not completely satisfied with your AI Watch, simply contact our support team within 30 days of delivery to initiate a return. The watch must be in original condition with all accessories. Refunds are processed within 5-7 business days.',
  },
  {
    id: 5,
    question: "What's included in the box?",
    answer: 'Each AI Watch package includes: 1x AI Watch, 1x Magnetic Charging Cable, 1x Quick Start Guide, 1x Warranty Card, and 1x Free Silicone Band (in addition to the default band). Optional accessories like premium leather bands and extra charging cables are available for separate purchase.',
  },
];

interface FAQItemProps {
  faq: typeof faqs[0];
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-[var(--accent-primary)]/50 bg-[var(--card-bg)]'
          : 'border-[var(--border-color)] bg-[var(--bg-secondary)]/50 hover:border-[var(--border-color)]/80'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[var(--text-primary)] pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div
        className={`transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/50 pt-4">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Got questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ Grid — each item enters with a small horizontal slide, staggered */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal
              key={faq.id}
              animation="fade-left"
              duration={600}
              delay={index * 80}
            >
              <FAQItem
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Contact CTA */}
        <ScrollReveal animation="fade-up" duration={600} delay={150}>
          <div className="mt-12 text-center">
            <p className="text-[var(--text-secondary)]">
              Still have questions?{' '}
              <a
                href="mailto:support@aiwatch.com"
                className="text-[var(--accent-primary)] hover:underline font-medium"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
