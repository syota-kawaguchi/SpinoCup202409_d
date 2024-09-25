<!-- App.svelte -->
<script lang="ts">
  import { Canvas, useTask } from "@threlte/core";
  import SelectingCarsComponets from "./components/SelectingCarsComponets.svelte";
  import { carPaths } from "./const";
    import CarParameter from "./components/CarParameter.svelte";

  const _cars = [
    { id: 1, name: "Car 1" },
    { id: 2, name: "Car 2" },
    { id: 3, name: "Car 3" },
  ];

  const _handleSelectCar = (id: number) => {
    localStorage.setItem("selectedCarID", id.toString());
  };

  const intensityBright = 1.8
  const intensityDart = 0.2

  let selectingCarIndex = 0;
  let selectingCarName  = _cars.find(car => car.id == selectingCarIndex + 1)?.name ?? ""
  let selectedCarIndex = selectingCarIndex;
  let rotateDirection = -1;
  let onAnimation = false;
  let intensity = intensityBright
  const IncrementCarIndex = () => {
    if (onAnimation) {
      console.log("animation running")
      return
    }
    OnAnimationStart()
    if (selectingCarIndex < carPaths.length - 1) {
      selectingCarIndex++
    }
    else {
      selectingCarIndex = 0
    }
    rotateDirection = -1
    onAnimation = true
  }

  const DecrementCarIndex = () => {
    if (onAnimation) {
      return
    }
    OnAnimationStart()
    if (0 < selectingCarIndex) {
      selectingCarIndex--
    }
    else {
      selectingCarIndex = carPaths.length - 1
    }
    rotateDirection = 1
    onAnimation = true
  }

  const Decide = () => {
    _handleSelectCar(selectingCarIndex + 1)
    //TODO(kawaguchi): go to next page
    let item = localStorage.getItem("selectedCarID")
    console.log(`localStorageItem : ${item}`)
  }

  const OnAnimationStart = () => {
    selectedCarIndex = selectingCarIndex
    intensity = intensityDart
    selectingCarName = ""
  }

  function onAnimationFinished() {
    selectingCarName = _cars.find(car => car.id == selectingCarIndex + 1)?.name ?? ""
    onAnimation = false
    intensity = intensityBright
  }

</script>

<p class="selecting-car-name">
  {selectingCarName}
</p>

<Canvas>
  <SelectingCarsComponets 
    selectedCarIndex={selectedCarIndex} 
    selectingCarIndex={selectingCarIndex} 
    rotateDirection={rotateDirection}
    onAnimationFinished={onAnimationFinished}
    intensity={intensity}
  />
</Canvas>

<button class="next-car-button" on:click={IncrementCarIndex}>
  次へ
</button>

<button class="prev-car-button" on:click={DecrementCarIndex}>
  戻る
</button>

<div class="container">
  <CarParameter label={"Hot"} maxGuage={5} guage={2}/>
  <CarParameter label={"Hot"} maxGuage={5} guage={3}/>
  <button class="done-button" on:click={Decide}>
    決定
  </button>
</div>

<style>
  .selecting-car-name {
    margin: 0 auto;
    padding: 0;
    position: absolute;
    top: 10%;
    right: 0;
    left: 0;
    width: 300px;
    height: 80px;
    font-size: 40px;
    z-index: 1;
    /* display: block; */
    color: white;
    text-align: center;
  }

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

  .container {
    margin: 0 auto;
    padding: 0;
    position: absolute;
    bottom: 12%;
    right: 0;
    left: 0;
    text-align: center;
    z-index: 1;
  }

  .done-button{
    margin: 0 auto;
    padding: 0;
    width: 200px;
    height: 80px;
    z-index: 1;
    color: white;
    background-color: blue;
    text-align: center;
  }
</style>
