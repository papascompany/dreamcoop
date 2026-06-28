import Slot from "@/components/Slot";
import { getContent } from "@/lib/content-store";

// 하단 정렬 텍스트 가독성 확보용 그라데이션(밝은 실사에서도 안전하도록 하단 강화).
const heroOverlay =
  "linear-gradient(180deg,rgba(28,40,38,0.34) 0%,rgba(28,40,38,0.18) 42%,rgba(28,40,38,0.74) 100%)";

export default async function Hero() {
  const { hero, company } = await getContent();
  return (
    <section className="hero" id="top">
      <Slot
        src={hero.image}
        alt={hero.imageAlt}
        label="히어로 이미지"
        dark
        priority
        sizes="100vw"
        objectPosition={hero.imagePosition}
      />
      <div className="hero-ov" style={{ background: heroOverlay }} />
      <div className="hero-in">
        <div className="container">
          <p className="hkick">
            <span className="ebline" />
            {hero.eyebrow}
          </p>
          <h1 className="serif hh1">
            {hero.title[0]}
            <br />
            {hero.title[1]}
          </h1>
          <p className="hpen pen">{hero.pen}</p>
          <div className="hero-cta">
            <a className="btn-primary" href="#contact">
              상담 신청
            </a>
            <a className="btn-ghost" href={company.telHref}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2z" />
              </svg>
              24시간 전화 {company.tel}
            </a>
          </div>
          <p className="scrollcue">
            {hero.scrollCue}
            <span className="cuearrow" aria-hidden="true">
              ↓
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
