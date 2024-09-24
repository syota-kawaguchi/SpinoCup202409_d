<!-- pages/Top.svelte -->
<script lang="ts">
  import { Canvas } from '@threlte/core';
  import SelectingCarsComponets from "./components/SelectingCarsComponets.svelte";
  import { carPaths } from "./const";

  let carIndex = 0;
  const showNextCar = () => {
    console.log(`current car Index : ${carIndex}`);
    if (carIndex < carPaths.length) {
      carIndex++;
    } else {
      carIndex = 0;
    }
  };
  let carPath: string = "assets/models/car01.gltf";
  console.log(carPath);
</script>

<div class="container">
  <div class="canvas-wrapper">
    <Canvas>
      <SelectingCarsComponets {carPath} />
    </Canvas>
  </div>
  <button on:click={showNextCar}>Next Car</button>
</div>

<style>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .canvas-wrapper {
    flex: 1;
    position: relative;
    width: 100%;
    max-height: calc(
      100vh - 50px
    );
  }
</style>
