import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) return <main className="grid min-h-[60vh] place-items-center text-slate-600">영화를 찾을 수 없어요.</main>;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8]">
      <section className="relative h-[360px] overflow-hidden bg-slate-900 sm:h-[470px]">
        <img src={movie.backdropPath} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f6f8] via-black/20 to-black/20" />
        <div className="relative mx-auto flex h-full max-w-[1120px] items-start px-5 pt-8 sm:px-8">
          <Link to="/" className="rounded-full bg-black/35 px-4 py-2 text-sm text-white no-underline backdrop-blur">← 영화 목록</Link>
        </div>
      </section>
      <section className="relative mx-auto -mt-40 flex max-w-[1000px] flex-col gap-8 px-5 pb-16 sm:-mt-44 sm:flex-row sm:px-8">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="relative z-10 mx-auto aspect-[2/3] w-48 shrink-0 rounded-xl object-cover shadow-2xl sm:mx-0 sm:w-64" />
        <div className="relative z-10 min-w-0 self-end rounded-xl bg-white/95 p-6 shadow-lg sm:mb-1 sm:p-8">
          <p className="text-sm font-medium text-blue-600">{movie.genres.join(" · ")} <span className="px-1 text-slate-300">|</span> {movie.runtime}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{movie.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{movie.originalTitle}</p>
          <p className="mt-4 text-sm text-slate-500">개봉일 {movie.releaseDate}</p>
          <div className="my-6 h-px bg-slate-200" />
          <div className="flex items-center justify-between gap-4"><h2 className="text-lg font-semibold text-slate-900">{movie.tagline}</h2><BookmarkButton movieId={movie.id} /></div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{movie.overview}</p>
        </div>
      </section>
    </main>
  );
}
