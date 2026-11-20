import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  function logout() {
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: ["members", "me"] });
    sessionStorage.removeItem("umcine-logged-in");
    void navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center px-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold text-slate-950 no-underline"
        >
          <img src="/icons/movie.svg" alt="" className="h-7 w-7" />
          UMCine
        </Link>
        <nav className="ml-5 flex h-full items-center gap-3 sm:ml-12 sm:gap-8">
          <Link
            to="/"
            className={`relative flex h-full items-center text-xs no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:content-[''] sm:text-sm ${pathname === "/" ? "font-bold text-slate-950 after:bg-slate-950" : "text-slate-500 after:bg-transparent hover:text-slate-950"}`}
          >
            영화
          </Link>
          <Link
            to="/search"
            className={`relative flex h-full items-center text-xs no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:content-[''] sm:text-sm ${pathname === "/search" ? "font-bold text-slate-950 after:bg-slate-950" : "text-slate-500 after:bg-transparent hover:text-slate-950"}`}
          >
            검색
          </Link>
          {accessToken && !meQuery.isLoading && !meQuery.isError && (
            <Link
              to="/profile"
              className={`relative flex h-full items-center text-xs no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:content-[''] sm:text-sm ${pathname.startsWith("/profile") ? "font-bold text-slate-950 after:bg-slate-950" : "text-slate-500 after:bg-transparent hover:text-slate-950"}`}
            >
              내 정보
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-slate-100"
          >
            <img src="/icons/search.svg" alt="" className="h-5 w-5" />
          </Link>
          {!accessToken ? (
            <Link
              to="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" aria-label="내 정보 불러오는 중" />
          ) : meQuery.isError ? (
            <button type="button" onClick={() => void meQuery.refetch()} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700">
              내 정보 다시 불러오기
            </button>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
