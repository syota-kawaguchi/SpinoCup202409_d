// src/single-spa-config.js
import React from "react";
import ReactDOMClient from "react-dom/client";
import rootComponent from "./App"; // ルートコンポーネントのインポート
import singleSpaReact from "single-spa-react";

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent,
  errorBoundary(err, info, props) {
    return <div>エラーが発生しました。</div>;
  },
});
