"use client";

import { useEffect, useRef, useState } from "react";
import Slot from "@/components/Slot";
import { process as processDefault } from "@/lib/content";

export default function Process({
  data: process = processDefault,
}: {
  data?: typeof processDefault;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.6;
      const next = Math.max(
        0,
        Math.min(1, (start - r.top) / Math.max(1, r.height - vh * 0.2)),
      );
      setProg((prev) => (Math.abs(next - prev) > 0.004 ? next : prev));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // process.steps.length 는 상수 — 마운트 시 1회 구독.
  }, []);

  const n = process.steps.length;

  return (
    <section className="sec proc" id="process" aria-label="진행 절차">
      <div className="container">
        <div
          className="rv"
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}
        >
          <p className="eyebrow" style={{ marginBottom: 24 }}>
            <span className="ebline" />
            {process.eyebrow}
          </p>
          <h2 className="serif h2">
            {process.title[0]}
            <br />
            {process.title[1]}
          </h2>
          <p className="lead" style={{ margin: "24px auto 0" }}>
            {process.lead}
          </p>
        </div>

        <div className="procTrack" ref={trackRef}>
          <div className="spine" />
          <div className="fill" style={{ height: `${(prog * 100).toFixed(2)}%` }} />

          {process.steps.map((step, i) => {
            const num = String(i + 1).padStart(2, "0");
            const active = prog >= i / (n - 1) - 0.06;
            const side = i % 2 ? "right" : "left";
            return (
              <div className={`prow rv ${side}`} key={step.t}>
                <div className="pphoto">
                  <Slot src={step.image} alt={step.t} label={`${num} ${step.t}`} />
                </div>
                <div className="ptext">
                  <div className="pstep">Step {num}</div>
                  <div className="pbignum serif">{num}</div>
                  <h3 className="serif ptitle">{step.t}</h3>
                  <p className="pdesc">{step.d}</p>
                </div>
                <div className={`node${active ? " on" : ""}`} aria-hidden="true">
                  {num}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
