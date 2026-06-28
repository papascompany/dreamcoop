"use client";

import { useState } from "react";
import { faq } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState(0); // 첫 항목 기본 열림, -1 = 모두 닫힘

  return (
    <section className="sec faqsec" aria-label="자주 묻는 질문">
      <div className="container">
        <div className="rv" style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ marginBottom: 22, justifyContent: "center" }}>
            <span className="ebline" />
            {faq.eyebrow}
          </p>
          <h2 className="serif h2">{faq.title}</h2>
        </div>

        <div className="faqlist">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div className={`faqItem rv${isOpen ? " open" : ""}`} key={item.q}>
                <button
                  type="button"
                  className="faqQ"
                  id={btnId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  {item.q}
                  <span className="faqsign" aria-hidden="true">
                    +
                  </span>
                </button>
                <div
                  className="faqA"
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                >
                  <div className="faqAin">{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
