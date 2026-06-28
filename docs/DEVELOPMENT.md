# 드림상조협동조합 — 개발 현황 문서

> 최종 갱신: 2026-06-28 · 단일 랜딩페이지 + 실시간 편집 CMS + 상담 접수

## 1. 개요
비영리 상조 협동조합 "드림상조협동조합"의 단일 랜딩페이지. 실사 중심 에디토리얼 레이아웃과 스크롤 구동 인터랙션으로 철학·서비스를 전달하고, **관리자가 빌드 없이 콘텐츠/이미지를 실시간 편집**하며 **상담 신청을 접수·조회**한다.

- 라이브: **https://dreamcoop.vercel.app**
- 관리자: **https://dreamcoop.vercel.app/admin/login**
- 레포: **github.com/papascompany/dreamcoop** (main 푸시 → Vercel 자동배포)

## 2. 기술 스택
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** · **Tailwind v4**
- 폰트: `next/font/google` — Noto Serif KR / Noto Sans KR / Nanum Pen Script
- 데이터/스토리지: **Supabase** (storige 프로젝트) — 콘텐츠 JSON, 상담 내역, 이미지 버킷
- 배포: **Vercel** (yohans-projects/dreamcoop), GitHub 연동 자동배포

## 3. 아키텍처
- 랜딩 `/` 는 `force-dynamic` — 요청마다 `getContent()`가 Supabase에서 콘텐츠를 읽어 기본값(`lib/content.ts`의 `defaultContent`) 위에 **deepMerge**. DB 미설정/오류 시 기본값 폴백.
- 관리자 저장 → DB upsert → `revalidatePath('/')` → **빌드 없이 즉시 반영**.
- 읽기는 anon 키, 쓰기/업로드는 **service_role**(서버 전용, RLS 우회).
- 콘텐츠는 컴포넌트에 하드코딩하지 않고 `lib/content.ts` 단일 소스 → 런타임에 DB 값으로 덮어씀.

```
app/
  page.tsx               # 섹션 조립(force-dynamic) + FAQPage JSON-LD + 스킵 링크
  layout.tsx             # 폰트/메타데이터/Organization JSON-LD
  globals.css            # 디자인 토큰 + 전 컴포넌트 스타일 + 반응형
  sitemap.ts robots.ts opengraph-image.tsx   # SEO
  api/consult/route.ts   # 상담 접수(서버 검증 → DB 저장 → 알림 best-effort)
  admin/
    login/  landing/  consults/  AdminNav.tsx  actions.ts
components/
  Header.tsx BrandMark.tsx Slot.tsx
  sections/{Hero,Philosophy,FourDreams,Services,Product,Band,Process,
            MemberBenefits,Coop,Campaign,Contact,Faq,Footer}.tsx
lib/
  content.ts(기본값/타입) content-store.ts(get/save/upload+merge)
  supabase.ts  auth.ts  consults.ts  notify.ts  site.ts
middleware.ts            # /admin/* 보호
```

## 4. 구현된 기능

### 랜딩 (서비스 흐름 순)
히어로 → 철학 → 4가지 드림(약속) → 서비스(4카드) → 상품 구성(8항목+유가족 부담) → 추모 밴드 → 진행 절차(스크롤 타임라인) → 조합원 혜택(6) → 협동조합(통계) → 효행캠페인 → 상담 신청 → FAQ → 푸터.
- 메인 메뉴: 철학 · 약속 · 서비스 · 상품 구성 · 진행 절차 · 협동조합
- 콘텐츠는 `참고자료`(기존 modoo.at 백업)의 **검증된 사실** 기반(대표 홍정기 · 사업자번호 249-81-00128 · 010-4436-7504 · 출자·가입비 10만원 1회 · 후불제 · 1인 8~10회 · 효행캠페인). 시안의 미검증 수치는 사실 기반 지표로 교체.

### 인터랙션
- 스크롤 구동 진행 절차 타임라인(fill·노드 점등), sticky 헤더, FAQ 아코디언, 효행캠페인 카드 hover(grow+wobble), 모바일 햄버거 메뉴.
- 한글 줄바꿈: `word-break: keep-all`. `prefers-reduced-motion` 대응.
- 이미지 슬롯: 실사 없으면 브랜드 톤 그라데이션 플레이스홀더. 히어로는 `imagePosition`으로 모바일 크롭 기준 조정.

### 랜딩관리 CMS (`/admin/landing`)
- 비밀번호 로그인 + 미들웨어 보호. 전 콘텐츠 트리(텍스트·이미지·카드·배열)를 섹션별 접이식 패널에서 편집.
- **경로 기반 함수형 업데이트** — 여러 이미지를 동시에 올려도 서로 덮어쓰지 않음.
- 이미지: 업로드 전 브라우저에서 **2000px·JPEG로 리사이즈/압축**(대용량 안전) → Supabase Storage → 공개 URL.
- 저장 즉시 사이트 반영. 미저장 표시·업로드 성공 표시.

### 상담 신청 + 상담내역
- 공개 폼 → `/api/consult`(서버 검증) → `dreamcoop_consults` 저장 → 관리자 `/admin/consults`에서 최신순 조회(성함·연락처·문의유형·메시지·일시).
- 알림(이메일/웹훅)은 환경변수 설정 시 best-effort 발송.

### SEO
- 메타데이터·OG(한국어 폰트 임베드 동적 이미지)·JSON-LD(FuneralHome, FAQPage)·sitemap·robots·`lang="ko"`.

## 5. 데이터 모델 (Supabase · storige 프로젝트)
> 계정 papascompany / org `fvoavmovrkjkhysnbrbo` / project **storige** (`uobbgxwuukwptqtywxxj`, ap-northeast-2). 상세 [docs/CMS.md](CMS.md).

| 객체 | 용도 |
|---|---|
| `public.dreamcoop_landing` | 콘텐츠 JSON (싱글톤 `id='main'`, 공개 읽기) |
| `public.dreamcoop_consults` | 상담 신청 내역 (비공개, service_role 전용) |
| storage 버킷 `dreamcoop` | 업로드 이미지 (공개 읽기) |

## 6. 배포 & 환경변수
- GitHub `main` 푸시 → Vercel 자동배포.
- Vercel(production) 등록됨: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- 선택: `RESEND_API_KEY`+`CONSULT_TO_EMAIL` 또는 `CONSULT_WEBHOOK_URL`(상담 즉시 알림). `.env.example` 참고.
- ⚠️ `pnpm build`와 `pnpm dev`는 `.next` 공유 → 동시 실행 금지.

## 7. 관리자 사용
1. `/admin/login` 로그인(비밀번호: Vercel `ADMIN_PASSWORD`).
2. **랜딩관리**: 텍스트/이미지/카드 편집 → 저장하기 → 즉시 반영.
3. **상담내역**: 접수된 상담 최신순 조회(연락처 탭 시 전화).

## 8. 주요 수정 이력(요약)
- 한글 줄바꿈(keep-all) 및 반응형 정비.
- 참고자료 기반 신규 섹션 4종 추가(약속·상품구성·혜택·효행).
- 랜딩관리 CMS + 상담내역 구축, GitHub↔Vercel 자동배포.
- 이미지 업로드: 1MB 초과 500 → 본문한도 상향 + 클라이언트 리사이즈.
- 다중 이미지 업로드 롤백 버그 → 경로 기반 함수형 업데이트로 수정.
- 히어로 모바일 크롭 기준(우측) 옵션화.
- 상담 누락 버그(honeypot 자동완성 오탐) → honeypot 제거, 검증 통과 시 무조건 저장.

## 9. 알려진 제약 · 운영 전 TODO
1. **커스텀 도메인** 미연결(현재 vercel.app). 연결 시 `lib/site.ts` `SITE_URL` 한 곳 교체.
2. **정확한 주소·대표 유선번호** 확정 필요(현재 010 휴대폰). `lib/content.ts`.
3. **상담 즉시 알림** 미설정(현재 DB 저장만). 환경변수로 활성화 권장.
4. 스토리지에 **교체된 옛 이미지가 누적**(무해). 필요 시 정리 기능 추가.
5. 관리자 비밀번호는 단일 비밀번호 방식 — 운영 시 강한 값으로 교체 권장.
6. honeypot 제거로 봇 차단 없음 — 스팸 발생 시 요청 제한(rate limit) 추가 가능.

## 10. 다음 제안
- **CTA 강화**(서비스 활성화): 히어로 행동 유도, 모바일 상시 전화/상담 바, 헤더 CTA 강조 등 — 별도 보고 참조.
