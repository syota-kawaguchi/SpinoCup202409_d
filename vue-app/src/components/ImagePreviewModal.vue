<!-- src/components/ImagePreviewModal.vue -->
<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  show: boolean;
  imageUrl: string;
}>();

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

const shareToTwitter = () => {
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    window.location.href
  )}&text=${encodeURIComponent("私のゲームスコアをチェックしてね！")}`;
  window.open(twitterUrl, "_blank");
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>画像プレビュー</h2>
      <img :src="imageUrl" alt="スコア画像" class="preview-image" />
      <div class="button-container">
        <button @click="shareToTwitter">Twitterで共有</button>
        <button @click="closeModal">閉じる</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
}

.preview-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}
</style>
