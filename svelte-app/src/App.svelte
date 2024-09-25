<!-- App.svelte -->
<script lang="ts">
  import { Canvas, useTask } from "@threlte/core";
  import SelectingCarsComponets from "./components/SelectingCarsComponets.svelte";
  import { carPaths } from "./const";
  import CarParameter from "./components/CarParameter.svelte";

  const _cars = [
    { id: 1, name: "チューズカー", hot: 2, size: 2 },
    { id: 2, name: "ホットカー", hot: 4, size: 2 },
    { id: 3, name: "モンスターカー", hot: 5, size: 5 },
  ];

  const _handleSelectCar = (_id: number) => {
    const id = `car0${_id}`;
    localStorage.setItem("selectedCarID", id);
  };

  const intensityBright = 1.8;
  const intensityDart = 0.2;

  let selectingCarIndex = 0;
  let selectingCarName =
    _cars.find((car) => car.id == selectingCarIndex + 1)?.name ?? "";
  let selectedCarIndex = selectingCarIndex;
  let rotateDirection = -1;
  let onAnimation = false;
  let intensity = intensityBright;
  const IncrementCarIndex = () => {
    if (onAnimation) {
      console.log("animation running");
      return;
    }
    OnAnimationStart();
    if (selectingCarIndex < carPaths.length - 1) {
      selectingCarIndex++;
    } else {
      selectingCarIndex = 0;
    }
    rotateDirection = 1;
    onAnimation = true;
  };

  const DecrementCarIndex = () => {
    if (onAnimation) {
      return;
    }
    OnAnimationStart();
    if (0 < selectingCarIndex) {
      selectingCarIndex--;
    } else {
      selectingCarIndex = carPaths.length - 1;
    }
    rotateDirection = -1;
    onAnimation = true;
  };

  const Decide = () => {
    _handleSelectCar(selectingCarIndex + 1);
    //TODO(kawaguchi): go to next page
    let item = localStorage.getItem("selectedCarID");
    console.log(`localStorageItem : ${item}`);
    window.location.href = "/react/play";
  };

  const OnAnimationStart = () => {
    selectedCarIndex = selectingCarIndex;
    intensity = intensityDart;
    selectingCarName = "";
  };

  function onAnimationFinished() {
    selectingCarName =
      _cars.find((car) => car.id == selectingCarIndex + 1)?.name ?? "";
    onAnimation = false;
    intensity = intensityBright;
  }
</script>

<p class="selecting-car-name">
  <span>{selectingCarName}</span>
</p>

<Canvas>
  <SelectingCarsComponets
    {selectedCarIndex}
    {selectingCarIndex}
    {rotateDirection}
    {onAnimationFinished}
    {intensity}
  />
</Canvas>

<button class="change-car-button change-prev" on:click={IncrementCarIndex}>
  <span class="dli-chevron-right"></span>
</button>

<button class="change-car-button change-next" on:click={DecrementCarIndex}>
  <span class="dli-chevron-left"></span>
</button>

<div class="container">
  <div>
    <CarParameter
      label={"Hot"}
      maxGuage={5}
      guage={_cars[selectingCarIndex].hot}
      isSelecting={!onAnimation}
    />
    <CarParameter
      label={"Size"}
      maxGuage={5}
      guage={_cars[selectingCarIndex].size}
      isSelecting={!onAnimation}
    />
  </div>
  <button
    class="done-button"
    on:click={Decide}
    disabled={selectingCarName === ""}
  >
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

  .change-car-button {
    padding: 0;
    position: absolute;
    bottom: 50%;
    right: 20%;
    width: 80px;
    height: 80px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
    border-color: rgba(0, 0, 0, 0.4);
    text-align: center;
  }

  .change-next {
    left: 20%;
  }

  .change-prev {
    right: 20%;
  }

  .change-car-button:hover {
    border-color: transparent;
    border-color: #fff;
    transition: 0s;
  }

  .change-car-button:focus {
    outline: none;
  }

  .container {
    margin: 0 auto;
    padding: 0;
    position: absolute;
    bottom: 4%;
    right: 0;
    left: 0;
    text-align: center;
    z-index: 1;
  }

  .done-button {
    margin: 0 auto;
    padding: 0;
    width: 200px;
    height: 80px;
    z-index: 1;
    text-align: center;
    background-color: transparent;
    color: #fff;
    font-size: 40px;
    border: 0;
  }

  .done-button:focus {
    outline: none;
  }

  /* 右矢印 */
  .dli-chevron-right {
    display: inline-block;
    vertical-align: middle;
    color: #fff;
    line-height: 1;
    width: 2.5em;
    height: 2.5em;
    border: 0.3em solid currentColor;
    border-left: 0;
    border-bottom: 0;
    box-sizing: border-box;
    transform: translateX(-25%) rotate(45deg);
  }

  .dli-chevron-left {
    display: inline-block;
    vertical-align: middle;
    color: #fff;
    line-height: 1;
    width: 2.5em;
    height: 2.5em;
    border: 0.3em solid currentColor;
    border-left: 0;
    border-bottom: 0;
    box-sizing: border-box;
    transform: translateX(25%) rotate(-135deg);
  }
</style>
