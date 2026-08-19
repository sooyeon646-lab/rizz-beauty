import type { Metadata } from "next";
import EditorScreen from "@/components/editor/EditorScreen";

export const metadata: Metadata = {
  title: "랜딩페이지 편집",
  description: "상호명과 메인 문구를 수정합니다.",
};

export default function EditorPage() {
  return <EditorScreen />;
}
