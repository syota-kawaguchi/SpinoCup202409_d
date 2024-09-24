<!-- src/components/SharedScoreComponent.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../firebase/init";
import { useHead } from "@vueuse/head";
import ImagePreviewModal from "./ImagePreviewModal.vue";

const route = useRoute();
const db = getFirestore(app);

const score = ref(0);
const loading = ref(true);
const showModal = ref(false);
const imageUrl = ref("");

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

onMounted(async () => {
  const scoreId = route.params.id as string;

  try {
    const q = query(collection(db, "scores"), where("id", "==", scoreId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      score.value = querySnapshot.docs[0].data().score;
      imageUrl.value = await generateImage();
    } else {
      console.error("Score not found");
    }
  } catch (error) {
    console.error("Error fetching score: ", error);
  } finally {
    loading.value = false;
  }
});

// OGPメタタグの設定
watch([score, imageUrl], () => {
  useHead({
    title: `ゲームスコア: ${score.value}点`,
    meta: [
      { property: "og:title", content: `ゲームスコア: ${score.value}点` },
      { property: "og:description", content: "すごいスコアが出たよ！" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: window.location.href },
      { property: "og:image", content: imageUrl.value },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  });
});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div>
    <div v-if="loading">読み込み中...</div>
    <div v-else>
      <h1>共有されたスコア: {{ score }}点</h1>
      <button @click="openModal">画像プレビュー</button>
      <ImagePreviewModal
        :show="showModal"
        :imageUrl="imageUrl"
        @close="closeModal"
      />
    </div>
  </div>
</template>
