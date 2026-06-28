import { getContent } from "@/lib/content-store";

export default async function Product() {
  const { product } = await getContent();
  return (
    <section className="sec product-sec" id={product.id} aria-label="상품 구성">
      <div className="container">
        <div className="rv" style={{ maxWidth: 680 }}>
          <p className="eyebrow" style={{ marginBottom: 26 }}>
            <span className="ebline" />
            {product.eyebrow}
          </p>
          <h2 className="serif h2">
            {product.title[0]}
            <br />
            {product.title[1]}
          </h2>
          <p className="lead" style={{ marginTop: 26 }}>
            {product.lead}
          </p>
        </div>

        <div className="prodgrid">
          {product.items.map((it) => (
            <div className="proditem rv" key={it.title}>
              <div className="prod-key">{it.key}</div>
              <h3 className="serif prod-t">{it.title}</h3>
              <p className="prod-d">{it.desc}</p>
              {it.note ? <p className="prod-note">{it.note}</p> : null}
            </div>
          ))}
        </div>

        <p className="prod-foot rv">{product.footnote}</p>
      </div>
    </section>
  );
}
