# 実装計画：モバイル用 Due Date 入力フォームのレイアウト修正

## 課題
モバイル表示時（画面幅が狭い場合）において、Due Date（期限）用のカレンダー入力フォーム（`<input type="date">`）の右端が、他のテキスト入力フィールドなどの右端と揃わず、はみ出してしまうレイアウト崩れが発生している。

## 原因の考察
- ブラウザデフォルトの `date` タイプ入力フィールドは、特有の最小幅（intrinsic width）やパディング・マージンを持つことがあり、単純な `width: 100%` 指定だけでは `border-box` の計算から溢れる（または正しく適用されない）ケースがあるため。

## 修正内容 (`style.css`)
`.form-input[type="date"]` に対して、モバイルでも他の入力フィールドと幅が一致するように明示的なスタイルを追加します。

1. **幅の強制指定**: `max-width: 100%;` や `width: 100%; display: block;` を明示して親要素以上に広がらないようにする。
2. **デザインの統一**: 必要に応じて `appearance: none;` や `min-width` のリセットを行い、iOS Safari 等のネイティブな余白がレイアウトに影響を及ぼさないようにします。

### 具体的な変更予定コード (style.css)
```css
/* Date Input Styling */
.form-input[type="date"] {
  position: relative;
  min-height: 45px; /* Ensure height consistency */
  /* --- 追加 --- */
  width: 100%;
  max-width: 100%;
  display: block; 
  /* iOS等で独自のパディングがつくのを防ぎつつ幅を揃える */
  box-sizing: border-box; 
  /* ------------ */
}
```

## 動作確認 (Verification)
- 修正後、ブラウザのデベロッパーツール等で幅をモバイルサイズ (320px ~ 400px程度) に縮め、Due Date入力フォームと隣接するAssigneeなどのフォームの右端がピタリと揃っているか確認する。
