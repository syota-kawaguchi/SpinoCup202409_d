<script lang="ts">
  import { T, useTask, useLoader } from '@threlte/core'
  import { interactivity, useGltf, ContactShadows, GLTF, Grid, OrbitControls, Environment } from '@threlte/extras'
  import { spring } from 'svelte/motion'
  import { Group } from 'three'

  interactivity()
  let rotation = 0
  useTask((delta:number) => {
    rotation += delta
  })

  // let fileUrl = "/Users/shotakawaguchi/project/SpinoCup202409_d/react/public/models/car01.gltf"
  let fileUrl = "assets/testmodel.gltf"
</script>

<T.PerspectiveCamera
  makeDefault
  position={[5, 5, 5]}
  on:create={({ref}) => {
    ref.lookAt(0, 1, 0)
  }}
/>

<T.DirectionalLight 
  position={[0, 10, 10]} 
  castShadow
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
  	url="assets/testmodel.gltf"
  />
</T.Mesh>