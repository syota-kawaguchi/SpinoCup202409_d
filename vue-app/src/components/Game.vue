<!-- src/components/GameComponent.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebase/init";
import { v4 as uuidv4 } from "uuid";

const db = getFirestore(app);

const score = ref(0);
const shareUrl = ref("");

const updateScore = (newScore: number) => {
  score.value = newScore;
};

const generateShareLink = async () => {
  const id = uuidv4();

  try {
    await addDoc(collection(db, "scores"), {
      id,
      score: score.value,
      createdAt: new Date(),
    });

    const baseUrl = window.location.origin;
    shareUrl.value = `${baseUrl}/score/${id}`;
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
    </div>
  </div>
</template>
