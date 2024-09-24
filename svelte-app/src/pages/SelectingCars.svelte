<!-- pages/Top.svelte -->
<script lang="ts">
  import { Canvas } from '@threlte/core'
  import SelectingCarsComponets from '../components/SelectingCarsComponets.svelte';
  import { carPaths } from '../const';

  let carIndex = 0
  const showNextCar = () => {
    console.log(`current car Index : ${carIndex}`)
    if (carIndex < carPaths.length) {
      carIndex++
    }
    else {
      carIndex = 0
    }
  }
  let carPath:string = "assets/models/car01.gltf"
  console.log(carPath)
</script>
<div>hogehoge</div>
<Canvas class=".svelte-o3oskp">
  <SelectingCarsComponets carPath={carPath}/>
</Canvas>

<style>
/* #app {
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
} */
/* .svelte-o3oskp {
  height: 1280px;
  width: 100%;
} */
</style>
