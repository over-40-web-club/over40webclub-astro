/**
 * 画像アセット管理のためのユーティリティ関数
 */

/**
 * 画像の完全パスを取得
 * @param imagePath - 相対パス (例: 'portfolio/01-thumbnail.jpg')
 * @returns publicディレクトリからの完全パス
 */
export function getImagePath(imagePath: string): string {
  // 先頭のスラッシュを除去
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  // publicディレクトリからの相対パスを返す
  return `/images/${cleanPath}`;
}

/**
 * ファイル名からalt属性を生成
 * @param imagePath - 画像パス
 * @param fallback - フォールバック用のalt文字列
 * @returns 生成されたalt属性
 */
export function getImageAlt(imagePath: string, fallback: string = ''): string {
  if (fallback) return fallback;

  const filename = imagePath.split('/').pop()?.split('.')[0] || '';
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * 外部画像かどうかを判定
 * @param imagePath - 確認する画像パス
 * @returns 外部画像の場合true、ローカル画像の場合false
 */
export function isExternalImage(imagePath: string): boolean {
  // HTTP/HTTPSで始まるURL、または/で始まるpublic画像を外部画像として扱う
  return (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('/')
  );
}

/**
 * Astro Imageコンポーネント用の最適化された画像属性を取得
 * @param imagePath - 画像パス
 * @param alt - alt属性
 * @param width - 幅（オプション）
 * @param height - 高さ（オプション）
 * @returns 画像属性オブジェクト
 */
export function getImageAttributes(
  imagePath: string,
  alt: string = '',
  width?: number,
  height?: number
) {
  const src = isExternalImage(imagePath) ? imagePath : getImagePath(imagePath);
  const altText = getImageAlt(imagePath, alt);

  const attributes: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'sync' | 'auto';
  } = {
    src,
    alt: altText,
    loading: 'lazy',
    decoding: 'async',
  };

  if (width) attributes.width = width;
  if (height) attributes.height = height;

  return attributes;
}

/**
 * 画像の種類に応じたデフォルトサイズを取得
 * @param imagePath - 画像パス
 * @returns デフォルトの幅と高さ
 */
export function getDefaultImageSize(imagePath: string): {
  width: number;
  height: number;
} {
  const path = imagePath.toLowerCase();

  // ポートフォリオのサムネイル
  if (path.includes('portfolio') && path.includes('thumbnail')) {
    return { width: 400, height: 300 };
  }

  // ポートフォリオのフル画像
  if (path.includes('portfolio') && path.includes('full')) {
    return { width: 800, height: 600 };
  }

  // チームメンバーの画像
  if (path.includes('team')) {
    return { width: 200, height: 200 };
  }

  // ヒストリー画像
  if (path.includes('history')) {
    return { width: 300, height: 200 };
  }

  // ロゴ画像
  if (path.includes('logos')) {
    return { width: 150, height: 100 };
  }

  // ヘッダー背景
  if (path.includes('header-bg')) {
    return { width: 1920, height: 1080 };
  }

  // デフォルト
  return { width: 400, height: 300 };
}

/**
 * レスポンシブ画像のためのsizes属性を生成
 * @param baseWidth - ベースとなる画像幅
 * @returns sizes属性の値
 */
export function generateSrcSet(baseWidth: number): string {
  // 画像の種類に応じてレスポンシブサイズを設定
  if (baseWidth >= 800) {
    // 大きな画像（ヒーロー、ポートフォリオフル）
    return '(max-width: 576px) 100vw, (max-width: 768px) 90vw, (max-width: 992px) 80vw, 70vw';
  } else if (baseWidth >= 400) {
    // 中サイズ画像（ポートフォリオサムネイル）
    return '(max-width: 576px) 90vw, (max-width: 768px) 45vw, (max-width: 992px) 30vw, 25vw';
  } else if (baseWidth >= 200) {
    // 小サイズ画像（チームメンバー、ヒストリー）
    return '(max-width: 576px) 50vw, (max-width: 768px) 33vw, (max-width: 992px) 25vw, 20vw';
  } else {
    // 非常に小さい画像（ロゴなど）
    return '(max-width: 576px) 30vw, (max-width: 768px) 20vw, 15vw';
  }
}

/**
 * Core Web Vitals最適化のための画像プリロード設定
 * @param imagePath - 画像パス
 * @returns プリロードが必要かどうか
 */
export function shouldPreloadImage(imagePath: string): boolean {
  const path = imagePath.toLowerCase();

  // Above the foldの重要な画像のみプリロード
  return (
    path.includes('header-bg') || path.includes('hero') || path.includes('logo')
  );
}

/**
 * 画像の最適な品質設定を取得
 * @param imagePath - 画像パス
 * @param defaultQuality - デフォルト品質
 * @returns 最適化された品質値
 */
export function getOptimalQuality(
  imagePath: string,
  defaultQuality: number = 85
): number {
  const path = imagePath.toLowerCase();

  // 写真系は少し品質を上げる
  if (path.includes('team') || path.includes('portfolio')) {
    return Math.min(defaultQuality + 5, 95);
  }

  // アイコンやロゴは品質を下げても問題ない
  if (path.includes('logo') || path.includes('icon')) {
    return Math.max(defaultQuality - 10, 70);
  }

  return defaultQuality;
}
