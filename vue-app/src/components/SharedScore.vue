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

onMounted(async () => {
  const scoreId = route.params.id as string;

  try {
    const q = query(collection(db, "scores"), where("id", "==", scoreId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const scoreData = querySnapshot.docs[0].data();
      score.value = scoreData.score;
      imageUrl.value = scoreData.imageUrl;
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
      <pre>{{ imageUrl }}</pre>
      <img
        :src="imageUrl"
        alt="スコア画像"
        style="max-width: 300px; margin-top: 20px"
      />
      <button @click="openModal">画像プレビュー</button>
      <ImagePreviewModal
        :show="showModal"
        :imageUrl="imageUrl"
        @close="closeModal"
      />
    </div>
  </div>
</template>
