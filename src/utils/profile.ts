import type { UserProfile } from "../types/user";

const PROFILE_KEY = "umcine-profile";

export function getProfile(): UserProfile | null {
  const value = localStorage.getItem(PROFILE_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
