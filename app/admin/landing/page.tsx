import type { Metadata } from "next";
import { getContent } from "@/lib/content-store";
import { SUPABASE_ADMIN_READY } from "@/lib/supabase";
import AdminNav from "@/app/admin/AdminNav";
import LandingEditor from "./LandingEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "랜딩관리", robots: { index: false } };

export default async function AdminLandingPage() {
  const content = await getContent();
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800">
      <AdminNav active="landing" />

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
