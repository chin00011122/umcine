import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
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

        <div className="absolute right-3 top-3"><BookmarkButton movieId={movie.id} /></div>
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
