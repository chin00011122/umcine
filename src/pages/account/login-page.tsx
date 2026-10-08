import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthPage, fieldClass } from "../../components/layout/auth-page";
import { getProfile } from "../../utils/profile";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const profile = getProfile();
    if (!profile || profile.email !== email) { setMessage("가입된 이메일을 찾을 수 없어요. 먼저 회원가입해 주세요."); return; }
    if (!password) { setMessage("비밀번호를 입력해 주세요."); return; }
    sessionStorage.setItem("umcine-logged-in", "true");
    window.dispatchEvent(new Event("umcine-auth-change"));
    navigate({ to: "/profile" });
  }
  return <AuthPage><div className="mb-8 text-center"><h1 className="text-2xl font-bold">로그인</h1><p className="mt-2 text-sm text-slate-500">UMCine에 오신 것을 환영해요.</p></div><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-medium">이메일<input className={fieldClass} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해 주세요" /></label><label className="block text-sm font-medium">비밀번호<input className={fieldClass} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력해 주세요" /></label>{message && <p role="alert" className="text-sm text-red-600">{message}</p>}<button className="h-12 w-full rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">로그인</button></form><p className="mt-6 text-center text-sm text-slate-500">처음이신가요? <Link to="/signup" className="font-semibold text-blue-600 no-underline">회원가입</Link></p></AuthPage>;
}
