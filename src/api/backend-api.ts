const backendBaseUrl = import.meta.env.VITE_BACKEND_API_BASE_URL ?? "http://localhost:8080";

export interface AvailabilityResponse {
  available: boolean;
}

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

async function getJson<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${backendBaseUrl}${path}`);
  } catch {
    throw new Error("백엔드에 연결하지 못했어요. 서버 실행 주소와 CORS 설정을 확인해 주세요.");
  }

  if (!response.ok) {
    throw new Error(`백엔드 요청에 실패했어요. (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function checkNickname(nickname: string): Promise<AvailabilityResponse> {
  return getJson(`/members/nickname/${encodeURIComponent(nickname)}`);
}

export function checkEmail(email: string): Promise<AvailabilityResponse> {
  return getJson(`/members/email/${encodeURIComponent(email)}`);
}

export function getMemberRatings(memberId: number): Promise<RatingResponse[]> {
  return getJson(`/members/${memberId}/ratings`);
}
