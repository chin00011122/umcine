import type { TmdbMovieDetail, TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "./tmdb-image";

const genreNames: Record<number, string> = {
  12: "모험", 14: "판타지", 16: "애니메이션", 18: "드라마", 27: "공포",
  28: "액션", 35: "코미디", 36: "역사", 37: "서부", 53: "스릴러",
  80: "범죄", 99: "다큐멘터리", 878: "SF",
  9648: "미스터리", 10402: "음악", 10749: "로맨스", 10751: "가족",
  10752: "전쟁", 10770: "TV 영화",
};

export function toMovieCardModel(movie: TmdbMovieListItem): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path),
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path),
    genres: movie.genre_ids.map((id) => genreNames[id] ?? "영화"),
    runtime: "상영 시간 정보 없음",
    tagline: "",
    overview: movie.overview,
    isBookmarked: false,
  };
}

export function toMovieDetailModel(movie: TmdbMovieDetail): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path),
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path),
    genres: movie.genres.map((genre) => genre.name),
    runtime: movie.runtime === null
      ? "상영 시간 정보가 없어요."
      : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`,
    tagline: movie.tagline,
    overview: movie.overview,
    isBookmarked: false,
  };
}
export type { Movie as MovieCardModel };
