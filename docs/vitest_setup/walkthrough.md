# Vitest導入とテスト実行の確認 (Walkthrough)

JavaScriptロジックの分離と、Vitestによるユニットテストの実行が完了しました。

## 実施内容

### 1. ファイルの分割
- `index.html` 内の Vue.js ロジックのうち、UIに依存しない計算処理を `logic.js` へ抽出しました。
- `index.html` を修正し、ESモジュールとして `logic.js` をインポートするように変更しました。

### 2. 環境構築
- `package.json` を作成し、`vitest` を開発依存関係に追加しました。
- `npm test` でテストを実行できるようにスクリプトを設定しました。

### 3. テストの作成と実行
- `logic.test.js` を作成し、以下の機能をテストしました：
  - タスクのフィルタリング (`filterTasksByStatus`)
  - タスクキーの取得 (`getTaskKey`)
  - 新規タスクキーの生成 (`generateTaskKey`)
  - ステータスの遷移ロジック (`getNextStatus`)

## テスト結果

全7件のテストがパスしました。

```text
 RUN  v4.0.18 /Users/horokusa/Desktop/TaskBoard-UI-Test-0213

 ✓ logic.test.js (7 tests) 4ms
   ✓ TaskBoard Logic (7)
     ✓ filterTasksByStatus (2)
       ✓ は、指定されたステータスのタスクのみを抽出すること 2ms
       ✓ 該当するタスクがない場合は空の配列を返すこと 0ms
     ✓ getTaskKey (2)
       ✓ は、キーが存在する場合そのキーを返すこと 0ms
       ✓ は、キーが空または存在しない場合 "NEW" を返すこと 1ms
     ✓ generateTaskKey (1)
       ✓ は、タスク数に応じた動的なキーを生成すること 0ms
     ✓ getNextStatus (2)
       ✓ は、ステータスを次の段階へ進めること 0ms
       ✓ は、最後のステータスの次は最初に戻ること 0ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
```
