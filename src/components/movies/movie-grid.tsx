import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  compact?: boolean;
}

export default function MovieGrid({
  movies,
  compact = false,
}: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="empty-message">표시할 영화가 없어요.</p>;
  }

  return (
    <section className={`grid items-start gap-x-4 gap-y-8 sm:gap-x-5 ${compact ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
