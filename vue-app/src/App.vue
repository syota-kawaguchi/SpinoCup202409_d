<template>
  <div class="image-container">
    <img src="https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/images/result-car.jpg" alt="Car" />
    <div class="text-overlay">
      <span class="large-number">{{ score }}</span> yummy
    </div>

    <!-- SNSシェアボタン -->
    <div class="share-buttons">
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
export default {
  name: "ImageWithText",
  data() {
    return {
      score: 0
    };
  },
  mounted() {
    // Google Fonts をダイナミックに読み込む
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Pacifico&display=swap";
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
    if (storedScore) {
      this.score = parseInt(storedScore, 10);
    }else{
      this.score = 0;
    }
  },
};
</script>

<style scoped>
/* コンテナ設定：画像を固定し、画面全体に表示 */
.image-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 画像設定：画像がコンテナ全体に収まるように表示 */
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 画像の縦横比を保持しつつ、コンテナ全体をカバー */
}

/* テキストオーバーレイ設定 */
.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(15deg); /* 15度傾ける */
  color: #fbbde8; /* テキストの色 */
  font-size: 48px; /* テキストの標準サイズ */
  font-family: "Pacifico", cursive; /* 可愛いフォント */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: bold;
  z-index: 1; /* 画像の上に表示 */
}

/* 数字だけを大きくするスタイル */
.large-number {
  font-size: 80px; /* 数字を大きく */
  color: #ff6f61; /* 数字の色を少し変えても良い */
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
