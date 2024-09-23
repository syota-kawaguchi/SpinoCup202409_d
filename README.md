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