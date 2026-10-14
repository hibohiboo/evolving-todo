# 構成

## 技術スタック

- TypeScript のみ。pnpm workspace によるモノレポ
- `docs/` … VitePress 製の仕様書・ダッシュボードのサイト（GitHub Pages で公開）
- `apps/web/` … Vite + React 19 + TanStack Query + MSW。バックエンドは無く、`/api/*` は MSW が応答する
- `packages/domain/` … ドメイン型と純粋関数。`docs/spec/` の用語をそのまま型に落とす
- テスト … Vitest。lint・フォーマットは Biome

ディレクトリと依存の向きの正は[アーキテクチャルール](../process/rules/architecture.md)。

## GitHub Pages に載せるもの

main に push するたびに `.github/workflows/deploy.yml` が全部をビルドし直す。

| パス | 中身 | 作り方 |
|---|---|---|
| `/` | ダッシュボード | `docs/backlog/`・`docs/roadmap.md`・`docs/open-questions.md`・既知の問題・進化ログから、ビルド時に `docs/.vitepress/*.data.ts` が集める |
| `/process/timeline` | 体制の進化のタイムライン | 進化ログの月ごとのページから、ビルド時に `evolution.data.ts` が集める |
| `/app/` | アプリ | `apps/web` のビルドを `scripts/copy-web-to-pages.mjs` が写す（MSW ごと動く） |
| `/vitest-report/` | テストレポート | [テストレポート](test-report.md) |
