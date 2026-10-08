import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AuthPage, fieldClass } from "../../components/layout/auth-page";
import { getProfile, saveProfile } from "../../utils/profile";

export function EditProfilePage() {
  const navigate = useNavigate(); const [email, setEmail] = useState(""); const [nickname, setNickname] = useState("");
  useEffect(() => {
    if (sessionStorage.getItem("umcine-logged-in") !== "true") { navigate({ to: "/login" }); return; }
    const profile = getProfile(); if (profile) { setEmail(profile.email); setNickname(profile.nickname); }
  }, [navigate]);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); saveProfile({ email, nickname }); navigate({ to: "/profile" }); }
  return <AuthPage><div className="mb-7"><h1 className="text-2xl font-bold">내 정보 수정</h1><p className="mt-2 text-sm text-slate-500">프로필 정보를 변경해요.</p></div><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-medium">이메일<input className={`${fieldClass} bg-slate-50 text-slate-500`} type="email" value={email} readOnly /></label><label className="block text-sm font-medium">닉네임<input className={fieldClass} required value={nickname} onChange={(e) => setNickname(e.target.value)} /></label><div className="flex gap-3"><Link to="/profile" className="grid h-12 flex-1 place-items-center rounded-md border border-slate-300 text-sm font-semibold text-slate-700 no-underline">취소</Link><button className="h-12 flex-1 rounded-md bg-blue-600 text-sm font-semibold text-white">저장하기</button></div></form></AuthPage>;
}
