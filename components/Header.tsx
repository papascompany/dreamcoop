"use client";

import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";
import { company, nav } from "@/lib/content";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setSolid(window.scrollY > 40);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // 모바일 메뉴 열림 시 Esc로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`hdr${solid || open ? " solid" : ""}`}>
        <a href="#top" className="brand" aria-label={`${company.name} 홈`}>
          <BrandMark />
          <span className="serif">
            드림상조<span className="bsub">협동조합</span>
          </span>
        </a>
        <nav className="nav" aria-label="주요 메뉴">
          {nav.map((l) => (
            <a className="navlink" href={l.href} key={l.href}>
              {l.label}
            </a>
          ))}
          <a className="hcta" href="#contact" onClick={() => setOpen(false)}>
            상담 신청
          </a>
          <button
            type="button"
            className="navtoggle"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M5 5l12 12M17 5L5 17"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h16M3 11h16M3 16h16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </nav>
      </header>

      <div id="mobile-nav" className={`mobilenav${open ? " open" : ""}`}>
        <nav aria-label="모바일 메뉴">
          {nav.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="mobilenav-cta" href="#contact" onClick={() => setOpen(false)}>
            상담 신청
          </a>
        </nav>
      </div>
    </>
  );
}
