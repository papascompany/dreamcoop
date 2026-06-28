/**
 * 관리자 세션: 상태 비저장 서명 토큰(HMAC-SHA256). Edge/Node 양쪽에서 동작(Web Crypto).
 * 로그인은 ADMIN_PASSWORD 비교, 세션 쿠키는 ADMIN_SESSION_SECRET로 서명.
 */

const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";

export const ADMIN_COOKIE = "dc_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7일

function toBase64Url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(sig);
}

export async function createToken(): Promise<string> {
  const exp = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${exp}.${await sign(exp)}`;
}

export async function verifyToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (!Number(exp) || Number(exp) < Date.now()) return false;
  return sig === (await sign(exp));
}
