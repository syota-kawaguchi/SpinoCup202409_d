<script lang="ts">
  import { onMount, tick } from "svelte";

  export let label: string;
  export let maxGuage: number;
  export let guage: number;
  export let isSelecting: boolean;

  let previousGuage: number;
  let enableGuage: number;
  let flashingGuage: number;

  // 初期化時に previousGuage を設定
  onMount(() => {
    previousGuage = guage;
  });

  // guage が変更されたら previousGuage を更新
  $: {
    // guage < previousGuage の場合
    if (guage < previousGuage) {
      enableGuage = guage;
      flashingGuage = previousGuage;
    } else {
      enableGuage = previousGuage;
      flashingGuage = guage;
    }
  }

  //   isSelecting が true の場合は guage を 0 にする
  $: {
    if (isSelecting) {
      previousGuage = guage;
      flashingGuage = 0;
    }
  }
</script>

<div class="car-param-wrapper">
  <div><p class="label">{label}</p></div>
  <ul class="guage">
    {#each { length: maxGuage } as _, i}
      {#if i < enableGuage}
        <li class="enable"></li>
      {:else if i < flashingGuage}
        <li class="flash"></li>
      {:else}
        <li class="disable"></li>
      {/if}
    {/each}
  </ul>
</div>

<style>
  div.car-param-wrapper {
    margin: 0 auto;
    display: flex;
    width: 300px;
    height: 60px;
    align-items: center;
  }
  p.label {
    margin: 0 auto;
    font-size: 20px;
    color: #ffffff;
  }
  ul.guage {
    padding: 0;
    margin: 0 auto;
    list-style: none;
    height: 20px;
    display: flex; /*横並びにする*/
    vertical-align: middle;
  }
  ul.guage li {
    text-align: center;
    transform: skewX(-45deg);
  }
  li.enable {
    position: relative;
    padding: 5px 15px;
    background-color: #de5901;
  }
  li.disable {
    position: relative;
    padding: 5px 15px;
    background-color: #aaaaaa;
  }


</style>
