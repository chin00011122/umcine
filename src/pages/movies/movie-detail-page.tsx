import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { toMovieDetailModel } from "../../utils/movies/movie-adapter";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const details = movieDetailQuery.data
    ? toMovieDetailModel(movieDetailQuery.data)
    : null;
  return (
    <>
      {!isValidMovieId ? (
        <p>올바르지 않은 영화 번호예요.</p>
      ) : movieDetailQuery.isPending ? (
        <p>영화 상세 정보를 불러오는 중이에요.</p>
      ) : movieDetailQuery.isError ? (
        <div>
          <p>{getMovieDetailErrorMessage(movieDetailQuery.error)}</p>
          <button onClick={() => void movieDetailQuery.refetch()}>
            다시 시도
          </button>
        </div>
      ) : details ? (
        <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8]">
          <section className="relative h-[360px] overflow-hidden bg-slate-900 sm:h-[470px]">
            {details.backdropPath ? (
              <img
                src={details.backdropPath}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-55"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#f5f6f8] via-black/20 to-black/20" />
            <div className="relative mx-auto flex h-full max-w-[1120px] items-start px-5 pt-8 sm:px-8">
              <Link
                to="/"
                className="rounded-full bg-black/35 px-4 py-2 text-sm text-white no-underline backdrop-blur"
              >
                ← 영화 목록
              </Link>
            </div>
          </section>

          <section className="relative mx-auto -mt-40 flex max-w-[1000px] flex-col gap-8 px-5 pb-16 sm:-mt-44 sm:flex-row sm:px-8">
            <div className="relative z-10 mx-auto aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-2xl sm:mx-0 sm:w-64">
              {details.posterPath ? (
                <img
                  src={details.posterPath}
                  alt={`${details.title} 포스터`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="grid h-full place-items-center text-sm text-slate-500">
                  이미지 없음
                </span>
              )}
            </div>

            <div className="relative z-10 min-w-0 self-end rounded-xl bg-white/95 p-6 shadow-lg sm:mb-1 sm:p-8">
              <p className="text-sm font-medium text-blue-600">
                {details.genres.join(" · ") || "장르 정보가 없어요."}{" "}
                <span className="px-1 text-slate-300">|</span> {details.runtime}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {details.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {details.originalTitle}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                개봉일 {details.releaseDate || "정보 없음"}
              </p>
              <div className="my-6 h-px bg-slate-200" />
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {details.tagline || ""}
                </h2>
                <BookmarkButton movieId={details.id} />
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {details.overview || "줄거리 정보가 없어요."}
              </p>
            </div>
          </section>
        </main>
      ) : (
        <p>영화 정보를 찾을 수 없어요.</p>
      )}
    </>
  );
}
