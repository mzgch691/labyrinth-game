# 迷路ゲーム（Labyrinth Game）

『世界のゲーム事典』（松田道弘著）に収録されているゲームをウェブでプレイできるようにしました。  
1vs1で互いに作った迷路を解く対戦ゲームです。

## 🛠️ 技術スタック

- **フロント:** TypeScript, HTML/CSS
- **バック:** Node.js, WebSocket
- **デプロイ:** Render


## 🚀 クイックスタート

### Visual Studio Code + Dev Container を使う場合

1. VS Code に **Dev Containers** 拡張をインストール
2. リポジトリをクローン
```bash
git clone https://github.com/mzgch691/labyrinth-game.git
```
3. VS Code でフォルダを開く
4. コマンドパレット（Ctrl+Shift+P）で **"Dev Containers: Reopen in Container"** を選択
5. 自動的に環境がセットアップされます

セットアップ完了後、ターミナルで実行：
```bash
npm run build
npm run serve:server
```

別のターミナルで実行：
```bash
npm run serve:front
```

### ローカル環境で実行する場合

前提条件: Node.js 14 以上

```bash
git clone https://github.com/mzgch691/labyrinth-game.git
cd labyrinth-game
npm install
npm run build
npm run serve:server
```

別のターミナルで実行：
```bash
npm run serve:front
```

## 🌐 Render でデプロイ

このプロジェクトは Render で無料公開できます。

### 必要な設定

**Web Service（バックエンド）**
- GitHub リポジトリを連携
- **Build Command:** `npm run build`
- **Start Command:** `node dist/server/index.js`
- **Environment:** Node
- Render が PORT 環境変数を自動設定（コードで対応済み）

**Static Site（フロントエンド）**
- 同じ GitHub リポジトリを連携
- **Build Command:** `npm run build`
- **Publish Directory:** `.`（dist フォルダも含まれます）

### デプロイの流れ

1. GitHub に push
2. Render が自動的に build して deploy
3. 数分で本番環境に反映

### WebSocket 接続の自動設定

フロント側は `window.location.hostname` でホスト名を判定：
- ローカル（localhost → `ws://localhost:8080`）
- 本番環境（Render URL → `wss://バックエンドURL`）
