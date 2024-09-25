/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module "*.svelte" {
    import { DefineComponent } from "svelte";
  
    const component: DefineComponent<{}, {}, any>;
  
    export default component;
  }
