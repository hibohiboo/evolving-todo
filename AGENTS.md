# Evolving TODO

ダッシュボードと「体制の進化」の仕組みを組み込んだ TODO アプリのサンプル。本ファイルはAIコーディングエージェント向けの地図である。Claude Code・Codex・Cursor など、どのエージェント（どのモデル）でも、まずここを読む。Claude Code は `CLAUDE.md` からこのファイルを読み込む。

## 技術スタック

構成の正は `docs/architecture/index.md`。要点だけ：TypeScript・pnpm workspace。`docs/`（VitePress）・`apps/web/`（Vite + React 19 + TanStack Query + MSW。**バックエンドは無く、状態はリロードで消える**）・`packages/domain/`（ドメイン型と純粋関数）。

## ディレクトリ構成

- `docs/spec/`・`docs/open-questions.md` … 正式仕様（SSOT）
- `docs/process/` … 開発プロセス（開発サイクル・ルール・依頼文雛形・体制の進化ログ）。**正式仕様の一部**
- `docs/backlog/` … 要望を1要望1ファイルで置く。先頭の状態から、トップページのダッシュボードをビルド時に組み立てる
- `docs/roadmap.md` … ゴールとマイルストーンの定義
- `docs/plans/` … プランドキュメント（作業単位の設計書。サイトには載せない）
- `apps/`・`packages/` … コード。置き場所と依存の向きは `docs/process/rules/architecture.md` が正
- `scripts/` … git フック・ビルドの検査・置換の補助スクリプト
- `.claude/` … Claude Code 固有の設定。中身と決まりは `CLAUDE.md` に書く

## コマンド

```sh
pnpm web:dev          # http://localhost:5173（MSW 有効）。人間が手で起動する用
pnpm web:dev:agent    # http://localhost:5174。エージェントがブラウザで確かめる用
pnpm web:test         # Vitest（MSW の node サーバーで画面を描画）
pnpm web:typecheck    # tsc
pnpm domain:test      # Vitest（packages/domain の純粋関数）
pnpm domain:typecheck # tsc
pnpm tools:test       # node --test（scripts/ と .claude/hooks/ の補助スクリプト）
pnpm docs:dev         # 仕様書サイトをローカルで確認
pnpm docs:build       # 仕様書サイトのビルド（リンク切れ・ロードマップに無いマイルストーン・進化ログの書式の誤りで失敗する）
pnpm build:pages      # docs + app をまとめてビルド（デプロイと同じ）
pnpm lint             # Biome
node scripts/replace-once.mjs <spec.json>  # ファイルの文字列を置き換える。件数と二重の当たりを確かめてから書く
node scripts/mutate-check.mjs <spec.json>  # 守る条件を1つずつ外し、テストが落ちることを確かめて元に戻す
```

lint・型検査・テスト・docsビルドは、AI にトークンを使わせず git フックで機械的に止める。

- `.githooks/pre-commit` … ステージ済みファイルだけ `biome check --staged --write`。安全な指摘は自動修正して再ステージする
- `.githooks/commit-msg` … 進め方に関わるファイル（`docs/process/`・`AGENTS.md`・`CLAUDE.md`・`.claude/`）を変えたのに、体制の進化ログ（`docs/process/evolution.md` か `docs/process/evolution/<年-月>.md`）が変わっていないコミットを止める。記録が要らない変更は、コミットメッセージに `進化ログ不要: <理由>` の行を書く
- `.githooks/pre-push` … 型検査・テスト・docs ビルド（CIと同じ）

`pnpm install` すると `prepare` スクリプトが `git config --local core.hooksPath .githooks` を設定する。CI（`.github/workflows/ci.yml`）にも同じチェックがある。

## 開発ルールの適用

ファイルを読む・変更する・レビューするときは、対象パスに一致するルールを先に読む。

| 対象 | 必ず読むルール |
|---|---|
| `apps/**`, `packages/**` | `docs/process/rules/architecture.md` |
| `**/*.test.*`, `apps/web/src/test/**`, `apps/web/src/mocks/**`、テストの追加・変更 | `docs/process/rules/testing.md` |
| push・マージ前、レビュー実行時 | `docs/process/rules/review.md` |
| `docs/plans/**`、機能追加・振る舞いの変更（プラン作成から） | `docs/process/index.md`（開発サイクル） |
| `docs/backlog/**` | `docs/backlog/index.md`（要望の書き方） |

## 最重要ルール

1. **ルールと仕様書が矛盾したら止める。** 推測でどちらかを優先せず、矛盾の内容を人間に報告し、判断を仰ぐ。
2. **唯一の信頼できる情報源（SSOT）。** 同じ情報を複数箇所に重複して書かず、常にどこか一箇所を正とする。進み具合は要望ファイルに書き、ダッシュボードには書き写さない。
3. **重複・分散に気づいたら、その場で直して報告する。** どちらを正にするかが決められないときだけ、止めて人間に聞く。
4. **プランにない変更は実装しない。** 必要になったら立ち止まって報告する（`docs/process/index.md`）。
5. **未解決論点（`docs/open-questions.md`）を勝手に決めない。**
6. **改行コードは LF**（Windows でも。`.gitattributes` が強制する）。
