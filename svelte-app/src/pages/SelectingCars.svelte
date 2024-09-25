<!-- pages/Top.svelte -->
<script lang="ts">
  import { Canvas, useTask } from "@threlte/core";
  import SelectingCarsComponets from "../components/SelectingCarsComponets.svelte";
  import { carPaths } from "../const";
    import { rotate } from "three/webgpu";

  type RotateDirection = Clockwise | CounterClockwise
  type Clockwise = {direction : number}
  type CounterClockwise = {direction : 1}

  let selectingCarIndex = 0;
  let selectedCarIndex = selectingCarIndex;
  let rotateDirection = -1;
  const IncrementCarIndex = () => {
    selectedCarIndex = selectingCarIndex
    rotateDirection = -1
    if (selectingCarIndex < carPaths.length - 1) {
      selectingCarIndex++
    }
    else {
      selectingCarIndex = 0
    }
  }

  const DecrementCarIndex = () => {
    selectedCarIndex = selectingCarIndex
    rotateDirection = 1
    if (0 < selectingCarIndex) {
      selectingCarIndex--
    }
    else {
      selectingCarIndex = carPaths.length - 1
    }
  }

</script>

<Canvas>
  <SelectingCarsComponets selectedCarIndex={selectedCarIndex} selectingCarIndex={selectingCarIndex} rotateDirection={rotateDirection}/>
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
