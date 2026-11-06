import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";

import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import Pagination from "../../components/movies/pagination";
import { toMovieCardModel } from "../../utils/movies/movie-adapter";

export function SearchPage() {
  const { query = "", page = 1 } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const normalizedQuery = query.trim();

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery, page }],
    queryFn: () => searchMovies({ query: normalizedQuery, page }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];
  const totalResults = searchQuery.data?.total_results ?? 0;
  const totalPages = searchQuery.data?.total_pages ?? 0;

  useEffect(() => {
    setSearchText(query);
  }, [query]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    void navigate({
      search: { query: nextQuery || undefined, page: undefined },
    });
  }

  function changePage(nextPage: number) {
    void navigate({
      search: {
        query: normalizedQuery || undefined,
        page: nextPage === 1 ? undefined : nextPage,
      },
    });
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-[1120px]">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-950">
          영화 검색
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm"
        >
          <img src="/icons/search.svg" alt="" className="h-4 w-4 opacity-60" />
          <input
            aria-label="검색어"
            placeholder="예: 스파이더맨"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white"
          >
            검색
          </button>
        </form>

        {!normalizedQuery ? (
          <p className="py-10 text-center text-sm text-slate-500">
            검색어를 입력해 주세요.
          </p>
        ) : (
          <section className="mt-7">
            <h2 className="mb-5 text-sm font-semibold text-slate-800">
              ‘{normalizedQuery}’ 검색 결과{" "}
              <span className="ml-1 font-normal text-slate-500">
                {searchQuery.isLoading
                  ? "불러오는 중"
                  : searchQuery.isError
                    ? "결과를 불러오지 못했어요"
                    : `${totalResults}편`}
              </span>
            </h2>

            {searchQuery.isLoading ? (
              <p
                className="py-12 text-center text-sm text-slate-500"
                role="status"
              >
                검색 결과를 불러오는 중이에요.
              </p>
            ) : searchQuery.isError ? (
              <div className="py-12 text-center">
                <p role="alert" className="text-sm text-slate-600">
                  검색 결과를 불러오지 못했어요.
                </p>
                <button
                  type="button"
                  onClick={() => void searchQuery.refetch()}
                  className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  다시 시도
                </button>
              </div>
            ) : searchResults.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-500">
                검색 결과가 없어요.
              </p>
            ) : (
              <>
                <ul className="grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-2">
                  {searchResults.map((movie) => {
                    const card = toMovieCardModel(movie);

                    return (
                      <li
                        key={movie.id}
                        className="flex min-h-[160px] gap-4 border-b border-slate-200 py-4"
                      >
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="relative h-[144px] w-[96px] shrink-0 overflow-hidden rounded-md bg-slate-200"
                        >
                          {card.posterPath ? (
                            <img
                              src={card.posterPath}
                              alt={`${movie.title} 포스터`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-xs text-slate-500">
                              이미지 없음
                            </span>
                          )}
                        </Link>

                        <div className="min-w-0 py-1">
                          <Link
                            to="/movies/$movieId"
                            params={{ movieId: String(movie.id) }}
                            className="font-semibold text-slate-900 no-underline hover:text-blue-700"
                          >
                            {movie.title}
                          </Link>
                          <p className="mt-1 text-xs text-slate-500">
                            {movie.original_title} ·{" "}
                            {movie.release_date || "개봉일 정보 없음"}
                          </p>
                          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">
                            {movie.overview || "줄거리 정보가 없어요."}
                          </p>
                          <Link
                            to="/movies/$movieId"
                            params={{ movieId: String(movie.id) }}
                            className="mt-2 inline-block text-xs font-semibold text-blue-600 no-underline"
                          >
                            상세 보기 →
                          </Link>
                        </div>

                        <div className="ml-auto shrink-0">
                          <BookmarkButton movieId={movie.id} />
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={changePage}
                  />
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
