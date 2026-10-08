import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full shadow-md transition hover:scale-105 active:scale-95",
        isBookmarked ? "bg-blue-600" : "bg-black/60",
      )}
      type="button"
      aria-label={isBookmarked ? "북마크에서 삭제" : "북마크에 추가"}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className="h-6 w-6 brightness-0 invert"
      />
    </button>
  );
}
