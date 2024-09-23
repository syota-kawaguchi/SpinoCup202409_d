import singleSpaSvelte from "single-spa-svelte";
import App from './App.svelte';  // Svelte コンポーネントをインポート

// Svelte コンポーネントのライフサイクル関数を設定
const svelteLifecycles = singleSpaSvelte({
  component: App,
  domElementGetter: () => document.getElementById("svelte-app"),  // DOM要素を取得
  props: { someData: "Hello from Svelte!" }  // Svelteコンポーネントに渡すプロパティ
});

// `single-spa` のライフサイクル関数をエクスポート
export const bootstrap = svelteLifecycles.bootstrap;
export const mount = svelteLifecycles.mount;
export const unmount = svelteLifecycles.unmount;
