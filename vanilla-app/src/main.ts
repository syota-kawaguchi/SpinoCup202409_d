import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'; // FBXLoaderをインポート

// シーンの作成
const scene = new THREE.Scene()

// カメラの作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 7)
camera.lookAt(0, 0, 0)

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 照明の追加
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 7.5)
scene.add(directionalLight)

// FBXローダーを使用してボンネットのFBXモデルを読み込み
const loader = new FBXLoader();
loader.load('https://bonnet-grills-bbq-app-bucket.s3.amazonaws.com/models/fbx/car03.fbx', (fbx: any) => {
  fbx.scale.set(0.02, 0.02, 0.02); // サイズ調整
  fbx.position.set(0, -1, -5); // 位置調整
  scene.add(fbx);
}, undefined, (error: any) => {
  console.error('FBXモデルの読み込みに失敗しました:', error);
});

// 食材クラスの定義
class Ingredient extends THREE.Mesh {
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;

  constructor(geometry: THREE.BufferGeometry, material: THREE.Material) {
    super(geometry, material);
    this.velocity = new THREE.Vector3(0, -0.05, 0);
    this.rotationSpeed = new THREE.Vector3(
      Math.random() * 0.1,
      Math.random() * 0.1,
      Math.random() * 0.1
    );
  }

  update() {
    this.position.add(this.velocity);
    this.rotation.x += this.rotationSpeed.x;
    this.rotation.y += this.rotationSpeed.y;
    this.rotation.z += this.rotationSpeed.z;

    if (this.position.y <= 0.1) {
      this.position.y = 0.1;
      this.velocity.set(0, 0, 0);
      if (this.material instanceof THREE.MeshStandardMaterial) {
        this.material.color.setHex(0x8B4513);
      }
    }
  }
}

// 食材の配列
const ingredients: Ingredient[] = [];

// 食材を生成する関数
function createIngredient() {
  const geometries = [
    new THREE.SphereGeometry(0.2),  // ミートボール
    new THREE.CylinderGeometry(0.1, 0.1, 0.3),  // ソーセージ
    new THREE.BoxGeometry(0.3, 0.1, 0.3)  // ステーキ
  ];
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xFF6347 }),  // トマト色
    new THREE.MeshStandardMaterial({ color: 0xFFA07A }),  // 薄いサーモン色
    new THREE.MeshStandardMaterial({ color: 0x8B0000 })   // 暗い赤色
  ];

  const randomGeometry = geometries[Math.floor(Math.random() * geometries.length)];
  const randomMaterial = materials[Math.floor(Math.random() * materials.length)];

  const ingredient = new Ingredient(randomGeometry, randomMaterial);
  ingredient.position.set(
    (Math.random() - 0.5) * 3,
    5 + Math.random() * 2,
    (Math.random() - 0.5) * 2
  );
  scene.add(ingredient);
  ingredients.push(ingredient);
}

// アニメーションループ
const animate = () => {
  requestAnimationFrame(animate);

  if (Math.random() < 0.02) {
    createIngredient();
  }

  ingredients.forEach(ingredient => ingredient.update());

  renderer.render(scene, camera);
}
animate();

// リサイズ対応
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// スタートボタンのクリックイベント
const startButton = document.getElementById('start');
if (startButton instanceof HTMLButtonElement) {
  startButton.addEventListener('click', () => {
    window.location.href = '/solidjs/title';
  });
} else {
  console.error('Start button not found!');
}
