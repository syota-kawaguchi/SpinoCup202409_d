import type { Component } from "solid-js";

import styles from "./App.module.css";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <main class={styles.main}>
        <canvas  />
      </main>
    </div>
  );
};

export default App;
