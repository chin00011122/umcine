import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { useSignupMutation } from "@/hooks/use-signup-mutation";
import { AuthPage, fieldClass } from "@/components/layout/auth-page";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type FormKey = keyof typeof DEFAULT_FORM;
type FormValue = (typeof DEFAULT_FORM)[FormKey];

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const signupMutation = useSignupMutation();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: FormKey, value: FormValue) {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }

    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const value = form[key].trim();
    setDuplicateCheck((previous) => ({
      ...previous,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(value)
          : await checkNicknameDuplicate(value);
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { isChecking: true, isAvailable: response.available },
      }));
      alert(
        response.available
          ? `사용할 수 있는 ${key === "email" ? "이메일" : "닉네임"}이에요.`
          : `이미 사용 중인 ${key === "email" ? "이메일" : "닉네임"}이에요.`,
      );
    } catch {
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { isChecking: true, isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { ...previous[key], isChecking: false },
      }));
    }
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || signupMutation.isPending) return;

    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
  };

  return (
    <AuthPage>
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="mt-2 text-sm text-slate-500">
          UMCine 계정을 만들어 보세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium">
            이메일
          </label>
          <div className="flex items-start gap-2">
            <input
              id="signup-email"
              className={fieldClass}
              type="email"
              autoComplete="email"
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(event) =>
                handleChangeField("email", event.target.value)
              }
              placeholder="이메일을 입력해 주세요"
              aria-invalid={showEmailError}
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => void handleCheckDuplicate("email")}
              className="mt-2 h-12 shrink-0 rounded-md border border-slate-300 px-3 text-xs disabled:opacity-50"
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              올바른 이메일 주소를 입력해 주세요.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-nickname"
            className="block text-sm font-medium"
          >
            닉네임
          </label>
          <div className="flex items-start gap-2">
            <input
              id="signup-nickname"
              className={fieldClass}
              autoComplete="nickname"
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(event) =>
                handleChangeField("nickname", event.target.value)
              }
              placeholder="2~12자로 입력해 주세요"
              aria-invalid={showNicknameError}
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => void handleCheckDuplicate("nickname")}
              className="mt-2 h-12 shrink-0 rounded-md border border-slate-300 px-3 text-xs disabled:opacity-50"
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}
        </div>

        <label htmlFor="signup-password" className="block text-sm font-medium">
          비밀번호
          <input
            id="signup-password"
            className={fieldClass}
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) =>
              handleChangeField("password", event.target.value)
            }
            placeholder="영문 대소문자·숫자·특수문자 포함 8자 이상"
            aria-invalid={showPasswordError}
          />
          {showPasswordError && (
            <span className="mt-1 block text-xs text-rose-600" role="alert">
              영문 대소문자, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요.
            </span>
          )}
        </label>

        <label
          htmlFor="signup-password-confirm"
          className="block text-sm font-medium"
        >
          비밀번호 확인
          <input
            id="signup-password-confirm"
            className={fieldClass}
            type="password"
            autoComplete="new-password"
            value={form.passwordConfirm}
            onChange={(event) =>
              handleChangeField("passwordConfirm", event.target.value)
            }
            placeholder="비밀번호를 다시 입력해 주세요"
            aria-invalid={showPasswordConfirmError}
          />
          {showPasswordConfirmError && (
            <span className="mt-1 block text-xs text-rose-600" role="alert">
              비밀번호가 일치하지 않아요.
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={!canSubmit || signupMutation.isPending}
          className="h-12 w-full rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {signupMutation.isPending ? "가입 중" : "가입하기"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        이미 계정이 있나요?{" "}
        <Link to="/login" className="font-semibold text-blue-600 no-underline">
          로그인
        </Link>
      </p>
    </AuthPage>
  );
}
