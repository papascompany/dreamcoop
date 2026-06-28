import BrandMark from "@/components/BrandMark";
import { getContent } from "@/lib/content-store";

export default async function Footer() {
  const { company, footer } = await getContent();
  return (
    <footer className="ft">
      <div className="container">
        <div className="ftgrid">
          <div>
            <div className="ftbrand">
              <BrandMark size={26} />
              {company.name}
            </div>
            <p className="ftp">{footer.about}</p>
            <p className="ftp" style={{ marginTop: 14, color: "var(--sand)" }}>
              {footer.campaign}
            </p>
          </div>

          <div>
            <div className="fthd">바로가기</div>
            {footer.quickLinks.map((l) => (
              <a className="ftlink" href={l.href} key={l.href}>
                {l.label}
              </a>
            ))}
          </div>

          <div>
            <div className="fthd">24시간 상담</div>
            <a className="fttel serif" href={company.telHref}>
              {company.tel}
            </a>
            <a className="ftlink" href="#contact">
              온라인 상담 신청
            </a>
            <p className="ftp" style={{ fontSize: 13, marginTop: 14 }}>
              {company.address}
              <br />
              대표 {company.rep} · 사업자등록번호 {company.bizNo}
            </p>
          </div>
        </div>

        <div className="ftbot">
          <span>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </span>
          <span>개인정보처리방침 · 이용약관</span>
        </div>
      </div>
    </footer>
  );
}
