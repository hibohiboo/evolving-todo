# アーキテクチャルール

## 構造

| パス | 置くもの |
|---|---|
| `packages/domain/src/` | ドメイン型（zod のスキーマ）と純粋関数（I/O なし）。`docs/spec/` の用語をそのまま名前にする |
| `packages/schemas/src/endpoint/` | API の一覧の1項目の定義（`define.ts`）と、応答の検査（`check.ts`） |
| `packages/schemas/src/<URL の最初の区切り>/` | その URL の API の一覧（`endpoints.ts`。例：`todos/endpoints.ts`） |
| `packages/schemas/src/api/` | API の一覧のすべて（`endpoints.ts`）と、OpenAPI の文書の組み立て（`openapi.ts`） |
| `apps/web/src/pages/` | 画面。1画面1ファイル |
| `apps/web/src/shared/api/` | API の呼び出しと TanStack Query のフック |
| `apps/web/src/mocks/` | MSW のハンドラと初期データ（バックエンドの代わり） |
| `apps/web/src/app/` | アプリ全体の設定・スタイル |
| `apps/web/src/test/` | Vitest のテスト（[テストルール](testing.md)） |
| `apps/web/e2e/` | Playwright の E2E |

画面が増えて、この表で置き場所が決まらなくなったら、表を直してから置く（勝手に新しいディレクトリを作らない）。

## 依存の向き

- `apps/web` → `packages/schemas` → `packages/domain` の一方向。`packages/domain` はほかのパッケージを import しない
- `apps/web` の中で `packages/schemas` を import してよいのは `mocks`・`test` だけ（画面は API の一覧を知らない。将来バックエンドが同じ一覧を使う）
- `pages` → `shared` の一方向。`shared` は `pages` を import しない
- 画面のコード（`pages`・`shared`）は `mocks`・`test` を import しない
- barrel（`index.ts` での再エクスポート）は作らない（`biome.json` の `noBarrelFile` が止める）

## 1ファイル1責務

- 1つのファイルは1つのことをする。純粋な計算がページの中で育ってきたら、`packages/domain` へ切り出す（Functional Core）
- 今の開発フェーズ（バックエンド無し・リロードで状態が消える）に対して重い設計（旧データの互換・移行、使う場所のまだ無い拡張点）は作らない
