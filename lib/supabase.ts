import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase 연동 — storige 프로젝트 (papascompany / org fvoavmovrkjkhysnbrbo)
 *   URL: https://uobbgxwuukwptqtywxxj.supabase.co
 * 모든 접근은 서버에서만. 읽기=anon/publishable 키, 쓰기/업로드=service_role 키.
 */

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const CONTENT_TABLE = "dreamcoop_landing";
export const CONTENT_ROW_ID = "main";
export const STORAGE_BUCKET = "dreamcoop";

export const SUPABASE_READ_READY = Boolean(url && anonKey);
export const SUPABASE_ADMIN_READY = Boolean(url && serviceKey);

/** 공개 읽기 클라이언트(RLS select 정책 적용). */
export function supabaseRead(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/** 관리자 쓰기/업로드 클라이언트(service_role, RLS 우회). 서버 전용. */
export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
