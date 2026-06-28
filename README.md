# 드림상조협동조합 랜딩페이지

고인을 정중하고 고결하게 배웅하고 가족이 따뜻한 추억을 기억하도록 돕는, 비영리 상조 협동조합의 단일 랜딩페이지. 실사 사진 중심의 에디토리얼 레이아웃 + 스크롤에 반응하는 진행 절차 타임라인.

## 스택
- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** · **Tailwind v4**
- 폰트: `next/font/google` — Noto Serif KR(헤드라인) / Noto Sans KR(본문) / Nanum Pen Script(손글씨)
- 디자인 토큰 "미스트 & 세이지"를 `app/globals.css`의 CSS 변수로 단일 정의

## 실행
```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 프로덕션 빌드 (lint/type 포함)
pnpm lint
```
> ⚠️ `pnpm build`와 `pnpm dev`는 `.next`를 공유하므로 동시에 실행하지 말 것.

## 구조
```
app/
  layout.tsx            # 폰트, 메타데이터, Organization JSON-LD
  page.tsx              # 섹션 조립 + FAQPage JSON-LD + 스킵 링크
  globals.css           # 디자인 토큰 + 전 컴포넌트 스타일 + 반응형
  sitemap.ts robots.ts  # SEO 라우트
  opengraph-image.tsx   # 동적 OG 카드(한국어 폰트 임베드)
  api/consult/route.ts  # 상담 신청 접수(서버 검증 + honeypot)
components/
  Header.tsx BrandMark.tsx Slot.tsx
  sections/{Hero,Philosophy,Services,Band,Process,Coop,Contact,Faq,Footer}.tsx
lib/
  content.ts            # 모든 카피의 단일 소스 (VERIFIED/TODO 태깅)
  notify.ts             # 상담 발송 (env로 채널 선택)
  site.ts               # SITE_URL (도메인 단일 상수)
public/images/          # 실사 사진
reference/              # 기존 사이트 백업 등 참조 자료 (git 제외, 로컬 전용)
```

## 콘텐츠 출처
모든 카피는 `lib/content.ts`에 모여 있고 값마다 출처를 태깅했다.
- **VERIFIED**: 기존 modoo.at 백업에서 확인된 사실 (대표 홍정기 · 사업자번호 249-81-00128 · 010-4436-7504 · 출자·가입비 10만원 1회 · 후불제 · 1인 8~10회 · 효행캠페인)
- **TODO**: 운영 전 실데이터로 교체 (정확한 주소, 도메인 등)

> 디자인 시안의 미검증 수치(12,000+·8,400회·98%·1668-0000)는 사실 기반 지표(10만원·후불제·8~10회·24시간)와 실번호로 교체함.

## 상담 폼 발송 설정
`lib/notify.ts`가 환경변수로 채널을 선택한다(`.env.example` 참고). 미설정 시 서버 콘솔 마스킹 로깅만 하므로 **운영 전 반드시 설정**할 것.
- `CONSULT_WEBHOOK_URL` — Slack/알림톡 게이트웨이/Zapier 등
- `RESEND_API_KEY` + `CONSULT_TO_EMAIL` (+ `CONSULT_FROM_EMAIL`) — 이메일 발송

## 배포 (Vercel)
GitHub `papascompany/dreamcoop`에 푸시하면 Vercel이 자동 빌드·배포한다. 운영 전:
1. `lib/site.ts`의 `SITE_URL`을 실도메인으로 교체 (메타/OG/JSON-LD/sitemap 일괄 반영)
2. Vercel 프로젝트 환경변수에 상담 발송 채널 설정
3. `lib/content.ts`의 정확한 주소·연락처 확정

## 서브에이전트 팀 (`.claude/agents/`)
design · content · marketing · frontend · backend · qa · tester — 각 charter는 해당 `.md` 참조.
