/**
 * Scroll monitoring utility functions
 * Replaces the functionality from useWindowOnScroll.jsx
 */

export interface ScrollMonitorOptions {
  throttleMs?: number;
  offset?: number;
  rootMargin?: string;
}

const DEFAULT_OPTIONS: Required<ScrollMonitorOptions> = {
  throttleMs: 166, // ~60fps (same as original)
  offset: 200,
  rootMargin: '0px 0px -20% 0px',
};

/**
 * Throttle function implementation
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: number | null = null;
  let lastExecTime = 0;

  const throttledFunc = ((...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(null, args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        func.apply(null, args);
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - (currentTime - lastExecTime));
    }
  }) as T & { cancel: () => void };

  throttledFunc.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttledFunc;
}

/**
 * Get current scroll position
 */
export function getScrollPosition(): number {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(
  element: Element,
  offset: number = 0
): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.top <= windowHeight - offset && rect.bottom >= offset;
}

/**
 * Get the currently active section based on scroll position
 */
export function getActiveSection(
  sections: NodeListOf<Element> | Element[],
  offset: number = 200
): string | null {
  const scrollTop = getScrollPosition();
  let activeSection: string | null = null;

  // Convert NodeList to Array if needed
  const sectionsArray = Array.from(sections);

  for (const section of sectionsArray) {
    const sectionTop = (section as HTMLElement).offsetTop;
    const sectionHeight = (section as HTMLElement).clientHeight;

    if (scrollTop >= sectionTop - offset) {
      activeSection = section.getAttribute('id');
    }
  }

  return activeSection;
}

/**
 * Update active navigation links based on current section
 */
export function updateActiveNavLinks(
  navLinks: NodeListOf<Element> | Element[],
  activeSection: string | null
): void {
  const navLinksArray = Array.from(navLinks);

  navLinksArray.forEach((link) => {
    link.classList.remove('active');

    const href =
      link.getAttribute('href') || link.getAttribute('data-scroll-to');
    if (href === `#${activeSection}`) {
      link.classList.add('active');
    }
  });
}

/**
 * Scroll monitor class for managing scroll events and active section detection
 */
export class ScrollMonitor {
  private options: Required<ScrollMonitorOptions>;
  private scrollHandler: ((event: Event) => void) & { cancel: () => void };
  private intersectionObserver: IntersectionObserver | null = null;
  private sections: Element[] = [];
  private navLinks: Element[] = [];
  private callbacks: Set<
    (scrollTop: number, activeSection: string | null) => void
  > = new Set();

  constructor(options: ScrollMonitorOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    // Create throttled scroll handler
    this.scrollHandler = throttle((event: Event) => {
      this.handleScroll();
    }, this.options.throttleMs);
  }

  /**
   * Initialize the scroll monitor
   */
  public initialize(): void {
    this.findElements();
    this.setupScrollListener();
    this.setupIntersectionObserver();

    // Initial call to set active section
    this.handleScroll();
  }

  /**
   * Destroy the scroll monitor and clean up listeners
   */
  public destroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
    this.scrollHandler.cancel();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    this.callbacks.clear();
  }

  /**
   * Add a callback to be called on scroll events
   */
  public addCallback(
    callback: (scrollTop: number, activeSection: string | null) => void
  ): void {
    this.callbacks.add(callback);
  }

  /**
   * Remove a callback
   */
  public removeCallback(
    callback: (scrollTop: number, activeSection: string | null) => void
  ): void {
    this.callbacks.delete(callback);
  }

  /**
   * Manually refresh the monitor (useful after DOM changes)
   */
  public refresh(): void {
    this.findElements();
    this.handleScroll();
  }

  private findElements(): void {
    // Find all sections with IDs
    this.sections = Array.from(document.querySelectorAll('section[id]'));

    // Find all navigation links
    this.navLinks = Array.from(
      document.querySelectorAll('[data-nav-link], [data-scroll-to]')
    );
  }

  private setupScrollListener(): void {
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private setupIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      return; // Fallback to scroll-based detection
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            if (sectionId) {
              updateActiveNavLinks(this.navLinks, sectionId);
            }
          }
        });
      },
      {
        rootMargin: this.options.rootMargin,
        threshold: 0.1,
      }
    );

    // Observe all sections
    this.sections.forEach((section) => {
      this.intersectionObserver?.observe(section);
    });
  }

  private handleScroll(): void {
    const scrollTop = getScrollPosition();
    const activeSection = getActiveSection(this.sections, this.options.offset);

    // Update active nav links if not using IntersectionObserver
    if (!this.intersectionObserver) {
      updateActiveNavLinks(this.navLinks, activeSection);
    }

    // Call all registered callbacks
    this.callbacks.forEach((callback) => {
      callback(scrollTop, activeSection);
    });
  }
}

/**
 * Global scroll monitor instance
 */
let globalScrollMonitor: ScrollMonitor | null = null;

/**
 * Initialize global scroll monitor
 */
export function initializeScrollMonitor(
  options: ScrollMonitorOptions = {}
): ScrollMonitor {
  if (globalScrollMonitor) {
    globalScrollMonitor.destroy();
  }

  globalScrollMonitor = new ScrollMonitor(options);
  globalScrollMonitor.initialize();

  return globalScrollMonitor;
}

/**
 * Get the global scroll monitor instance
 */
export function getScrollMonitor(): ScrollMonitor | null {
  return globalScrollMonitor;
}

/**
 * Add a scroll callback to the global monitor
 */
export function onScroll(
  callback: (scrollTop: number, activeSection: string | null) => void
): () => void {
  if (!globalScrollMonitor) {
    globalScrollMonitor = initializeScrollMonitor();
  }

  globalScrollMonitor.addCallback(callback);

  // Return cleanup function
  return () => {
    globalScrollMonitor?.removeCallback(callback);
  };
}

/**
 * Simple scroll listener with throttling (similar to original useWindowOnScroll)
 */
export function addScrollListener(
  callback: (event: Event) => void,
  throttleMs: number = 166
): () => void {
  const throttledCallback = throttle(callback, throttleMs);

  window.addEventListener('scroll', throttledCallback, { passive: true });

  // Call once on mount
  callback(new Event('scroll'));

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', throttledCallback);
    throttledCallback.cancel();
  };
}
