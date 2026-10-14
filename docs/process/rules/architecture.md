# アーキテクチャルール

## 構造

| パス | 置くもの |
|---|---|
| `packages/domain/src/` | ドメイン型と純粋関数（I/O なし）。`docs/spec/` の用語をそのまま名前にする |
| `apps/web/src/pages/` | 画面。1画面1ファイル |
| `apps/web/src/shared/api/` | API の呼び出しと TanStack Query のフック |
| `apps/web/src/mocks/` | MSW のハンドラと初期データ（バックエンドの代わり） |
| `apps/web/src/app/` | アプリ全体の設定・スタイル |
| `apps/web/src/test/` | Vitest のテスト（[テストルール](testing.md)） |

画面が増えて、この表で置き場所が決まらなくなったら、表を直してから置く（勝手に新しいディレクトリを作らない）。

## 依存の向き

- `apps/web` → `packages/domain` の一方向。`packages/domain` は `apps/` を import しない
- `pages` → `shared` の一方向。`shared` は `pages` を import しない
- 画面のコード（`pages`・`shared`）は `mocks`・`test` を import しない
- barrel（`index.ts` での再エクスポート）は作らない（`biome.json` の `noBarrelFile` が止める）

## 1ファイル1責務

- 1つのファイルは1つのことをする。純粋な計算がページの中で育ってきたら、`packages/domain` へ切り出す（Functional Core）
- 今の開発フェーズ（バックエンド無し・リロードで状態が消える）に対して重い設計（旧データの互換・移行、使う場所のまだ無い拡張点）は作らない
