---
layout: home

hero:
  name: "Evolving TODO 開発ダッシュボード"
  tagline: 開発の進み具合と、開発体制そのものの進化を、リポジトリのファイルからビルド時に組み立てる TODO アプリのサンプル。
  actions:
    - theme: alt
      text: 開発プロセスを読む
      link: /process/
    - theme: alt
      text: アプリを開く
      link: /app/
      target: _self
---

<script setup>
import Dashboard from './.vitepress/components/Dashboard.vue';
</script>

<Dashboard />
