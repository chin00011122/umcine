import { useState } from "react";
import "../../App.css";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import type { Movie } from "../../types/movie";

type SortOrder = "release-date" | "title";

function readCompactPreference() {
  try {
    return localStorage.getItem("umcine-card-size") === "compact";
  } catch {
    return false;
  }
}

function readSortOrder(): SortOrder {
  try {
    return sessionStorage.getItem("umcine-movie-sort") === "title" ? "title" : "release-date";
  } catch {
    return "release-date";
  }
}

export function MovieListPage() {
  const bookmarkedIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [currentPage, setCurrentPage] = useState(1);
  const [compact, setCompact] = useState(readCompactPreference);
  const [sortOrder, setSortOrder] = useState<SortOrder>(readSortOrder);

  function changeCompact(value: boolean) {
    setCompact(value);
    try {
      localStorage.setItem("umcine-card-size", value ? "compact" : "comfortable");
    } catch {
      // The screen remains usable if browser storage is unavailable.
    }
  }

  function changeSortOrder(value: SortOrder) {
    setSortOrder(value);
    try {
      sessionStorage.setItem("umcine-movie-sort", value);
    } catch {
      // The selected order still applies for this render.
    }
  }

  const sortedMovies: Movie[] = [...movies].sort((a, b) =>
    sortOrder === "title"
      ? a.title.localeCompare(b.title, "ko")
      : b.releaseDate.localeCompare(a.releaseDate),
  );

  return (
    <main className="page">
      <section className="title-section" id="movies">
        <div>
          <p className="eyebrow">UMCINE MOVIES</p>
          <h1>영화 목록</h1>
        </div>
        <p className="movie-count">
          총 {movies.length}편 · 북마크 {bookmarkedIds.length}편
        </p>
      </section>
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          정렬
          <select value={sortOrder} onChange={(event) => changeSortOrder(event.target.value as SortOrder)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800">
            <option value="release-date">개봉일순</option>
            <option value="title">제목순</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-slate-600">
          카드 크기
          <select value={compact ? "compact" : "comfortable"} onChange={(event) => changeCompact(event.target.value === "compact")} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800">
            <option value="comfortable">기본</option>
            <option value="compact">작게</option>
          </select>
        </label>
      </div>
      <MovieGrid movies={sortedMovies} compact={compact} />
      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </main>
  );
}
