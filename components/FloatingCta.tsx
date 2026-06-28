"use client";

import { useEffect, useState } from "react";

/** 데스크톱 전용 플로팅 CTA — 히어로를 지나면 우하단에 노출(모바일은 콜바가 대체, CSS로 숨김). */
export default function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setShow(window.scrollY > window.innerHeight * 0.9);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <a
      className={`floatcta${show ? " show" : ""}`}
      href="#contact"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
    >
      상담 신청
    </a>
  );
}
