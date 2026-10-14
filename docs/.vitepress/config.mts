import { defineConfig } from 'vitepress';
import { githubSlug } from './slug';

export default defineConfig({
  base: '/evolving-todo/',
  title: 'Evolving TODO',
  description: 'ダッシュボードと「体制の進化」を組み込んだ TODO アプリのサンプル',
  lang: 'ja-JP',
  // docs/plans/ は作業単位のプランドキュメント（コードのパス等を多く含む）で、公開サイトには載せない
  srcExclude: ['plans/**'],
  markdown: { anchor: { slugify: githubSlug } },
  // アプリ・API ドキュメント・テストレポートはビルド後に dist へ書き、スライドは public/ の静的な HTML なので、
  // VitePress のリンク検査からは外す
  ignoreDeadLinks: [
    /^\/app\//,
    /^\/api-docs\//,
    /^\/vitest-report\//,
    /^\/e2e-report\//,
    /^\/slides\//,
  ],

  themeConfig: {
    nav: [
      { text: 'ホーム', link: '/' },
      { text: '仕様', link: '/spec/todo' },
      { text: '開発プロセス', link: '/process/' },
      { text: 'タイムライン', link: '/process/timeline' },
      { text: 'アプリ', link: '/app/', target: '_self' },
      { text: 'API', link: '/api-docs/', target: '_self' },
      { text: 'スライド', link: '/slides/', target: '_self' },
    ],

    // ページを足したら、ここにも足す（メニューから辿れなくならないように）
    sidebar: [
      {
        text: '仕様',
        items: [
          { text: 'TODO', link: '/spec/todo' },
          { text: '未解決論点', link: '/open-questions' },
        ],
      },
      {
        text: '進み具合',
        items: [
          { text: 'ロードマップ', link: '/roadmap' },
          { text: '要望（バックログ）', link: '/backlog/' },
        ],
      },
      {
        text: '開発',
        items: [
          { text: '構成', link: '/architecture/' },
          { text: '既知の問題', link: '/architecture/known-issues' },
          { text: 'テストレポート', link: '/architecture/test-report' },
          { text: '開発プロセス', link: '/process/' },
          {
            text: 'ルール',
            collapsed: false,
            items: [
              { text: 'アーキテクチャ', link: '/process/rules/architecture' },
              { text: 'テスト', link: '/process/rules/testing' },
              { text: 'レビュー', link: '/process/rules/review' },
            ],
          },
          { text: '依頼文サンプル', link: '/process/prompt-sample' },
          { text: '体制の進化ログ', link: '/process/evolution' },
          { text: '体制の進化のタイムライン', link: '/process/timeline' },
        ],
      },
    ],

    outline: { level: [2, 3] },

    socialLinks: [{ icon: 'github', link: 'https://github.com/hibohiboo/evolving-todo' }],
  },
});
