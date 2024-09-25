import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { niku,tamanegi,medamayaki,timeMax,carSizes } from "./const";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//未使用

let raycaster: THREE.Raycaster, mouse: THREE.Vector2;

class manager {
  constructor(
    public score: number,
    public sunpower: number
  ) 
  {
    
  }
  addScore(_num:number){
    this.score += _num;
  }
  sunpowerCalc(_time:number){
    this.sunpower = Math.sin(_time/timeMax*Math.PI);
    if(this.sunpower<0) this.sunpower = 0;
  }
}

class FoodInfo{
  constructor(
    public name: string,
    public isOnBonnet: boolean,
    public status: string,
    public maxGrilledness: number,
    public grilledness: number,
  )
  {
    
  }
  grill(_power: number){
    if(this.isOnBonnet == true){
      this.grilledness += _power;
    }
  }
  grillednessCheck() {
    if (this.grilledness >= this.maxGrilledness && this.status == "yake") {
      // this.status = "koge";
      return "koge";
    }else if(this.grilledness >= this.maxGrilledness/2 && this.status == "nama"){
      // this.status = "yake";
      return "yake";
    }
  }
}

function App() {
  const [carID, setCarID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // TODO: Loading画面の追加
  console.log(`carID: ${carID}, loading: ${loading}`);

  useEffect(() => {
    const selectedCarID = localStorage.getItem("selectedCarID");
    if (selectedCarID) {
      setCarID(selectedCarID);
      setLoading(false);
    } else {
      setCarID("car02");
      setLoading(false);
    }
  }, []);

  let carSizeX: number;
  let carSizeY: number;

  switch (carID) {
    case "car01":
    carSizeX = carSizes[0][0];
    carSizeY = carSizes[0][1];
      break;
    case "car02":
    carSizeX = carSizes[1][0];  
    carSizeY = carSizes[1][1];  
      break;
    case "car03":
    carSizeX = carSizes[2][0];  
    carSizeY = carSizes[2][1];  
      break;
  
    default:
      break;
  }

  // ゲームが終わった時にスコアをlocalstorageに保存する
  // const _saveScore = (score: number) => {
  //   localStorage.setItem("score", String(score));
  // };
  // TODO: ゲームの終了処理を追加

  const managerObj = new manager(0,0);
  function getGrillTime(_name: string) {
    let _grillednessMax = 0;
          switch (_name) {
            case "niku":
              _grillednessMax = niku;
              break;
            case "tamanegi":
              _grillednessMax = tamanegi;
              break;
            case "medamayaki":
              _grillednessMax = medamayaki;
              break;
            default:
              _grillednessMax = 1000;
              break;
          }
    return _grillednessMax;
  }

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
    // const loadedModels: THREE.Object3D[] = []; // Explicitly define the type
    const foodArray: FoodInfo[] = [];
    const foodModels: THREE.Object3D[] = []; // Explicitly define the type
    const stageModels: THREE.Object3D[] = [];
    const other: THREE.Object3D[] = []; //otherにはヘラ[0]、まな板[1]

    //camera move
    function initializeCamera(){
      camera.position.set(0,13,3);
      camera.lookAt(0,4,0);
    }

    // 使ってない
    // function loadFBXModel(_filename: string, _tag: string, _posX: number, _posY: number, _posZ: number,_rotate: number, _scale: number) {
    //   fbxloader.load(_filename, (object) => {
    //     object.position.set(_posX, _posY, _posZ);
    //     object.rotation.y = _rotate;
    //     object.scale.set(_scale, _scale, _scale);
    //     object.name = _tag;
    //     object.castShadow = true;
    //     loadedModels.push(object); // Store the model in the array
    //     scene.add(object);
    //   });
    // }

    function loadFBXModelAsFood(_filename: string, _tag: string, _name: string, _isOnBonnet: boolean, _status: string, _grillednessMax: number, _currentGrilledness: number, _posX: number, _posY: number, _posZ: number,_rotate: number, _scale: number) {
      fbxloader.load(_filename, (object) => {
        object.position.set(_posX, _posY, _posZ);
        object.rotation.y = _rotate;
        object.scale.set(_scale, _scale, _scale);
        object.name = _tag;
        object.castShadow = true;
        foodModels.push(object); // Store the model in the array
        foodArray.push(new FoodInfo(_name,_isOnBonnet,_status,_grillednessMax,_currentGrilledness));
        scene.add(object);
      });
    }

    function initializeHera(){ //初期化の順番守って。Hera->Manaita->
      fbxloader.load("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/hera.fbx", (object) => {
        object.position.set(2, 8, 0);
        object.rotation.y = -0.8;
        object.scale.set(0.01, 0.01, 0.01);
        object.name = "hera";
        object.castShadow = true;
        //other.push(object); // Store the model in the array
        other[0] = object;
        scene.add(object);
      });
    }

    function initializeManaita(){
      fbxloader.load("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/manaita.fbx", (object) => {
        object.position.set(7.5, 7.3, -1);
        object.scale.set(0.015, 0.015, 0.015);
        object.name = "manaita";
        object.castShadow = true;
        //other.push(object); // Store the model in the array
        other[1] = object;
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

    // function test_GuideTamanegi(_filename: string, _tag: string, _posX: number, _posY: number, _posZ: number,_rotate: number, _scale: number) {
    //   fbxloader.load(_filename, (object) => {
    //     object.position.set(_posX, _posY, _posZ);
    //     object.rotation.y = _rotate;
    //     object.scale.set(_scale, _scale*100, _scale);
    //     object.name = _tag; // 作成したオブジェクトに"stage"タグを適用
    //     object.receiveShadow = true;
    //     stageModels.push(object); // Store the model in the array
    //     scene.add(object);
    //   });
    // }

    function loadMultipleFBXModels(_filename: string, _tag: string, _name: string, _count: number, _scale: number) {
      for (let i = 0; i < _count; i++) {
        const posX = Math.random() * 3 + 6; // Random X position between -50 and 50
        const posY = 7.8;// Math.random() * 100 - 50; // Random Y position between -50 and 50
        const posZ = Math.random() * 4 - 4; // Random Z position between -50 and 50
        const rotate = Math.random() * 3;

        loadFBXModelAsFood(_filename, _tag, _name, false, "nama", getGrillTime(_name),0, posX, posY, posZ, rotate, _scale);
      }
    }

    function initializeStage(){ // stageを既定の位置に配置
      loadFBXModelAsStage("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/stage01.fbx","stage",0,0,0,0,0.1);
      loadFBXModelAsStage("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/"+carID+".fbx","car",0,5,-10+(60-carSizeX)*0.05,0,0.05);
      loadMultipleFBXModels("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/niku.fbx","food","niku",5,0.05);
      loadMultipleFBXModels("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/tamanegi.fbx","food","tamanegi",5,0.05);
      loadMultipleFBXModels("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/medamayaki.fbx","food","medamayaki",5,0.05);
      loadFBXModelAsStage("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/manaita.fbx","stage",-10.4+(60-carSizeX)*0.05,7,1,-1.57,0.02);
      
      //test_GuideTamanegi("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/tamanegi.fbx","stage",Math.sqrt(carSizeX),7,Math.sqrt(carSizeY),0,0.03);
      //test_GuideTamanegi("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/tamanegi.fbx","stage",Math.sqrt(carSizeX),7,-Math.sqrt(carSizeY),0,0.03);
      //test_GuideTamanegi("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/tamanegi.fbx","stage",-Math.sqrt(carSizeX),7,Math.sqrt(carSizeY),0,0.03);
      //test_GuideTamanegi("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/tamanegi.fbx","stage",-Math.sqrt(carSizeX),7,-Math.sqrt(carSizeY),0,0.03);
    }

    /* テスト用、オブジェクト配置テスト
    loadMultipleFBXModels("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/car03.fbx", 3, 0.01);
    loadMultipleFBXModels("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/car02.fbx", 3, 0.01);
    loadMultipleFBXModels("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/car01.fbx", 3, 0.01);

    loadFBXModel("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/niku.fbx", 0, 0, 0, 0.05); //使用例
    loadFBXModel("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/tamanegi.fbx", 2, 0, 2, 0.05);

    loadFBXModelAsStage("https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/stage01.fbx", 0, 0, 0, 0.02);
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

    function changeModel(_formerObject: THREE.Object3D, _grilledness: number, _num: number, _Filename: string){
      const _posX = _formerObject.position.x;
      const _posY = _formerObject.position.y;
      const _posZ = _formerObject.position.z;
      //const _rotateX = _formerObject.obj3D.rotation.x;
      const _rotateY = _formerObject.rotation.y;
      //const _rotateZ = _formerObject.obj3D.rotation.z;
      const _scale = _formerObject.scale.x;
      const _tag = _formerObject.name;
      const _name = foodArray[_num].name;
      loadFBXModelAsFood(_Filename,_tag,_name, foodArray[_num].isOnBonnet, foodArray[_num].status, getGrillTime(_name),_grilledness,_posX,_posY,_posZ,_rotateY,_scale);
      //delete _Filename;
      scene.remove(_formerObject);
      foodModels.splice(_num,1);
      foodArray.splice(_num,1);
    }

    function deleteModel(_formerObject: THREE.Object3D, _num: number){
      scene.remove(_formerObject);
      foodModels.splice(_num,1);
      foodArray.splice(_num,1);
    }

//========== Mouse Event =================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
            other[0].position.set(intersects[i].point.x + 0.8,intersects[i].point.y + 0.7,intersects[i].point.z - 1.5);
            other[0].rotation.set(0.5,-1,0);
            dragObject.x = intersects[i].point.x;
            dragObject.y = intersects[i].point.y+1;
            dragObject.z = intersects[i].point.z;
            if(dragObject.dragTarget !== null){
              dragObject.dragTarget.position.x = dragObject.x;
              dragObject.dragTarget.position.y = dragObject.y;
              dragObject.dragTarget.position.z = dragObject.z;
              other[0].position.y = dragObject.y;
              other[0].position.z = dragObject.z - 0.5;
              other[0].rotation.set(0,-0.8,0);
            }
            break;
          }
        }
      }
    }

    function checkFoodsOnBonnet(){
      // console.log(foodArray.length);
      for(let i = 0; i<foodArray.length; i++){
        if(  foodModels[i] != dragObject.dragTarget
          && foodModels[i].position.x*foodModels[i].position.x < carSizeX
          && foodModels[i].position.z*foodModels[i].position.z < carSizeY
          && foodModels[i].position.y > 3
          && foodModels[i].position.y < 7.8){
            foodArray[i].isOnBonnet = true;
          }else{
            foodArray[i].isOnBonnet = false;
            if(foodModels[i].position.x < -5 && foodModels[i].position.y > 8){
              if(foodArray[i].status != "yake"){
                deleteModel(foodModels[i],i);
              }else{
                managerObj.addScore(1);
                deleteModel(foodModels[i],i);
                console.log(managerObj.score);
              }
            }
          }
      }
    }

    function checkFoodsDelete(){
      for(let i = 0; i<foodArray.length; i++){
        if(foodModels[i].position.y < 5 && foodModels[i] != dragObject.dragTarget){
          deleteModel(foodModels[i],i);
        }
      }
    }

    function onMouseUp(event: { preventDefault: () => void; clientX: number; clientY: number; }) {
      event.preventDefault();
      if(dragObject.dragTarget !== null){
        dragObject.dragTarget.position.y += -0.94;
        //checkFoodsOnBonnet();
        //changeModel(dragObject.dragTarget,0,"https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/niku_yake.fbx");
        dragObject.dragTarget = null;
      }
    }

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//=================================================================================================

    // 初回実行
    tick();
    initializeStage();
    initializeCamera();
    initializeHera();
    initializeManaita();

    function tick() {
      requestAnimationFrame(tick);
      checkFoodsOnBonnet();
      checkFoodsDelete();

      // stageModels.forEach((model) => {
      //     if(model.name == "car"){
      //       model.position.y += 0.1;
      //     }
      // });      
      // for(let i = 0; i < foodModels.length; i++){
      //   foodModels[i].grill();
      //   if(foodModels[i].grillednessCheck() == "yake"){
      //     changeModel(foodModels[i],foodModels[i].grilledness,"https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/niku_yake.fbx");
      //   }else if(foodModels[i].grillednessCheck() == "koge"){
      //     changeModel(foodModels[i],foodModels[i].grilledness,"https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/models/niku_koge.fbx");
      //   }

      for(let i = 0; i<foodArray.length; i++){
        foodArray[i].grill(managerObj.sunpower);
        if(foodArray[i].grillednessCheck() == "koge"){
              foodArray[i].status = "koge";
              changeModel(foodModels[i],foodArray[i].grilledness,i,"https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/" + foodArray[i].name + "_koge.fbx");
            }else if(foodArray[i].grillednessCheck() == "yake"){
              foodArray[i].status = "yake";
              changeModel(foodModels[i],foodArray[i].grilledness,i,"https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/" + foodArray[i].name + "_yake.fbx");
        }
      }

      // }

      //テスト用、全オブジェクト回転移動
      // for(let i = 0; i < foodModels.length; i++){
      //   foodModels[i].rotation.y += 0.1;
      //   console.log(i);
      // }

      //console.log(foodArray.length);
      //console.log(foodModels.length);

      managerObj.sunpowerCalc(clock.getElapsedTime());
      ambientLight.color.set(managerObj.sunpower*6,managerObj.sunpower*5,1+managerObj.sunpower*5);

      const outputElement = document.getElementById("output");
      if (outputElement) {
          outputElement.innerText = (timeMax - clock.getElapsedTime()).toString();
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

      {/* <button onClick={()=>{debugger;}}>stop</button> */}
      
    </main>
  );
}

export default App;
