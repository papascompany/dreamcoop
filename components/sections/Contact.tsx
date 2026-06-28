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
      // 스팸 방지용 honeypot (사람은 비워둠)
      company_website: String(data.get("company_website") ?? ""),
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
            <a className="serif ctatel" href={company.telHref}>
              {company.tel}
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

                {/* honeypot: 화면/스크린리더에서 숨김 */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                  <label>
                    회사 홈페이지
                    <input name="company_website" tabIndex={-1} autoComplete="off" />
                  </label>
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
