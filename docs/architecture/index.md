# 構成

## 技術スタック

- TypeScript のみ。pnpm workspace によるモノレポ
- `docs/` … VitePress 製の仕様書・ダッシュボードのサイト（GitHub Pages で公開）
- `apps/web/` … Vite + React 19 + TanStack Query + MSW。バックエンドは無く、`/api/*` は MSW が応答する
- `packages/domain/` … ドメイン型（zod のスキーマ）と純粋関数。`docs/spec/` の用語をそのまま型に落とす
- `packages/schemas/` … API の一覧（メソッド・パス・状態コードごとの応答の形）。モック（MSW）・テスト・API ドキュメント・将来のバックエンドが共用する
- テスト … Vitest。E2E は Playwright（CI とデプロイで流す）。lint・フォーマットは Biome

ディレクトリと依存の向きの正は[アーキテクチャルール](../process/rules/architecture.md)。

## GitHub Pages に載せるもの

main に push するたびに `.github/workflows/deploy.yml` が全部をビルドし直す。

| パス | 中身 | 作り方 |
|---|---|---|
| `/` | ダッシュボード | `docs/backlog/`・`docs/roadmap.md`・`docs/open-questions.md`・既知の問題・進化ログから、ビルド時に `docs/.vitepress/*.data.ts` が集める |
| `/process/timeline` | 体制の進化のタイムライン | 進化ログの月ごとのページから、ビルド時に `evolution.data.ts` が集める |
| `/app/` | アプリ | `apps/web` のビルドを `scripts/copy-web-to-pages.mjs` が写す（MSW ごと動く） |
| `/api-docs/` | API ドキュメント | 下の「API ドキュメント」 |
| `/e2e-report/`・`/vitest-report/` | テストレポート | [テストレポート](test-report.md) |
| `/slides/` | このリポジトリの仕組みを紹介するスライド（reveal.js） | `docs/public/slides/` をそのまま載せる。本文は `slides.md`（`---` で次のスライド、`Note:` からスピーカーノート）、`index.html` は枠と見た目だけ。reveal.js は CDN から読む |

## API ドキュメント

`packages/schemas` の API の一覧（`api/endpoints.ts`）から、`pnpm api:docs`（`scripts/build-api-docs.ts`）が OpenAPI 3.1 の文書（`/api-docs/openapi.json`）と Redoc の HTML（`/api-docs/`）を作る。文書は手で書かない。

- **一覧とモックがずれないこと** — MSW のハンドラと一覧の1対1（`apps/web/src/test/apiEndpoints.test.ts`）と、テストで返したすべての応答が一覧の形どおりか（`apps/web/src/test/responseCheck.ts`）を Vitest で確かめる。ハンドラを足して一覧に書き漏らすと、テストが落ちる
- **文書の誤り** — redocly lint（`redocly.yaml`。警告も誤りにする `recommended-strict`）を通らなければ失敗する。今は満たさないと決めたもの（認証の定義・ライセンス・4xx の応答が無い API）だけ止めている
- **順番** — `pnpm docs:build` が dist を作り直すので、その後に流す（`build:pages`・CI・pre-push はその順）
