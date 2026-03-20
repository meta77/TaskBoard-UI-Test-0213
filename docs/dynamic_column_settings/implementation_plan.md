# 実装計画 (Implementation Plan)

## 目的
タスクボードの列（ステータス）の数と名称を、ユーザーが設定モーダルから動的に変更できるように拡張します。列数は最大7つまでとし、デフォルトの仕様（Backlog, To Do, In Progress, Review, Done）を初期値とします。ビジネスロジックとUI（状態管理）を疎結合にする既存のパラダイムを維持しつつ実装します。

## 変更内容

### 1. `logic.js` (ビジネスロジック - 純粋関数)
固定配列 `columnFlow` に依存している既存関数の引数を、動的な `columns` 配列を受け取るように改修し、列設定用の追加・削除・更新関数を実装します。
- **[MODIFY] `findTargetPosition(tasks, taskId, direction, columns)`**
  - 動的な列設定（`columns`）を受け取るように変更し、左右（'left', 'right'）移動の計算をこの配列に基づいて行うようにします。
- **[MODIFY] `getNextStatus(currentStatus, columns)`**
  - 動的な列設定（`columns`）を受け取るように変更し、次ステータスの計算をこの配列に基づいて行うようにします。
- **[NEW] `addColumnSetting(columns, newName)`**
  - 最大7つまでの制限で、新しい列設定（idと名前をもつオブジェクト）を配列の末尾に追加する純粋関数。IDは `col_${Date.now()}` のようにユニークに生成します。
- **[NEW] `removeColumnSetting(columns, colId)`**
  - 最低1つの列を残す制限で、指定された列IDを削除する純粋関数。
- **[NEW] `updateColumnSetting(columns, colId, newName)`**
  - 指定された列IDの名称を更新する純粋関数。
- **[NEW] `sanitizeTaskStatuses(tasks, columns)`**
  - 保存時に、設定変更によって存在しなくなった列ID（ステータス）を持つタスクを救済（マイグレーション）する関数です。存在しないステータスのタスクは、強制的に「一番左の列（`columns[0].id`）」に移動させます。

### 2. `logic.test.js` (ユニットテスト)
変更・追加した `logic.js` の関数に対するユニットテストを記述・更新します。
- **[MODIFY] 既存関数のテスト**
  - `getNextStatus` と `findTargetPosition` のテストにモックの `columns` 配列を渡すように修正し、期待通り動作することを確認します。
- **[NEW] 新規関数のテスト**
  - 列の追加（最大7つ制限）、削除（最低1つ制限）、名称更新のテストを追加します。
  - サニタイズ処理が「存在しないステータスのタスクを先頭列に移動させる」という仕様を満たすかテストします。

### 3. `app.js` (状態管理・副作用・Vueロジック)
固定されていた `columns` 変数をリアクティブな状態（`ref`）に変更し、設定モーダル用の状態を追加します。
- **[MODIFY] State定義**
  - `const columns = ref([...])` としてリアクティブ化します。デフォルト値は以前のものを使用します。
- **[NEW] Settings State**
  - 設定モーダルでの編集用に `columnsDraft = ref([])` を追加します。
- **[MODIFY] `openSettingsModal` & `saveSettings`**
  - `openSettingsModal` 時に `columns.value` のディープコピーを `columnsDraft` に作成します。
  - `saveSettings` 時に `columnsDraft.value` を本番に適用し、同時に全タスクに対して `sanitizeTaskStatuses` を実行し不整合を防ぎます。
- **[NEW] Draft操作メソッド**
  - 列設定の追加・削除・更新用の一時保存メソッド群（`draftAddColumn`, `draftRemoveColumn`, `draftUpdateColumn`）を作成し `return` します。

### 4. `index.html` (UI/DOM)
Board SettingsモーダルのUIを拡張し、タスクのフォーム等も動的な列に対応しているか確認（元々 `v-for` を使用しているため軽微な修正）します。
- **[MODIFY] 設定モーダル**
  - 「Description Fields」の下に「Column Settings (Max 7)」の編集エリアを構築します。
  - 列名の入力フィールド、削除ボタン（ゴミ箱アイコン）、及び「+ Add Column」ボタンを配置します。

## ユーザーレビュー要求 (User Review Required)
- **サニタイズ（救済）の仕様確認**:
  > [!IMPORTANT]
  > ある列（例：「In Progress」）を削除して設定を保存した際、そこに属していたタスクの行き先（救済先）を**「一番左（先頭）の列に強制移動させる」**という仕様にしています。もし「設定上から消えたらタスクも削除する」、あるいは「未分類（特別列）を作る」などの別要件がよろしければご指定ください。

## 検証・テスト計画 (Verification Plan)
### 自動テスト
- `npm test` によるユニット（ビジネスロジック）及び統合テスト（`app.js` の状態遷移）の実行とPASSの確認。
### 手動確認
1. 設定画面から列を7つまで追加できること。7つを超過しないこと。
2. ドラッグ＆ドロップ、およびモバイルの「クイック移動ボタン」が追加した列にも正しく適応されること。
3. すでにタスクが入っている列を削除した際、その列のタスクが一番左の列に移動し、エラーやデータの消失が表示上でも起きないこと。
