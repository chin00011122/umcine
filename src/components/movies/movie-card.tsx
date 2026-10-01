import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="group mx-auto w-full min-w-0 max-w-[360px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[14px] bg-[#eee] shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          className={cn(
            "absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border-0 p-0 shadow-[0_3px_12px_rgba(0,0,0,0.16)] transition-[transform,background] duration-150 hover:scale-[1.06] hover:bg-white active:scale-[0.95]",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          type="button"
          aria-label={movie.isBookmarked ? "북마크에서 삭제" : "북마크에 추가"}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            className="h-6 w-6 brightness-0 invert"
            alt=""
          />
        </button>
      </div>

      <div className="px-[2px] pt-[14px]">
        <h2 className="truncate text-[17px] font-bold leading-[1.4] text-[#161616]">
          {movie.title}
        </h2>

        <p className="mt-1 truncate text-[13px] leading-[1.4] text-[#8a8a8a]">
          {movie.originalTitle}
        </p>

        <div className="mt-2 flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-xs text-[#666]">
          <span>{movie.releaseDate}</span>
          <span className="text-[#bbb]">•</span>
          <span>{movie.genres.join(" · ")}</span>
        </div>
      </div>
    </article>
  );
}
