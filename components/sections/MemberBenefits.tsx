import { memberBenefits } from "@/lib/content";

export default function MemberBenefits() {
  return (
    <section
      className="sec benefits-sec"
      id={memberBenefits.id}
      aria-label="조합원 혜택"
    >
      <div className="container">
        <div className="rv" style={{ maxWidth: 680 }}>
          <p className="eyebrow" style={{ marginBottom: 26 }}>
            <span className="ebline" />
            {memberBenefits.eyebrow}
          </p>
          <h2 className="serif h2">
            {memberBenefits.title[0]}
            <br />
            {memberBenefits.title[1]}
          </h2>
          <p className="lead" style={{ marginTop: 26 }}>
            {memberBenefits.lead}
          </p>
        </div>

        <div className="benefits">
          {memberBenefits.items.map((b) => (
            <div className="benefit rv" key={b.key}>
              <div className="pnum serif">{b.key}</div>
              <h3 className="pt">{b.title}</h3>
              <p className="pd">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
