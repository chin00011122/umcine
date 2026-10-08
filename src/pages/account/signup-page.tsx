import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthPage, fieldClass } from "../../components/layout/auth-page";
import { getProfile, saveProfile } from "../../utils/profile";

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [nickname, setNickname] = useState(""); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (getProfile()?.email === email) { setMessage("이미 가입된 이메일이에요."); return; }
    if (password.length < 8) { setMessage("비밀번호를 8자리 이상 입력해 주세요."); return; }
    if (password !== confirm) { setMessage("비밀번호가 일치하지 않아요."); return; }
    saveProfile({ email, nickname }); sessionStorage.setItem("umcine-logged-in", "true"); window.dispatchEvent(new Event("umcine-auth-change")); navigate({ to: "/profile" });
  }
  return <AuthPage><div className="mb-7 text-center"><h1 className="text-2xl font-bold">회원가입</h1><p className="mt-2 text-sm text-slate-500">UMCine 계정을 만들어 보세요.</p></div><form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">이메일<div className="flex gap-2"><input className={fieldClass} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" /><button type="button" onClick={() => setMessage(email.includes("@") ? "사용할 수 있는 이메일이에요." : "올바른 이메일을 입력해 주세요.")} className="mt-2 shrink-0 rounded-md border border-slate-300 px-3 text-xs">중복 확인</button></div></label><label className="block text-sm font-medium">닉네임<div className="flex gap-2"><input className={fieldClass} required value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" /><button type="button" onClick={() => setMessage(nickname.trim() ? "사용할 수 있는 닉네임이에요." : "닉네임을 입력해 주세요.")} className="mt-2 shrink-0 rounded-md border border-slate-300 px-3 text-xs">중복 확인</button></div></label><label className="block text-sm font-medium">비밀번호<input className={fieldClass} type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자리 이상 입력해 주세요" /></label><label className="block text-sm font-medium">비밀번호 확인<input className={fieldClass} type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="비밀번호를 다시 입력해 주세요" /></label>{message && <p role="status" className="text-sm text-blue-600">{message}</p>}<button className="h-12 w-full rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">가입하기</button></form><p className="mt-5 text-center text-sm text-slate-500">이미 계정이 있나요? <Link to="/login" className="font-semibold text-blue-600 no-underline">로그인</Link></p></AuthPage>;
}
