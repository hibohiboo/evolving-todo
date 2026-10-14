# テストルール（種別の切り分けと骨抜き禁止）

## 種別と実行コマンド

| 種別 | ツール | 置き場所 | 実行 | 何を守るか |
|---|---|---|---|---|
| ドメイン | Vitest | `packages/domain/src/**/*.test.ts`（対象と同じディレクトリ） | `pnpm domain:test` | 純粋関数の判定・変換 |
| API のスキーマ | Vitest | `packages/schemas/src/**/*.test.ts`（ドメインと同じ置き方） | `pnpm schemas:test` | 応答の検査（`checkResponse`）と誤りの文、OpenAPI の文書 |
| 画面 | Vitest + Testing Library + MSW（node） | `apps/web/src/test/<画面名>.test.tsx` | `pnpm web:test` | 画面が描画できること、操作の連なり（ボタン → MSW が応答 → 表示が変わる） |
| E2E | Playwright（Chromium） | `apps/web/e2e/*.test.ts` | `pnpm web:e2e`（CI とデプロイだけ。重いので pre-push には入れない） | ビルドした画面が実ブラウザで MSW ごと動き、コンソールに誤りが出ないこと。細かい操作は画面のテストで見て、E2E にしない |
| 補助スクリプト | node --test | `scripts/*.test.mjs`・`.claude/hooks/*.test.mjs` | `pnpm tools:test` | git フック・ビルドの検査・Claude Code のフックの判定 |

型検査（`pnpm web:typecheck`・`pnpm domain:typecheck`）もテストの一部として扱う。push 前に `.githooks/pre-push` が自動で確認する。

画面のテストがロジックの分岐を全部なぞり始めたら、そのロジックを純粋関数に切り出してドメインのテストへ落とす。

## シードデータ（MSW）

- モックの初期データは `apps/web/src/mocks/fixtures.ts` に限る。テストやページの中で独自の値を作らず、`fixtures.ts` から引く
- 各テストの後に `resetDb()` で状態を戻す（`src/test/setup.ts`）。テストは実行順に依存しない
- 未処理のリクエストはエラーにする（`onUnhandledRequest: 'error'`）。新しい API を呼ぶなら先に `handlers.ts` へ追加する
- MSW の応答は、すべてのテストで API の一覧（`packages/schemas` の `api/endpoints.ts`）と照らす（`src/test/setup.ts` が `src/test/responseCheck.ts` を組み込む）。一覧に無い API・状態コード、形の違う本文が返ると、そのテストが落ちる。ハンドラを足す・応答を変えるときは、一覧（`packages/schemas/src/<URL の最初の区切り>/endpoints.ts`）も直す。テストの中で `server.use` で差し替える応答も、一覧どおりの形にする。通信の失敗を試すときは `HttpResponse.error()`（検査されない）を使う

## 骨抜き禁止

```ts
// ✖ 何も守っていない
expect(result).toBeDefined();
// ✖ 条件付きスキップ（環境がないと黙って成功扱い）
if (!process.env.SOME_FLAG) return;

// ✅ 期待値を固定して assert する。境界の内側と外側を書く
expect(remainingCount([])).toBe(0);
```

- MSW のハンドラをテスト内で常時成功に差し替えない
- `.only` / `.skip` を残したままコミットしない（`biome.json` の `noFocusedTests`・`noSkippedTests` がコミット前フックで止める）
- 新規テストは先に Red（失敗）を確認してから実装する。最初から通ったら、実装済みか assert が弱いかを判定する
- 既存の実装で最初から通るテスト（ガード・回帰）は、守っている条件を一時的に外して**落ちることを確かめてから**元に戻す。手で書き換えず `node scripts/mutate-check.mjs <spec.json>` を使う（外す書き換えが1件だけ当たることを確かめ、テストを流し、必ず元に戻す）

## テストの独立性

- 各テストが自分の QueryClient を作り、共有状態を持たない（`src/test/renderPage.tsx`）
- 固定時間で待たず、`findBy*` を使う
- セレクタは role / label / text を優先し、クラス名に依存しない
