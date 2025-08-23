# Content Collections

このディレクトリには、Over 40 Web Club AstroサイトのContent Collectionsが含まれています。

## Collections

### Sections (`sections/`)

ウェブサイトのメインコンテンツセクション（About、Portfolio、History等）

**スキーマ:**

- `title` (任意): セクションタイトル
- `anchor` (任意): ナビゲーション用のアンカーID
- `header` (任意): セクションヘッダーテキスト
- `subheader` (任意): セクションサブヘッダーテキスト
- `order` (任意): 表示順序
- `published` (デフォルト: true): セクションを表示するかどうか
- `services` (任意): Aboutセクション用のサービス項目配列
- `portfolio` (任意): ポートフォリオ項目配列
- `timeline` (任意): 歴史・タイムライン項目配列
- `clients` (任意): クライアント項目配列

### Team (`team/`)

チームメンバーのプロフィール情報

**スキーマ:**

- `id`: 一意のID
- `name`: 表示名
- `image` (任意): プロフィール画像のパス
- `order` (任意): 表示順序
- `social` (任意): SNSリンクのオブジェクト
  - `homepage` (任意): ホームページURL
  - `twitter` (任意): Twitterユーザー名
  - `facebook` (任意): FacebookユーザーID
  - `linkedin` (任意): LinkedInユーザー名
  - `github` (任意): GitHubユーザー名
  - `medium` (任意): MediumユーザーID
  - `instagram` (任意): Instagramユーザー名
  - `youtube` (任意): YouTube チャンネルURL

### Navigation (`navigation/`)

ナビゲーションバーのコンテンツ

**スキーマ:**

- `brand`: ブランドテキスト・ロゴ
- `menuText`: メニューボタンのテキスト

### Hero (`hero/`)

ヒーロー・トップセクションのコンテンツ

**スキーマ:**

- `header`: メインヘッダーテキスト
- `subheader`: サブヘッダーテキスト
- `imageFileName`: 背景画像のファイル名
- `jumpToAnchor`: CTAボタンのターゲットアンカー
- `jumpToAnchorText`: CTAボタンのテキスト

### Footer (`footer/`)

フッターのコンテンツ

**スキーマ:**

- `copyright` (任意): 著作権テキスト
- `socialLinks` (任意): ソーシャルメディアリンクの配列
- `quickLinks` (任意): クイックナビゲーションリンクの配列

## 使用方法

AstroコンポーネントでContent Collectionsをインポートして使用：

```typescript
import { getCollection } from 'astro:content';
import {
  getSections,
  getNavigation,
  getHero,
  getFooter,
} from '../utils/content';

// 全セクションを取得
const sections = await getSections();

// チームメンバーを取得
const teamMembers = await getCollection('team');

// 特定のコンテンツを取得
const navigation = await getNavigation();
const hero = await getHero();
const footer = await getFooter();
```

## ファイル構造

```
src/content/
├── config.ts          # Content collection定義
├── sections/           # メインコンテンツセクション
│   ├── about.md
│   ├── contact.md
│   ├── history.md
│   ├── portfolio.md
│   └── team.md
├── team/              # チームメンバープロフィール
│   ├── pitang1965.md
│   ├── horumont.md
│   ├── return-null.md
│   └── ...            # 他のメンバーファイル
├── navigation/        # ナビゲーションコンテンツ
│   └── main.md
├── hero/             # ヒーローセクションコンテンツ
│   └── main.md
└── footer/           # フッターコンテンツ
    └── main.md
```
