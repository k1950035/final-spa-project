<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useMovieStore } from './stores/movieStore';

const store = useMovieStore();
const router = useRouter();

const searchKeyword = ref('');

const onSearch = () => {
  const query = searchKeyword.value.trim();
  if (!query) return;
  router.push({ name: 'search', query: { q: query } });
};

const getAverageRating = () => {
  if (store.favorites.length === 0) {
    return '0.0';
  }
  const totalRatingSum = store.favorites.reduce((accumulator, movie) => {
    return accumulator + movie.vote_average;
  }, 0);
  const calculatedAverage = totalRatingSum / store.favorites.length;
  return calculatedAverage.toFixed(1);
};
</script>

<template>
  <div class="app-container">
    <header class="main-header">
      <div class="header-content">
        <RouterLink to="/" class="logo-zone">
          <span class="logo-icon">🎬</span>
          <h1 class="logo-text">NETVUE</h1>
        </RouterLink>
        <nav class="nav-menu">
          <RouterLink to="/" class="nav-item">홈</RouterLink>
          <RouterLink to="/movies" class="nav-item">영화 목록</RouterLink>
          <RouterLink to="/favorites" class="nav-item">찜 목록</RouterLink>
        </nav>
        <form class="search-form" @submit.prevent="onSearch">
          <input
            v-model="searchKeyword"
            type="text"
            class="header-search"
            placeholder="영화 제목 검색"
          />
          <button type="submit" class="search-btn">🔍</button>
        </form>
        <div class="header-dashboard">
          <div class="dashboard-badge favorite-count">
            <span class="badge-label">❤️ 찜한 작품수</span>
            <span class="badge-value">{{ store.favorites.length }}개</span>
          </div>
          <div class="dashboard-badge average-rating">
            <span class="badge-label">⭐ 평균 평점</span>
            <span class="badge-value">{{ getAverageRating() }} / 10</span>
          </div>
        </div>
      </div>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container { font-family: "Noto Sans KR", sans-serif; background-color: #f8f9fa; min-height: 100vh; display: flex; flex-direction: column; }
.main-header { background-color: #1e272e; color: #ffffff; position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); padding: 0 40px; }
.header-content { max-width: 1200px; margin: 0 auto; height: 80px; display: flex; align-items: center; justify-content: space-between; }
.logo-zone { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #ffffff; }
.logo-icon { font-size: 28px; }
.logo-text { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; background: linear-gradient(45deg, #ff4757, #ff6b81); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-menu { display: flex; gap: 30px; }
.nav-item { font-size: 16px; color: #cdd5e0; font-weight: 700; transition: color 0.2s ease; padding: 8px 16px; border-radius: 8px; text-decoration: none; }
.nav-item:hover { color: #ffffff; background-color: rgba(255, 255, 255, 0.05); }
.router-link-active.nav-item { color: #ff4757; background-color: rgba(255, 87, 87, 0.1); }
.search-form { display: flex; align-items: center; background-color: #2f3542; border-radius: 30px; padding: 4px 6px 4px 16px; }
.header-search { background: transparent; border: none; outline: none; color: #ffffff; font-size: 14px; width: 160px; }
.header-search::placeholder { color: #a4b0be; }
.search-btn { background: #ff4757; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 14px; transition: 0.2s; }
.search-btn:hover { background: #ff6b81; }
.header-dashboard { display: flex; gap: 15px; }
.dashboard-badge { background-color: #2f3542; padding: 10px 16px; border-radius: 30px; display: flex; align-items: center; gap: 10px; }
.badge-label { font-size: 13px; color: #a4b0be; font-weight: 500; }
.badge-value { font-size: 14px; font-weight: 800; color: #ffffff; }
.average-rating .badge-value { color: #e1b12c; }
.main-content { flex-grow: 1; width: 100%; box-sizing: border-box; }
</style>
