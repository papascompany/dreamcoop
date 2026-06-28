import { ImageResponse } from "next/og";

export const alt = "드림상조협동조합 — 마지막 길을, 가장 따뜻하게";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Noto Serif KR 서브셋을 satori 호환 포맷(ttf)으로 가져온다.
// 구형 User-Agent를 보내면 Google Fonts가 woff2 대신 ttf URL을 반환한다(satori는 woff2 미지원).
async function loadKoreanFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const api = `https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600&text=${encodeURIComponent(
      text,
    )}`;
    const css = await fetch(api, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" },
    }).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const brand = "드림상조협동조합";
  const title = "마지막 길을,\n가장 따뜻하게";
  const sub = "매월 납입 없는 후불제 · 비영리 상조 협동조합";

  const fontData = await loadKoreanFont(brand + title + sub);
  const fontFamily = fontData ? "NotoSerifKR" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(160deg, #36433f 0%, #2b3633 55%, #222a27 100%)",
          fontFamily,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a7beb1",
            fontSize: 26,
            letterSpacing: 6,
          }}
        >
          <div style={{ width: 44, height: 2, background: "#7c9a8e" }} />
          {brand}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#f4eee2",
            fontSize: 92,
            fontWeight: 600,
            lineHeight: 1.15,
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", color: "rgba(244,238,226,0.82)", fontSize: 32 }}>
          {sub}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "NotoSerifKR", data: fontData, weight: 600, style: "normal" }]
        : [],
    },
  );
}
