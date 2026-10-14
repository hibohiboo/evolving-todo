// GitHub Pages 用に、テストの HTML レポートを VitePress の dist 配下へコピーする。
// Pages は 1 サイト 1 アーティファクトなので、docs と app と同じ dist に同居させる。
// 一覧のページは docs/architecture/test-report.md（ここで置く先を変えたら、そのページのリンクも直す）。
//
// copy-web-to-pages.mjs と異なり、ソースが無くてもデプロイ全体を失敗させない（exit 0 で正常終了する）。
// deploy.yml で `if: always()` 実行される（テストが失敗してもデプロイは止めない方針のため）。
import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const reports = [
  // Vitest（pnpm test:report）
  ['apps/web/vitest-report', 'vitest-report/web'],
  ['packages/domain/vitest-report', 'vitest-report/domain'],
];

for (const [from, to] of reports) {
  const src = resolve(from);
  const dest = resolve('docs/.vitepress/dist', to);
  if (!existsSync(src)) {
    console.warn(`test report not found (skipped): ${src}`);
    continue;
  }
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
  console.log(`copied ${src} -> ${dest}`);
}
