import { defaultSiteData } from "@/data/site";

export const NAVER_BOOKING_URL = defaultSiteData.links.naverBooking.url;
export const KAKAO_CHANNEL_URL = defaultSiteData.links.kakao.url;

export const bookingLinks = {
  naver: NAVER_BOOKING_URL,
  kakao: KAKAO_CHANNEL_URL,
} as const;
