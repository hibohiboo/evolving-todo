import { expect, test } from '@playwright/test';
import { initialTodos } from '../src/mocks/fixtures';

/**
 * ビルドした画面が、実ブラウザで MSW（Service Worker）ごと動くことを確かめるスモークテスト。
 * 細かい操作は Vitest の画面のテスト（src/test/）で見る。ここは実ブラウザでしか起きない崩れ・実行時エラーだけを見る
 */
test('TODO の一覧が、コンソールの誤り無く描画できる', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'やること' })).toBeVisible();
  for (const t of initialTodos) {
    await expect(page.getByText(t.title)).toBeVisible();
  }
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  expect(pageErrors, pageErrors.join('\n')).toHaveLength(0);
});
