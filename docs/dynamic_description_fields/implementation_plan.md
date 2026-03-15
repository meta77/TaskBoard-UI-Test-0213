# 実装計画 (Implementation Plan)

## 目的
タスクカードが複数（最大3つ）のDescription項目を持てるようにする。設定モーダルを追加し、各項目のタイトルや数を編集・保存できるように拡張する。機能追加に際しては、ビジネスロジック（純粋関数）とDOMや状態管理（副作用）を明確に分離し、保守性・テスト容易性を維持する。

## 変更内容

### 1. `logic.js` (ビジネスロジック - 純粋関数)
Description設定の追加・削除・更新を行うための純粋関数を実装します。
- **[NEW] `addFieldSetting(settings, newTitle)`**
  - 現在の設定数（最大3つ）をチェックし、制限以内の場合は末尾に新しいフィールド設定を追加した新しい配列を返す。
- **[NEW] `removeFieldSetting(settings, fieldId)`**
  - 指定されたIDのフィールドを削除し、新しい配列を返す（必須1項目の制限などを必要に応じてもたせる）。
- **[NEW] `updateFieldSetting(settings, fieldId, newTitle)`**
  - 指定されたIDのフィールドのタイトルを更新した新しい配列を返す。
- **[NEW] `sanitizeTaskDescriptions(taskDescriptions, settings)`**
  - タスク保存時などに、現在有効なフィールド設定IDに存在しない不要なDescriptionデータを削除した新しいオブジェクトを返す。

### 2. `app.js` (状態管理・副作用・Vueロジック)
状態（Vueの`ref`）に設定データと設定モーダル用のプロパティを追加します。
- **[NEW] State 追加**
  - `descriptionSettings`: `[{ id: 'desc_1', title: 'Description' }]` (デフォルト)
  - `isSettingsModalOpen`: `false` (モーダルの開閉状態)
  - `settingsDraft`: 設定モーダル編集中の一時コミット用データ
- **[MODIFY] `currentTask` の初期状態更新**
  - 単一の文字列 `description: ''` を、オブジェクト `descriptions: {}` （または `descriptions: { desc_1: '' }`）に変更します。
- **[MODIFY] 既存データのマイグレーション**
  - アプリの初期化時、もしくはタスク読み込み時に既存の `description` 文字列を持つタスクデータを検知し、`descriptions: { desc_1: '...' }` の形に透過的にマッピングします。古いプロパティは削除します。
- **[MODIFY] 設定保存・適用処理**
  - `saveSettings()` 関数を作成し、一時保存状態を `descriptionSettings` に反映しモーダルを閉じます。

### 3. `index.html` (UI/DOM)
設定ページのモーダルと、タスク作成/編集モーダルのフォームを改修します。
- **[MODIFY] ヘッダー**
  - 「New Ticket」ボタンの隣に、UI設定用の「Settings（またはギアアイコン）」ボタンを追加します。
- **[NEW] 設定モーダル**
  - 説明フィールドの一覧を表示し、タイトルの編集、削除ボタン、および「+ Add Field (Max 3)」ボタンを配置します。
- **[MODIFY] タスク作成/編集モーダル**
  - 既存の `<textarea v-model="currentTask.description">` を廃止します。
  - 代わりに `descriptionSettings` を `v-for` でループし、動的に複数の `<textarea v-model="currentTask.descriptions[setting.id]">` を描画するようにします。

### 4. `logic.test.js` (ユニットテスト)
新しく追加した純粋関数に対するユニットテストを実装します。
- **[NEW] テストケースの追加**
  - `addFieldSetting` が正しく配列を返し、3つを超える場合は追加されないこと。
  - `removeFieldSetting` や `updateFieldSetting` が元の配列を破壊せず（非破壊的）、正しい新しい配列を返すこと。

## 検証・テスト計画 (Verification Plan)

### Automated Tests (自動テスト)
- `logic.test.js` に追加する新しいテストは以下のコマンドで実行、検証します。
  - `npm test` （または現在設定されているVitest/Jest等のコマンド。今回は `package.json` を確認したところVitestが使われている想定）を実行し、純粋なロジックが仕様通り動くことを担保します。

### Manual Verification (手動テスト・ブラウザ確認)
1. **設定モーダルの動作確認**: 「Settings」ボタンをクリックし、設定モーダルが開くこと。
2. **フィールド数の制限確認**: 「Add Field」ボタンで最大3つまでしかフィールドが追加できないこと。
3. **フィールド編集・削除の確認**: フィールドのタイトルを任意に変更でき、不要なフィールドを削除できること。保存（Save）で設定内容が反映されること。
4. **タスク作成の動作確認**: サンプルのタスクを新規作成（または既存タスクを編集）する際、設定した数の Description フィールド（例えば「概要」「実装詳細」「テスト手順」）が正しくレンダリングされていること。データが入力・保存・正しく再表示できること。
5. **マイグレーション確認**: 既存の `description` 文字列を持つタスク（app.js内のハードコードデータなど）が、フィールド1の領域に正しく表示されること。
