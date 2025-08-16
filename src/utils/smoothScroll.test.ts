import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  smoothScrollTo,
  smoothScrollToTop,
  createSmoothScrollHandler,
  initializeSmoothScroll,
} from './smoothScroll';

// Mock DOM methods
const mockScrollTo = vi.fn();
const mockRequestAnimationFrame = vi.fn();
const mockPerformanceNow = vi.fn();

// Mock querySelector
const mockQuerySelector = vi.fn();
const mockQuerySelectorAll = vi.fn();

// Mock element
const mockElement = {
  getBoundingClientRect: vi.fn(() => ({ top: 500 })),
  addEventListener: vi.fn(),
  getAttribute: vi.fn(),
};

beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();

  // Mock window methods
  Object.defineProperty(window, 'scrollTo', {
    value: mockScrollTo,
    writable: true,
  });

  Object.defineProperty(window, 'requestAnimationFrame', {
    value: mockRequestAnimationFrame,
    writable: true,
  });

  Object.defineProperty(window, 'pageYOffset', {
    value: 0,
    writable: true,
  });

  Object.defineProperty(performance, 'now', {
    value: mockPerformanceNow,
    writable: true,
  });

  // Mock document methods
  Object.defineProperty(document, 'querySelector', {
    value: mockQuerySelector,
    writable: true,
  });

  Object.defineProperty(document, 'querySelectorAll', {
    value: mockQuerySelectorAll,
    writable: true,
  });

  Object.defineProperty(document, 'documentElement', {
    value: { scrollTop: 0 },
    writable: true,
  });

  Object.defineProperty(document, 'body', {
    value: { scrollTop: 0 },
    writable: true,
  });

  // Setup performance.now to return incrementing values
  let time = 0;
  mockPerformanceNow.mockImplementation(() => {
    time += 16; // Simulate 60fps
    return time;
  });

  // Setup requestAnimationFrame to call callback immediately
  mockRequestAnimationFrame.mockImplementation((callback) => {
    setTimeout(callback, 0);
    return 1;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('smoothScrollTo', () => {
  it('should scroll to numeric position', async () => {
    const targetPosition = 500;

    await smoothScrollTo(targetPosition, { duration: 100 });

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('should scroll to element by selector', async () => {
    const targetSelector = '#test-section';
    mockQuerySelector.mockReturnValue(mockElement);

    await smoothScrollTo(targetSelector, { duration: 100 });

    expect(mockQuerySelector).toHaveBeenCalledWith(targetSelector);
    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('should handle element not found', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockQuerySelector.mockReturnValue(null);

    await smoothScrollTo('#nonexistent', { duration: 100 });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Element with selector "#nonexistent" not found'
    );
    expect(mockScrollTo).toHaveBeenCalled(); // Should still scroll to 0

    consoleSpy.mockRestore();
  });

  it('should apply offset to target position', async () => {
    const offset = 100;
    mockQuerySelector.mockReturnValue(mockElement);

    await smoothScrollTo('#test', { duration: 100, offset });

    expect(mockScrollTo).toHaveBeenCalled();
  });
});

describe('smoothScrollToTop', () => {
  it('should scroll to top of page', async () => {
    await smoothScrollToTop({ duration: 100 });

    expect(mockScrollTo).toHaveBeenCalled();
  });
});

describe('createSmoothScrollHandler', () => {
  it('should return a function that scrolls to target', async () => {
    const handler = createSmoothScrollHandler(500, { duration: 100 });

    expect(typeof handler).toBe('function');

    await handler();

    expect(mockScrollTo).toHaveBeenCalled();
  });
});

describe('initializeSmoothScroll', () => {
  it('should initialize scroll handlers for data-scroll-to elements', () => {
    const mockElements = [
      { ...mockElement, getAttribute: vi.fn(() => '#section1') },
      { ...mockElement, getAttribute: vi.fn(() => '#section2') },
    ];

    mockQuerySelectorAll.mockImplementation((selector) => {
      if (selector === '[data-scroll-to]') return mockElements;
      if (selector === '[data-scroll-to-top]') return [];
      if (selector === 'a[href^="#"]') return [];
      return [];
    });

    initializeSmoothScroll();

    expect(mockQuerySelectorAll).toHaveBeenCalledWith('[data-scroll-to]');
    expect(mockElements[0].addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
    expect(mockElements[1].addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
  });

  it('should initialize scroll handlers for data-scroll-to-top elements', () => {
    const mockElements = [mockElement];

    mockQuerySelectorAll.mockImplementation((selector) => {
      if (selector === '[data-scroll-to]') return [];
      if (selector === '[data-scroll-to-top]') return mockElements;
      if (selector === 'a[href^="#"]') return [];
      return [];
    });

    initializeSmoothScroll();

    expect(mockQuerySelectorAll).toHaveBeenCalledWith('[data-scroll-to-top]');
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
  });

  it('should initialize scroll handlers for anchor links', () => {
    const mockElements = [
      { ...mockElement, getAttribute: vi.fn(() => '#section1') },
    ];

    mockQuerySelectorAll.mockImplementation((selector) => {
      if (selector === '[data-scroll-to]') return [];
      if (selector === '[data-scroll-to-top]') return [];
      if (selector === 'a[href^="#"]') return mockElements;
      return [];
    });

    initializeSmoothScroll();

    expect(mockQuerySelectorAll).toHaveBeenCalledWith('a[href^="#"]');
    expect(mockElements[0].addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    );
  });
});
