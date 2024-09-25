import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Tres from "@tresjs/core";

export const app = createApp(App);

app.use(Tres)
app.mount('#app')
