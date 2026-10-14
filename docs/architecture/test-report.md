# テストレポート

main への push ごとに、デプロイ（`.github/workflows/deploy.yml`）がテストを流し、その結果の HTML レポートをこのサイトに載せる。テストが落ちてもデプロイは止めず、落ちたままのレポートを載せる（落ちたことはレポートと CI で気づく）。手元の `pnpm docs:dev` にはレポートが無い。

| レポート | 中身 | 手元で流すコマンド |
|---|---|---|
| <a href="/evolving-todo/vitest-report/web/" target="_self">Vitest：Webアプリ</a> | `apps/web` のテスト（MSW の node サーバーで画面を描画） | `pnpm web:test` |
| <a href="/evolving-todo/vitest-report/domain/" target="_self">Vitest：ドメイン</a> | `packages/domain` の純粋関数のテスト | `pnpm domain:test` |

Vitest の HTML レポートを手元で作るときは `pnpm test:report`（各パッケージの `vitest-report/` に書く。git には載せない）。レポートを dist に写すのは `scripts/copy-test-reports-to-pages.mjs`。
