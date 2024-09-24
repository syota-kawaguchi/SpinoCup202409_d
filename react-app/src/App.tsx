import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//未使用

let raycaster: THREE.Raycaster, mouse: THREE.Vector2;

function App() {
  const ref: React.RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);

  const dragObject: {
    mode: number;
    dragTarget: THREE.Object3D | null;
    x: number;
    y: number;
    z: number;
} = {
    mode: 0,
    dragTarget: null,
    x: 0,
    y: 0,
    z: 0
};

  useEffect(() => {
    if (!ref.current) return;

    // camera size settings
    const cameraViewSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // mouse
        // レイキャスターの初期化(追記部分)
        raycaster = new THREE.Raycaster();

        //マウスベクトルの初期化(追記部分)
        mouse = new THREE.Vector2();
    
        // イベントリスナーの追加(追記部分)
        document.addEventListener('mousedown', onMouseDown, false);
        document.addEventListener('mouseup', onMouseUp, false);
        document.addEventListener('mousemove', onMouseMove, false);

    // scene
    const scene: THREE.Scene = new THREE.Scene();

    // Clock
    const clock = new THREE.Clock();
    clock.start();

    // camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75, // FOVを75から50に減少
      cameraViewSize.width / cameraViewSize.height,
      0.1,
      1000
    );
    camera.position.set(0, 20, 100); // カメラ位置を調整
    
    // renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: ref.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(cameraViewSize.width, cameraViewSize.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // OrbitControls
    //const controls = new OrbitControls(camera, renderer.domElement);
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.05;

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
    // let mixer: THREE.AnimationMixer;
    const loadedModels: THREE.Object3D[] = []; // Explicitly define the type
    const stageModels: THREE.Object3D[] = [];
    const hera: THREE.Object3D[] = [];

    //camera move
    function initializeCamera(){
      camera.position.set(0,13,3);
      camera.lookAt(0,4,0);
    }

    function loadFBXModel(_filename: string, _tag: string, _posX: number, _posY: number, _posZ: number,_rotate: number, _scale: number) {
      fbxloader.load(_filename, (object) => {
        object.position.set(_posX, _posY, _posZ);
        object.rotation.y = _rotate;
        object.scale.set(_scale, _scale, _scale);
        object.name = _tag;
        object.castShadow = true;
        loadedModels.push(object); // Store the model in the array
        scene.add(object);
      });
    }

    function initializeHera(){
      fbxloader.load("/react/models/hera.fbx", (object) => {
        object.position.set(2, 8, 0);
        object.rotation.y = -0.8;
        object.scale.set(0.01, 0.01, 0.01);
        object.name = "hera";
        object.castShadow = true;
        hera.push(object); // Store the model in the array
        scene.add(object);
      });
    }


    function loadFBXModelAsStage(_filename: string, _tag: string, _posX: number, _posY: number, _posZ: number,_rotate: number, _scale: number) {
      fbxloader.load(_filename, (object) => {
        object.position.set(_posX, _posY, _posZ);
        object.rotation.y = _rotate;
        object.scale.set(_scale, _scale, _scale);
        object.name = _tag; // 作成したオブジェクトに"stage"タグを適用
        object.receiveShadow = true;
        stageModels.push(object); // Store the model in the array
        scene.add(object);
      });
    }

    function loadMultipleFBXModels(_filename: string, _tag: string, _count: number, _scale: number) {
      for (let i = 0; i < _count; i++) {
        const posX = Math.random() * 8 - 4; // Random X position between -50 and 50
        const posY = 6;// Math.random() * 100 - 50; // Random Y position between -50 and 50
        const posZ = Math.random() * 6 - 3; // Random Z position between -50 and 50

        loadFBXModel(_filename, _tag, posX, posY, posZ, 0, _scale);
      }
    }

    function initializeStage(){ // stageを既定の位置に配置
      loadFBXModelAsStage("/react/models/stage01.fbx","stage",0,0,0,0,0.1);
      loadFBXModelAsStage("/react/models/car02.fbx","car",0,5,-10,0,0.05);
      loadMultipleFBXModels("/react/models/niku.fbx","food",5,0.05);
    }

    /* テスト用、オブジェクト配置テスト
    loadMultipleFBXModels("/react/models/car03.fbx", 3, 0.01);
    loadMultipleFBXModels("/react/models/car02.fbx", 3, 0.01);
    loadMultipleFBXModels("/react/models/car01.fbx", 3, 0.01);

    loadFBXModel("/react/models/niku.fbx", 0, 0, 0, 0.05); //使用例
    loadFBXModel("/react/models/tamanegi.fbx", 2, 0, 2, 0.05);

    loadFBXModelAsStage("/react/models/stage01.fbx", 0, 0, 0, 0.02);
    */

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

    // イベントリスナーに対応する処理(追記部分)
    function onMouseDown(event: { preventDefault: () => void; clientX: number; clientY: number; }) {
      event.preventDefault();

      // 座標を正規化する呪文
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // レイキャスティングでマウスと重なるオブジェクトを取得
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if(intersects[0] !== null){
        for (let i = 0; i < intersects.length; i++) {
          if(intersects[i].object.parent?.name == "food"){
            dragObject.dragTarget = intersects[i].object.parent;
            break;
          }
        }
      }
    }
    
    function onMouseMove(event: { preventDefault: () => void; clientX: number; clientY: number; }) {
      event.preventDefault();

      // 座標を正規化する呪文
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // レイキャスティングでマウスと重なるオブジェクトを取得
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if(intersects[0] !== null){
        for (let i = 0; i < intersects.length; i++) {
          if(intersects[i].object.parent !== dragObject.dragTarget && intersects[i].object.parent?.name !== "hera"){
            hera[0].position.set(intersects[i].point.x + 0.8,intersects[i].point.y + 0.3,intersects[i].point.z - 0.5);
            dragObject.x = intersects[i].point.x;
            dragObject.y = intersects[i].point.y+1;
            dragObject.z = intersects[i].point.z;
            if(dragObject.dragTarget !== null){
              dragObject.dragTarget.position.x = dragObject.x;
              dragObject.dragTarget.position.y = dragObject.y;
              dragObject.dragTarget.position.z = dragObject.z;
              hera[0].position.y = dragObject.y;
            }
            break;
          }
        }
      }
    }

    function onMouseUp(event: { preventDefault: () => void; clientX: number; clientY: number; }) {
      event.preventDefault();
      if(dragObject.dragTarget !== null){
        dragObject.dragTarget.position.y += -1;
        dragObject.dragTarget = null;
      }
    }

    // 初回実行
    tick();
    initializeStage();
    initializeCamera();
    initializeHera();

    function tick() {
      requestAnimationFrame(tick);

      // stageModels.forEach((model) => {
      //     if(model.name == "car"){
      //       model.position.y += 0.1;
      //     }
      // });      

      /* テスト用、全オブジェクト回転移動
      loadedModels.forEach((model) => {
        model.rotation.y += test; // Rotate the loaded model
        model.position.y += test; // Translate the loaded model
      });
      */
      const outputElement = document.getElementById("output");
      if (outputElement) {
          outputElement.innerText = (100 - clock.getElapsedTime()).toString();
      }
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
    window.addEventListener("click", () => {
      //ここにクリック時のアクションを追加
    });
    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", () => {
      });
    };
  },);

  return (
    <main style={{ width: "100%",height:"100%" }}>
      <canvas ref={ref} style={{ width: "100%",height:"100%" }} />
      <div id="info">
        Time:
      </div>

      <div id="output">

      </div>
      
    </main>
  );
}

export default App;
