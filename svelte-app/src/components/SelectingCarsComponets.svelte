<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { interactivity, GLTF, Environment } from '@threlte/extras'
  import { carPaths } from "../const";

  export let selectedCarIndex: number
  export let selectingCarIndex: number
  export let rotateDirection: number  //時計回り : -1, 反時計回り : 1
  export let onAnimationFinished: () => void

  // 縁を描くように車を等間隔に配置する関数
  const ArrangeCarsCircle = (radius: number, nCars: number, index:number) => {
    const angle  = (360 / nCars) * index //角度
    const radian = angle * (Math.PI / 180)
    const x = radius * Math.sin(radian)
    const z = radius * Math.cos(radian)
    const position = [x, 0, z]
    console.log(position)
    return position
  }

  const CalcCarLookAt = (nCars: number, selectedCarIndex:number) => {
    const angle = (360 / nCars) * selectedCarIndex //角度
    return angle
  }

  interactivity()

  const radius = 5 //車を円形に配置する半径
  const lightPosition : number[] = [0, 10, 10]
  const cameraPosition : number[] = [4, 4, 10]
  const carsCenterPosition : number[] = [1, 2.3, -3]//車を円形に配置する円心
  const circlePosition : number[] = [0, 1, 0] //車の下に表示されている円のポジション

  let carRotation = CalcCarLookAt(carPaths.length, selectedCarIndex)
  let carRotationAfterChanged = CalcCarLookAt(carPaths.length, selectingCarIndex)
  useTask((delta) => {
    if (selectedCarIndex != selectingCarIndex) {
      const radian = (360 / carPaths.length) * (Math.PI / 180)
      carRotation += (delta * rotateDirection)
      if (radian <= Math.abs(carRotation - carRotationAfterChanged)) {
        selectedCarIndex = selectingCarIndex
        carRotationAfterChanged = carRotation
        onAnimationFinished()
        console.log(`selecting Index : ${selectingCarIndex}`)
      }
    }
  })
</script>

<T.PerspectiveCamera
  makeDefault
  position={cameraPosition}
  on:create={({ref}) => {
    ref.lookAt(0, 2, 0)
  }}
/>

<T.DirectionalLight 
  position={lightPosition} 
  castShadow
/>

<Environment
	files={'https://static8.depositphotos.com/1035653/917/i/450/depositphotos_9173686-stock-photo-empty-auto-repair-shop-for.jpg'}
	isBackground={true}
/>

<T.Mesh
  position={carsCenterPosition}
  rotation.y={-carRotation}
>
  {#each { length: carPaths.length } as _, i}
    <T.Mesh
      position={ArrangeCarsCircle(radius, carPaths.length, i)}
      rotation.y={carRotation}
    >
      <GLTF url={carPaths[i]}/>
    </T.Mesh>
  {/each}
</T.Mesh>

<T.Mesh
  position={circlePosition}
  rotation.x={-Math.PI / 2}
  receiveShadow
>
  <T.CircleGeometry args={[4, 40]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>