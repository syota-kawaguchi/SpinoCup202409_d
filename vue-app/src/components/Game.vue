<!-- src/components/GameComponent.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase/init";
import { v4 as uuidv4 } from "uuid";

const db = getFirestore(app);
const storage = getStorage(app);

const score = ref(0);
const shareUrl = ref("");
const imageUrl = ref("");

const updateScore = (newScore: number) => {
  score.value = newScore;
};

const generateImage = async () => {
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
    ctx.fillText(`ゲームスコア: ${score.value}点`, 50, 100);

    // スコア
    ctx.font = "bold 72px Arial";
    ctx.fillStyle = "#FF4500";
    ctx.fillText(`${score.value}点`, 50, 300);
  }

  return canvas.toDataURL("image/png");
};

const uploadImage = async (dataUrl: string, id: string) => {
  const storageReference = storageRef(storage, `scores/${id}.png`);
  await uploadString(storageReference, dataUrl, "data_url");
  return await getDownloadURL(storageReference);
};

const generateShareLink = async () => {
  const id = uuidv4();

  try {
    const imageDataUrl = await generateImage();
    const publicImageUrl = await uploadImage(imageDataUrl, id);

    await addDoc(collection(db, "scores"), {
      id,
      score: score.value,
      imageUrl: publicImageUrl,
      createdAt: new Date(),
    });

    const baseUrl = window.location.origin;
    shareUrl.value = `${baseUrl}/vue/score/${id}`;
    imageUrl.value = publicImageUrl;
  } catch (error) {
    console.error("Error saving score: ", error);
    alert("スコアの保存に失敗しました。");
  }
};

const shareToTwitter = () => {
  if (!shareUrl.value) {
    alert("先にシェアリンクを生成してください。");
    return;
  }

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    shareUrl.value
  )}&text=${encodeURIComponent(`私のスコアは${score.value}点でした！`)}`;
  window.open(twitterUrl, "_blank");
};
</script>

<template>
  <div>
    <h1>ゲームスコア: {{ score }}点</h1>
    <button @click="updateScore(Math.floor(Math.random() * 1000))">
      スコア更新（デモ用）
    </button>
    <button @click="generateShareLink">シェアリンク生成</button>

    <div v-if="shareUrl">
      <p>シェアリンク: {{ shareUrl }}</p>
      <button @click="shareToTwitter">Twitterで共有</button>
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="スコア画像"
        style="max-width: 300px; margin-top: 20px"
      />
    </div>
  </div>
</template>
