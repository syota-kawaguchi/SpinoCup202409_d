<script setup lang="ts">
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase/init";

const title = ref("動的OGP画像生成");
const description = ref("Vue 3とFirebase Storageを使用したOGP画像生成");
const ogpImageUrl = ref("");

const generateOgpImage = async (): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 背景
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, 1200, 630);

    // タイトル
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#333333";
    ctx.fillText(title.value, 50, 100, 1100);

    // 説明
    ctx.font = "24px Arial";
    ctx.fillStyle = "#666666";
    ctx.fillText(description.value, 50, 200, 1100);
  }

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/png");
  });
};

const uploadToFirebaseStorage = async (imageBlob: Blob): Promise<string> => {
  const storage = getStorage(app);
  const imageRef = storageRef(storage, `ogp-images/${Date.now()}.png`);

  await uploadBytes(imageRef, imageBlob);
  return getDownloadURL(imageRef);
};

const generateAndUploadOgpImage = async () => {
  try {
    const imageBlob = await generateOgpImage();
    const url = await uploadToFirebaseStorage(imageBlob);
    ogpImageUrl.value = url;
    console.log("OGP画像URL:", url);
  } catch (error) {

    console.error("OGP画像の生成とアップロードに失敗しました:", error);
    alert("OGP画像の生成とアップロードに失敗しました");
  }
};
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <button @click="generateAndUploadOgpImage">
      OGP画像生成＆アップロード
    </button>
    <img v-if="ogpImageUrl" :src="ogpImageUrl" alt="OGP画像プレビュー" />
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
