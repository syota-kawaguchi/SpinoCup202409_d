# SpinoCup202409_d

## 開発環境構築
前提条件
- nodeとnpmをインストールしている前提


1. 必要であれば `npm run install:all`
2. `npm run build`
3. `npm run dev`
  - 開発サーバーが立ち上がる
4. 初回のみ？ `docker compose up -d`
5. `docker compose restart reverse-proxy`
  - loacalhostを80番に統一

## アプリケーション構成とルーティング
- localhost/svelte/title タイトル画面
- localhost/svelte/selecting-cars 車選択画面
- localhost/react/play ゲーム画面

## 共有事項
- svgファイルを使うとバグが起きるので、使う必要が出たら要検討したい