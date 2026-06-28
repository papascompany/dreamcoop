import Slot from "@/components/Slot";
import { hero } from "@/lib/content";

// 하단 정렬 텍스트 가독성 확보용 그라데이션(밝은 실사에서도 안전하도록 하단 강화).
const heroOverlay =
  "linear-gradient(180deg,rgba(28,40,38,0.34) 0%,rgba(28,40,38,0.18) 42%,rgba(28,40,38,0.74) 100%)";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <Slot
        src={hero.image}
        alt={hero.imageAlt}
        label="히어로 이미지"
        dark
        priority
        sizes="100vw"
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
