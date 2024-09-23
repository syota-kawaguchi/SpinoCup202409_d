import singleSpaSvelte from "single-spa-svelte";
import myRootSvelteComponent from "my-root-svelte-component.js";

const svelteLifecycles = singleSpaSvelte({
  component: myRootSvelteComponent,
  domElementGetter: () => document.getElementById("svelte-app"),
  props: { someData: "data" },
});

export const bootstrap = svelteLifecycles.bootstrap;
export const mount = svelteLifecycles.mount;
export const unmount = svelteLifecycles.unmount;
