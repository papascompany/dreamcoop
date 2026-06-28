"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-6">
      <form
        action={action}
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 space-y-4"
      >
        <div>
          <h1 className="text-lg font-semibold text-neutral-800">드림상조 · 랜딩관리</h1>
          <p className="text-sm text-neutral-500 mt-1">관리자 비밀번호를 입력하세요.</p>
        </div>
        <input type="hidden" name="next" value={next} />
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="비밀번호"
          className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-neutral-500"
        />
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
        >
          {pending ? "확인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}
