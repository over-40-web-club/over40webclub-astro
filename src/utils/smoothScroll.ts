/**
 * Smooth scroll utility functions
 * Replaces the functionality from useSmoothScrollTo.jsx
 */

export interface SmoothScrollOptions {
  duration?: number;
  easing?: 'linear' | 'easeInOutQuart' | 'easeInOutCubic';
  offset?: number;
}

const DEFAULT_OPTIONS: Required<SmoothScrollOptions> = {
  duration: 800,
  easing: 'easeInOutQuart',
  offset: 0,
};

/**
 * Easing functions for smooth scrolling
 */
const easingFunctions = {
  linear: (t: number): number => t,
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

/**
 * Get the current scroll position
 */
function getScrollTop(): number {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

/**
 * Get the target scroll position for an element
 */
function getTargetPosition(target: string | number, offset: number): number {
  if (typeof target === 'number') {
    return target;
  }

  const element = document.querySelector(target);
  if (!element) {
    console.warn(`Element with selector "${target}" not found`);
    return 0;
  }

  const elementTop = element.getBoundingClientRect().top + getScrollTop();
  return Math.max(0, elementTop - offset);
}

/**
 * Animate scroll to a specific position
 */
function animateScrollTo(
  targetPosition: number,
  duration: number,
  easing: keyof typeof easingFunctions
): Promise<void> {
  return new Promise((resolve) => {
    const startPosition = getScrollTop();
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easingFunctions[easing](progress);
      const currentPosition = startPosition + distance * easedProgress;

      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

/**
 * Smooth scroll to a target element or position
 * @param target - CSS selector string or numeric position
 * @param options - Scroll options
 */
export async function smoothScrollTo(
  target: string | number,
  options: SmoothScrollOptions = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const targetPosition = getTargetPosition(target, opts.offset);

  return animateScrollTo(targetPosition, opts.duration, opts.easing);
}

/**
 * Smooth scroll to top of page
 */
export function smoothScrollToTop(
  options: SmoothScrollOptions = {}
): Promise<void> {
  return smoothScrollTo(0, options);
}

/**
 * Create a smooth scroll handler function
 * Similar to the original useSmoothScrollTo hook
 */
export function createSmoothScrollHandler(
  target: string | number,
  options: SmoothScrollOptions = {}
): () => Promise<void> {
  return () => smoothScrollTo(target, options);
}

/**
 * Initialize smooth scroll for navigation links
 * This should be called after DOM is loaded
 */
export function initializeSmoothScroll(
  options: SmoothScrollOptions = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  console.log('Initializing smooth scroll with options:', opts);

  // Handle navigation links with data-scroll-to attribute
  const scrollLinks = document.querySelectorAll('[data-scroll-to]');
  console.log('Found scroll links:', scrollLinks.length);

  scrollLinks.forEach((link, index) => {
    const target = link.getAttribute('data-scroll-to');
    console.log(`Link ${index}: target="${target}"`);

    if (target) {
      // Check if target element exists
      const targetElement = document.querySelector(target);
      console.log(`Target element for "${target}":`, targetElement);

      link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Scrolling to: ${target}`);
        smoothScrollTo(target, opts);
      });
    }
  });

  // Handle links with data-scroll-to-top attribute
  const topLinks = document.querySelectorAll('[data-scroll-to-top]');
  console.log('Found top scroll links:', topLinks.length);

  topLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Scrolling to top');
      smoothScrollToTop(opts);
    });
  });

  // Handle regular anchor links with smooth scrolling
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  console.log('Found anchor links:', anchorLinks.length);

  anchorLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      // Check if target element exists
      const targetElement = document.querySelector(href);
      console.log(`Anchor link "${href}":`, targetElement);

      link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Scrolling to anchor: ${href}`);
        smoothScrollTo(href, opts);
      });
    }
  });
}
