<template>
  <div class="page-container">
    <div class="image-container">
      <img src="/result-car.jpg" alt="Car" />
    </div>
    <div class="content-overlay">
      <div class="text-overlay">
        <span class="large-number">80000</span> yummy
      </div>
      <a href="/vanilla/home" class="btn btn-primary home-button">
        Go back to Home
      </a>
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
  </div>
</template>

<script>
export default {
  name: "ImageWithText",
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
  },
};
</script>

<style scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(15deg);
  color: #fbbde8;
  font-size: 48px;
  font-family: "Pacifico", cursive;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: bold;
}

.large-number {
  font-size: 80px;
  color: #ff6f61;
}

.home-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: #4caf50;
  color: white;
  padding: 15px 25px;
  text-decoration: none;
  font-size: 18px;
  border-radius: 5px;
  transition: background-color 0.3s;
  pointer-events: auto;
}

.home-button:hover {
  background-color: #45a049;
}

.share-buttons {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  pointer-events: auto;
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
