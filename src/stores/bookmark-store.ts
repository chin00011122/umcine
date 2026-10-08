import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { movies } from "../data/movies";
import { readBookmarkIds } from "../utils/bookmark-storage";

const validMovieIds = new Set(movies.map((movie) => movie.id));

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
        bookmarkedMovieIds: readBookmarkIds(),
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      migrate: (persistedState) => {
        const saved = persistedState as Partial<BookmarkStore> | undefined;
        const ids = Array.isArray(saved?.bookmarkedMovieIds)
          ? saved.bookmarkedMovieIds
          : [];
        return {
          bookmarkedMovieIds: ids.filter(
            (id): id is number =>
              typeof id === "number" && Number.isInteger(id) && validMovieIds.has(id),
          ),
        };
      },
      merge: (persistedState, currentState) => {
        const saved = persistedState as Partial<BookmarkStore> | undefined;
        const ids = Array.isArray(saved?.bookmarkedMovieIds)
          ? saved.bookmarkedMovieIds.filter(
              (id): id is number =>
                typeof id === "number" && Number.isInteger(id) && validMovieIds.has(id),
            )
          : [];
        return { ...currentState, bookmarkedMovieIds: ids };
      },
    },
  ),
);
