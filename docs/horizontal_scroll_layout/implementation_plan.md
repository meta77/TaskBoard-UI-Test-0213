# 実装計画 (Implementation Plan)

## 目的
タスクボードの列設定で6列、7列と追加された場合、現在デスクトップ表示（`lg` ブレイクポイント以上）で設定されている `grid-cols-5`（5列での折り返し）によるレイアウト崩れを防ぎます。追加された列が下に落ちるのではなく、**画面の右側に水平に伸び、横スクロールで閲覧できる**ようにUIを修正します。

## 変更内容

### 1. `index.html` のレイアウトコンテナ修正
ボード全体を囲むコンテナの Tailwind CSS クラスを変更します。

- **[MODIFY] 現在のクラス**
  ```html
  class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 lg:grid lg:grid-cols-5 lg:pb-0 lg:overflow-visible"
  ```
- **[MODIFY] 修正後のクラス**
  デスクトップ環境（`lg:`）で `grid` に切り替えるのをやめ、モバイル環境と同じようにフレックスボックス（`flex`）を全画面サイズで維持し、横方向へのオーバーフロー（`overflow-x-auto`）を許容して水平スクロールを実現します。列の幅（Min/Max）を固定することで、横幅が足りなくても列が潰れないようにします。
  ```html
  class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4"
  ```
  ※または、`auto-cols` を用いた Grid の横展開レイアウトを適用します。今回は最もシンプルで堅牢なFlexでの横展開を採用します。

### 2. コンテナの子要素（列カラム）幅の修正
デスクトップ（`lg:`）時に `w-auto` になっていた設定を修正し、ある程度の固定幅（例：`w-[320px]` などのピクセルベースや `min-w-[]`）を持たせることで、列が増えても潰れることなく右へ広がるように調整します。

- **[MODIFY] 子要素（列）のクラス**
  ```html
  <!-- 変更前 -->
  class="flex flex-col flex-none w-[85vw] snap-center md:w-[45vw] lg:w-auto"
  
  <!-- 変更後 -->
  class="flex flex-col flex-none w-[85vw] snap-center md:w-[45vw] lg:w-[320px]"
  ```

## 検証・テスト計画 (Verification Plan)
1. スクリプトの自動テスト範囲外であるため、ローカルサーバー経由または静的表示での手動UI確認を想定します。
2. 仕様通り、設定で「6つ目」「7つ目」の列を追加した時、列が2段目以降に落ちることなく、右に広がり、ブラウザ本体またはコンテナの横スクロールバーで閲覧可能になることを確認します。
