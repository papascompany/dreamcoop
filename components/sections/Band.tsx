import Slot from "@/components/Slot";
import { band } from "@/lib/content";

export default function Band() {
  return (
    <section className="band" aria-label="추모 명언">
      <Slot src={band.image} alt={band.imageAlt} label="추모 · 자연" dark sizes="100vw" />
      <div className="band-ov" />
      <div className="band-in">
        <p className="serif bandq">
          {band.quote[0]}
          <br />
          {band.quote[1]}
        </p>
        <p className="pen band-sign">{band.sign}</p>
      </div>
    </section>
  );
}
