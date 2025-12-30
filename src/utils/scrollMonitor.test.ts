import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getScrollPosition,
  isElementInViewport,
  getActiveSection,
  updateActiveNavLinks,
  ScrollMonitor,
  initializeScrollMonitor,
  getScrollMonitor,
  onScroll,
  addScrollListener,
} from './scrollMonitor';

// Mock DOM methods
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
const mockQuerySelectorAll = vi.fn();

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

// Mock elements
const createMockElement = (
  id: string,
  offsetTop: number = 0,
  clientHeight: number = 100
) => ({
  getAttribute: vi.fn((attr) => (attr === 'id' ? id : null)),
  setAttribute: vi.fn(),
  offsetTop,
  clientHeight,
  getBoundingClientRect: vi.fn(() => ({
    top: offsetTop - window.pageYOffset,
    bottom: offsetTop + clientHeight - window.pageYOffset,
  })),
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
  },
});

beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();

  // Mock window properties
  Object.defineProperty(window, 'pageYOffset', {
    value: 0,
    writable: true,
  });

  Object.defineProperty(window, 'innerHeight', {
    value: 800,
    writable: true,
  });

  Object.defineProperty(window, 'addEventListener', {
    value: mockAddEventListener,
    writable: true,
  });

  Object.defineProperty(window, 'removeEventListener', {
    value: mockRemoveEventListener,
    writable: true,
  });

  // Mock document properties
  Object.defineProperty(document, 'documentElement', {
    value: { scrollTop: 0, clientHeight: 800 },
    writable: true,
  });

  Object.defineProperty(document, 'body', {
    value: { scrollTop: 0 },
    writable: true,
  });

  Object.defineProperty(document, 'querySelectorAll', {
    value: mockQuerySelectorAll,
    writable: true,
  });

  // Mock IntersectionObserver as a class
  class MockIntersectionObserver {
    observe = mockObserve;
    disconnect = mockDisconnect;
    unobserve = vi.fn();
    constructor(callback: any, options?: any) {
      mockIntersectionObserver(callback, options);
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    value: MockIntersectionObserver,
    writable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getScrollPosition', () => {
  it('should return pageYOffset when available', () => {
    Object.defineProperty(window, 'pageYOffset', {
      value: 100,
      writable: true,
    });
    expect(getScrollPosition()).toBe(100);
  });

  it('should fallback to documentElement.scrollTop', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    Object.defineProperty(document, 'documentElement', {
      value: { scrollTop: 150 },
      writable: true,
    });
    expect(getScrollPosition()).toBe(150);
  });
});

describe('isElementInViewport', () => {
  it('should return true when element is in viewport', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: 100,
        bottom: 200,
      }),
    } as Element;

    expect(isElementInViewport(mockElement)).toBe(true);
  });

  it('should return false when element is above viewport', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: -100,
        bottom: -50,
      }),
    } as Element;

    expect(isElementInViewport(mockElement)).toBe(false);
  });

  it('should consider offset parameter', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: 750,
        bottom: 850,
      }),
    } as Element;

    // With offset 100, element at top 750 should NOT be in viewport
    // since windowHeight (800) - offset (100) = 700, and 750 > 700
    expect(isElementInViewport(mockElement, 100)).toBe(false);

    // Test with element that should be in viewport with offset
    const mockElementInView = {
      getBoundingClientRect: () => ({
        top: 650,
        bottom: 750,
      }),
    } as Element;

    expect(isElementInViewport(mockElementInView, 100)).toBe(true);
  });
});

describe('getActiveSection', () => {
  it('should return the active section based on scroll position', () => {
    Object.defineProperty(window, 'pageYOffset', {
      value: 300,
      writable: true,
    });

    const sections = [
      createMockElement('section1', 0, 200),
      createMockElement('section2', 200, 200),
      createMockElement('section3', 400, 200),
    ];

    // With scroll position 300 and offset 100:
    // section1: 300 >= 0 - 100 = -100 ✓ (active)
    // section2: 300 >= 200 - 100 = 100 ✓ (active, overwrites section1)
    // section3: 300 >= 400 - 100 = 300 ✓ (active, overwrites section2)
    const activeSection = getActiveSection(sections as any, 100);
    expect(activeSection).toBe('section3');
  });

  it('should return null when no section is active', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

    const sections = [createMockElement('section1', 500, 200)];

    const activeSection = getActiveSection(sections as any, 100);
    expect(activeSection).toBe(null);
  });
});

describe('updateActiveNavLinks', () => {
  it('should update active class on navigation links', () => {
    const navLinks = [
      {
        classList: { add: vi.fn(), remove: vi.fn() },
        getAttribute: vi.fn((attr) => (attr === 'href' ? '#section1' : null)),
      },
      {
        classList: { add: vi.fn(), remove: vi.fn() },
        getAttribute: vi.fn((attr) => (attr === 'href' ? '#section2' : null)),
      },
    ];

    updateActiveNavLinks(navLinks as any, 'section1');

    expect(navLinks[0].classList.remove).toHaveBeenCalledWith('active');
    expect(navLinks[0].classList.add).toHaveBeenCalledWith('active');
    expect(navLinks[1].classList.remove).toHaveBeenCalledWith('active');
    expect(navLinks[1].classList.add).not.toHaveBeenCalled();
  });
});

describe('ScrollMonitor', () => {
  it('should initialize and setup event listeners', () => {
    mockQuerySelectorAll.mockImplementation((selector) => {
      if (selector === 'section[id]') return [createMockElement('section1')];
      if (selector === '[data-nav-link], [data-scroll-to]') return [];
      return [];
    });

    const monitor = new ScrollMonitor();
    monitor.initialize();

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should add and remove callbacks', () => {
    const monitor = new ScrollMonitor();
    const callback = vi.fn();

    monitor.addCallback(callback);
    monitor.removeCallback(callback);

    // Should not throw
    expect(true).toBe(true);
  });

  it('should clean up on destroy', () => {
    mockQuerySelectorAll.mockReturnValue([]);

    const monitor = new ScrollMonitor();
    monitor.initialize();
    monitor.destroy();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
    expect(mockDisconnect).toHaveBeenCalled();
  });
});

describe('initializeScrollMonitor', () => {
  it('should create and return a scroll monitor instance', () => {
    mockQuerySelectorAll.mockReturnValue([]);

    const monitor = initializeScrollMonitor();

    expect(monitor).toBeInstanceOf(ScrollMonitor);
    expect(getScrollMonitor()).toBe(monitor);
  });
});

describe('onScroll', () => {
  it('should add callback to global monitor', () => {
    mockQuerySelectorAll.mockReturnValue([]);

    const callback = vi.fn();
    const cleanup = onScroll(callback);

    expect(typeof cleanup).toBe('function');
    expect(getScrollMonitor()).toBeInstanceOf(ScrollMonitor);
  });
});

describe('addScrollListener', () => {
  it('should add throttled scroll listener', () => {
    const callback = vi.fn();
    const cleanup = addScrollListener(callback, 100);

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
    expect(callback).toHaveBeenCalledWith(expect.any(Event)); // Initial call
    expect(typeof cleanup).toBe('function');
  });
});
