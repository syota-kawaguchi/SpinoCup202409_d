import type { Component } from "solid-js";

import styles from "./App.module.css";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a class={styles.link} href="/react/play">
         Go to Play app
        </a>
      </header>
    </div>
  );
};

export default App;
