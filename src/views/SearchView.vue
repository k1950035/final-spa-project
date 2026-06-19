<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "../stores/movieStore";

const store = useMovieStore();
const route = useRoute();

const runSearch = async () => {
  if (store.movies.length === 0) {
    await store.fetchMovies();
  }
  store.searchMovies(route.query.q);
  document.title = `🔍 '${route.query.q}' 검색 결과`;
};

onMounted(runSearch);

watch(() => route.query.q, runSearch);
</script>

<template>
  <main class="page">
    <div class="header-section">
      <h1>🔍 '{{ route.query.q }}' 검색 결과</h1>
      <p class="sub-title">
        총 {{ store.searchResults.length }}건의 영화를 찾았습니다.
      </p>
    </div>

    <div v-if="store.isLoading" class="status-message loading">
      ⌛ 데이터를 불러오는 중입니다...
    </div>
    <div
      v-else-if="store.searchResults.length === 0"
      class="status-message empty"
    >
      😢 '{{ route.query.q }}'에 해당하는 영화를 찾을 수 없습니다.
    </div>
    <div v-else class="movie-list">
      <div
        v-for="movie in store.searchResults"
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
.loading {
  color: #3498db;
  background-color: #e3f2fd;
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
  margin-bottom: 10px;
  font-size: 16px;
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
