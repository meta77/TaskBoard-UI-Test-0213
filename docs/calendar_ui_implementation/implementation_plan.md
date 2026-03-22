# 実装計画：Due DateのカレンダーUI導入

Due Date（期限）の入力をテキスト形式からカレンダー形式に変更し、ユーザー体験を向上させます。

## 1. データ構造の適正化 (`app.js`, `logic.js`)
- 内部的な日付保持形式を `MM.DD` (例: 02.20) から、標準的な `ISO 8601` 形式である `YYYY-MM-DD` (例: 2026-02-20) に変更します。
- `logic.js` に日付をカード表示に適した形式 (EX: 02.20) に変換するヘルパー関数 `formatDisplayDate(dateStr)` を追加します。
- `app.js` の初期データの日付を新しい形式にアップデートします。

## 2. UIのアップグレード (`index.html`)
- 入力フィールドを `<input v-model="currentTask.dueDate" type="date" class="form-input">` に変更します。
- カード上の日付表示部分 (`task-date`) で `formatDisplayDate(task.dueDate)` を使用するように変更します。

## 3. デザインの洗練 (`style.css`)
- ブラウザ標準の date input はダークテーマで見づらくなることが多いため、CSSでカスタマイズを施します。
- `::-webkit-calendar-picker-indicator` を調整し、アイコンを白系に反転させてダークモードに馴染ませます。
- 入力フィールドのフォーカス状態やホバー状態を他のフィールドと統一し、プレミアムな質感を持たせます。

## 4. テストと確認 (Walkthrough)
- 新規作成・編集の両方でカレンダーから正しく日付が選択・保存されることを確認します。
- カード表示が元の「月.日」形式を保っていることを確認します。
