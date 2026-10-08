import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { UserProfile } from "../../types/user";
import { getProfile } from "../../utils/profile";

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    if (sessionStorage.getItem("umcine-logged-in") !== "true") { navigate({ to: "/login" }); return; }
    setProfile(getProfile());
  }, [navigate]);
  function logout() { sessionStorage.removeItem("umcine-logged-in"); navigate({ to: "/" }); }
  if (!profile) return <main className="min-h-[60vh] bg-[#f5f6f8]" />;
  return <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8] px-5 py-12 sm:px-8"><section className="mx-auto max-w-[760px]"><h1 className="mb-7 text-2xl font-bold">내 정보</h1><div className="rounded-xl bg-white p-7 shadow-sm sm:p-9"><div className="flex items-center gap-5 border-b border-slate-200 pb-7"><div className="grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">{profile.nickname.slice(0, 1)}</div><div><p className="text-xl font-bold">{profile.nickname}</p><p className="mt-1 text-sm text-slate-500">{profile.email}</p></div></div><dl className="grid gap-5 py-7 text-sm sm:grid-cols-[140px_1fr]"><dt className="font-semibold text-slate-500">닉네임</dt><dd>{profile.nickname}</dd><dt className="font-semibold text-slate-500">이메일</dt><dd>{profile.email}</dd></dl><div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6"><Link to="/profile/edit" className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline">내 정보 수정</Link><button onClick={logout} className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">로그아웃</button></div></div></section></main>;
}
