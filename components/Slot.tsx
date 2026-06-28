import Image from "next/image";

/**
 * 이미지 슬롯.
 * - `src`가 있으면 실사 사진(next/image)으로 렌더.
 * - 없으면 브랜드 팔레트 기반의 '의도된 플레이스홀더'(그라데이션+텍스처)로 렌더.
 *   → 실사 확보 시 콘텐츠 데이터의 image 경로만 채우면 자동으로 사진으로 교체됨.
 */
export default function Slot({
  src,
  alt,
  label,
  dark = false,
  priority = false,
  sizes,
}: {
  src?: string | null;
  alt: string;
  label?: string;
  dark?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={`slot${dark ? " slot--dark" : ""}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 900px) 100vw, 50vw"}
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }
  // 실사 미확보 플레이스홀더는 실제 정보를 담지 않으므로 장식 처리(스크린리더 무시).
  // 주변 텍스트가 맥락을 충분히 전달한다. src 확보 시 위 분기에서 실제 이미지로 노출.
  return (
    <div className={`slot${dark ? " slot--dark" : ""}`} aria-hidden="true">
      {label ? <span className="slot__label">{label}</span> : null}
    </div>
  );
}
