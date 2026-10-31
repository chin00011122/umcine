import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { checkEmail, checkNickname } from "../../api/backend-api";
import { AuthPage, fieldClass } from "../../components/layout/auth-page";
import { getProfile, saveProfile } from "../../utils/profile";

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);

  async function handleEmailCheck() {
    const value = email.trim();
    if (!value) {
      setEmailMessage("이메일을 입력해 주세요.");
      setEmailAvailable(null);
      return;
    }

    setCheckingEmail(true);
    try {
      const result = await checkEmail(value);
      setEmailAvailable(result.available);
      setEmailMessage(result.available ? "사용할 수 있는 이메일이에요." : "이미 사용 중인 이메일이에요.");
    } catch (error) {
      setEmailAvailable(null);
      setEmailMessage(error instanceof Error ? error.message : "이메일 확인에 실패했어요.");
    } finally {
      setCheckingEmail(false);
    }
  }

  async function handleNicknameCheck() {
    const value = nickname.trim();
    if (!value) {
      setNicknameMessage("닉네임을 입력해 주세요.");
      setNicknameAvailable(null);
      return;
    }

    setCheckingNickname(true);
    try {
      const result = await checkNickname(value);
      setNicknameAvailable(result.available);
      setNicknameMessage(result.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch (error) {
      setNicknameAvailable(null);
      setNicknameMessage(error instanceof Error ? error.message : "닉네임 확인에 실패했어요.");
    } finally {
      setCheckingNickname(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (emailAvailable !== true || nicknameAvailable !== true) {
      setMessage("이메일과 닉네임 중복 확인을 먼저 완료해 주세요.");
      return;
    }
    if (getProfile()?.email === email) {
      setMessage("이미 이 브라우저에 저장된 이메일이에요.");
      return;
    }
    if (password.length < 8) {
      setMessage("비밀번호를 8자리 이상 입력해 주세요.");
      return;
    }
    if (password !== confirm) {
      setMessage("비밀번호가 일치하지 않아요.");
      return;
    }

    saveProfile({ email, nickname });
    sessionStorage.setItem("umcine-logged-in", "true");
    window.dispatchEvent(new Event("umcine-auth-change"));
    navigate({ to: "/profile" });
  }

  return (
    <AuthPage>
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="mt-2 text-sm text-slate-500">UMCine 계정을 만들어 보세요.</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium">
          이메일
          <div className="flex gap-2">
            <input
              className={fieldClass}
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailAvailable(null);
                setEmailMessage("");
              }}
              placeholder="이메일"
            />
            <button
              type="button"
              onClick={handleEmailCheck}
              disabled={checkingEmail}
              className="mt-2 shrink-0 rounded-md border border-slate-300 px-3 text-xs disabled:opacity-50"
            >
              {checkingEmail ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {emailMessage && (
            <p className={`mt-1 text-xs ${emailAvailable ? "text-emerald-700" : "text-rose-600"}`} role="status">
              {emailMessage}
            </p>
          )}
        </label>

        <label className="block text-sm font-medium">
          닉네임
          <div className="flex gap-2">
            <input
              className={fieldClass}
              required
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setNicknameAvailable(null);
                setNicknameMessage("");
              }}
              placeholder="닉네임"
            />
            <button
              type="button"
              onClick={handleNicknameCheck}
              disabled={checkingNickname}
              className="mt-2 shrink-0 rounded-md border border-slate-300 px-3 text-xs disabled:opacity-50"
            >
              {checkingNickname ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {nicknameMessage && (
            <p className={`mt-1 text-xs ${nicknameAvailable ? "text-emerald-700" : "text-rose-600"}`} role="status">
              {nicknameMessage}
            </p>
          )}
        </label>

        <label className="block text-sm font-medium">
          비밀번호
          <input
            className={fieldClass}
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8자리 이상 입력해 주세요"
          />
        </label>
        <label className="block text-sm font-medium">
          비밀번호 확인
          <input
            className={fieldClass}
            type="password"
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="비밀번호를 다시 입력해 주세요"
          />
        </label>
        {message && <p role="status" className="text-sm text-blue-600">{message}</p>}
        <button className="h-12 w-full rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">
          가입하기
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        이미 계정이 있나요? <Link to="/login" className="font-semibold text-blue-600 no-underline">로그인</Link>
      </p>
    </AuthPage>
  );
}
