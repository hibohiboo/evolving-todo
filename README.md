# Evolving TODO

ダッシュボードと「体制の進化」の仕組みを組み込んだ、TODO アプリのサンプル。

- サイト（ダッシュボード・仕様・開発プロセス）：https://hibohiboo.github.io/evolving-todo/
- アプリ：https://hibohiboo.github.io/evolving-todo/app/
- 体制の進化のタイムライン：https://hibohiboo.github.io/evolving-todo/process/timeline
- API ドキュメント：https://hibohiboo.github.io/evolving-todo/api-docs/
- テストレポート：https://hibohiboo.github.io/evolving-todo/architecture/test-report

## 何を見せるサンプルか

[CarTaGraphFantasy](https://github.com/hibohiboo/CarTaGraphFantasy) で AI コーディングエージェントと育てた開発体制を、小さなアプリで再現したもの。

1. **状況を手で書かない** — 要望ファイル（`docs/backlog/*.md` の frontmatter）とロードマップから、トップページのダッシュボードをビルド時に組み立てる
2. **開発サイクル** — プラン（AI がインタビュー）→ AI レビュー → 実装（TDD）→ 3観点の AI レビュー → 人間レビュー → 振り返り（`docs/process/`）
3. **体制の進化** — 振り返りで出た改善を「候補 → 評価 → 採用／却下」で進化ログに残し、タイムラインをビルド時に作る。進め方を変えたのに記録していないコミットは git フックが止める

アプリの機能（追加・完了・削除など）は、この開発サイクルを実際に回して足していく。その経過はダッシュボードとタイムラインに出る。

## 始め方

```sh
pnpm install   # git フックも設定される
pnpm web:dev   # http://localhost:5173
pnpm docs:dev  # 仕様書サイト
```

AI エージェント向けの地図は [AGENTS.md](AGENTS.md)。

## 移植について

`scripts/` と `.claude/hooks/` の多くは CarTaGraphFantasy から写した。コメントにある日付・PR 番号・失敗の経緯は、移植元のもの。
