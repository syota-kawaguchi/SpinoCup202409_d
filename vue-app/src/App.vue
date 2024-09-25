<template>
  <div class="image-container">
    <TresCanvas style="max-height: 100vh; min-height: 100vh">
      <TresPerspectiveCamera :position="[0, 0, 4]" :fov="40" />
      <TresAmbientLight intensity="2" />
      <!-- 環境光の追加 -->
      <TresDirectionalLight intensity="1" position="[1, 1, 1]" />
      <!-- 方向性光の追加 -->
      <TresObject3D
        :position="[driftPositionX, 0, driftPositionZ]"
        :rotation="[0, driftRotation, 0]"
        ref="gltfModelCenter"
      />
      <TresObject3D
        :position="[driftPositionX - 6, 0, driftPositionZSub]"
        :rotation="[0, driftRotation, 0]"
        ref="gltfModelLeft"
      />
      <TresObject3D
        :position="[driftPositionX + 6, 0, driftPositionZSub]"
        :rotation="[0, driftRotation, 0]"
        ref="gltfModelRight"
      />
    </TresCanvas>

    <div class="text-overlay" ref="textOverlay">
      <span class="count-text">{{ displayScore }}</span>
      <span v-if="displayScore === score">YUMMY</span>
    </div>

    <!-- SNSシェアボタン -->
    <div class="share-buttons">
      <a href="/solidjs/title" class="btn btn-primary home-button">
        Go back to Home
      </a>
      <a
        href="https://twitter.com/intent/tweet?text=My%20score%20is%2080000%20yummy!&url=https://example.com"
        target="_blank"
        class="share-button twitter"
        aria-label="Share on Twitter"
      >
        <i class="fab fa-twitter"></i>
      </a>
      <a
        href="https://www.facebook.com/sharer/sharer.php?u=https://example.com"
        target="_blank"
        class="share-button facebook"
        aria-label="Share on Facebook"
      >
        <i class="fab fa-facebook-f"></i>
      </a>
      <a
        href="https://social-plugins.line.me/lineit/share?url=https://example.com"
        target="_blank"
        class="share-button line"
        aria-label="Share on LINE"
      >
        <i class="fab fa-line"></i>
      </a>
    </div>
  </div>
</template>

<script>
import { TresCanvas } from "@tresjs/core";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Object3D } from "three";

export default {
  name: "ImageWithText",
  data() {
    return {
      score: 0,
      displayScore: 0,
      time: 150,
      driftRate: 1,
      driftRotation: 0,
      driftPositionX: 0,
      driftPositionZ: 0,
      driftPositionZSub: 0,
      selectedCarID: "car01",
      gltfLoader: new GLTFLoader(), // GLTFLoaderをインスタンス化
    };
  },
  mounted() {
    // Google Fonts をダイナミックに読み込む
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // FontAwesome の読み込み
    const fontAwesome = document.createElement("link");
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
    fontAwesome.rel = "stylesheet";
    document.head.appendChild(fontAwesome);

    // localStorageからスコアを取得
    const storedScore = localStorage.getItem("score");
    // consoleにスコアを表示
    if (storedScore) {
      this.score = parseInt(storedScore, 10);
    } else {
      this.score = 0;
    }
    // localStorageからスコアを取得
    const storedSelectedCarID = localStorage.getItem("selectedCarID");
    // consoleにスコアを表示
    if (storedScore) {
      this.selectedCarID = storedSelectedCarID;
    } else {
      this.selectedCarID = "car01";
    }

    // GLTFモデルを読み込み
    this.loadGLTFModel("gltfModelCenter");

    if (this.score > 1000) {
      this.loadGLTFModel("gltfModelLeft");
      this.loadGLTFModel("gltfModelRight");
    }

    // カメラの距離を設定
    this.animateCamera();
  },

  methods: {
    loadGLTFModel(
      modelName = "gltfModelCenter" // モデル名のデフォルト値を設定
    ) {
      // selectedCarIDに基づいてモデルのパスを決定する
      const modelPath = `https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/gltf/${this.selectedCarID}.gltf`;

      // GLTFモデルをロード
      this.gltfLoader.load(modelPath, (gltf) => {
        const model = gltf.scene || new Object3D(); // モデルを取得

        // TresObject3Dにモデルを追加
        this.$refs[modelName].add(model);
      });
    },
    animateCamera() {
      // 4になるまでカメラの距離を減らす
      if (this.time > 4) {
        this.time -= 1;
        this.driftPositionZ = -this.time + 2 * this.driftPositionX;
        this.driftPositionZSub =
          this.driftPositionZ > -15
            ? -15
            : -this.time + 2 * this.driftPositionX;
        // 後半だけカメラを回転させる
        if (this.time < 54) {
          switch (true) {
            case this.score < 500:
              this.driftRotation += 0.2;
              break;
            case this.score < 1000:
              this.driftRate = (this.time - 4) / 50;
              this.driftPositionX =
                5 * Math.sin((1 - this.driftRate) * Math.PI);
              this.driftRotation = Math.sin(
                ((1 - this.driftRate) * 3 * Math.PI) / 2
              );
              break;
            default:
              break;
          }
        }
        // スコアをカウントアップする
        if (this.displayScore < this.score) {
          this.displayScore += 1;
          this.$refs.textOverlay.style.color = `rgba(${
            100 + Math.min(this.displayScore, 233)
          }, 44, 44, 1)`;
        }
        requestAnimationFrame(this.animateCamera);
      } else {
        this.displayScore = this.score;

        // スコアが500未満の場合は赤色、500以上の場合は緑色、1000以上の場合は青色
        this.$refs.textOverlay.style.color = `rgba(${
          this.score < 500 ? "0" : this.score < 1000 ? "100" : "233"
        }, 44, 44, 1)`;
      }
    },
  },
};
</script>

<style scoped>
/* コンテナ全体のスタイル */
.image-container {
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 画像設定：画像がコンテナ全体に収まるように表示 */
.image-container img {
  width: 100%;
  height: 100%;
}

.count-text {
  display: inline-block; /* 幅を指定するには block または inline-block が必要 */
  text-align: center;
  min-width: 25rem;
}

/* テキストオーバーレイ設定 */
.text-overlay {
  span {
    display: inline-block;
  }
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(10deg); /* 15度傾ける */
  color: #e92c2c; /* テキストの色 */
  font-size: 12rem; /* テキストの標準サイズ */
  font-family: "Lilita One", cursive; /* 可愛いフォント */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: bold;
  z-index: 1; /* 画像の上に表示 */
  line-height: 0.8;
  -webkit-text-stroke-width: 6px;
  -webkit-text-stroke-color: rgb(0, 0, 0);
}

/* SNSシェアボタンのスタイル */
.share-buttons {
  z-index: 10;
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.share-button {
  font-size: 32px;
  color: white;
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.share-button.twitter {
  background-color: #1da1f2;
}

.share-button.facebook {
  background-color: #3b5998;
}

.share-button.line {
  background-color: #00c300;
}

.share-button:hover {
  opacity: 0.8;
}
</style>
