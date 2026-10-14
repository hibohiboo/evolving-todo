# テストルール（種別の切り分けと骨抜き禁止）

## 種別と実行コマンド

| 種別 | ツール | 置き場所 | 実行 | 何を守るか |
|---|---|---|---|---|
| ドメイン | Vitest | `packages/domain/src/**/*.test.ts`（対象と同じディレクトリ） | `pnpm domain:test` | 純粋関数の判定・変換 |
| 画面 | Vitest + Testing Library + MSW（node） | `apps/web/src/test/<画面名>.test.tsx` | `pnpm web:test` | 画面が描画できること、操作の連なり（ボタン → MSW が応答 → 表示が変わる） |
| 補助スクリプト | node --test | `scripts/*.test.mjs`・`.claude/hooks/*.test.mjs` | `pnpm tools:test` | git フック・ビルドの検査・Claude Code のフックの判定 |

型検査（`pnpm web:typecheck`・`pnpm domain:typecheck`）もテストの一部として扱う。push 前に `.githooks/pre-push` が自動で確認する。

画面のテストがロジックの分岐を全部なぞり始めたら、そのロジックを純粋関数に切り出してドメインのテストへ落とす。

## シードデータ（MSW）

- モックの初期データは `apps/web/src/mocks/fixtures.ts` に限る。テストやページの中で独自の値を作らず、`fixtures.ts` から引く
- 各テストの後に `resetDb()` で状態を戻す（`src/test/setup.ts`）。テストは実行順に依存しない
- 未処理のリクエストはエラーにする（`onUnhandledRequest: 'error'`）。新しい API を呼ぶなら先に `handlers.ts` へ追加する

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
