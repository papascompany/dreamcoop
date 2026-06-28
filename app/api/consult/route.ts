import { NextResponse } from "next/server";
import { deliverConsult, type ConsultPayload } from "@/lib/notify";
import { saveConsult } from "@/lib/consults";
import { contact } from "@/lib/content";

/**
 * 상담 신청 접수.
 * 클라이언트를 신뢰하지 않고 서버에서도 검증한다. 현재는 안전한 stub(마스킹 로깅).
 * 운영 시 lib/notify.ts 의 deliverConsult 만 실연동으로 교체하면 된다.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  // ⚠️ 과거 honeypot(숨김 필드) 무음 폐기는 자동완성이 그 필드를 채우면 진짜 문의를
  //    잃게 만들어 제거함. 검증을 통과한 제출은 무조건 저장한다.
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const inquiryType =
    typeof body.inquiryType === "string" ? body.inquiryType : contact.inquiryTypes[0];
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 40) {
    return NextResponse.json({ error: "성함을 확인해 주세요." }, { status: 422 });
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 9 || phoneDigits.length > 11) {
    return NextResponse.json(
      { error: "연락처를 정확히 입력해 주세요." },
      { status: 422 },
    );
  }
  if (!contact.inquiryTypes.includes(inquiryType as (typeof contact.inquiryTypes)[number])) {
    return NextResponse.json({ error: "문의 유형을 확인해 주세요." }, { status: 422 });
  }
  if (message.length > 2000) {
    return NextResponse.json(
      { error: "남기실 말씀이 너무 깁니다." },
      { status: 422 },
    );
  }

  const payload: ConsultPayload = { name, phone, inquiryType, message };

  try {
    // DB 저장(관리자 '상담내역'의 원천) — 가장 중요한 영속화.
    await saveConsult(payload);
  } catch (e) {
    console.error("[consult] 저장 실패", e);
    return NextResponse.json(
      { error: "접수 처리 중 문제가 발생했습니다. 대표전화로 연락 주세요." },
      { status: 500 },
    );
  }

  // 알림(이메일/웹훅)은 best-effort — 실패해도 접수 자체는 성공으로 처리.
  try {
    await deliverConsult(payload);
  } catch (e) {
    console.error("[consult] 알림 실패", e);
  }

  return NextResponse.json({ ok: true });
}
