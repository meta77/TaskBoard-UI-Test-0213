# Task List

- [ ] `logic.js` に列設定を追加・削除・更新する純粋関数を実装（`addColumnSetting`, `removeColumnSetting`, `updateColumnSetting`）
- [ ] `logic.test.js` に追加した列設定用関数のユニットテストを実装
- [ ] `logic.js` の既存ロジック（`getNextStatus`, `findTargetPosition` 等）を固定配列ではなく動的 `columns` 配列を受け取るように修正し、テストを修正
- [ ] `app.js` の `columns` を固定配列から `ref` に変更し、設定モーダル用に `columnsDraft` 状態を追加
- [ ] `app.js` の `saveSettings` に列設定の保存ロジックと、削除された列にいたタスクの移動（例：一番左の列に寄せる等のサニタイズ）を追加
- [ ] `index.html` の設定モーダル UI を拡張し、「列設定（最大7つ）」の編集エリアを追加
- [ ] `index.html` のボード表示やセレクトボックスが動的な `columns` を参照するように修正し、各種表示崩れがないか確認
- [ ] `npm test` 等で単体・統合テストの実行と手動テストでの動作確認を行う
