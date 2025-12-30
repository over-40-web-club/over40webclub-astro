#!/usr/bin/env node
/**
 * Portfolio画像をリサイズするスクリプト
 * 使い方: node scripts/resize-portfolio-image.js <元画像パス> <番号>
 * 例: node scripts/resize-portfolio-image.js tmp/image.jpg 13
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// コマンドライン引数を取得
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('使い方: node scripts/resize-portfolio-image.js <元画像パス> <番号>');
  console.error('例: node scripts/resize-portfolio-image.js tmp/image.jpg 13');
  process.exit(1);
}

const [sourcePath, number] = args;
const sourceFullPath = join(projectRoot, sourcePath);

if (!existsSync(sourceFullPath)) {
  console.error(`エラー: 画像ファイルが見つかりません: ${sourceFullPath}`);
  process.exit(1);
}

const outputDir = join(projectRoot, 'public/images/portfolio');
const thumbnailPath = join(outputDir, `${number}-thumbnail.jpg`);
const fullPath = join(outputDir, `${number}-full.jpg`);

async function resizeImages() {
  try {
    console.log(`元画像: ${sourcePath}`);
    console.log(`出力番号: ${number}`);

    // サムネイル画像を生成 (400x300)
    await sharp(sourceFullPath)
      .resize(400, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(thumbnailPath);
    console.log(`✓ サムネイル生成完了: ${thumbnailPath}`);

    // フル画像を生成 (600x400)
    await sharp(sourceFullPath)
      .resize(600, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toFile(fullPath);
    console.log(`✓ フル画像生成完了: ${fullPath}`);

    console.log('\n✅ 画像の変換が完了しました！');
  } catch (error) {
    console.error('エラー:', error.message);
    process.exit(1);
  }
}

resizeImages();
