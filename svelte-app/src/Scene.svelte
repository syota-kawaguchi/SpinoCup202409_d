<script>
  import { T, useTask, useLoader } from '@threlte/core'
  import { interactivity, useGltf, ContactShadows, GLTF, Grid, OrbitControls, Environment } from '@threlte/extras'
  import { spring } from 'svelte/motion'
  import { Group } from 'three'

  interactivity()
  const scale = spring(1)
  let rotation = 0
  useTask((delta) => {
    rotation += delta
  })

  console.log("Scene.svelte")
</script>

<T.PerspectiveCamera
  makeDefault
  position={[5, 5, 5]}
  on:create={({ ref }) => {
    ref.lookAt(0, 1, 0)
  }}
/>

<T.DirectionalLight 
  position={[0, 10, 10]} 
  castShadow
/>

<!-- <T.Mesh 
  rotation.y={rotation}
  position.y={1}
  scale={$scale}
  on:pointerenter={() => {
    console.log("on Pointer Enter")
    scale.set(1.5)}
  }
  on:pointerleave={() => scale.set(1)}
  castShadow
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
</T.Mesh> -->

<T.Mesh
  rotation.x={-Math.PI / 2}
  receiveShadow
>
  <T.CircleGeometry args={[4, 40]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>

<T.Mesh position={[0, 1.3, 0]}>
  <GLTF
  	url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf"
  />
  <!-- <GLTF
  	url="/react/models/testmodel.gltf"
  /> -->
</T.Mesh>

<!-- {#if $gltf}
  <T
    is={ref}
    {...$$restProps}
  >
    <T.Mesh
      geometry={$gltf.nodes.Blossom.geometry}
      material={$gltf.materials.Blossom}
      rotation={[Math.PI / 2, 0, 0]}
      scale={1.22}
    />
    <T.Mesh
      geometry={$gltf.nodes.Stem.geometry}
      material={$gltf.materials.Stem}
      rotation={[Math.PI / 2, 0, 0]}
      scale={1.22}
    />
    <slot {ref} />
  </T>
{/if} -->