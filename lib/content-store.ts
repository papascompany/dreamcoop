import { cache } from "react";
import { defaultContent, type Content } from "@/lib/content";
import {
  supabaseRead,
  supabaseAdmin,
  CONTENT_TABLE,
  CONTENT_ROW_ID,
  STORAGE_BUCKET,
} from "@/lib/supabase";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

/**
 * 깊은 병합: override가 우선. 배열은 통째로 교체(관리자가 항목 수를 늘리고 줄일 수 있도록).
 * DB에 일부 필드만 저장돼 있어도 나머지는 기본값으로 채워진다.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(override)) {
      out[key] =
        key in (base as Record<string, unknown>)
          ? deepMerge((base as Record<string, unknown>)[key], override[key])
          : override[key];
    }
    return out as T;
  }
  return override as T;
}

/**
 * 런타임 콘텐츠. DB(storige.dreamcoop_landing)의 저장값을 기본값 위에 병합해 반환.
 * React cache로 요청당 1회만 조회. DB 미설정/오류 시 기본값으로 안전하게 폴백.
 */
export const getContent = cache(async (): Promise<Content> => {
  const sb = supabaseRead();
  if (!sb) return defaultContent;
  try {
    const { data, error } = await sb
      .from(CONTENT_TABLE)
      .select("data")
      .eq("id", CONTENT_ROW_ID)
      .maybeSingle();
    if (error || !data || !data.data) return defaultContent;
    return deepMerge(defaultContent, data.data);
  } catch {
    return defaultContent;
  }
});

/** 관리자 저장: 전체 콘텐츠 트리를 upsert. */
export async function saveContent(data: unknown): Promise<void> {
  const sb = supabaseAdmin();
  if (!sb) throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
  const { error } = await sb
    .from(CONTENT_TABLE)
    .upsert({ id: CONTENT_ROW_ID, data, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

/** 이미지 업로드 → 공개 URL 반환. */
export async function uploadImage(file: File): Promise<string> {
  const sb = supabaseAdmin();
  if (!sb) throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `landing/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;
  // 서버 액션에서 받은 File을 ArrayBuffer로 변환해 업로드(대용량/스트리밍 이슈 방지).
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await sb.storage.from(STORAGE_BUCKET).upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return sb.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
