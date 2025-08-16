/**
 * Core Web Vitals最適化のためのユーティリティ関数
 */

/**
 * Critical CSS を識別するためのセレクター
 */
export const CRITICAL_CSS_SELECTORS = [
  // Above the fold要素
  'header',
  'nav',
  '.hero',
  '.navbar',
  '.btn-primary',
  '.section-header',

  // レイアウト要素
  'body',
  'html',
  '.container',
  '.row',
  '.col',

  // フォント関連
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  '.font-heading',
  '.font-body',

  // 重要なコンポーネント
  '.btn',
  '.card',
  '.text-primary',
];

/**
 * リソースヒントを生成
 * @param type - ヒントの種類
 * @param href - リソースのURL
 * @param crossorigin - CORS設定
 * @returns リソースヒントのHTML
 */
export function generateResourceHint(
  type: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch',
  href: string,
  crossorigin?: boolean
): string {
  const crossoriginAttr = crossorigin ? ' crossorigin' : '';

  switch (type) {
    case 'preload':
      return `<link rel="preload" href="${href}" as="font" type="font/woff2"${crossoriginAttr}>`;
    case 'prefetch':
      return `<link rel="prefetch" href="${href}">`;
    case 'preconnect':
      return `<link rel="preconnect" href="${href}"${crossoriginAttr}>`;
    case 'dns-prefetch':
      return `<link rel="dns-prefetch" href="${href}">`;
    default:
      return '';
  }
}

/**
 * 重要なフォントのプリロード設定
 */
export const FONT_PRELOADS = [
  {
    family: 'Montserrat',
    weights: ['400', '700'],
    display: 'swap',
  },
  {
    family: 'Roboto Slab',
    weights: ['400', '700'],
    display: 'swap',
  },
  {
    family: 'Kaushan Script',
    weights: ['400'],
    display: 'swap',
  },
];

/**
 * 外部リソースの事前接続設定
 */
export const PRECONNECT_DOMAINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://api.airtable.com',
];

/**
 * Largest Contentful Paint (LCP) 最適化のための設定
 */
export interface LCPOptimization {
  // Above the foldの画像を特定
  heroImages: string[];
  // クリティカルCSS
  criticalCSS: string[];
  // プリロードすべきリソース
  preloadResources: Array<{
    href: string;
    as: string;
    type?: string;
    crossorigin?: boolean;
  }>;
}

/**
 * Cumulative Layout Shift (CLS) 最適化のための設定
 */
export interface CLSOptimization {
  // 画像のアスペクト比を保持
  maintainAspectRatio: boolean;
  // フォント読み込み時のレイアウトシフト防止
  fontDisplaySwap: boolean;
  // 動的コンテンツのプレースホルダー
  usePlaceholders: boolean;
}

/**
 * First Input Delay (FID) 最適化のための設定
 */
export interface FIDOptimization {
  // JavaScriptの遅延読み込み
  deferNonCriticalJS: boolean;
  // イベントリスナーの最適化
  passiveEventListeners: boolean;
  // 長時間実行タスクの分割
  yieldToMain: boolean;
}

/**
 * Core Web Vitals最適化設定
 */
export const CORE_WEB_VITALS_CONFIG = {
  lcp: {
    heroImages: ['/images/header-bg.jpg', '/images/hero-bg.jpg'],
    criticalCSS: CRITICAL_CSS_SELECTORS,
    preloadResources: [
      {
        href: '/fonts/montserrat-v25-latin-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true,
      },
      {
        href: '/fonts/roboto-slab-v24-latin-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true,
      },
    ],
  } as LCPOptimization,

  cls: {
    maintainAspectRatio: true,
    fontDisplaySwap: true,
    usePlaceholders: true,
  } as CLSOptimization,

  fid: {
    deferNonCriticalJS: true,
    passiveEventListeners: true,
    yieldToMain: true,
  } as FIDOptimization,
};

/**
 * パフォーマンス監視用のWeb Vitals測定コード
 */
export const WEB_VITALS_SCRIPT = `
  // Web Vitals measurement
  function measureWebVitals() {
    // LCP measurement
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID measurement
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });

    // CLS measurement
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Run measurement after page load
  if (document.readyState === 'complete') {
    measureWebVitals();
  } else {
    window.addEventListener('load', measureWebVitals);
  }
`;

/**
 * 画像遅延読み込みのIntersection Observer設定
 */
export const LAZY_LOADING_CONFIG = {
  rootMargin: '50px 0px',
  threshold: 0.01,
};

/**
 * Service Workerキャッシュ戦略
 */
export const CACHE_STRATEGIES = {
  // 静的アセット（CSS, JS, 画像）
  static: {
    strategy: 'CacheFirst',
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  // HTML ページ
  pages: {
    strategy: 'NetworkFirst',
    maxAge: 24 * 60 * 60, // 1日
  },

  // API レスポンス
  api: {
    strategy: 'StaleWhileRevalidate',
    maxAge: 5 * 60, // 5分
  },

  // フォント
  fonts: {
    strategy: 'CacheFirst',
    maxAge: 365 * 24 * 60 * 60, // 1年
  },
};
