import { onMount, createSignal, type Component } from "solid-js";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import styles from "./App.module.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const App: Component = () => {
  let canvasRef: HTMLCanvasElement | undefined;
  const [isMobile, setIsMobile] = createSignal(false);

  const handleStart = () => {
    window.location.href = "/vanilla";
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "g" || e.key === "G") {
      handleStart();
    }
  };

  onMount(() => {
    setIsMobile(window.innerWidth <= 768);

    if (!canvasRef) return;
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
      50,
      cameraViewSize.width / cameraViewSize.height,
      0.1,
      1000
    );
    camera.position.set(0, 2, 20);

    // renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(cameraViewSize.width, cameraViewSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;

    // light
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(
      0xffffff,
      0.5
    );
    scene.add(ambientLight);
    const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
      0xffffff,
      0.8
    );
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // model loader
    const fbxloader: FBXLoader = new FBXLoader();
    let mixer: THREE.AnimationMixer;
    fbxloader.load(
      "https://bonnet-grills-bbq-app-bucket.s3.amazonaws.com/models/fbx/car03.fbx",
      (object) => {
        object.position.set(0, 0, 0);
        object.scale.set(1, 1, 1);

        scene.add(object);
        // オブジェクトが読み込まれた後にカメラの位置を自動調整
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        camera.position.set(center.x + 200, center.y + 200, center.z + cameraZ);
        camera.lookAt(center);
        controls.target.copy(center);
      }
    );

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // リサイズ対応
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobile(width <= 768);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    if (!isMobile()) {
      window.addEventListener("keydown", handleKeydown);
    }

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
      if (!isMobile()) {
        window.removeEventListener("keydown", handleKeydown);
      }
    };
  });

  return (
    <div class={styles.App}>
      <main class={styles.main}>
        <img
          class={styles.title}
          src="https://bonnet-grills-bbq-app-bucket.s3.amazonaws.com/images/title.svg"
          alt="BONNET GRILLS BBQのタイトルロゴ"
        />
        <canvas class={styles.canvas} ref={canvasRef} />
        <p class={styles.p}>Press G to start</p>
      </main>
    </div>
  );
};

export default App;
