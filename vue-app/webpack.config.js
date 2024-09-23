// webpack.config.js
const path = require('path');

module.exports = {
  externals: ["vue", "vue-router"],
  entry: './src/main.ts', // エントリーポイント
  output: {
    filename: 'vue-app.js', // 出力ファイル名
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system', // systemjs 用のターゲット
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // 他の必要な loader を追加
    ],
  },
  // 他の設定も必要に応じて追加
};
