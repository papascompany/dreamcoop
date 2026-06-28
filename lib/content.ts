/**
 * 드림상조협동조합 — 콘텐츠 단일 소스
 *
 * 출처: `참고자료/`(기존 modoo.at 백업)에서 확인된 실제 사실 기반.
 * 카피는 컴포넌트에 하드코딩하지 않고 이 파일에서만 관리한다.
 *
 * ⚠️ 검증 표기
 *  - VERIFIED: 참고자료에서 확인된 사실.
 *  - TODO: 실데이터 확인 필요(placeholder). 운영 전 교체.
 *
 * 이미지: 실사 사진 경로(`/images/...`). null이면 브랜드 톤 플레이스홀더로 렌더된다.
 *  (입관·성복 등 가장 엄숙한 단계는 무리한 사진 대신 정제된 플레이스홀더 유지)
 */

export const company = {
  name: "드림상조협동조합",
  legalName: "드림(상조)협동조합",
  rep: "홍정기", // VERIFIED
  bizNo: "249-81-00128", // VERIFIED
  tel: "010-4436-7504", // VERIFIED (백업 본문 다수 등장)
  telHref: "tel:01044367504",
  // TODO: 정확한 도로명 주소 확인 필요. 제휴(구로구청 인터넷방송) 근거로 구로구 추정.
  address: "서울특별시 구로구 (상세 주소 확인 예정)",
  email: "", // TODO
  joinFee: "10만원", // VERIFIED (출자금+가입비 1회)
} as const;

export const nav = [
  { href: "#philosophy", label: "철학" },
  { href: "#services", label: "서비스" },
  { href: "#process", label: "진행 절차" },
  { href: "#coop", label: "협동조합" },
] as const;

export const hero = {
  eyebrow: "드림상조협동조합",
  title: ["마지막 길을,", "가장 따뜻하게"],
  pen: "사람을, 사람답게 배웅합니다",
  scrollCue: "아래로 스크롤",
  image: "/images/hero.jpeg",
  imageAlt: "해질녘 바닷가를 함께 걷는 가족의 뒷모습",
} as const;

export const philosophy = {
  eyebrow: "우리의 철학",
  // <em>…</em> 은 accent 강조어
  statement: [
    "상조는 <em>금융상품</em>이 아닙니다.",
    "마지막 길은 비용이 아니라,",
    "<em>정성</em>으로 채워야 합니다.",
  ],
  lead: "대부분의 상조는 매달 돈을 내는 보험이 되었습니다. 드림상조협동조합은 다릅니다. 우리는 고인을 정중하고 고결하게 배웅하고, 남겨진 가족이 따뜻한 추억을 오래 간직할 수 있도록 곁을 지킵니다.",
  portrait: "/images/philosophy.jpeg",
  portraitAlt: "세대가 함께 모인 따뜻한 가족의 모습",
  points: [
    {
      n: "01",
      t: "조합원이 주인입니다",
      d: "드림상조는 비영리 협동조합입니다. 회사의 이익이 아니라, 조합원과 가족을 위해 운영되며 1년 운영 실적을 총회에서 투명하게 보고합니다.",
    },
    {
      n: "02",
      t: "강매 없는 투명함",
      d: "불필요한 부가상품과 숨은 비용 없이, 꼭 필요한 것만 정직하게 안내합니다. 매월 납입도, 회사 부도로 잃을 위험도 없습니다.",
    },
    {
      n: "03",
      t: "사람을 위한 의전",
      d: "정해진 절차를 넘어, 고인을 한 사람으로서 고결하게 배웅합니다. 형식이 아니라 마음으로 모십니다.",
    },
  ],
} as const;

export const services = {
  eyebrow: "서비스",
  title: ["한 사람의 삶을", "온전히 배웅하는 일"],
  lead: "처음 연락이 닿는 순간부터 마지막 추모까지, 모든 과정을 정성껏 함께합니다.",
  // image: 실사 확보 전까지 null → '의도된 플레이스홀더'. 확보 시 경로만 채우면 교체됨.
  items: [
    {
      tag: "의전",
      t: "장례 의전",
      d: "전 과정에 전문 장례지도사가 동행하여, 형식이 아닌 마음으로 모십니다.",
      image: "/images/service-ceremony.jpeg" as string | null,
    },
    {
      tag: "공간",
      t: "빈소 · 추모 공간",
      d: "고인의 삶을 닮은 품격 있는 공간을 정성껏 연출하고, 4명의 접객 도우미가 함께합니다.",
      image: "/images/service-space.jpeg" as string | null,
    },
    {
      tag: "운구",
      t: "운구 · 발인",
      d: "대형버스 또는 리무진으로, 마지막 한 걸음까지 정중하게 떠나는 길을 함께 걷습니다.",
      image: "/images/service-procession.jpeg" as string | null,
    },
    {
      tag: "기억",
      t: "추모 · 기억 보관",
      d: "49재와 추모, 사진과 글로 고인의 삶을 기록하여 가족의 곁에 오래 남깁니다.",
      image: "/images/service-memory.jpeg" as string | null,
    },
  ],
} as const;

export const band = {
  quote: ["“떠나는 이의 품격은,", "남겨진 이의 위로가 됩니다.”"],
  sign: "— 드림상조협동조합",
  image: "/images/band.jpeg",
  imageAlt: "해질녘, 아이를 안고 선 부모의 실루엣",
} as const;

export const process = {
  eyebrow: "진행 절차",
  title: ["처음부터 끝까지,", "함께 걷는 여섯 걸음"],
  lead: "스크롤을 따라 한 걸음씩, 우리가 곁에서 함께하는 모든 순간을 안내합니다.",
  steps: [
    {
      t: "임종 · 접수",
      d: "24시간 언제든 한 통의 전화로. 전문 장례지도사가 곧바로 도착해 고인을 정중히 모십니다.",
      image: "/images/process-1.jpeg" as string | null,
    },
    {
      t: "빈소 · 의전 준비",
      d: "품격 있는 빈소와 영정·제단을 정성껏 마련하고, 조문 절차를 세심히 안내해 드립니다.",
      image: "/images/process-2.jpeg" as string | null,
    },
    {
      t: "입관 · 성복",
      d: "염습과 입관, 성복례까지. 고인을 단정히 모시는 모든 과정을 가족과 함께합니다.",
      image: null as string | null,
    },
    {
      t: "발인 · 운구",
      d: "마지막 인사를 나누는 발인제와 정중한 운구로, 떠나는 길을 끝까지 배웅합니다.",
      image: "/images/process-4.jpeg" as string | null,
    },
    {
      t: "화장 · 안치",
      d: "화장과 안치 또는 매장까지, 고인이 편히 머무실 자리를 정성을 다해 살핍니다.",
      image: "/images/process-5.jpeg" as string | null,
    },
    {
      t: "추모 · 기억",
      d: "49재와 추모 공간, 기록으로 고인의 삶을 오래도록 기억할 수 있도록 곁을 지킵니다.",
      image: "/images/process-6.jpeg" as string | null,
    },
  ],
} as const;

export const coop = {
  eyebrow: "협동조합이라는 약속",
  title: ["이익이 아니라", "사람을 위해"],
  lead: "드림상조는 조합원이 함께 만들고 운영하는 비영리 협동조합입니다. 출자금과 가입비 10만원 한 번이면 본인과 직계가족 모두가 함께 준비할 수 있습니다. 회사의 수익이 아니라 조합원과 가족의 마음을 가장 먼저 생각하며, 모든 운영을 총회에서 투명하게 공개합니다.",
  image: "/images/coop.jpeg",
  imageAlt: "여러 세대가 함께 모인 조합 가족의 모습",
  // 사실 기반 지표(미검증 수치 대신). 실데이터 확보 시 교체.
  stats: [
    { n: "10만원", l: "1회 출자·가입비" }, // VERIFIED
    { n: "후불제", l: "행사 후 정산" }, // VERIFIED
    { n: "8~10회", l: "1인 가족 모두 이용" }, // VERIFIED
    { n: "24시간", l: "언제든 상담" }, // VERIFIED
  ],
} as const;

export const contact = {
  eyebrow: "사전 상담 · 가입 문의",
  title: ["마지막을 미리 준비하는 것은,", "남겨질 가족을 위한 배려입니다."],
  body: "부담 없이 문의해 주세요. 가입 의무 없이, 조합의 취지와 진행 방식을 충분히 안내해 드립니다. 갑작스러운 상황이라면 24시간 대표전화로 연락 주세요.",
  inquiryTypes: ["사전 상담 · 가입 문의", "장례 접수 (긴급)", "기타 문의"],
  sent: {
    title: "상담 신청이 접수되었습니다",
    body: "빠른 시일 내에 정성껏 연락드리겠습니다.\n편안한 마음으로 기다려 주세요.",
  },
} as const;

export const faq = {
  eyebrow: "자주 묻는 질문",
  title: "궁금한 점이 있으신가요",
  items: [
    {
      q: "조합 가입은 어떻게 하나요?",
      a: "온라인 상담 신청 또는 대표전화 한 통이면 충분합니다. 출자금과 가입비 10만원을 한 번 납부하면 조합원이 되고, 본인과 직계가족 누구나 이용하실 수 있습니다. 조합의 취지와 운영 방식을 충분히 안내해 드린 뒤 부담 없이 결정하세요.",
    },
    {
      q: "매월 내는 비용이 있나요?",
      a: "없습니다. 기존 상조의 보험형 월 납입과 달리, 드림상조는 10만원 1회 출자와 후불제로 운영됩니다. 장례 비용은 행사를 마친 뒤 정산하며, 매월 납입이나 회사 부도·횡령으로 잃을 위험이 없습니다.",
    },
    {
      q: "갑작스러운 상황에도 도움받을 수 있나요?",
      a: "네. 24시간 언제든 연락 주시면 전문 장례지도사가 즉시 출동하여 처음부터 끝까지 곁에서 함께합니다. 가입 여부와 무관하게 상조행사 이용권으로도 진행하실 수 있습니다.",
    },
    {
      q: "서비스 가능한 지역은 어디까지인가요?",
      a: "전국 주요 지역에서 의전이 가능하며, 지역별 협력 빈소와 연계해 어디서나 동일한 정성으로 모십니다.",
    },
    {
      q: "가입하지 않아도 상담이 가능한가요?",
      a: "물론입니다. 미리 준비하는 사전 상담은 누구에게나 열려 있으며 어떠한 가입 의무도 없습니다. 상조행사 이용권을 보시고 연락 주시면 가입 없이도 장례를 진행해 드립니다.",
    },
  ],
} as const;

export const footer = {
  about:
    "고인의 길을 정중하고 고결하게 배웅하고, 가족이 따뜻한 추억을 기억할 수 있도록. 사람을 위한 비영리 상조 협동조합입니다.",
  campaign: "매주 토요일은 어르신께 전화드리는 날 — 효행캠페인",
  quickLinks: [
    { href: "#philosophy", label: "우리의 철학" },
    { href: "#services", label: "서비스" },
    { href: "#process", label: "진행 절차" },
    { href: "#coop", label: "협동조합 안내" },
  ],
} as const;
