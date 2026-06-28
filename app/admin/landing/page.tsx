import type { Metadata } from "next";
import { getContent } from "@/lib/content-store";
import { SUPABASE_ADMIN_READY } from "@/lib/supabase";
import { logoutAction } from "@/app/admin/actions";
import LandingEditor from "./LandingEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "랜딩관리", robots: { index: false } };

export default async function AdminLandingPage() {
  const content = await getContent();
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800">
      <header className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">드림상조 · 랜딩관리</span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-neutral-500 hover:text-neutral-800 underline"
            >
              사이트 보기 ↗
            </a>
          </div>
          <form action={logoutAction}>
            <button className="text-sm text-neutral-500 hover:text-neutral-800">
              로그아웃
            </button>
          </form>
        </div>
      </header>

      {!SUPABASE_ADMIN_READY ? (
        <div className="max-w-4xl mx-auto px-5 pt-4">
          <div className="bg-amber-50 border border-amber-300 text-amber-900 text-sm rounded-lg px-4 py-3">
            ⚠️ <strong>SUPABASE_SERVICE_ROLE_KEY</strong>가 설정되지 않아 <strong>저장·이미지
            업로드가 비활성화</strong>됩니다. Supabase(storige) 대시보드 → Settings → API의
            service_role 키를 <code>.env.local</code> 및 Vercel 환경변수에 추가하세요.
          </div>
        </div>
      ) : null}

      <main className="max-w-4xl mx-auto px-5 py-6">
        <LandingEditor initial={content} adminReady={SUPABASE_ADMIN_READY} />
      </main>
    </div>
  );
}
