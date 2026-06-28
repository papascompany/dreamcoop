/** 잎/촛불 형상의 브랜드 마크. currentColor를 따라 헤더/푸터에서 색이 상속된다. */
export default function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      className="bmark"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21c0-5 4-7 4-11a4 4 0 0 0-8 0c0 4 4 6 4 11z" />
      <circle cx="12" cy="9.5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
