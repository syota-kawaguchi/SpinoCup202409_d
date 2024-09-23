import { registerApplication, start } from "single-spa";

// Reactアプリケーションの登録
registerApplication({
  name: "react-app",
  app: () =>
    System.import("react-app").then((module) => ({
      bootstrap: module.bootstrap,
      mount: module.mount,
      unmount: module.unmount,
    })),
  activeWhen: ["/react"],
  customProps: {},
});

// Vueアプリケーションの登録
registerApplication({
  name: "vue-app",
  app: () =>
    System.import("vue-app").then((module) => ({
      bootstrap: module.bootstrap,
      mount: module.mount,
      unmount: module.unmount,
    })),
  activeWhen: ["/vue"],
  customProps: {},
});

// Svelteアプリケーションの登録
registerApplication({
  name: "svelte-app",
  app: () =>
    System.import("svelte-app").then((module) => ({
      bootstrap: module.bootstrap,
      mount: module.mount,
      unmount: module.unmount,
    })),
  activeWhen: ["/svelte"],
  customProps: {},
});

start();
