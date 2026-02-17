# レスポンシブ対応 実装計画

レスポンシブ対応を行い、スマホブラウザでも快適に操作できるようにレイアウトを調整する。

## User Review Required

- **機能変更の提案 (承認依頼)**:
    - スマホではドラッグ＆ドロップ操作が困難な場合があるため、タスク詳細画面（モーダル）内でのステータス変更操作を推奨する。
    - また、スマホ縦画面では5カラムを横に並べるのは不可能なため、**1画面1カラム表示で横スクロール（スワイプ）で切り替えるレイアウト**を提案する。これにより、タスクカードが見やすくなり、誤操作を防げる。

## Proposed Changes

###/Users/horokusa/Desktop/TaskBoard-UI-Test-0213/

#### [MODIFY] style.css
- `.board-container`: `min-width: 1200px` を削除し、PC画面（`min-width: 1024px`等）のみに適用するか、完全にレスポンシブなコンテナにする。
- `.task-card`: タッチデバイスでの操作性を考慮し、少し余白を広げるか、タップ領域を確認する。
- `.modal-content`: `width: 500px` を基本としつつ、スマホ画面（`max-width: 640px`）では `width: 95%`、`margin: 10px` 程度に調整する。

#### [MODIFY] index.html
- `.grid.grid-cols-5`: Tailwind のレスポンシブプレフィックスを使用する。
    - `grid-cols-1`: スマホ（デフォルト）
    - `md:grid-cols-3`: タブレット
    - `lg:grid-cols-5`: PC
- スマホ時のカラム表示:
    - `overflow-x-auto` `snap-x` `snap-mandatory` を追加し、各カラムを `snap-center` にして、スワイプでカラム移動できるようにする（カンバンアプリの一般的UI）。
    - あるいは、単純に縦積み（`flex-col`）にする。今回は「快適に操作」を目指すため、横スクロール方式を第一候補として実装する。

## Verification Plan

### Manual Verification
- Chrome DevTools のデバイスモードを使用し、以下の解像度で表示確認を行う。
    - iPhone SE / 12 / 14 Pro (375px ~ 430px 幅)
    - iPad Air / Mini (768px ~ 820px 幅)
- 確認項目:
    - 横スクロール（または縦積み）で全てのカラムにアクセスできるか。
    - タスクカードの内容が見切れていないか。
    - モーダルが画面内に収まり、閉じるボタンが押せるか。
    - 新規作成ボタンが押せるか。
    - 入力フォームが画面外にはみ出していないか。
