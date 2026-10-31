import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

void getMoviesWithFetch(1)
  .then((response) => console.log("fetch 인기 영화 응답:", response.results))
  .catch((error: unknown) => console.error("fetch 인기 영화 요청 실패:", error));
