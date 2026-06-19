import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useMovieStore = defineStore("movie", () => {
  const movies = ref([]);

  const favorites = ref(JSON.parse(sessionStorage.getItem("favorites")) || []);

  const isLoading = ref(false);
  const errorMessage = ref("");
  const selectedMovie = ref(null);
  const sortBy = ref("title");
  const searchResults = ref([]);

  const sortMovies = () => {
    if (sortBy.value === "title") {
      movies.value.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    } else if (sortBy.value === "release") {
      movies.value.sort((a, b) =>
        (b.release_date || "").localeCompare(a.release_date || ""),
      );
    } else if (sortBy.value === "rating") {
      movies.value.sort((a, b) => b.vote_average - a.vote_average);
    }
  };

  const setSortBy = (key) => {
    sortBy.value = key;
    sortMovies();
  };

  const searchMovies = (keyword) => {
    const query = (keyword || "").trim().toLowerCase();
    searchResults.value = movies.value.filter((movie) =>
      movie.title.toLowerCase().includes(query),
    );
  };

  const fetchMovies = async () => {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const API_KEY = "454c8a94d8af51c47824cb1abf74c53c";

      const movieParams = {
        api_key: API_KEY,
        language: "ko-KR",
        region: "KR",
        sort_by: "popularity.desc",
        include_adult: false,
        "release_date.gte": "2025-01-01",
        with_release_type: "2|3",
        page: 1,
      };

      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: movieParams,
          headers: { Authorization: `Bearer ${API_KEY}` },
        },
      );

      const fetchedMovies = response.data.results;

      fetchedMovies.forEach((movie) => {
        const isAlreadyFavorite = favorites.value.some(
          (fav) => fav.id === movie.id,
        );
        movie.isFavorite = isAlreadyFavorite;
      });

      movies.value = fetchedMovies;
      sortMovies();
    } catch (error) {
      console.error("API 통신 에러 상세 내역:", error);
      errorMessage.value =
        "영화 데이터를 불러오는 데 실패했습니다. 통신 상태나 API Key를 확인해 주세요.";
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMovieDetail = async (movieId) => {
    isLoading.value = true;
    errorMessage.value = "";
    selectedMovie.value = null;

    try {
      const API_KEY = "454c8a94d8af51c47824cb1abf74c53c";
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;

      const response = await axios.get(url, {
        params: {
          api_key: API_KEY,
          language: "ko-KR",
        },
      });
      selectedMovie.value = response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        errorMessage.value = "존재하지 않거나 삭제된 영화 정보입니다.";
      } else {
        errorMessage.value = "서버 통신 중 에러가 발생했습니다.";
      }
    } finally {
      isLoading.value = false;
    }
  };

  const toggleFavorite = (movieId) => {
    const movie = movies.value.find((m) => m.id === movieId);
    if (movie) {
      movie.isFavorite = !movie.isFavorite;
      if (movie.isFavorite) {
        favorites.value.push(movie);
      } else {
        favorites.value = favorites.value.filter((m) => m.id !== movieId);
      }
      sessionStorage.setItem("favorites", JSON.stringify(favorites.value));
    }
  };

  const removeFavorite = (movieId) => {
    favorites.value = favorites.value.filter((m) => m.id !== movieId);
    const movie = movies.value.find((m) => m.id === movieId);
    if (movie) {
      movie.isFavorite = false;
    }
    sessionStorage.setItem("favorites", JSON.stringify(favorites.value));
  };

  return {
    movies,
    favorites,
    isLoading,
    errorMessage,
    fetchMovies,
    selectedMovie,
    fetchMovieDetail,
    toggleFavorite,
    removeFavorite,
    sortBy,
    setSortBy,
    searchResults,
    searchMovies,
  };
});
