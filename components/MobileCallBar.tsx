import { getContent } from "@/lib/content-store";

/** 모바일 하단 고정 콜바 — 스크롤 내내 '전화 상담 · 상담 신청' 상시 노출(긴급 1탭 발신). */
export default async function MobileCallBar() {
  const { company } = await getContent();
  return (
    <div className="callbar" aria-label="빠른 연락">
      <a className="cb-call" href={company.telHref}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2z" />
        </svg>
        전화 상담
      </a>
      <a className="cb-consult" href="#contact">
        상담 신청
      </a>
    </div>
  );
}
