import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const update = () => setLoggedIn(sessionStorage.getItem("umcine-logged-in") === "true");
    update();
    window.addEventListener("storage", update);
    window.addEventListener("umcine-auth-change", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("umcine-auth-change", update);
    };
  }, [pathname]);

  function logout() {
    sessionStorage.removeItem("umcine-logged-in");
    setLoggedIn(false);
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-slate-950 no-underline">
          <img src="/icons/movie.svg" alt="" className="h-7 w-7" />
          UMCine
        </Link>
        <nav className="ml-5 flex h-full items-center gap-3 sm:ml-12 sm:gap-8">
          <Link to="/" className={`relative flex h-full items-center text-xs no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:content-[''] sm:text-sm ${pathname === "/" ? "font-bold text-slate-950 after:bg-slate-950" : "text-slate-500 after:bg-transparent hover:text-slate-950"}`}>영화</Link>
          <Link to="/search" className={`relative flex h-full items-center text-xs no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:content-[''] sm:text-sm ${pathname === "/search" ? "font-bold text-slate-950 after:bg-slate-950" : "text-slate-500 after:bg-transparent hover:text-slate-950"}`}>검색</Link>
          {loggedIn && <Link to="/profile" className={`relative flex h-full items-center text-xs no-underline after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:content-[''] sm:text-sm ${pathname.startsWith("/profile") ? "font-bold text-slate-950 after:bg-slate-950" : "text-slate-500 after:bg-transparent hover:text-slate-950"}`}>내 정보</Link>}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <Link to="/search" aria-label="검색" className="grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-slate-100">
            <img src="/icons/search.svg" alt="" className="h-5 w-5" />
          </Link>
          {loggedIn ? <button onClick={logout} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">로그아웃</button> : <Link to="/login" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700">로그인</Link>}
        </div>
      </div>
    </header>
  );
}
