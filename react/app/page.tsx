"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export default function Home() {
  const ref: React.RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // camera size settings
    const cameraViewSize = {
      width: 1000,
      height: 800,
    };

    //scene
    const scene: THREE.Scene = new THREE.Scene();

    //Clock
    const clock = new THREE.Clock();

    //camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      cameraViewSize.width / cameraViewSize.height,
      0.1,
      1000
    );
    camera.position.set(0, 5, 13);

    //renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: ref.current ?? undefined,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(cameraViewSize.width, cameraViewSize.height);

    //light
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(
      0xffffff,
      5
    );
    scene.add(ambientLight);
    const pointLight: THREE.PointLight = new THREE.PointLight(0xffffff, 100);
    scene.add(pointLight);

    //grid (本番環境ではコメントアウトすること)
    const gridHelper: THREE.GridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    //model loader
    const fbxloader: FBXLoader = new FBXLoader();
    let mixer: THREE.AnimationMixer;
    //TODO: チーズが表示されるようにする
    fbxloader.load("models/testModel.fbx", (object) => {
      object.position.set(0, 0, 0);
      object.scale.set(0.05, 0.05, 0.05);
      const anim = new FBXLoader();
      anim.load("models/testModel.fbx", (anim) => {
        mixer = new THREE.AnimationMixer(object);
        mixer.clipAction(anim.animations[0]).play();
      });

      scene.add(object);
    });

    //Animation
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <main className="">
      <canvas ref={ref} />
    </main>
  );
}
