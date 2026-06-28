import { fourDreams } from "@/lib/content";

export default function FourDreams() {
  return (
    <section className="sec dreams-sec" id={fourDreams.id} aria-label="드림상조의 약속">
      <div className="container">
        <div
          className="rv"
          style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}
        >
          <p className="eyebrow" style={{ marginBottom: 22, justifyContent: "center" }}>
            <span className="ebline" />
            {fourDreams.eyebrow}
          </p>
          <h2 className="serif h2">
            {fourDreams.title[0]}
            <br />
            {fourDreams.title[1]}
          </h2>
          <p className="lead" style={{ margin: "24px auto 0" }}>
            {fourDreams.lead}
          </p>
        </div>

        <div className="dreams">
          {fourDreams.items.map((d, i) => (
            <article className="dream rv" key={d.key}>
              <div className="dream-num serif">{String(i + 1).padStart(2, "0")}</div>
              <div className="dream-tag">{d.key}</div>
              <h3 className="serif dream-t">{d.title}</h3>
              <p className="dream-d">{d.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
