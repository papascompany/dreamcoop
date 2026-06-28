/**
 * 상담 신청 처리 추상화 레이어.
 *
 * 환경변수로 발송 채널을 선택한다(코드 변경 없이 활성화):
 *   1) CONSULT_WEBHOOK_URL  — POST로 페이로드 전달(Slack/알림톡 게이트웨이/Zapier 등)
 *   2) RESEND_API_KEY + CONSULT_TO_EMAIL — Resend REST API로 이메일 발송(SDK 불필요)
 *   3) (미설정) — 안전한 stub: 마스킹 로깅만. 운영 전까지 실데이터 유출 없음.
 *
 * ⚠️ 개인정보: 상조 상담은 민감정보가 포함될 수 있다. 로그에는 마스킹된 값만 남기고,
 *   실제 보관/전송은 동의·보관기간·암호화 정책을 갖춘 채널로만 한다.
 */

export type ConsultPayload = {
  name: string;
  phone: string;
  inquiryType: string;
  message: string;
};

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return "***";
  return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
}

function maskName(name: string): string {
  if (name.length <= 1) return "*";
  return `${name[0]}${"*".repeat(name.length - 1)}`;
}

export async function deliverConsult(payload: ConsultPayload): Promise<void> {
  const webhookUrl = process.env.CONSULT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONSULT_TO_EMAIL;

  // 1) 웹훅 (Slack/알림톡 게이트웨이/Zapier 등)
  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "consult", ...payload }),
    });
    if (!res.ok) throw new Error(`consult webhook failed: ${res.status}`);
    return;
  }

  // 2) Resend 이메일 (REST API — SDK 의존성 없음)
  if (resendKey && toEmail) {
    const from = process.env.CONSULT_FROM_EMAIL ?? "onboarding@resend.dev";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [toEmail],
        subject: `[드림상조 상담신청] ${payload.name} 님 · ${payload.inquiryType}`,
        text: [
          `성함: ${payload.name}`,
          `연락처: ${payload.phone}`,
          `문의 유형: ${payload.inquiryType}`,
          "",
          "남기실 말씀:",
          payload.message || "(없음)",
        ].join("\n"),
      }),
    });
    if (!res.ok) throw new Error(`resend email failed: ${res.status}`);
    return;
  }

  // 3) 미설정 — 안전 stub(마스킹 로깅). 운영 전 채널 설정 필요.
  console.info("[consult] 신규 상담 신청 (발송 미설정 — 로깅만)", {
    name: maskName(payload.name),
    phone: maskPhone(payload.phone),
    inquiryType: payload.inquiryType,
    messageLength: payload.message.length,
  });
  console.warn(
    "[consult] ⚠️ 실제 발송이 설정되지 않았습니다. CONSULT_WEBHOOK_URL 또는 RESEND_API_KEY+CONSULT_TO_EMAIL 을 설정하세요.",
  );
}
