import { useState } from "react";
import "../../App.css";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  const bookmarkedCount = movies.filter((movie) => movie.isBookmarked).length;

  return (
    <>
      <main className="page">
        <section className="title-section" id="movies">
          <div>
            <p className="eyebrow">UMCINE MOVIES</p>
            <h1>영화 목록</h1>
          </div>
          <p className="movie-count">
            총 {movies.length}편 · 북마크 {bookmarkedCount}편
          </p>
        </section>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}
