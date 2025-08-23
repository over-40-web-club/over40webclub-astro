# Over 40 Web Club - Astroサイト

これは、もともとGatsbyで構築されたOver 40 Web ClubのウェブサイトをAstroに移行したものです。

## 📋 目次

- [プロジェクト構造](#-プロジェクト構造)
- [コマンド](#-コマンド)
- [技術スタック](#️-技術スタック)
- [機能](#-機能)
- [デプロイ](#-デプロイ)
- [コンテンツ管理](#-コンテンツ管理)
  - [チームメンバー管理](#チームメンバー管理)
  - [**チームメンバー向け編集手順**](#チームメンバー向け編集手順) 👈 **メンバーの方はこちら**
- [開発](#-開発)
- [テスト](#-テスト)
- [詳細情報](#-詳細情報)

## 🚀 プロジェクト構造

```text
astro-site/
├── public/
│   ├── images/              # 画像アセット
│   │   └── team/           # チームメンバーの写真
│   └── favicon.svg
├── src/
│   ├── components/          # 再利用可能なコンポーネント
│   │   ├── ui/             # 基本UIコンポーネント
│   │   ├── sections/       # ページセクション
│   │   └── layout/         # レイアウトコンポーネント
│   ├── layouts/            # ページレイアウト
│   ├── pages/              # ページファイル（ルーティング）
│   ├── content/            # マークダウンコンテンツ
│   │   ├── sections/       # セクションコンテンツ
│   │   ├── team/           # チームメンバープロフィール
│   │   └── config.ts       # コンテンツ設定
│   ├── styles/             # グローバルスタイル
│   ├── utils/              # ユーティリティ関数
│   ├── types/              # TypeScript型定義
│   └── config/             # サイト設定
├── scripts/                # ユーティリティスクリプト
├── astro.config.mjs        # Astro設定
├── package.json
├── tsconfig.json
└── vitest.config.ts        # テスト設定
```

## 🧞 コマンド

すべてのコマンドは、プロジェクトのルートからターミナルで実行します：

| コマンド              | アクション                                       |
| :------------------- | :----------------------------------------------- |
| `npm install`        | 依存関係をインストール                            |
| `npm run dev`        | `localhost:4321`でローカル開発サーバーを起動      |
| `npm run build`      | 本番用サイトを `./dist/` にビルド                 |
| `npm run preview`    | デプロイ前にローカルでビルドをプレビュー           |
| `npm run test`       | テストを一度実行                                  |
| `npm run test:watch` | テストをウォッチモードで実行                      |
| `npm run type-check` | TypeScriptの型チェックを実行                     |
| `npm run astro ...`  | `astro add`, `astro check` などのCLIコマンドを実行 |

## 🛠️ 技術スタック

- **フレームワーク**: Astro 5.x
- **言語**: TypeScript
- **スタイル**: SCSS + Bootstrap 5.2.0
- **テスト**: Vitest + jsdom
- **コンテンツ**: Content Collectionsを使ったMarkdown

## 🎨 機能

- Astroによる静的サイト生成
- 型安全性のためのTypeScript
- BootstrapとSCSSの統合
- マークダウン管理のためのContent Collections
- チームデータのGitベースコンテンツ管理
- レスポンシブデザイン
- SEO最適化
- パフォーマンス最適化

## 🌐 デプロイ

このサイトは以下の機能を持つNetlifyでのデプロイに対応しています：

- Gitからの自動ビルド
- Netlify Formsを使ったフォーム処理
- セキュリティヘッダーとパフォーマンス最適化
- 自動リダイレクトとエラーハンドリング

### クイックデプロイ設定

1. **Netlifyに接続**: GitリポジトリをNetlifyにリンク
2. **ビルド設定を構成**:
   - ビルドコマンド: `npm run build`
   - 公開ディレクトリ: `dist`
   - Nodeバージョン: 18
3. **環境変数を設定**（詳細は`DEPLOYMENT.md`を参照）:
   - `SITE_URL`
4. **デプロイ**: Netlifyが自動的にビルドしてデプロイします

### 検証

デプロイ設定をテストしてください：

```bash
npm run verify-deployment
```

詳細なデプロイ手順については、`DEPLOYMENT.md`を参照してください。

## 📝 コンテンツ管理

コンテンツは以下を通じて管理されます：

- ページセクション用の`src/content/sections/`内のマークダウンファイル
- チームメンバープロフィール用の`src/content/team/`内のマークダウンファイル
- チーム写真を含む`public/images/`内の静的アセット

### チームメンバー管理

チームメンバーのデータは個別のマークダウンファイルとして保存されます：

- **場所**: `src/content/team/[twitterユーザー名].md`
- **画像**: `public/images/team/[twitterユーザー名].[拡張子]`
- **形式**: フロントマターのメタデータ + 自己紹介のマークダウンコンテンツ

チームメンバーファイル構造の例：
```markdown
---
id: "unique-id"
name: "表示名"
image: "/images/team/username.jpg"
order: 1
social:
  twitter: "username"
  github: "username"
  homepage: "https://example.com"
---

マークダウン形式のチームメンバー自己紹介。
```

### チームメンバー向け編集手順

> **📝 チームメンバーの皆さんへ**  
> 自分のプロフィール情報（自己紹介・SNSリンク・プロフィール画像）を更新したい場合は、以下の手順に従ってください。  
> GitHubアカウントとローカル開発環境（Node.js）が必要です。

チームメンバーが自分のプロフィールを編集する手順：

#### 1. リポジトリの取得
```bash
# リポジトリをクローン
git clone https://github.com/over-40-web-club/over40webclub-astro.git
cd over40webclub-astro

# 依存関係をインストール
npm install
```

#### 2. 自分のプロフィールファイルを確認
```bash
# src/content/team/ 内で自分のファイルを探す
ls src/content/team/

# 例：Twitterユーザー名が "your-username" の場合
# src/content/team/your-username.md を編集
```

#### 3. プロフィール編集
お好みのエディタでマークダウンファイルを編集：
```markdown
---
id: "your-record-id"
name: "あなたの名前"
image: "/images/team/your-username.jpg"
order: 1
social:
  twitter: "your-username"
  github: "your-github"
  homepage: "https://your-website.com"
---

ここに自己紹介を書いてください。
Markdownが使用できます。**太字**や*斜体*、リンクも可能です。
```

#### 4. ローカルでテスト
```bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:4321 を開き
# Teamセクションで変更を確認
```

#### 5. 変更をプッシュ
```bash
# 変更をステージング
git add src/content/team/your-username.md

# コミット（分かりやすいメッセージで）
git commit -m "プロフィール更新: [あなたの名前]"

# 変更をプッシュ
git push origin main
```

#### 6. 画像の更新（必要に応じて）
プロフィール画像を更新する場合：
1. 新しい画像を `public/images/team/your-username.[拡張子]` に配置
2. マークダウンファイルの `image:` パスが正しいことを確認
3. 上記手順でコミット・プッシュ

#### 注意事項
- ファイル名は変更しないでください（Twitterユーザー名ベース）
- 他のメンバーのファイルは編集しないでください
- プッシュ前に必ずローカルでテストしてください
- 画像ファイルは適切なサイズ（推奨：400x400px程度）にしてください

#### トラブルシューティング

**問題：`npm install` でエラーが出る**
```bash
# Node.jsのバージョンを確認（18以上推奨）
node --version

# キャッシュをクリアして再試行
npm cache clean --force
npm install
```

**問題：開発サーバーが起動しない**
```bash
# ポートが使用されている場合、別のポートを使用
npm run dev -- --port 3000
```

**問題：自分のファイルが見つからない**
```bash
# 全てのチームファイルを確認
ls -la src/content/team/
# あなたのTwitterユーザー名.md があることを確認
```

**問題：プッシュ権限がない**
- リポジトリのコラボレーター権限が必要です
- 管理者に連絡してアクセス権限を確認してください

**サポート**  
問題が解決しない場合は、GitHubのIssueまたはDiscordで質問してください。

### レガシーマイグレーション

このプロジェクトは以前、チームデータ管理にAirtableを使用していました。マイグレーションスクリプトは歴史的参考のため`scripts/archive/`にアーカイブされていますが、現在のセットアップでは動作しません。

## 🔧 開発

1. リポジトリをクローン
2. 依存関係をインストール: `npm install`
3. （オプション）環境変数を設定（`.env.example`を参照）
4. 開発サーバーを開始: `npm run dev`
5. ブラウザで `http://localhost:4321` を開く

## 🧪 テスト

以下でテストを実行：

```bash
npm run test          # 一度実行
npm run test:watch    # ウォッチモード
```

## 📚 詳細情報

- [Astro ドキュメント](https://docs.astro.build)
- [Bootstrap ドキュメント](https://getbootstrap.com/docs/5.2/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs/)
