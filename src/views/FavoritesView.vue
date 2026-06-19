<script setup>
import { onMounted } from "vue";
import { useMovieStore } from "../stores/movieStore";

const store = useMovieStore();

onMounted(() => {
  document.title = "❤️ 내가 찜한 영화";
});
</script>

<template>
  <main class="page">
    <div class="header-section">
      <h1>❤️ 내가 찜한 영화</h1>
      <p class="sub-title">
        총 {{ store.favorites.length }}편의 작품을 찜했습니다.
      </p>
    </div>

    <div v-if="store.favorites.length === 0" class="status-message empty">
      🤍 아직 찜한 영화가 없습니다. 마음에 드는 작품을 찜해보세요!
    </div>
    <div v-else class="movie-list">
      <div
        v-for="movie in store.favorites"
        :key="movie.id"
        class="movie-card"
      >
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          class="poster"
        />
        <div v-else class="poster-placeholder">이미지 준비 중</div>
        <div class="card-content">
          <h3 class="title">{{ movie.title }}</h3>
          <p class="release-date" v-if="movie.release_date">
            📅 개봉일: {{ movie.release_date }}
          </p>
          <p class="rating">⭐ {{ movie.vote_average.toFixed(1) }} / 10</p>
          <button
            @click="store.removeFavorite(movie.id)"
            class="fav-btn active"
          >
            ♥ 찜 해제
          </button>
        </div>
        <RouterLink
          :to="`/movies/${movie.id}`"
          class="stretched-link"
          :aria-label="`${movie.title} 상세 정보 보기`"
        ></RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.page {
  padding: 40px;
  background-color: #f8f9fa;
  min-height: 100vh;
}
.header-section {
  margin-bottom: 30px;
  text-align: center;
  color: #2c3e50;
}
.sub-title {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}
.status-message {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: 50px;
  border-radius: 12px;
}
.empty {
  color: #7f8c8d;
  background-color: #f1f2f6;
}
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}
.movie-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
}
.movie-card:hover {
  transform: translateY(-5px);
}
.poster {
  width: 100%;
  height: 380px;
  object-fit: cover;
}
.poster-placeholder {
  width: 100%;
  height: 380px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-weight: bold;
}
.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.title {
  font-size: 18px;
  color: #333;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}
.release-date {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 10px;
  font-weight: 500;
}
.rating {
  font-weight: bold;
  color: #f39c12;
  margin-bottom: 20px;
  font-size: 16px;
}
.fav-btn {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 12px;
  cursor: pointer;
  border: none;
  background: #ecf0f1;
  color: #333;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  transition: 0.3s;
  margin-top: auto;
}
.fav-btn.active {
  background: #ff4757;
  color: white;
}
.stretched-link {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
</style>
