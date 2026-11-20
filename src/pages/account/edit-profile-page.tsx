import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getMe, type MemberInfo } from "@/api/members/me";
import { AuthPage, fieldClass } from "@/components/layout/auth-page";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import { useAuthStore } from "@/stores/auth-store";

export function EditProfilePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"], queryFn: getMe,
    enabled: Boolean(accessToken), staleTime: 5 * 60 * 1000, retry: false,
  });

  if (!accessToken) return <main className="p-8">로그인이 필요해요. <Link to="/login">로그인하기</Link></main>;
  if (meQuery.isLoading) return <main className="p-8">내 정보를 불러오는 중이에요.</main>;
  if (meQuery.isError || !meQuery.data) return <main className="p-8">내 정보를 불러오지 못했어요. <button type="button" onClick={() => void meQuery.refetch()}>다시 시도</button></main>;
  return <EditProfileForm profile={meQuery.data} />;
}

function EditProfileForm({ profile }: { profile: MemberInfo }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile.nickname);
  const updateMeMutation = useUpdateMeMutation();
  const trimmedNickname = nickname.trim();
  const canSubmit = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;
    updateMeMutation.mutate({ nickname: trimmedNickname }, {
      onSuccess: () => { void navigate({ to: "/profile" }); },
    });
  }

  return (
    <AuthPage>
      <div className="mb-7"><h1 className="text-2xl font-bold">내 정보 수정</h1><p className="mt-2 text-sm text-slate-500">프로필 정보를 변경해요.</p></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm font-medium">이메일<input className={`${fieldClass} bg-slate-50 text-slate-500`} type="email" value={profile.email} readOnly /></label>
        <label className="block text-sm font-medium">닉네임<input className={fieldClass} required value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
        <div className="flex gap-3">
          <Link to="/profile" className="grid h-12 flex-1 place-items-center rounded-md border border-slate-300 text-sm font-semibold text-slate-700 no-underline">취소</Link>
          <button type="submit" disabled={!canSubmit || updateMeMutation.isPending} className="h-12 flex-1 rounded-md bg-blue-600 text-sm font-semibold text-white disabled:opacity-50">{updateMeMutation.isPending ? "저장 중" : "저장하기"}</button>
        </div>
      </form>
    </AuthPage>
  );
}
