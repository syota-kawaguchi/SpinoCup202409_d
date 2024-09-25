import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


// class記法でAppクラスを定義して、constructorで初期化をする方法で実施します！
class App {
  private canvasElement: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock: THREE.Clock;
  private mixer: THREE.AnimationMixer | undefined;
  private audio: HTMLAudioElement | undefined;

  constructor() {
    this.canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 20);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableRotate = false;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;

    this.setupLights();
    this.loadModel();
    this.setupEventListeners();
    this.animate();
    this.audio = document.getElementById('click-sound') as HTMLAudioElement;
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);
  }

  private loadModel(): void {
    const fbxloader = new FBXLoader();
    fbxloader.load(
      "https://bonnet-grills-bbq-app-bucket.s3.amazonaws.com/models/fbx/car03.fbx",
      (object) => {
        object.position.set(0.5, 0.5, 0.5);
        object.scale.set(1, 1, 1);

        this.scene.add(object);

        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        this.camera.position.set(center.x + 200, center.y + 200, center.z + cameraZ);
        this.camera.lookAt(center);
        this.controls.target.copy(center);
      }
    );
  }

  private setupEventListeners(): void {
    window.addEventListener("resize", () => this.handleResize());
    window.addEventListener("keydown", (e) => this.handleKeydown(e));
    window.addEventListener("click", () => this.handleAudio());
  }

  private handleAudio(): void {
    this.audio = new Audio("https://bonnet-grills-bbq-app-bucket.s3.amazonaws.com/sounds/rev.mp3");
    this.audio.play();
  }

  private handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case "g":
      case "G":
        // 次のページへ進む
        window.location.href = "/svelte/selecting-cars";
        break;
      case "b":
      case "B":
        // 前のページへ戻る
        window.location.href = "/solidjs/title";
        break;
    }
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});