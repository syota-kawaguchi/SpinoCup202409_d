<!-- pages/Top.svelte -->
<script lang="ts">
  import { Canvas, useTask } from "@threlte/core";
  import SelectingCarsComponets from "../components/SelectingCarsComponets.svelte";
  import { carPaths } from "../const";

  let carIndex = 0;
  const IncrementCarIndex = () => {
    if (carIndex < carPaths.length - 1) {
      carIndex++
    }
    else {
      carIndex = 0
    }
  }

  const DecrementCarIndex = () => {
    if (0 < carIndex) {
      carIndex--
    }
    else {
      carIndex = carPaths.length - 1
    }
  }

</script>

<Canvas>
  <SelectingCarsComponets carPath={carPaths[carIndex]}/>
</Canvas>

<button class="next-car-button" on:click={IncrementCarIndex}>
  次へ
</button>

<button class="prev-car-button" on:click={DecrementCarIndex}>
  戻る
</button>

<style>
  .next-car-button{
    padding: 0;
    position: absolute;
    bottom: 50%;
    right: 10%;
    width: 80px;
    height: 80px;
    z-index: 1;
    /* display: block; */
    color: white;
    background-color: blue;
    text-align: center;
  }

  .prev-car-button{
    padding: 0;
    position: absolute;
    bottom: 50%;
    left: 10%;
    width: 80px;
    height: 80px;
    z-index: 1;
    /* display: block; */
    color: white;
    background-color: blue;
    text-align: center;
  }
</style>
