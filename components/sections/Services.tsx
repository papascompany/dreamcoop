import Slot from "@/components/Slot";
import { getContent } from "@/lib/content-store";

export default async function Services() {
  const { services } = await getContent();
  return (
    <section className="sec svcs" id="services" aria-label="서비스 안내">
      <div className="container">
        <div className="rv" style={{ maxWidth: 680 }}>
          <p className="eyebrow" style={{ marginBottom: 26 }}>
            <span className="ebline" />
            {services.eyebrow}
          </p>
          <h2 className="serif h2">
            {services.title[0]}
            <br />
            {services.title[1]}
          </h2>
          <p className="lead" style={{ marginTop: 26 }}>
            {services.lead}
          </p>
        </div>

        <div className="svcgrid">
          {services.items.map((svc) => (
            <article className="svc rv" key={svc.t}>
              <Slot
                src={svc.image}
                alt={svc.t}
                dark
                label={svc.t}
                sizes="(max-width: 900px) 50vw, 25vw"
              />
              <div className="svc-ov" />
              <div className="svc-body">
                <span className="svc-tag">{svc.tag}</span>
                <h3 className="serif svc-title">{svc.t}</h3>
                <p className="svc-desc">{svc.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
