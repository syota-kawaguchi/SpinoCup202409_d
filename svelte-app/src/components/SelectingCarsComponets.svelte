<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { interactivity, GLTF, Environment } from '@threlte/extras'
  import { carPaths } from "../const";

  export let carPath: string

  interactivity()
</script>

<T.PerspectiveCamera
  makeDefault
  position={[7, 7, 7]}
  on:create={({ref}) => {
    ref.lookAt(0, 1, 0)
  }}
/>

<T.DirectionalLight 
  position={[0, 10, 10]} 
  castShadow
/>

<Environment
	files={'https://static8.depositphotos.com/1035653/917/i/450/depositphotos_9173686-stock-photo-empty-auto-repair-shop-for.jpg'}
	isBackground={true}
/>

<T.Mesh
  rotation.x={-Math.PI / 2}
  receiveShadow
>
  <T.CircleGeometry args={[4, 40]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>

<T.Mesh position={[0, 1.3, 0]}>
  <GLTF
  	url={carPath}
  />
</T.Mesh>