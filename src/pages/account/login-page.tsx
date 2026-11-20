import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthPage, fieldClass } from "../../components/layout/auth-page";
import { useLoginMutation } from "@/hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };
  return (
    <AuthPage>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="mt-2 text-sm text-slate-500">
          UMCine에 오신 것을 환영해요.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm font-medium">
          이메일
          <input
            className={fieldClass}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해 주세요"
          />
        </label>
        <label className="block text-sm font-medium">
          비밀번호
          <input
            className={fieldClass}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
          />
        </label>
        <button type="submit" disabled={!canSubmit || loginMutation.isPending} className="h-12 w-full rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        처음이신가요?{" "}
        <Link to="/signup" className="font-semibold text-blue-600 no-underline">
          회원가입
        </Link>
      </p>
    </AuthPage>
  );
}
