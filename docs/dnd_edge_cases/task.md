# Task List

- [ ] `app.test.js` に「何も選ばずにドロップした場合（`onDragStart` なしでの `onDrop`）」のテストを追加
- [ ] `app.test.js` に「元の位置と同じ場所（自分自身の上）にドロップした場合」のテストを追加
- [ ] `logic.test.js` に `moveTaskInArray` で自分自身をターゲットにした場合のテストを追加
- [ ] `logic.js` の `moveTaskInArray` を修正し、`taskId === targetTaskId` の早期リターンを追加
- [ ] `npm test` を実行して、追加した統合テストとロジックの修正が正しく機能するか確認
