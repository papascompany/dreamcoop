import { logoutAction } from "@/app/admin/actions";

/** 관리자 공통 상단 네비(랜딩관리 · 상담내역). 로그인 페이지에는 사용하지 않는다. */
export default function AdminNav({ active }: { active: "landing" | "consults" }) {
  const tab = (on: boolean) =>
    "px-3 py-1.5 rounded-lg text-sm " +
    (on ? "bg-neutral-800 text-white" : "text-neutral-600 hover:bg-neutral-100");
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="font-semibold whitespace-nowrap">드림상조 · 관리</span>
          <nav className="flex items-center gap-1">
            <a href="/admin/landing" className={tab(active === "landing")}>
              랜딩관리
            </a>
            <a href="/admin/consults" className={tab(active === "consults")}>
              상담내역
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-neutral-500 hover:text-neutral-800 underline whitespace-nowrap"
          >
            사이트 보기 ↗
          </a>
          <form action={logoutAction}>
            <button className="text-sm text-neutral-500 hover:text-neutral-800">
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
