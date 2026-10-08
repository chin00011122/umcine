import type { ReactNode } from "react";

export function AuthPage({ children }: { children: ReactNode }) {
  return <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-[#f5f6f8] px-5 py-12"><div className="w-full max-w-[440px] rounded-xl bg-white p-7 shadow-sm sm:p-10">{children}</div></main>;
}

export const fieldClass = "mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
