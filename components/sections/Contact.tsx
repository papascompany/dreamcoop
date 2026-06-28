"use client";

import { useState, type FormEvent } from "react";
import {
  company as companyDefault,
  contact as contactDefault,
} from "@/lib/content";

export default function Contact({
  company = companyDefault,
  contact = contactDefault,
}: {
  company?: typeof companyDefault;
  contact?: typeof contactDefault;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      inquiryType: String(data.get("inquiryType") ?? ""),
      message: String(data.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.phone) {
      setError("성함과 연락처를 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "전송에 실패했습니다.");
      }
      setSent(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "잠시 후 다시 시도하시거나 대표전화로 연락 주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="sec cta" id="contact" aria-label="사전 상담 · 가입 문의">
      <div className="container">
        <div className="ctagrid">
          <div className="rv">
            <p className="eyebrow" style={{ marginBottom: 26 }}>
              <span className="ebline" />
              {contact.eyebrow}
            </p>
            <h2 className="serif ctah">
              {contact.title[0]}
              <br />
              {contact.title[1]}
            </h2>
            <p className="ctap">{contact.body}</p>
            <a className="emrg" href={company.telHref}>
              <span className="emrg-ic">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2z" />
                </svg>
              </span>
              <span>
                <span className="emrg-lbl">갑작스러운 상황 · 24시간 긴급 접수</span>
                <span className="emrg-num serif">{company.tel}</span>
              </span>
            </a>
          </div>

          <div className="rv">
            {sent ? (
              <div className="form sent" role="status" aria-live="polite">
                <div className="sentmark" aria-hidden="true">
                  ✓
                </div>
                <h3 className="senth serif">{contact.sent.title}</h3>
                <p className="sentp" style={{ whiteSpace: "pre-line" }}>
                  {contact.sent.body}
                </p>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                <div className="frow">
                  <div className="field">
                    <label className="flbl" htmlFor="name">
                      성함
                    </label>
                    <input
                      className="inp"
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="이름을 입력해 주세요"
                    />
                  </div>
                  <div className="field">
                    <label className="flbl" htmlFor="phone">
                      연락처
                    </label>
                    <input
                      className="inp"
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="flbl" htmlFor="inquiryType">
                    문의 유형
                  </label>
                  <select className="inp" id="inquiryType" name="inquiryType">
                    {contact.inquiryTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="flbl" htmlFor="message">
                    남기실 말씀
                  </label>
                  <textarea
                    className="inp"
                    id="message"
                    name="message"
                    placeholder="궁금하신 점이나 상황을 자유롭게 적어 주세요"
                  />
                </div>

                {error ? (
                  <p className="formerr" role="alert">
                    {error}
                  </p>
                ) : null}

                <button className="submit" type="submit" disabled={submitting}>
                  {submitting ? "접수 중…" : "정중히 상담 신청하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
