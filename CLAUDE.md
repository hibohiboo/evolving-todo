# Evolving TODO プロジェクトルール

開発ルール・技術スタック・ディレクトリ構成・最重要ルールは、ツールに依存しない入口ファイル `AGENTS.md` に集約している（ここに重複して書かない）。Claude Code だけの話はここだけに書く。

@AGENTS.md

## Claude Code 固有の補足

- `.claude/agents/` と `.claude/skills/` は、`docs/process/` に書かれた手順の**呼び出し口**である。手順の本文を変えるときは `docs/process/` 側を直す。
- サブエージェントの `model` は `inherit` にし、特定モデルを固定しない。段（強い／標準／軽い）は、起動するときに Agent ツールの `model` で opus／sonnet／haiku を指定する。
- プランドキュメントは `docs/plans/`（`settings.json` の `plansDirectory`）に置く。
- 自動メモリは Claude 固有の記憶で、他のエージェントからは見えない。プロジェクトとして残すべき知識は `docs/` に書く。
- 大きなファイルは Bash の heredoc で書かず Write ツールで書く。インタプリタへの heredoc、ソースファイルへの heredoc、`sed -i`、`git stash`、`git checkout`・`git restore` でファイルを戻す操作、`--no-verify` は `.claude/hooks/guard-bash.mjs` が止める（移植元で、ルールに書いても再発したものを機械にした）。ファイルの文字列の置き換えは Edit ツールか `node scripts/replace-once.mjs <spec.json>` を使う。わざと崩した箇所は `node scripts/mutate-check.mjs` で外して戻す。
- 複数のファイルを書き換えるスクリプトは、Write でスクラッチパッドにファイルとして書いてから実行する。日本語を出力するスクリプトは `PYTHONIOENCODING=utf-8` を付ける。
- Bash ツールは Git Bash で動くので、`/` で始まる値（`WEB_BASE=/evolving-todo/app/` など）を渡すと Windows のパスに書き換えられる。`MSYS_NO_PATHCONV=1` を付けるか PowerShell で実行する。
- 独立した調べもの（複数ファイルの Read・Grep・git の確認）は1回の応答でまとめて呼ぶ。ツールを1回呼ぶたびに会話全体を読み直すので、読む量よりターン数が効く。
- 開発サイクルの区切り（プラン〜プランのレビュー／実装〜人間レビュー／振り返り）では、引き継ぐことをプランに書き終え、人間に `/clear` を頼む（`docs/process/index.md`「セッションを分ける」）。
- サブエージェントが利用上限などで途中で止まったら、作り直さず SendMessage でその agentId に続きを頼む。
- ブラウザで確かめるときは `browser-check` スキルを使う。
