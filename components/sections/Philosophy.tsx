import Slot from "@/components/Slot";
import { getContent } from "@/lib/content-store";

export default async function Philosophy() {
  const { philosophy } = await getContent();
  return (
    <section className="sec phil" id="philosophy" aria-label="우리의 철학">
      <div className="container">
        <div className="philgrid">
          <div className="rv">
            <p className="eyebrow" style={{ marginBottom: 30 }}>
              <span className="ebline" />
              {philosophy.eyebrow}
            </p>
            <p
              className="serif stmt"
              // 강조어(<em>)는 콘텐츠 데이터에서 제어 — accent 컬러로 표시된다.
              dangerouslySetInnerHTML={{
                __html: philosophy.statement.join("<br/>"),
              }}
            />
            <p className="lead" style={{ marginTop: 34 }}>
              {philosophy.lead}
            </p>
          </div>
          <div className="philportrait rv">
            <Slot
              src={philosophy.portrait}
              alt={philosophy.portraitAlt}
              label="가족 · 따뜻한 순간"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
        </div>

        <div className="points">
          {philosophy.points.map((pt) => (
            <div className="point rv" key={pt.n}>
              <div className="pnum serif">{pt.n}</div>
              <h3 className="pt">{pt.t}</h3>
              <p className="pd">{pt.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
