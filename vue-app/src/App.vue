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

    <div class="center-text-container">
      <div class="text-overlay" ref="textOverlay">
        <span class="count-text">{{ displayScore }}</span>
        <span v-if="displayScore === score">YUMMY</span>
      </div>

      <a href="/solidjs/title" class="link" ref="linkButton">
        Go back to Title
      </a>
    </div>

    <div class="overlay-and-background" ref="overlayAndBackground">
      <img
        class="background"
        src="https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/images/result_stamp02_light_2.webp"
        alt="背景"
        ref="background"
      />
      <div class="overlay"></div>
    </div>

    <!-- SNSシェアボタン -->
    <div class="share-buttons" ref="shareButtons">
      <a
        :href="`https://twitter.com/intent/tweet?text=${shareText}`"
        target="_blank"
        class="share-button twitter"
        aria-label="Share on Twitter"
      >
        <i class="fab fa-twitter"></i>
      </a>
      <a
        :href="`https://social-plugins.line.me/lineit/share?url=https://bonnet-grills-bbq.vercel.app/solidjs/title`"
        target="_blank"
        class="share-button line"
        aria-label="Share on LINE"
      >
        <i class="fab fa-line"></i>
      </a>
    </div>
    <!-- 左下のランク -->
    <div class="scale-bar-container">
      <div class="scale-bar">
        <div class="scale-mark" v-for="mark,index in ['1000 仙人', '500 パンピー', '0 へなちょこ']" :key="index">
          <div class="mark-line"></div>
          <span class="mark-label">{{ mark }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TresCanvas } from "@tresjs/core";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Object3D } from "three";
import { SHARE_TEXT_TEMPLATE } from "./const";

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
      showLinks: false, // To control button visibility
      showScore: false, // To control score visibility
      gltfLoader: new GLTFLoader(), // GLTFLoaderをインスタンス化
      shareText: `I got a score of ${this.score} on the BBQ app!`, // ツイート文言
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
      this.shareText = `${SHARE_TEXT_TEMPLATE[
        Math.floor(Math.random() * SHARE_TEXT_TEMPLATE.length)
      ].replace(
        "*",
        this.score
      )}%0A%0Ahttps://bonnet-grills-bbq.vercel.app/solidjs/title/`;
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

    // 背景画像のパスをスコアに応じて切り替える
    this.setBackgroundImage();

    // カメラの距離を設定
    this.animateCamera();
  },

  methods: {
    setBackgroundImage() {
      let imagePath;

      if (this.score < 500) {
        imagePath =
          "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/images/result_stamp03_light_2.webp";
      } else if (this.score < 1000) {
        imagePath =
          "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/images/result_stamp02_light_2.webp";
      } else {
        imagePath =
          "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/images/result_stamp01_light_2.webp";
      }

      // 背景画像を更新
      this.$refs.background.src = imagePath;
    },
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
        this.$refs.textOverlay.style.color =
          this.score < 500
            ? "#9aa3d3"
            : this.score < 1000
            ? "#d3bf9a"
            : "#ff1e00";
        // 縁の色を設定
        this.$refs.textOverlay.style.webkitTextStrokeColor =
          this.score < 500
            ? "#1f2440"
            : this.score < 1000
            ? "#372b14"
            : "#471610";

        // overlay-and-backgroundのopacityを0にする
        this.$refs.overlayAndBackground.style.opacity = 1;

        // Delay showing the buttons by 3 seconds
        setTimeout(() => {
          this.$refs.linkButton.style.opacity = 1;
          this.$refs.shareButtons.style.opacity = 1;
        }, 1000);
      }
    },
  },
  computed: {
    rankPercentage() {
      return Math.min(this.score / 10, 100);
    }
  },
};
</script>
