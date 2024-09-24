<script setup lang="ts">
// Composition API を使用するため、setup を追加
</script>

<template>
  <div id="app">
    <!-- ナビゲーションリンクを追加（オプション） -->
    <nav>
      <router-link to="/vue">ホーム</router-link> |
      <router-link to="/vue/score/example">サンプルスコア</router-link>
    </nav>

    <!-- router-view を配置 -->
    <router-view></router-view>
  </div>
</template>

<style>
/* ここにスタイルを追加できます */
</style>
