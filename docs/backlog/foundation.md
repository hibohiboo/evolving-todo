---
title: 開発の基盤を作る
status: 完了
summary: TODO の一覧を表示するだけのアプリと、ダッシュボード・体制の進化ログ・開発サイクル・git フック・CI・API ドキュメント・E2E・GitHub Pages へのデプロイを用意する。
updated: 2026-10-15
---

# 開発の基盤を作る

[CarTaGraphFantasy](https://github.com/hibohiboo/CarTaGraphFantasy) の開発体制のうち、次を移植した。経緯は[体制の進化ログ](../process/evolution/2026-10.md)。

- 要望ファイルとロードマップから、トップページのダッシュボードをビルド時に組み立てる
- 体制の進化ログから、タイムラインをビルド時に組み立てる。書式が読めなければビルドを止める
- 進め方を変えたのに進化ログを書いていないコミットを、commit-msg フックで止める
- 開発サイクル（`docs/process/`）と、Claude Code の呼び出し口（skills・レビューのサブエージェント・危ないコマンドを止めるフック）
- lint は pre-commit、型検査・テスト・docs ビルドは pre-push と CI
- API の一覧（`packages/schemas`）から API ドキュメントを作り、モックの応答が一覧どおりかをテストで確かめる（2026-10-15 に追加）
- E2E（Playwright）を CI で流し、レポートを Pages に載せる（2026-10-15 に追加）

アプリは、TODO の一覧と残りの件数を出すだけにした。追加・完了などの機能は、開発サイクルを回して足す（[ロードマップ](../roadmap.md) mvp）。
