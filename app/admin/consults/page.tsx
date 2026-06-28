import type { Metadata } from "next";
import { getConsults } from "@/lib/consults";
import AdminNav from "@/app/admin/AdminNav";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "상담내역", robots: { index: false } };

function fmtKST(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function ConsultsPage() {
  const { rows, error } = await getConsults();
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800">
      <AdminNav active="consults" />
      <main className="max-w-5xl mx-auto px-5 py-6">
        <h1 className="text-lg font-semibold mb-4">
          상담 신청 내역{" "}
          <span className="text-neutral-400 font-normal">({rows.length})</span>
        </h1>

        {error ? (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 text-sm rounded-lg px-4 py-3">
            ⚠️ 상담내역을 불러오지 못했습니다: {error}
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl px-5 py-12 text-center text-neutral-400 text-sm">
            아직 접수된 상담이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-neutral-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{r.name}</span>
                    <a
                      href={`tel:${r.phone.replace(/\D/g, "")}`}
                      className="text-sm text-emerald-700 hover:underline"
                    >
                      {r.phone}
                    </a>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {r.inquiry_type}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 whitespace-nowrap">
                    {fmtKST(r.created_at)}
                  </span>
                </div>
                {r.message ? (
                  <p className="mt-2 text-sm text-neutral-600 whitespace-pre-wrap">
                    {r.message}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
