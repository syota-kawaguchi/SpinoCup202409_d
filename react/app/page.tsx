"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Home() {
  const ref: React.RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const [reverseRotation, setReverseRotation] = useState(false);
  let test = 0.01;

  useEffect(() => {
    if (!ref.current) return;

    // camera size settings
    const cameraViewSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // scene
    const scene: THREE.Scene = new THREE.Scene();

    // Clock
    const clock = new THREE.Clock();

    // camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      50, // FOVを75から50に減少
      cameraViewSize.width / cameraViewSize.height,
      0.1,
      1000
    );
    camera.position.set(0, 2, 10); // カメラ位置を調整

    // renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: ref.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(cameraViewSize.width, cameraViewSize.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // light
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(
      0xffffff,
      1.8
    );
    scene.add(ambientLight);
    const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
      0xffffff,
      1.2
    );
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // grid (本番環境ではコメントアウトすること)
    const gridHelper: THREE.GridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // model loader
    const fbxloader: FBXLoader = new FBXLoader();
    let mixer: THREE.AnimationMixer;
    let loadedModels: THREE.Object3D[] = []; // Explicitly define the type

    function loadFBXModel(_filename: string, _posX: number, _posY: number, _posZ: number, _scale: number) {
      fbxloader.load(_filename, (object) => {
        object.position.set(_posX, _posY, _posZ);
        object.scale.set(_scale, _scale, _scale);
        loadedModels.push(object); // Store the model in the array

        scene.add(object);
      });
    }

    function loadMultipleFBXModels(_filename: string, _count: number, _scale: number) {
      for (let i = 0; i < _count; i++) {
        const posX = Math.random() * 10 - 5; // Random X position between -50 and 50
        const posY = Math.random() * 10 - 5; // Random Y position between -50 and 50
        const posZ = Math.random() * 10 - 5; // Random Z position between -50 and 50
    
        loadFBXModel(_filename, posX, posY, posZ, _scale);
      }
    }

    loadMultipleFBXModels("models/car03.fbx", 3, 0.01);
    loadMultipleFBXModels("models/car02.fbx", 3, 0.01);
    loadMultipleFBXModels("models/car01.fbx", 3, 0.01);

    loadFBXModel("models/niku.fbx",0,0,0,0.05); //使用例
    loadFBXModel("models/tamanegi.fbx",2,0,2,0.05);


      // オブジェクトが読み込まれた後にカメラの位置を自動調整
      /*
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5; // 少し余裕を持たせる
      camera.position.set(center.x, center.y, center.z + cameraZ);
      camera.lookAt(center);
      controls.target.copy(center);
      */
     //カメラ関連、上の記述を参考に

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 初回実行
    tick();

    function tick() {
      requestAnimationFrame(tick);
    
      // アニメーション処理をここに書く
      loadedModels.forEach((model) => {
        model.rotation.y += test; // Rotate the loaded model
        model.position.y += test; // Translate the loaded model
      });
    
      renderer.render(scene, camera); // レンダリング
    }

    // リサイズ対応
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // クリックイベントリスナーを追加
    // クリックで箱が下向きに移動する
    window.addEventListener("click", () => {
      test = -0.01;
    });

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", () => {
      });
    };
  }, [reverseRotation]);

  return (
    <main className="w-full h-screen">
      <canvas ref={ref} className="w-full h-full" />
    </main>
  );
}
