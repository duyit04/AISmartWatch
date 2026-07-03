import { describe, it, expect } from 'vitest';
import { pickActiveSection } from './scrollSpy';

// Layout fixture: 5 sections of equal height (800px each),
// viewport height 700. Document positions:
//   products:   0    - 800
//   features:  800   - 1600
//   specs:     1600   - 2400
//   reviews:   2400   - 3200
//   countdown: 3200   - 4000
const layout: Record<string, { top: number; height: number }> = {
  products:   { top: 0,    height: 800 },
  features:   { top: 800,  height: 800 },
  specs:      { top: 1600, height: 800 },
  reviews:    { top: 2400, height: 800 },
  countdown:  { top: 3200, height: 800 },
};
const ids = Object.keys(layout);

describe('pickActiveSection', () => {
  it('returns the first section when at the top of the page', () => {
    const res = pickActiveSection(ids, 0, 700, (id) => layout[id]);
    // viewport 0..700 lies entirely inside products (0..800),
    // ratio = 700/700 = 1.
    expect(res.id).toBe('products');
    expect(res.ratio).toBeCloseTo(1, 5);
  });

  it('switches when the viewport center crosses the next section', () => {
    // scrollY = 600 -> viewport 600..1300 covers products
    // (600..800 = 200px) + features (800..1300 = 500px).
    // features ratio = 500/700 = 0.714, products = 200/700
    // = 0.286 -> features wins.
    const res = pickActiveSection(ids, 600, 700, (id) => layout[id]);
    expect(res.id).toBe('features');
    expect(res.ratio).toBeCloseTo(500 / 700, 5);
  });

  it('locks onto a tall section whose top is just under the navbar', () => {
    // Bug from v1.3.1: scrollY+100 was below the top of
    // Features on tall sections, so the previous heuristic
    // kept returning 'products'. With overlap ratio, the
    // huge visible portion of Features wins immediately.
    const res = pickActiveSection(ids, 850, 700, (id) => layout[id]);
    expect(res.id).toBe('features');
  });

  it('does not get stuck when partially scrolled into a section', () => {
    // scrollY = 1500 -> viewport 1500..2200.
    // features visible 1500..1600 = 100px, specs 1600..2200
    // = 600px. Specs ratio 0.857, features 0.143 -> specs.
    const res = pickActiveSection(ids, 1500, 700, (id) => layout[id]);
    expect(res.id).toBe('specs');
  });

  it('returns previousId with ratio 0 when no section is in view', () => {
    // scrollY = -2000 (impossible in practice but exercises
    // the "between sections" guard). No section covers the
    // viewport -> ratio stays 0, id stays previousId.
    const res = pickActiveSection(ids, -2000, 700, (id) => layout[id], 'products');
    expect(res.ratio).toBe(0);
    expect(res.id).toBe('products');
  });

  it('tolerates a missing section by skipping it', () => {
    // Drop 'countdown' from the layout. Scrolling way down
    // should still pick the last visible one instead of
    // crashing.
    const partialIds = ids.slice(0, 4);
    const partialLayout: Record<string, { top: number; height: number }> = {
      products: layout.products,
      features: layout.features,
      specs: layout.specs,
      reviews: layout.reviews,
    };
    const res = pickActiveSection(
      partialIds,
      2700,
      700,
      (id) => partialLayout[id] ?? null
    );
    expect(res.id).toBe('reviews');
  });
});
