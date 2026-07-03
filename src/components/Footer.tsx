import { Watch, Globe } from 'lucide-react';
import { smoothScrollTo } from '../lib/utils';

const footerLinks = [
  { id: 'features', label: 'Features' },
  { id: 'specs', label: 'Specs' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
  { id: 'preorder', label: 'Pre-order' },
];

const socialLinks = [
  { label: 'X (Twitter)', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

export function Footer() {
  return (
    <footer className="relative py-16 border-t border-[var(--border-color)]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <Watch className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[var(--text-primary)]">
                AI<span className="gradient-text">Watch</span>
              </span>
            </a>
            <p className="text-[var(--text-secondary)] mb-6 max-w-sm">
              The future of time is here. AI-powered smartwatch with 14-day battery life, advanced health monitoring, and premium design.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)]/10 transition-colors group"
                  aria-label={social.label}
                >
                  <Globe className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => smoothScrollTo(link.id)}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Contact</h4>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li>
                <a href="mailto:hello@aiwatch.com" className="hover:text-[var(--accent-primary)] transition-colors">
                  hello@aiwatch.com
                </a>
              </li>
              <li>
                <a href="tel:+18001234567" className="hover:text-[var(--accent-primary)] transition-colors">
                  +1 (800) 123-4567
                </a>
              </li>
              <li className="pt-2">
                <span className="text-sm">Support Hours</span>
                <br />
                Mon-Fri: 9AM - 6PM PST
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            &copy; 2026 AI Watch Technologies. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
