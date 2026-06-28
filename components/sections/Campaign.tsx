import { getContent } from "@/lib/content-store";

export default async function Campaign() {
  const { campaign } = await getContent();
  return (
    <section className="sec campaign-sec" id={campaign.id} aria-label="효행캠페인">
      <div className="container">
        <div
          className="rv"
          style={{ textAlign: "center", maxWidth: 780, margin: "0 auto" }}
        >
          <p className="eyebrow" style={{ marginBottom: 22, justifyContent: "center" }}>
            <span className="ebline" />
            {campaign.eyebrow}
          </p>
          <h2 className="serif h2">
            {campaign.title[0]}
            <br />
            {campaign.title[1]}
          </h2>
          <p className="lead" style={{ margin: "26px auto 0" }}>
            {campaign.lead}
          </p>
        </div>

        <div className="camp-items">
          {campaign.items.map((it) => (
            <div className="camp-item rv" key={it.key}>
              <div className="camp-key pen">{it.key}</div>
              <h3 className="serif camp-t">{it.title}</h3>
              <p className="camp-d">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
