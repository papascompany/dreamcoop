# 랜딩관리 CMS — 개발/운영 문서

랜딩페이지의 **모든 텍스트·이미지·카드 문구**를 빌드 없이 실시간으로 편집하는 관리자 시스템.

## 어떤 Supabase에 연동돼 있나 (중요)

| 항목 | 값 |
|---|---|
| Supabase 계정 | **papascompany** (org `fvoavmovrkjkhysnbrbo`) |
| 프로젝트 | **storige** (기존 프로젝트 재사용) |
| 프로젝트 ref | `uobbgxwuukwptqtywxxj` |
| API URL | `https://uobbgxwuukwptqtywxxj.supabase.co` |
| 리전 | `ap-northeast-2` (서울) |
| 콘텐츠 테이블 | `public.dreamcoop_landing` (싱글톤 행 `id='main'`, `data jsonb`) |
| 이미지 버킷 | `dreamcoop` (public) |

> ⚠️ **storige 프로젝트는 다른 앱(mystory)과 공용**입니다. 드림상조 전용 객체는 모두 `dreamcoop_` 접두사 테이블과 `dreamcoop` 버킷에만 격리돼 있으니, 다른 테이블은 건드리지 마세요.

## 동작 원리

- 랜딩(`/`)은 `export const dynamic = "force-dynamic"`로 **요청마다** `getContent()`(`lib/content-store.ts`)를 호출.
- `getContent()`는 `dreamcoop_landing.data`(jsonb)를 읽어 **기본값(`lib/content.ts`의 `defaultContent`) 위에 deepMerge**. DB에 일부 필드만 있어도 나머지는 기본값으로 채워짐. DB 미설정/오류 시 전부 기본값으로 안전 폴백.
- 관리자가 저장 → `dreamcoop_landing.data`에 전체 트리 upsert → `revalidatePath('/')` → 사이트에 즉시 반영(빌드 불필요).
- 읽기 = anon/publishable 키(RLS select 정책). 쓰기·이미지 업로드 = **service_role 키**(서버 전용, RLS 우회).

## 환경변수 (`.env.local` 및 Vercel)

| 변수 | 용도 | 비고 |
|---|---|---|
| `SUPABASE_URL` | 프로젝트 URL | 공개값 |
| `SUPABASE_ANON_KEY` | 공개 읽기 키 | 공개값(publishable) |
| `SUPABASE_SERVICE_ROLE_KEY` | **저장/업로드** | ⚠️ 비밀. 대시보드 > storige > Settings > API > service_role. **미설정 시 저장 비활성화** |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 | |
| `ADMIN_SESSION_SECRET` | 세션 쿠키 서명 | 32바이트 hex |

- Vercel(production)에는 `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`가 **이미 등록됨**.
- **`SUPABASE_SERVICE_ROLE_KEY`만 직접 추가**해야 저장/업로드가 켜집니다:
  ```bash
  # 로컬
  echo 'SUPABASE_SERVICE_ROLE_KEY=<service_role_secret>' >> .env.local
  # Vercel
  vercel env add SUPABASE_SERVICE_ROLE_KEY production   # 붙여넣기
  ```

## 사용법

1. `https://dreamcoop.vercel.app/admin/login` 접속 → `ADMIN_PASSWORD` 입력.
2. 섹션별 패널을 열어 텍스트 수정 / 이미지 업로드 / 카드 항목 추가·삭제.
3. **저장하기** → 사이트 즉시 반영.

- 관리 경로: `/admin/login`, `/admin/landing`. `middleware.ts`가 `/admin/*`를 세션 쿠키로 보호.
- 이미지: 업로드 시 `dreamcoop` 버킷에 저장되고 공개 URL이 콘텐츠에 기록됨. `next.config.ts`의 `images.remotePatterns`에 해당 호스트가 허용돼 있음.

## 관련 파일
- `lib/supabase.ts` — 클라이언트(읽기/관리자)
- `lib/content-store.ts` — `getContent`/`saveContent`/`uploadImage` + deepMerge
- `lib/content.ts` — `defaultContent`(기본값/폴백)
- `lib/auth.ts`, `middleware.ts` — 세션/보호
- `app/admin/**` — 로그인·편집기·서버 액션
- DB 마이그레이션: Supabase `dreamcoop_landing_cms`

## 참고
- 랜딩이 매 요청 Supabase를 읽으므로(force-dynamic) 트래픽이 커지면 태그 캐시(`revalidateTag`)로 전환 검토.
