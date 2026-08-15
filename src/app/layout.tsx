import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "RIZZ BEAUTY | 리즈뷰티",
  description:
    "민낯에도 자신 있는 눈썹. 리즈뷰티만의 고객 니즈를 찾아 단 하나의 눈썹을 디자인합니다.",
  openGraph: {
    title: "RIZZ BEAUTY | 리즈뷰티",
    description: "민낯에도 자신 있는 눈썹",
    type: "website",
    locale: "ko_KR",
    siteName: "RIZZ BEAUTY",
    images: [
      {
        url: "/hero.jpg",
        width: 1080,
        height: 1080,
        alt: "RIZZ BEAUTY",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RIZZ BEAUTY | 리즈뷰티",
    description: "민낯에도 자신 있는 눈썹",
    images: ["/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
