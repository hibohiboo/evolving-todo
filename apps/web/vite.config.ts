import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

// GitHub Pages では docs サイト配下の /evolving-todo/app/ に置く（scripts/copy-web-to-pages.mjs）。
// ローカル開発では / のまま。
const base = process.env.WEB_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // 5173 番が埋まっていたら、別のポートで黙って起動せず失敗させる（別の作業の開発サーバーを確かめてしまわないため）
  server: { port: 5173, strictPort: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: false,
    css: false,
    // e2e/ は Playwright 専用（playwright.config.ts）。除外しないと Vitest も拾ってしまう
    exclude: [...configDefaults.exclude, '**/e2e/**'],
  },
});
