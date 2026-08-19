export type ExternalLink = {
  url: string;
  enabled: boolean;
};

export function isLinkVisible(link: ExternalLink) {
  return link.enabled && /^https?:\/\//i.test(link.url.trim());
}

export type SiteLinks = {
  naverBooking: ExternalLink;
  kakao: ExternalLink;
  instagram: ExternalLink;
  blog: ExternalLink;
};

export const MAX_SERVICE_IMAGES = 6;
export const MAX_SERVICES = 20;
export const MAX_CONCERN_CARDS = 6;
export const MAX_WHY_CARDS = 6;

export type ContentCard = {
  id: string;
  title: string;
  description: string;
};

export type ContentSectionKey = "concerns" | "why";

export type ContentSection = {
  title: string;
  visible: boolean;
  cards: ContentCard[];
};

export function hasCardContent(card: ContentCard) {
  return Boolean(card.title.trim() || card.description.trim());
}

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  visible: boolean;
  comingSoon?: boolean;
};

export type HeroContent = {
  subtitle: string;
  title: string;
  description: string;
  image: string;
};

export type SiteData = {
  siteName: string;
  hero: HeroContent;
  services: ServiceItem[];
  links: SiteLinks;
  concerns: ContentSection;
  why: ContentSection;
};
