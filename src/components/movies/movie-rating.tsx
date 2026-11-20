import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { getMemberRatings } from "@/api/backend-api";
import { createRating, updateRating, deleteRating } from "@/api/members/ratings";
import { useAuthStore } from "@/stores/auth-store";

export function MovieRating({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const [memberIdInput, setMemberIdInput] = useState("");
  const [memberId, setMemberId] = useState<number | null>(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const ratings = useQuery({ queryKey: ["members", memberId, "ratings"], queryFn: () => getMemberRatings(memberId!), enabled: memberId !== null });
  const existing = ratings.data?.find((rating) => rating.movieId === movieId);
  const mutation = useMutation({
    mutationFn: (action: "save" | "delete") => action === "delete" && existing
      ? deleteRating(existing.ratingId)
      : existing ? updateRating(existing.ratingId, { score, comment }) : createRating(movieId, { score, comment }),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["members", memberId, "ratings"] }); },
  });
  function lookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = Number(memberIdInput);
    if (Number.isInteger(id) && id > 0) setMemberId(id);
  }
  return <section className="mx-auto max-w-[1000px] px-5 pb-16">
    <h2 className="text-xl font-bold">평점</h2>
    <p className="mt-2 text-sm text-slate-600">회원 ID를 입력해 이 영화의 평점을 조회하세요.</p>
    <form onSubmit={lookup} className="mt-3 flex gap-2"><input aria-label="회원 ID" type="number" min="1" required value={memberIdInput} onChange={(e) => setMemberIdInput(e.target.value)} className="w-32 rounded border p-2"/><button className="rounded bg-slate-800 px-4 text-white">조회</button></form>
    {ratings.isFetching && <p>평점을 불러오는 중이에요.</p>}
    {ratings.isError && <p role="alert">평점을 불러오지 못했어요.</p>}
    {ratings.isSuccess && <p className="mt-3">{existing ? `평점 ${existing.score}/5 · ${existing.comment || "코멘트 없음"}` : "이 영화에 등록된 평점이 없어요."}</p>}
    {token && memberId !== null && ratings.isSuccess && <div className="mt-4 space-y-3"><p className="text-sm">본인의 회원 ID로 조회한 평점만 수정하거나 삭제할 수 있어요.</p><label>평점 <select value={score} onChange={(e) => setScore(Number(e.target.value))}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</select></label><textarea aria-label="평점 코멘트" maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} className="block w-full rounded border p-2" /><button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate("save")} className="mr-2 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{mutation.isPending ? "처리 중" : existing ? "평점 수정" : "평점 등록"}</button>{existing && <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate("delete")} className="rounded border px-4 py-2">평점 삭제</button>}{mutation.isError && <p role="alert">요청에 실패했어요. 본인의 평점인지 확인해 주세요.</p>}</div>}
  </section>;
}
