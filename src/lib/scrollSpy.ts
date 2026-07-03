/**
 * Scroll-spy: pick the section that occupies the largest visible
 * portion of the viewport at the given scroll position.
 *
 * Extracted from Navbar (v1.3.2) so the logic is unit-testable
 * without React or a real DOM. The DOM lookup via
 * document.getElementById is replaced here by a `getRect` callback
 * that callers (the Navbar, in production) plug document lookup
 * into, and tests plug a stub.
 *
 * `getRect` returns the section's offsetTop (absolute document
 * position of the top edge) and its height, in CSS pixels.
 */
export type SectionRect = {
  top: number;
  height: number;
};

export function pickActiveSection(
  ids: readonly string[],
  scrollY: number,
  viewportHeight: number,
  getRect: (id: string) => SectionRect | null,
  previousId: string = ''
): { id: string; ratio: number } {
  const viewportTop = scrollY;
  const viewportBottom = scrollY + viewportHeight;
  let bestId = previousId;
  let bestRatio = 0;

  for (const id of ids) {
    const rect = getRect(id);
    if (!rect) continue;
    const sectionTopAbs = rect.top;
    const sectionBottomAbs = rect.top + rect.height;
    const visibleTop = Math.max(viewportTop, sectionTopAbs);
    const visibleBottom = Math.min(viewportBottom, sectionBottomAbs);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const ratio = viewportHeight > 0 ? visibleHeight / viewportHeight : 0;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = id;
    }
  }

  return { id: bestId, ratio: bestRatio };
}
