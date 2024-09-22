// src/main.ts
import '../set-public-path' // パブリックパスの設定
import { h, createApp } from 'vue'
import singleSpaVue from 'single-spa-vue'
import App from './App.vue'

const appOptions = {
  render() {
    return h(App)
  }
}

// Vue 用のライフサイクルメソッドを定義
const vueLifecycles = singleSpaVue({
  createApp,
  appOptions,
  handleInstance(app) {
    // Vue インスタンスに対するカスタム操作を行う場合
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
