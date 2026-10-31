import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import "../../App.css";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { toMovieCardModel } from "../../utils/movies/movie-adapter";
import type { Movie } from "../../types/movie";

type SortOrder = "release-date" | "title";

function readCompactPreference() {
  try { return localStorage.getItem("umcine-card-size") === "compact"; }
  catch { return false; }
}

function readSortOrder(): SortOrder {
  try { return sessionStorage.getItem("umcine-movie-sort") === "title" ? "title" : "release-date"; }
  catch { return "release-date"; }
}

export function MovieListPage() {
  const navigate = useNavigate({ from: "/" });
  const { page = 1 } = useSearch({ from: "/" });
  const bookmarkedIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [compact, setCompact] = useState(readCompactPreference);
  const [sortOrder, setSortOrder] = useState<SortOrder>(readSortOrder);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await getMovies({ page });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
          setTotalResults(response.total_results);
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    void loadMovies();
    return () => { ignore = true; };
  }, [page, retryCount]);

  const displayMovies: Movie[] = movies.map(toMovieCardModel).sort((a, b) =>
    sortOrder === "title" ? a.title.localeCompare(b.title, "ko") : b.releaseDate.localeCompare(a.releaseDate),
  );
  function changeCompact(value: boolean) {
    setCompact(value);
    try { localStorage.setItem("umcine-card-size", value ? "compact" : "comfortable"); } catch { /* ignore unavailable storage */ }
  }
  function changeSortOrder(value: SortOrder) {
    setSortOrder(value);
    try { sessionStorage.setItem("umcine-movie-sort", value); } catch { /* ignore unavailable storage */ }
  }
  function changePage(nextPage: number) {
    void navigate({ search: { page: nextPage === 1 ? undefined : nextPage } });
  }

  return (
    <main className="page">
      <section className="title-section" id="movies">
        <div><p className="eyebrow">UMCINE MOVIES</p><h1>인기 영화</h1></div>
        <p className="movie-count">총 {totalResults ? `${totalResults}편` : "-"} · 북마크 {bookmarkedIds.length}편</p>
      </section>
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-600">정렬<select value={sortOrder} onChange={(event) => changeSortOrder(event.target.value as SortOrder)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800"><option value="release-date">개봉일순</option><option value="title">제목순</option></select></label>
        <label className="flex items-center gap-2 text-slate-600">카드 크기<select value={compact ? "compact" : "comfortable"} onChange={(event) => changeCompact(event.target.value === "compact")} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800"><option value="comfortable">기본</option><option value="compact">작게</option></select></label>
      </div>
      {isLoading ? <p className="py-20 text-center text-slate-500" role="status">영화 목록을 불러오는 중이에요.</p>
        : errorMessage ? <section className="py-20 text-center"><p className="text-slate-600" role="alert">{errorMessage}</p><button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">다시 시도</button></section>
          : movies.length === 0 ? <p className="py-20 text-center text-slate-500">조건에 맞는 영화가 없어요.</p>
            : <MovieGrid movies={displayMovies} compact={compact} />}
      {!isLoading && !errorMessage && totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />}
    </main>
  );
}
