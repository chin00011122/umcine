import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { getMemberRatings, type RatingResponse } from "../../api/backend-api";
import type { UserProfile } from "../../types/user";
import { getProfile } from "../../utils/profile";

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<RatingResponse[] | null>(null);
  const [ratingsMessage, setRatingsMessage] = useState("");
  const [loadingRatings, setLoadingRatings] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("umcine-logged-in") !== "true") {
      navigate({ to: "/login" });
      return;
    }
    setProfile(getProfile());
  }, [navigate]);

  async function loadRatings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = Number(memberId);
    if (!Number.isInteger(id) || id < 1) {
      setRatingsMessage("1 이상의 회원 ID를 입력해 주세요.");
      setRatings(null);
      return;
    }

    setLoadingRatings(true);
    setRatingsMessage("");
    try {
      setRatings(await getMemberRatings(id));
    } catch (error) {
      setRatings(null);
      setRatingsMessage(error instanceof Error ? error.message : "평점 조회에 실패했어요.");
    } finally {
      setLoadingRatings(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("umcine-logged-in");
    navigate({ to: "/" });
  }

  if (!profile) return <main className="min-h-[60vh] bg-[#f5f6f8]" />;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f5f6f8] px-5 py-12 sm:px-8">
      <section className="mx-auto max-w-[760px]">
        <h1 className="mb-7 text-2xl font-bold">내 정보</h1>
        <div className="rounded-xl bg-white p-7 shadow-sm sm:p-9">
          <div className="flex items-center gap-5 border-b border-slate-200 pb-7">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
              {profile.nickname.slice(0, 1)}
            </div>
            <div>
              <p className="text-xl font-bold">{profile.nickname}</p>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
            </div>
          </div>
          <dl className="grid gap-5 py-7 text-sm sm:grid-cols-[140px_1fr]">
            <dt className="font-semibold text-slate-500">닉네임</dt><dd>{profile.nickname}</dd>
            <dt className="font-semibold text-slate-500">이메일</dt><dd>{profile.email}</dd>
          </dl>
          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
            <Link to="/profile/edit" className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline">
              내 정보 수정
            </Link>
            <button onClick={logout} className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
              로그아웃
            </button>
          </div>
        </div>

        <section className="mt-7 rounded-xl bg-white p-7 shadow-sm sm:p-9" aria-labelledby="ratings-title">
          <h2 id="ratings-title" className="text-xl font-bold">회원별 평점 조회</h2>
          <p className="mt-2 text-sm text-slate-500">테스트할 회원 ID를 입력하면 백엔드에서 평점 목록을 불러옵니다.</p>
          <form onSubmit={loadRatings} className="mt-5 flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="rating-member-id">회원 ID</label>
            <input
              id="rating-member-id"
              className="h-11 w-36 rounded-md border border-slate-300 px-3 text-sm"
              type="number"
              min="1"
              required
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              placeholder="회원 ID"
            />
            <button
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              disabled={loadingRatings}
            >
              {loadingRatings ? "불러오는 중" : "평점 불러오기"}
            </button>
          </form>
          {ratingsMessage && <p role="status" className="mt-4 text-sm text-rose-600">{ratingsMessage}</p>}
          {ratings && (
            <div className="mt-5 space-y-3" role="status">
              {ratings.length === 0 ? (
                <p className="text-sm text-slate-500">등록된 평점이 없습니다.</p>
              ) : ratings.map((rating) => (
                <article key={rating.ratingId} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-semibold">영화 ID {rating.movieId} · 평점 {rating.score}/5</p>
                  <p className="mt-1 text-sm text-slate-600">{rating.comment ?? "코멘트 없음"}</p>
                  <p className="mt-2 text-xs text-slate-400">등록: {new Date(rating.createdAt).toLocaleString()}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
