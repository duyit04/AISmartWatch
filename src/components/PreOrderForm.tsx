import { useState, useEffect, useCallback } from 'react';
import { Check, Loader2, Send, Watch } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useToast } from '../hooks/ToastContext';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { validateEmail, validatePhone } from '../lib/utils';
import { FormSkeleton } from './Skeleton';
import { submitToWebhook, createWebhookPayload } from '../lib/webhook';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  model: '41mm' | '45mm';
  color: 'midnight' | 'silver' | 'gold';
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

const colorOptions = [
  { id: 'midnight', name: 'Midnight Black', hex: '#1a1a1a' },
  { id: 'silver', name: 'Silver', hex: '#c0c0c0' },
  { id: 'gold', name: 'Gold', hex: '#d4af37' },
];

const modelOptions = [
  { id: '41mm', name: '41mm', description: 'Compact & Light' },
  { id: '45mm', name: '45mm', description: 'Larger Display' },
];

export function PreOrderForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    model: '45mm',
    color: 'midnight',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToast();
  const { trackFormSubmit } = useBehaviorTracking({ enableClickTracking: false, enableScrollTracking: false });
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = createWebhookPayload({
        email: formData.email,
        name: formData.fullName,
        phone: formData.phone,
        model: formData.model,
        color: formData.color,
        message: formData.message,
      }, 'preorder-form');

      const result = await submitToWebhook(payload);

      if (!result.success) {
        throw new Error(result.message);
      }

      setIsSuccess(true);
      trackFormSubmit('preorder-form', true);
      toast.success('Pre-order submitted', 'We will contact you at ' + formData.email + '.');
    } catch (error) {
      trackFormSubmit('preorder-form', false);
      const message = error instanceof Error ? error.message : 'Submission failed';
      toast.error('Submission failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error on change
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <section id="preorder" ref={ref} className="section relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-20" />
        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto">
            <FormSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <section id="preorder" ref={ref} className="section relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-20" />
        
        <div className="container-custom relative z-10">
          <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="card p-12">
              {/* Success icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-500" />
              </div>

              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Pre-order Confirmed!
              </h2>
              
              <p className="text-[var(--text-secondary)] mb-8">
                Thank you for your pre-order, {formData.fullName.split(' ')[0]}! We've sent a confirmation email to <span className="text-[var(--accent-primary)]">{formData.email}</span>.
              </p>

              <div className="flex items-center justify-center gap-4 p-6 rounded-2xl bg-[var(--bg-secondary)] mb-8">
                <Watch className="w-8 h-8 text-[var(--accent-primary)]" />
                <div className="text-left">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {modelOptions.find(m => m.id === formData.model)?.name} — {colorOptions.find(c => c.id === formData.color)?.name}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Estimated delivery: August 2026
                  </div>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)]">
                You'll receive updates on your order status via email. We can't wait for you to experience the future of time!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="preorder" ref={ref} className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-20" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="container-custom relative z-10">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-start transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left - Info */}
          <div className="lg:sticky lg:top-32">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-4">
              Pre-order Now
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
              Reserve Your <span className="gradient-text">AI Watch</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Be among the first to experience the future of wearable technology. Pre-order now for exclusive launch pricing.
            </p>

            {/* Pricing */}
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] backdrop-blur border border-[var(--card-border)] mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-4xl font-bold text-[var(--text-primary)]">$299</span>
                <span className="text-lg text-[var(--text-secondary)] line-through">$399</span>
              </div>
              <p className="text-sm text-[var(--accent-primary)]">Launch special — 25% off retail price</p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                'Free premium watch band included ($29 value)',
                'Priority shipping — guaranteed delivery in August',
                '30-day money-back guarantee',
                '2-year extended warranty',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <span className="text-[var(--text-secondary)]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  className={`input ${errors.fullName ? 'input-error' : ''}`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Phone <span className="text-[var(--text-secondary)]">(optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  Model Size
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {modelOptions.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleChange('model', model.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.model === model.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                          : 'border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
                      }`}
                    >
                      <div className="font-semibold text-[var(--text-primary)]">{model.name}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{model.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  Color
                </label>
                <div className="flex gap-4">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleChange('color', color.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        formData.color === color.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                          : 'border-transparent hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-[var(--border-color)]"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-[var(--text-secondary)]">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Special Requests <span className="text-[var(--text-secondary)]">(optional)</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Any special requests or questions..."
                  rows={3}
                  className="input resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-lg py-5 group disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Complete Pre-order
                  </>
                )}
              </button>

              <p className="text-xs text-center text-[var(--text-secondary)]">
                By pre-ordering, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
