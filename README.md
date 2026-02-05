# 迷路ゲーム（Labyrinth Game）

マルチプレイヤー対応の迷路作成・対戦ゲームです。  
自分で迷路を作成し、他のプレイヤーと対戦できます。WebSocketを使用したリアルタイム通信対応。

## 🎮 機能

### ゲーム機能
- **迷路作成画面** - 自分用の迷路を自由に設計
- **迷路選択画面** - 保存済み迷路の管理・編集・削除
- **ロビー画面** - 迷路選択＆Ready状態管理
- **対戦画面** - リアルタイムで他プレイヤーと迷路を解く
- **ゴール判定** - 先にゴールしたプレイヤーが勝利

### 技術機能
- WebSocketによるリアルタイムマルチプレイ
- LocalStorageでの迷路データ管理
- TypeScriptによる型安全な実装

## 🛠️ 技術スタック

**フロントエンド**
- HTML/CSS/JavaScript (TypeScript)
- Vite（開発環境）

**バックエンド**
- Node.js
- WebSocket (ws)

**開発ツール**
- TypeScript
- Git

## 📋 ファイル構造

```
src/
  ├── front/                 # フロントエンド
  │   ├── screens/          # 画面（title, lobby, match, etc.）
  │   ├── components/       # UI コンポーネント
  │   ├── state/            # ゲーム状態管理
  │   ├── utils/            # ユーティリティ（迷路アルゴリズムなど）
  │   ├── styles/           # CSS ファイル
  │   ├── connection.ts     # WebSocket 接続
  │   ├── router.ts         # ページ遷移
  │   └── main.ts           # エントリポイント
  ├── server/               # バックエンド
  │   ├── handlers/         # メッセージハンドラ
  │   ├── state/            # サーバー状態管理
  │   ├── utils/            # ユーティリティ
  │   ├── ws/               # WebSocket 管理
  │   └── index.ts          # サーバー起動
  └── shared/               # 共有型定義
      └── types.ts          # TypeScript 型

dist/                        # ビルド出力
```

## 🚀 クイックスタート

### 前提条件
- Node.js 14 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/mzgch691/labyrinth-game.git
cd labyrinth-game

# 依存パッケージをインストール
npm install
```

### ローカル開発

**ビルド**
```bash
npm run build
```

**フロントエンド実行**（開発用サーバー）
```bash
npm run serve:front
```
ブラウザで `http://localhost:3000` を開く

**バックエンド実行**（WebSocket サーバー）
```bash
npm run serve:server
```
デフォルトポート: `8080`

### 開発中

TypeScript 監視モード
```bash
npm run watch
```
ファイル変更時に自動的にコンパイルされます。

## 🎯 使い方

### ゲームフロー

1. **タイトル画面** - 「はじめる」または「迷路作成」を選択
2. **迷路作成**
   - 「新しい迷路を作成」で新規作成
   - セル間をクリックして壁を配置
   - スタート(S)とゴール(G)をドラッグ移動
   - 「新規保存」で保存
3. **ロビー** - 迷路を選択して「Ready」ボタンを押す
4. **対戦** - 相手と同時に迷路を解く（ターンベース）
5. **結果** - ゴール到達でゲーム終了、勝者が表示される

### 迷路操作

| 操作 | 説明 |
|------|------|
| セル間をクリック | 壁をトグル（ON/OFF） |
| S/Gをドラッグ | スタート/ゴール位置を移動 |
| 「新規保存」 | 迷路を新規保存 |
| 「上書き保存」 | 編集中の迷路を上書き |

## 📡 ネットワーク通信

WebSocket で以下のメッセージをやり取りします：

| メッセージ | 説明 |
|-----------|------|
| START_MATCH | ゲーム開始通知 |
| MAZE_DATA | 迷路データ送受信 |
| MOVE_RESULT | 移動結果（成功/失敗） |
| GAME_OVER | ゲーム終了（勝者通知） |

## 🌐 Render で公開

### 1) Web Service（バックエンド）
- **Build Command:** `npm run build`
- **Start Command:** `node dist/server/index.js`
- **Environment:** Node.js

### 2) Static Site（フロントエンド）
- **Build Command:** `npm run build`
- **Publish Directory:** `.`

詳細は [Render 公開ガイド](https://docs.render.com) を参照。

## 💾 データ保存

- **ゲーム状態** - メモリ内（サーバー）
- **迷路データ** - LocalStorage（クライアント）

リロード時にローカルデータは保持されます。

## 🔧 開発に参加する

1. フォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing`)
3. コミット (`git commit -m 'Add amazing feature'`)
4. プッシュ (`git push origin feature/amazing`)
5. プルリクエストを作成

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

## 🤝 サポート

問題が発生した場合は GitHub Issues で報告してください。

---

**開発者:** mzgch691  
**最終更新:** 2026年2月5日
