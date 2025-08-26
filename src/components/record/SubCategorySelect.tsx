"use client";
import { useRouter, useParams } from "next/navigation";

const SUBS: Record<string, string[]> = {
  커피: ["카페 커피", "홈 커피", "드립 커피", "캡슐 커피", "기타"],
  차: ["녹차", "홍차", "허브차", "우롱차", "블렌드 티", "기타"],
  와인: [
    "레드 와인",
    "화이트 와인",
    "로제 와인",
    "스파클링 와인",
    "디저트 와인",
    "기타",
  ],
  위스키: [
    "싱글 몰트",
    "블렌디드",
    "버번",
    "라이 위스키",
    "아이리시 위스키",
    "기타",
  ],
  기타: ["기타"],
};

export default function SubCategorySelect() {
  const router = useRouter();
  const params = useParams();
  const type = decodeURIComponent(params.type as string);
  const subs = SUBS[type] || [];

  const handleSelect = (sub: string) => {
    router.push(`/record/${type}/new?sub=${encodeURIComponent(sub)}`);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">오늘의 {type} 스타일은?</h2>
      {subs.map((s) => (
        <button
          key={s}
          onClick={() => handleSelect(s)}
          className="w-full py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-[#7B2D2D] hover:text-white"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
