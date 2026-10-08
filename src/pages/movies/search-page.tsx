import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  useEffect(() => setSearchText(query ?? ""), [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const results = normalizedQuery
    ? movies.filter((movie) => movie.title.toLowerCase().includes(normalizedQuery) || movie.originalTitle.toLowerCase().includes(normalizedQuery))
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-[1120px]">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-950">영화 검색</h1>
        <form onSubmit={handleSubmit} className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
          <img src="/icons/search.svg" alt="" className="h-4 w-4 opacity-60" />
          <input aria-label="검색어" placeholder="예: 스파이더맨" value={searchText} onChange={(event) => setSearchText(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none" />
          <button type="submit" className="rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white">검색</button>
        </form>

        {!normalizedQuery ? <p className="py-10 text-center text-sm text-slate-500">검색어를 입력해 주세요.</p> : (
          <section className="mt-7">
            <h2 className="mb-5 text-sm font-semibold text-slate-800">‘{query}’ 검색 결과 <span className="ml-1 font-normal text-slate-500">{results.length}편</span></h2>
            {results.length === 0 ? <p className="py-16 text-center text-sm text-slate-500">검색 결과가 없어요.</p> : (
              <ul className="grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-2">
                {results.map((movie) => (
                  <li key={movie.id} className="flex min-h-[160px] gap-4 border-b border-slate-200 py-4">
                    <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="h-[144px] w-[96px] shrink-0 overflow-hidden rounded-md bg-slate-200">
                      <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-full w-full object-cover" />
                    </Link>
                    <div className="min-w-0 py-1">
                      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="font-semibold text-slate-900 no-underline hover:text-blue-700">{movie.title}</Link>
                      <p className="mt-1 text-xs text-slate-500">{movie.originalTitle} · {movie.releaseDate}</p>
                      <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">{movie.overview}</p>
                      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-2 inline-block text-xs font-semibold text-blue-600 no-underline">상세 보기 →</Link>
                    </div>
                    <div className="ml-auto shrink-0"><BookmarkButton movieId={movie.id} /></div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
