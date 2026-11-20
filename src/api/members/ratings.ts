import { authApi } from "@/api/auth-api";
import type { RatingResponse } from "@/api/backend-api";

export interface RatingInput { score: number; comment: string }
interface RatingEnvelope { result: RatingResponse }

export const createRating = (movieId: number, input: RatingInput) =>
  authApi.post("ratings", { json: { movieId, ...input } }).json<RatingEnvelope>();
export const updateRating = (ratingId: number, input: RatingInput) =>
  authApi.patch(`ratings/${ratingId}`, { json: input }).json<RatingEnvelope>();
export const deleteRating = (ratingId: number) =>
  authApi.delete(`ratings/${ratingId}`).json();
