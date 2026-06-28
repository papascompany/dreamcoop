"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { saveContentAction, uploadImageAction } from "@/app/admin/actions";

const LABELS: Record<string, string> = {
  company: "회사 정보",
  nav: "상단 메뉴",
  hero: "히어로",
  philosophy: "철학",
  fourDreams: "4가지 드림(약속)",
  services: "서비스",
  product: "상품 구성",
  band: "추모 밴드",
  process: "진행 절차",
  memberBenefits: "조합원 혜택",
  coop: "협동조합",
  campaign: "효행캠페인",
  contact: "상담 신청",
  faq: "자주 묻는 질문",
  footer: "푸터",
  title: "제목",
  titleLines: "제목(줄별)",
  lead: "리드 문구",
  eyebrow: "소제목",
  desc: "설명",
  items: "항목",
  steps: "단계",
  points: "포인트",
  stats: "통계",
  quickLinks: "바로가기",
  inquiryTypes: "문의 유형",
  statement: "강조 문구",
  image: "이미지",
  portrait: "인물 이미지",
  imageAlt: "이미지 대체텍스트",
  portraitAlt: "이미지 대체텍스트",
  imagePosition: "이미지 위치(예: right center · center · 70% 30%)",
  note: "비고",
  key: "구분",
  tag: "태그",
  label: "라벨",
  href: "링크",
  q: "질문",
  a: "답변",
  n: "숫자/값",
  l: "라벨",
  t: "제목",
  d: "설명",
  name: "이름",
  legalName: "법인명",
  rep: "대표자",
  bizNo: "사업자번호",
  tel: "대표 전화",
  telHref: "전화 링크",
  address: "주소",
  email: "이메일",
  joinFee: "가입비",
  pen: "손글씨 문구",
  scrollCue: "스크롤 안내",
  about: "소개 문구",
  sign: "서명",
  quote: "인용",
  footnote: "하단 주석",
  sent: "제출 완료 화면",
  body: "본문",
  num: "번호",
  id: "ID",
};

type Path = (string | number)[];
type SetAt = (path: Path, value: unknown | ((cur: unknown) => unknown)) => void;

function labelFor(key: string | number): string {
  if (key === "" || typeof key === "number") return "";
  return LABELS[key] ?? key;
}
function isObj(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}
function isImageKey(key: string | number): boolean {
  return key === "image" || key === "portrait";
}
function isLongText(v: string): boolean {
  return v.length > 48 || v.includes("\n");
}
function blankLike(template: unknown): unknown {
  if (typeof template === "string") return "";
  if (Array.isArray(template)) return [];
  if (isObj(template)) {
    const o: Record<string, unknown> = {};
    for (const k of Object.keys(template)) o[k] = blankLike(template[k]);
    return o;
  }
  return template;
}

// ── 경로 기반 불변 읽기/쓰기 — 항상 "최신 상태"에 적용되어 비동기 업로드끼리 덮어쓰지 않는다.
function getByPath(root: unknown, path: Path): unknown {
  return path.reduce<unknown>(
    (acc, k) => (acc == null ? acc : (acc as Record<string | number, unknown>)[k]),
    root,
  );
}
function setByPath(root: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const next = root.slice();
    next[head as number] = setByPath(root[head as number], rest, value);
    return next;
  }
  const obj = isObj(root) ? root : {};
  return { ...obj, [head]: setByPath(obj[head as string], rest, value) };
}

// ── 업로드 전 브라우저에서 이미지 리사이즈/압축(긴 변 2000px, JPEG 0.85).
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 2000;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob((b) => res(b), "image/jpeg", 0.85),
    );
    if (!blob) return file;
    if (blob.size >= file.size && file.size < 1_500_000) return file;
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      {label ? (
        <span className="block text-xs font-medium text-neutral-500 mb-1">{label}</span>
      ) : null}
      {children}
    </label>
  );
}

function ImageField({
  value,
  path,
  setAt,
  adminReady,
}: {
  value: string | null;
  path: Path;
  setAt: SetAt;
  adminReady: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    setDone(false);
    try {
      const processed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", processed);
      const res = await uploadImageAction(fd);
      if (res.error) setErr(res.error);
      else if (res.url) {
        setAt(path, res.url);
        setDone(true);
      }
    } catch {
      setErr("업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-28 h-20 rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden flex items-center justify-center text-[11px] text-neutral-400 shrink-0">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          "플레이스홀더"
        )}
      </div>
      <div className="space-y-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <label
            className={
              "inline-block text-xs px-2.5 py-1.5 rounded border " +
              (adminReady
                ? "border-neutral-300 cursor-pointer hover:bg-neutral-50"
                : "border-neutral-200 text-neutral-400 cursor-not-allowed")
            }
          >
            {busy ? "업로드 중…" : "이미지 업로드"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={!adminReady || busy}
              onChange={onPick}
            />
          </label>
          {value ? (
            <button
              type="button"
              onClick={() => setAt(path, null)}
              className="text-xs text-red-500 hover:underline"
            >
              제거(플레이스홀더)
            </button>
          ) : null}
        </div>
        <input
          type="text"
          value={value ?? ""}
          placeholder="또는 이미지 URL 직접 입력"
          onChange={(e) => setAt(path, e.target.value || null)}
          className="w-full border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-600"
        />
        {err ? <p className="text-xs text-red-600">{err}</p> : null}
        {done && !err ? (
          <p className="text-xs text-emerald-600">
            ✓ 업로드됨 — 위 <strong>저장하기</strong>를 눌러야 사이트에 반영됩니다.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ArrayEditor({
  fieldKey,
  value,
  path,
  setAt,
  adminReady,
  depth,
}: {
  fieldKey: string | number;
  value: unknown[];
  path: Path;
  setAt: SetAt;
  adminReady: boolean;
  depth: number;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-neutral-500">
        {labelFor(fieldKey)} · {value.length}개
      </div>
      <div className="space-y-2">
        {value.map((it, i) => (
          <div
            key={i}
            className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-neutral-400">#{i + 1}</span>
              <button
                type="button"
                onClick={() =>
                  setAt(path, (arr: unknown) =>
                    (arr as unknown[]).filter((_, j) => j !== i),
                  )
                }
                className="text-[11px] text-red-500 hover:underline"
              >
                삭제
              </button>
            </div>
            {typeof it === "string" ? (
              <input
                type="text"
                value={it}
                onChange={(e) => setAt([...path, i], e.target.value)}
                className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-sm"
              />
            ) : (
              <FieldEditor
                fieldKey=""
                value={it}
                path={[...path, i]}
                setAt={setAt}
                adminReady={adminReady}
                depth={depth + 1}
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          setAt(path, (arr: unknown) => {
            const a = arr as unknown[];
            return [...a, blankLike(a.length ? a[a.length - 1] : "")];
          })
        }
        className="text-xs px-2.5 py-1 rounded border border-neutral-300 hover:bg-neutral-50"
      >
        + 항목 추가
      </button>
    </div>
  );
}

function FieldEditor({
  fieldKey,
  value,
  path,
  setAt,
  adminReady,
  depth = 0,
}: {
  fieldKey: string | number;
  value: unknown;
  path: Path;
  setAt: SetAt;
  adminReady: boolean;
  depth?: number;
}) {
  if (isImageKey(fieldKey) && (typeof value === "string" || value === null)) {
    return (
      <Row label={labelFor(fieldKey)}>
        <ImageField
          value={value as string | null}
          path={path}
          setAt={setAt}
          adminReady={adminReady}
        />
      </Row>
    );
  }
  if (typeof value === "string") {
    return (
      <Row label={labelFor(fieldKey)}>
        {isLongText(value) ? (
          <textarea
            value={value}
            onChange={(e) => setAt(path, e.target.value)}
            rows={Math.min(6, Math.max(2, Math.ceil(value.length / 52)))}
            className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-sm leading-relaxed"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setAt(path, e.target.value)}
            className="w-full border border-neutral-300 rounded px-2.5 py-1.5 text-sm"
          />
        )}
      </Row>
    );
  }
  if (typeof value === "number") {
    return (
      <Row label={labelFor(fieldKey)}>
        <input
          type="text"
          value={String(value)}
          onChange={(e) => setAt(path, e.target.value)}
          className="w-40 border border-neutral-300 rounded px-2.5 py-1.5 text-sm"
        />
      </Row>
    );
  }
  if (Array.isArray(value)) {
    return (
      <ArrayEditor
        fieldKey={fieldKey}
        value={value}
        path={path}
        setAt={setAt}
        adminReady={adminReady}
        depth={depth}
      />
    );
  }
  if (isObj(value)) {
    return (
      <div className={depth > 0 ? "space-y-3" : "space-y-4"}>
        {Object.entries(value).map(([k, v]) => (
          <FieldEditor
            key={k}
            fieldKey={k}
            value={v}
            path={[...path, k]}
            setAt={setAt}
            adminReady={adminReady}
            depth={depth + 1}
          />
        ))}
      </div>
    );
  }
  return null;
}

export default function LandingEditor({
  initial,
  adminReady,
}: {
  initial: unknown;
  adminReady: boolean;
}) {
  const [content, setContent] = useState<Record<string, unknown>>(
    initial as Record<string, unknown>,
  );
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  // 모든 편집이 거치는 단일 경로 기반 함수형 업데이트 → 비동기 업로드끼리 덮어쓰지 않음.
  const setAt: SetAt = (path, value) => {
    setContent((prev) => {
      const cur = getByPath(prev, path);
      const next =
        typeof value === "function"
          ? (value as (c: unknown) => unknown)(cur)
          : value;
      return setByPath(prev, path, next) as Record<string, unknown>;
    });
    setDirty(true);
    setStatus(null);
  };

  function save() {
    setStatus(null);
    startTransition(async () => {
      const res = await saveContentAction(content);
      if (res.ok) setDirty(false);
      setStatus(
        res.ok
          ? { ok: true, msg: "저장되었습니다. 사이트에 즉시 반영됩니다." }
          : { ok: false, msg: res.error || "저장에 실패했습니다." },
      );
    });
  }

  return (
    <div>
      <div className="sticky top-[57px] z-10 -mx-5 px-5 py-3 bg-neutral-100/90 backdrop-blur border-b border-neutral-200 flex items-center gap-3 flex-wrap">
        <button
          onClick={save}
          disabled={pending || !adminReady}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {pending ? "저장 중…" : "저장하기"}
        </button>
        {dirty && !pending ? (
          <span className="text-sm text-amber-600">● 저장되지 않은 변경사항이 있습니다</span>
        ) : null}
        {status ? (
          <span className={"text-sm " + (status.ok ? "text-emerald-700" : "text-red-600")}>
            {status.msg}
          </span>
        ) : null}
        {!adminReady ? (
          <span className="text-xs text-neutral-400">
            service_role 키 설정 후 저장할 수 있습니다.
          </span>
        ) : null}
      </div>

      <div className="space-y-3 mt-4">
        {Object.keys(content).map((key) => (
          <details
            key={key}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden group"
          >
            <summary className="cursor-pointer select-none px-5 py-3.5 font-medium text-sm flex items-center justify-between">
              <span>{labelFor(key)}</span>
              <span className="text-neutral-300 group-open:rotate-180 transition">▾</span>
            </summary>
            <div className="px-5 pb-5 pt-3 border-t border-neutral-100">
              <FieldEditor
                fieldKey={key}
                value={content[key]}
                path={[key]}
                setAt={setAt}
                adminReady={adminReady}
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
