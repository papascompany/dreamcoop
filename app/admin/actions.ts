"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createToken,
  verifyToken,
} from "@/lib/auth";
import { saveContent, uploadImage } from "@/lib/content-store";

async function requireSession() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!(await verifyToken(token))) throw new Error("인증이 필요합니다.");
}

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const pw = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin/landing");
  if (!process.env.ADMIN_PASSWORD) {
    return { error: "서버에 ADMIN_PASSWORD가 설정되지 않았습니다." };
  }
  if (pw !== process.env.ADMIN_PASSWORD) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  (await cookies()).set(ADMIN_COOKIE, await createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect(next.startsWith("/admin") ? next : "/admin/landing");
}

export async function logoutAction() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function saveContentAction(
  data: unknown,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireSession();
    await saveContent(data);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "저장에 실패했습니다." };
  }
}

export async function uploadImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  try {
    await requireSession();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) return { error: "파일이 없습니다." };
    if (file.size > 8 * 1024 * 1024) return { error: "이미지는 8MB 이하만 업로드할 수 있습니다." };
    if (!file.type.startsWith("image/")) return { error: "이미지 파일만 업로드할 수 있습니다." };
    return { url: await uploadImage(file) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "업로드에 실패했습니다." };
  }
}
