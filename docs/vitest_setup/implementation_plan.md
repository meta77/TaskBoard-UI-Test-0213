# Vitest導入とコード分離の実装計画

この計画では、現在の `index.html` に含まれているJavaScriptロジックを独立したモジュールとして分離し、Vitestを使用してテストできる環境を構築します。

## 変更内容

### 1. プロジェクトの初期化
- [NEW] `package.json`: Vitestと実行スクリプトの設定を追加。

### 2. モジュール分離
- [NEW] `logic.js`: `index.html` の `<script>` 内にある、UIに依存しない純粋なロジック（`getTasksByStatus`, `getTaskKey`, `saveTask` 内のロジックなど）を抽出。
- [MODIFY] `index.html`: `logic.js` を ESモジュールとしてインポートするように変更。

### 3. テストの作成
- [NEW] `logic.test.js`: 分離した関数の動作を検証するテストコード。

## 検証計画
### 自動テスト
- `npm test` (または `npx vitest run`) を実行し、全てのテストがパスすることを確認。

### 手動確認
- ブラウザで `index.html` を開き、タスクの表示や追加などの基本機能が従来通り動くことを確認。
