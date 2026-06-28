import { supabaseAdmin } from "@/lib/supabase";

/**
 * 상담 신청 내역 — 개인정보 포함. 비공개 테이블(서버 service_role만 접근).
 * 저장: 공개 상담 폼(API)에서 호출. 조회: 관리자 페이지에서만.
 */

const TABLE = "dreamcoop_consults";

export type Consult = {
  id: string;
  name: string;
  phone: string;
  inquiry_type: string;
  message: string;
  status: string;
  created_at: string;
};

export async function saveConsult(input: {
  name: string;
  phone: string;
  inquiryType: string;
  message: string;
}): Promise<void> {
  const sb = supabaseAdmin();
  if (!sb) throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
  const { error } = await sb.from(TABLE).insert({
    name: input.name,
    phone: input.phone,
    inquiry_type: input.inquiryType,
    message: input.message,
  });
  if (error) throw new Error(error.message);
}

export async function getConsults(): Promise<{ rows: Consult[]; error?: string }> {
  const sb = supabaseAdmin();
  if (!sb) return { rows: [], error: "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다." };
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as Consult[] };
}
