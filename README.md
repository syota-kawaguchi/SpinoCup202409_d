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

## デプロイ方法
前提条件
- AWS IAM ユーザーのログインができている(Slackでパスワード等配った)

1. `aws configure`
2. デプロイ(例：vue)
  - `aws s3 cp ./vue-app/dist s3://***bucket-name***/vue --recursive`

## アプリケーション構成とルーティング
- localhost/vanilla タイトル画面
- localhost/solidjs/title 車選択画面
- localhost/svelte/selecting-cars 車選択画面
- localhost/react/play ゲーム画面
- localhost/vue/score スコア画面

## 共有事項
- svgファイルを使うとバグが起きるので、使う必要が出たら要検討したい