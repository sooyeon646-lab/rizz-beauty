import type { SiteData } from "@/types/site";

export const defaultSiteData: SiteData = {
  siteName: "RIZZ BEAUTY",
  hero: {
    title: "민낯에도\n자신 있는 눈썹",
    description:
      "리즈뷰티만의 고객 니즈를 찾아\n단 하나의 눈썹을 디자인합니다.",
    image: "/hero-main-1787047519946.jpg",
  },
  services: [
    {
      id: "women-eyebrow",
      name: "여자눈썹",
      description: "",
      price: "350,000원",
      images: ["/women-brow.jpg"],
      visible: true
    },
    {
      id: "men-eyebrow",
      name: "남자 눈썹",
      description: "",
      price: "400,000원",
      images: ["/men-brow.jpg"],
      visible: true
    },
    {
      id: "lip",
      name: "입술",
      description: "",
      price: "350,000원",
      images: ["/lip-before-after.jpg"],
      visible: true
    },
    {
      id: "hairline",
      name: "헤어라인",
      description: "",
      price: "상담 후 안내",
      images: [],
      visible: true,
      comingSoon: true
    }
  ],
  links: {
    naverBooking: {
      url: "https://naver.me/GoDbAU0W",
      enabled: true,
    },
    kakao: {
      url: "http://pf.kakao.com/_QCrbn/friend",
      enabled: true,
    },
    instagram: {
      url: "https://www.instagram.com/rizz__beauty",
      enabled: true,
    },
    blog: {
      url: "https://m.blog.naver.com/podobeautyjj",
      enabled: true,
    }
  },
  concerns: {
    title: "이런 분께 추천드립니다",
    visible: true,
    cards: [
      {
        id: "concern-1",
        title: "매일 눈썹 그리기가 번거로운 분",
        description: "아침마다 좌우 균형을 맞추느라 시간이 오래 걸리는 분",
      },
      {
        id: "concern-2",
        title: "민낯이면 인상이 흐려 보이는 분",
        description: "눈썹이 연하거나 비어 보여 또렷한 인상을 원하는 분",
      },
      {
        id: "concern-3",
        title: "기존 눈썹 잔흔이 마음에 들지 않는 분",
        description: "새로운 디자인을 원하시는 분",
      }
    ]
  },
  why: {
    title: "리즈뷰티가\n다른 이유",
    visible: true,
    cards: [
      {
        id: "why-1",
        title: "1:1 맞춤 상담",
        description: "얼굴형에 맞는 당신만을 위한 디자인을 함께 만듭니다.",
      },
      {
        id: "why-2",
        title: "섬세한 기술력",
        description:
          "한 올 한 올 정성스럽게. 자연스러운 결과를 위한 노하우를 쌓아왔습니다.",
      },
      {
        id: "why-3",
        title: "프리미엄 재료",
        description:
          "피부에 안전한 고급 색소만을 사용해, 시간이 지나도 아름답게.",
      },
      {
        id: "why-4",
        title: "지속적인 케어",
        description:
          "시술 후에도 변화를 함께 지켜보며, 만족스러운 결과를 위해 동행합니다.",
      },
    ],
  },
};
