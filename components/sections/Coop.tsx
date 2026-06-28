import Slot from "@/components/Slot";
import { getContent } from "@/lib/content-store";

export default async function Coop() {
  const { coop } = await getContent();
  return (
    <section className="sec coop" id="coop" aria-label="협동조합 안내">
      <div className="container">
        <div className="coopgrid">
          <div className="coopvis rv">
            <Slot
              src={coop.image}
              alt={coop.imageAlt}
              label="조합 · 함께하는 사람들"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
          <div className="rv">
            <p className="eyebrow" style={{ marginBottom: 26 }}>
              <span className="ebline" />
              {coop.eyebrow}
            </p>
            <h2 className="serif h2">
              {coop.title[0]}
              <br />
              {coop.title[1]}
            </h2>
            <p className="lead" style={{ marginTop: 26 }}>
              {coop.lead}
            </p>
          </div>
        </div>

        <div className="stats">
          {coop.stats.map((st) => (
            <div className="stat rv" key={st.l}>
              <div className="statnum serif">{st.n}</div>
              <div className="statl">{st.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
